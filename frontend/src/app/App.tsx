import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurTargetView } from 'expo-blur';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { cancelAnimation, clamp, useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { SafeAreaView, View, useWindowDimensions } from 'react-native';
import { getFinancialSummary, getTransactions, sendChatMessage, type FinancialSummary } from '../shared/api/client';
import { categoryNames, formatCurrency, type Transaction } from '../shared/domain/finance';
import { pageSpring, pageTabs, type PageTab } from '../shared/domain/navigation';
import { styles } from '../shared/theme/styles';
import { AuthFlow } from '../features/auth/AuthFlow';
import { HistoryScreen } from '../features/history/HistoryScreen';
import { HomeScreen } from '../features/home/HomeScreen';
import { BottomNav } from '../features/navigation/BottomNav';
import { ProfileScreen } from '../features/profile/ProfileScreen';
import { SummaryScreen } from '../features/summary/SummaryScreen';
import { EntryModal, type SheetState } from '../features/transactions/EntryModal';

export default function App() {
  const { width } = useWindowDimensions();
  const pageWidth = Math.min(width, 720);
  const blurTarget = useRef<View | null>(null);
  const [tab, setTab] = useState<PageTab>('Início');
  const pageProgress = useSharedValue(0);
  const swipeStart = useSharedValue(0);
  const indicatorStretch = useSharedValue(1);
  const [sheet, setSheet] = useState<SheetState>('closed');
  const [signedIn, setSignedIn] = useState(false);
  const [entry, setEntry] = useState('');
  const [items, setItems] = useState<Transaction[]>([]);
  const [transactionsFromApi, setTransactionsFromApi] = useState(false);
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const visibleTransactions = useMemo(() => items.slice(0, tab === 'Início' ? 3 : items.length), [items, tab]);
  const categoryTotals = useMemo(() => {
    if (!transactionsFromApi) return null;
    const now = new Date();
    const totals: Record<string, number> = {};
    items.forEach((item) => {
      if (item.value >= 0 || !item.occurredAt) return;
      const date = new Date(item.occurredAt);
      if (date.getFullYear() !== now.getFullYear() || date.getMonth() !== now.getMonth()) return;
      totals[item.category] = (totals[item.category] || 0) + Math.abs(item.value);
    });
    return totals;
  }, [items, transactionsFromApi]);
  const categoryData = useMemo(() => categoryNames.map((name) => ({
    name, value: categoryTotals ? formatCurrency(categoryTotals[name] || 0) : '—',
  })), [categoryTotals]);
  const weeklyTotals = useMemo(() => {
    if (!transactionsFromApi) return null;
    const now = new Date();
    const mondayOffset = (now.getDay() + 6) % 7;
    const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - mondayOffset);
    const totals = Array<number>(7).fill(0);
    items.forEach((item) => {
      if (item.value >= 0 || !item.occurredAt) return;
      const date = new Date(item.occurredAt);
      const dayIndex = Math.floor((new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() - monday.getTime()) / 86400000);
      if (dayIndex >= 0 && dayIndex < totals.length) totals[dayIndex] += Math.abs(item.value);
    });
    return totals;
  }, [items, transactionsFromApi]);
  const maxWeeklyTotal = weeklyTotals ? Math.max(0, ...weeklyTotals) : 0;
  const weeklyBarHeights = weeklyTotals?.map((total) => maxWeeklyTotal ? Math.max(5, (total / maxWeeklyTotal) * 42) : 0) || Array<number>(7).fill(0);

  const commitPage = useCallback((index: number) => setTab(pageTabs[index]), []);
  const navigateTo = useCallback((next: PageTab) => {
    const target = pageTabs.indexOf(next);
    cancelAnimation(pageProgress);
    pageProgress.value = withSpring(target, pageSpring, (finished) => {
      if (finished) scheduleOnRN(commitPage, target);
    });
    indicatorStretch.value = withSequence(withTiming(1.13, { duration: 100 }), withSpring(1, { damping: 15, stiffness: 280 }));
  }, [commitPage, indicatorStretch, pageProgress]);

  const pagerGesture = useMemo(() => Gesture.Pan()
    .activeOffsetX([-12, 12])
    .failOffsetY([-10, 10])
    .onBegin(() => { swipeStart.value = pageProgress.value; indicatorStretch.value = 1; })
    .onUpdate((event) => {
      pageProgress.value = clamp(swipeStart.value - event.translationX / pageWidth, 0, pageTabs.length - 1);
      indicatorStretch.value = 1 + Math.min(Math.abs(event.velocityX) / 8000, 0.13);
    })
    .onEnd((event) => {
      const progressDelta = pageProgress.value - swipeStart.value;
      const movedEnough = Math.abs(progressDelta) > 0.22;
      const direction = movedEnough ? Math.sign(progressDelta) : Math.abs(event.velocityX) > 560 ? Math.sign(-event.velocityX) : 0;
      const target = clamp(Math.round(swipeStart.value) + direction, 0, pageTabs.length - 1);
      pageProgress.value = withSpring(target, pageSpring, (finished) => { if (finished) scheduleOnRN(commitPage, target); });
      indicatorStretch.value = withSpring(1, { damping: 15, stiffness: 280 });
    })
    .onFinalize((_event, success) => {
      if (!success) {
        const target = Math.round(swipeStart.value);
        pageProgress.value = withSpring(target, pageSpring, (finished) => { if (finished) scheduleOnRN(commitPage, target); });
        indicatorStretch.value = withSpring(1, { damping: 15, stiffness: 280 });
      }
    }), [commitPage, indicatorStretch, pageProgress, pageWidth, swipeStart]);
  const pagerTrackStyle = useAnimatedStyle(() => ({ transform: [{ translateX: -pageProgress.value * pageWidth }] }), [pageWidth]);

  const refreshBackendData = useCallback(async () => {
    const [transactionsResult, summaryResult] = await Promise.allSettled([getTransactions(), getFinancialSummary()]);
    const errors: string[] = [];
    if (transactionsResult.status === 'fulfilled') { setItems(transactionsResult.value); setTransactionsFromApi(true); }
    else errors.push(transactionsResult.reason instanceof Error ? transactionsResult.reason.message : 'Falha ao carregar lançamentos.');
    if (summaryResult.status === 'fulfilled') setSummary(summaryResult.value);
    else errors.push(summaryResult.reason instanceof Error ? summaryResult.reason.message : 'Falha ao carregar o resumo.');
    setApiError(errors.length ? `Parte dos dados não carregou: ${errors.join(' ')}` : null);
  }, []);

  useEffect(() => { if (signedIn) void refreshBackendData(); }, [refreshBackendData, signedIn]);

  async function saveEntry(): Promise<void> {
    if (!entry.trim()) return;
    setSaving(true);
    setApiError(null);
    try {
      const result = await sendChatMessage(entry.trim());
      setSuccessMessage(result.message);
      setEntry('');
      setSheet('success');
      void refreshBackendData();
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Não foi possível enviar o lançamento.');
    } finally { setSaving(false); }
  }

  if (!signedIn) return <GestureHandlerRootView style={styles.gestureRoot}><SafeAreaView style={styles.safe}><StatusBar style="light" /><AuthFlow onComplete={() => setSignedIn(true)} /></SafeAreaView></GestureHandlerRootView>;

  return <GestureHandlerRootView style={styles.gestureRoot}><SafeAreaView style={styles.safe}><StatusBar style="light" /><View style={styles.app}>
    <LinearGradient pointerEvents="none" colors={['#111A0E', '#0B1209', '#080E07', '#0C1309']} locations={[0, 0.35, 0.72, 1]} start={{ x: 0.04, y: 0 }} end={{ x: 0.92, y: 1 }} style={styles.backgroundWash} />
    <LinearGradient pointerEvents="none" colors={['rgba(126,150,74,0.15)', 'rgba(71,91,48,0.055)', 'rgba(12,18,9,0)']} locations={[0, 0.46, 1]} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={styles.ambientTop} />
    <LinearGradient pointerEvents="none" colors={['rgba(116,139,63,0.08)', 'rgba(116,139,63,0)']} start={{ x: 0, y: 0.45 }} end={{ x: 1, y: 0.5 }} style={styles.ambientSide} />
    <BlurTargetView ref={blurTarget} style={styles.shell}>
      <GestureDetector gesture={pagerGesture}><View style={styles.pagerViewport}>
        <Animated.View style={[styles.pagerTrack, { width: pageWidth * pageTabs.length }, pagerTrackStyle]}>
          <View style={[styles.pagerPage, { width: pageWidth }]}><HomeScreen compact={pageWidth < 355} onRecord={() => setSheet('entry')} onHistory={() => navigateTo('Histórico')} items={visibleTransactions} summary={summary} apiError={apiError} categoryData={categoryData} barHeights={weeklyBarHeights} /></View>
          <View style={[styles.pagerPage, { width: pageWidth }]}><HistoryScreen items={visibleTransactions} apiError={apiError} /></View>
          <View style={[styles.pagerPage, { width: pageWidth }]}><SummaryScreen summary={summary} apiError={apiError} categoryData={categoryData} categoryTotals={categoryTotals} /></View>
          <View style={[styles.pagerPage, { width: pageWidth }]}><ProfileScreen /></View>
        </Animated.View>
      </View></GestureDetector>
    </BlurTargetView>
    <BottomNav active={tab} blurTarget={blurTarget} progress={pageProgress} indicatorStretch={indicatorStretch} onChange={(next) => next === 'Registrar' ? setSheet('entry') : navigateTo(next)} />
    <EntryModal state={sheet} entry={entry} onChange={(value) => { setEntry(value); setApiError(null); }} onClose={() => setSheet('closed')} onRecord={() => setSheet('recording')} onStop={() => setSheet('entry')} onSave={saveEntry} onHistory={() => { setSheet('closed'); navigateTo('Histórico'); }} error={sheet === 'entry' ? apiError : null} saving={saving} successMessage={successMessage} />
  </View></SafeAreaView></GestureHandlerRootView>;
}

import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { BlurTargetView, BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { cancelAnimation, clamp, interpolate, useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming, type SharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { KeyboardAvoidingView, Modal, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { categoryNames, formatCurrency, type Transaction } from './src/finance';
import { getFinancialSummary, getTransactions, sendChatMessage, type FinancialSummary } from './src/api';
import { styles } from './src/styles';
import { colors } from './src/theme';
import { GlassCard } from './src/GlassCard';

type Tab = 'Início' | 'Histórico' | 'Registrar' | 'Resumo' | 'Perfil';
type PageTab = Exclude<Tab, 'Registrar'>;
type SheetState = 'closed' | 'entry' | 'recording' | 'success';
type AuthStage = 'onboarding' | 'login' | 'register' | 'recovery';
type CategoryData = { name: string; value: string }[];
const days = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];
const pageTabs: PageTab[] = ['Início', 'Histórico', 'Resumo', 'Perfil'];
const pageSpring = { damping: 24, stiffness: 220, mass: 0.82 };
// Ícones vetoriais consistentes para manter o visual limpo do app.
const categoryIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  Alimentação: 'restaurant-outline',
  Transporte: 'car-sport-outline',
  Moradia: 'business-outline',
  Lazer: 'ticket-outline',
};
const transactionIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  Transporte: 'car-sport-outline',
  Alimentação: 'restaurant-outline',
  Moradia: 'business-outline',
  Salário: 'cash-outline',
  'Novo lançamento': 'add-circle-outline',
};

function Icon({ name, size = 20, color = colors.ink }: { name: keyof typeof Ionicons.glyphMap; size?: number; color?: string }) { return <Ionicons name={name} size={size} color={color} />; }
function RoundIcon({ name, onPress }: { name: keyof typeof Ionicons.glyphMap; onPress?: () => void }) { return <Pressable onPress={onPress} style={styles.iconButton}><Icon name={name} size={17} color={colors.textSecondary} /></Pressable>; }

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
    const currentMonth = new Date();
    const totals: Record<string, number> = {};
    items.forEach((item) => {
      if (item.value >= 0 || !item.occurredAt) return;
      const occurredAt = new Date(item.occurredAt);
      if (occurredAt.getFullYear() !== currentMonth.getFullYear() || occurredAt.getMonth() !== currentMonth.getMonth()) return;
      totals[item.category] = (totals[item.category] || 0) + Math.abs(item.value);
    });
    return totals;
  }, [items, transactionsFromApi]);
  const categoryData = useMemo(() => categoryNames.map((name) => ({
    name,
    value: categoryTotals ? formatCurrency(categoryTotals[name] || 0) : '—',
  })), [categoryTotals]);
  const weeklyTotals = useMemo(() => {
    if (!transactionsFromApi) return null;
    const now = new Date();
    const mondayOffset = (now.getDay() + 6) % 7;
    const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - mondayOffset);
    const totals = Array<number>(7).fill(0);
    items.forEach((item) => {
      if (item.value >= 0 || !item.occurredAt) return;
      const occurredAt = new Date(item.occurredAt);
      const dayIndex = Math.floor((new Date(occurredAt.getFullYear(), occurredAt.getMonth(), occurredAt.getDate()).getTime() - monday.getTime()) / 86400000);
      if (dayIndex >= 0 && dayIndex < totals.length) totals[dayIndex] += Math.abs(item.value);
    });
    return totals;
  }, [items, transactionsFromApi]);
  const maxWeeklyTotal = weeklyTotals ? Math.max(0, ...weeklyTotals) : 0;
  const weeklyBarHeights = weeklyTotals?.map((total) => maxWeeklyTotal ? Math.max(5, (total / maxWeeklyTotal) * 42) : 0) || Array<number>(7).fill(0);

  const commitPage = useCallback((index: number) => {
    setTab(pageTabs[index]);
  }, []);

  const navigateTo = useCallback((next: PageTab) => {
    const target = pageTabs.indexOf(next);
    cancelAnimation(pageProgress);
    pageProgress.value = withSpring(target, pageSpring, (finished) => {
      if (finished) scheduleOnRN(commitPage, target);
    });
    indicatorStretch.value = withSequence(
      withTiming(1.13, { duration: 100 }),
      withSpring(1, { damping: 15, stiffness: 280 }),
    );
  }, [commitPage, indicatorStretch, pageProgress]);

  const pagerGesture = useMemo(() => Gesture.Pan()
    .activeOffsetX([-12, 12])
    .failOffsetY([-10, 10])
    .onBegin(() => {
      swipeStart.value = pageProgress.value;
      indicatorStretch.value = 1;
    })
    .onUpdate((event) => {
      pageProgress.value = clamp(
        swipeStart.value - event.translationX / pageWidth,
        0,
        pageTabs.length - 1,
      );
      indicatorStretch.value = 1 + Math.min(Math.abs(event.velocityX) / 8000, 0.13);
    })
    .onEnd((event) => {
      const progressDelta = pageProgress.value - swipeStart.value;
      const velocityDirection = -event.velocityX;
      const movedEnough = Math.abs(progressDelta) > 0.22;
      const flicked = Math.abs(event.velocityX) > 560;
      const direction = movedEnough
        ? Math.sign(progressDelta)
        : flicked
          ? Math.sign(velocityDirection)
          : 0;
      const target = clamp(
        Math.round(swipeStart.value) + direction,
        0,
        pageTabs.length - 1,
      );

      pageProgress.value = withSpring(target, pageSpring, (finished) => {
        if (finished) scheduleOnRN(commitPage, target);
      });
      indicatorStretch.value = withSpring(1, { damping: 15, stiffness: 280 });
    })
    .onFinalize((_event, success) => {
      if (!success) {
        const target = Math.round(swipeStart.value);
        pageProgress.value = withSpring(target, pageSpring, (finished) => {
          if (finished) scheduleOnRN(commitPage, target);
        });
        indicatorStretch.value = withSpring(1, { damping: 15, stiffness: 280 });
      }
    }), [commitPage, indicatorStretch, pageProgress, pageWidth, swipeStart]);

  const pagerTrackStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -pageProgress.value * pageWidth }],
  }), [pageWidth]);

  const refreshBackendData = useCallback(async () => {
    const [transactionsResult, summaryResult] = await Promise.allSettled([
      getTransactions(),
      getFinancialSummary(),
    ]);
    const errors: string[] = [];

    if (transactionsResult.status === 'fulfilled') {
      setItems(transactionsResult.value);
      setTransactionsFromApi(true);
    }
    else errors.push(transactionsResult.reason instanceof Error ? transactionsResult.reason.message : 'Falha ao carregar lançamentos.');

    if (summaryResult.status === 'fulfilled') setSummary(summaryResult.value);
    else errors.push(summaryResult.reason instanceof Error ? summaryResult.reason.message : 'Falha ao carregar o resumo.');

    setApiError(errors.length ? `Parte dos dados não carregou: ${errors.join(' ')}` : null);
  }, []);

  useEffect(() => {
    if (signedIn) void refreshBackendData();
  }, [refreshBackendData, signedIn]);

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
    } finally {
      setSaving(false);
    }
  }

  if (!signedIn) return <GestureHandlerRootView style={styles.gestureRoot}><SafeAreaView style={styles.safe}><StatusBar style="light" /><AuthFlow onComplete={() => setSignedIn(true)} /></SafeAreaView></GestureHandlerRootView>;
  return <GestureHandlerRootView style={styles.gestureRoot}><SafeAreaView style={styles.safe}><StatusBar style="light" /><View style={styles.app}>
    <LinearGradient pointerEvents="none" colors={['#111A0E', '#0B1209', '#080E07', '#0C1309']} locations={[0, 0.35, 0.72, 1]} start={{ x: 0.04, y: 0 }} end={{ x: 0.92, y: 1 }} style={styles.backgroundWash} />
    <LinearGradient pointerEvents="none" colors={['rgba(126,150,74,0.15)', 'rgba(71,91,48,0.055)', 'rgba(12,18,9,0)']} locations={[0, 0.46, 1]} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={styles.ambientTop} />
    <LinearGradient pointerEvents="none" colors={['rgba(116,139,63,0.08)', 'rgba(116,139,63,0)']} start={{ x: 0, y: 0.45 }} end={{ x: 1, y: 0.5 }} style={styles.ambientSide} />
    <BlurTargetView ref={blurTarget} style={styles.shell}>
      <GestureDetector gesture={pagerGesture}>
        <View style={styles.pagerViewport}>
          <Animated.View style={[styles.pagerTrack, { width: pageWidth * pageTabs.length }, pagerTrackStyle]}>
            <View style={[styles.pagerPage, { width: pageWidth }]}><Home compact={pageWidth < 355} onRecord={() => setSheet('entry')} onHistory={() => navigateTo('Histórico')} items={visibleTransactions} summary={summary} apiError={apiError} categoryData={categoryData} barHeights={weeklyBarHeights} /></View>
            <View style={[styles.pagerPage, { width: pageWidth }]}><History items={visibleTransactions} apiError={apiError} /></View>
            <View style={[styles.pagerPage, { width: pageWidth }]}><Summary summary={summary} apiError={apiError} categoryData={categoryData} categoryTotals={categoryTotals} /></View>
            <View style={[styles.pagerPage, { width: pageWidth }]}><Profile /></View>
          </Animated.View>
        </View>
      </GestureDetector>
    </BlurTargetView>
    <BottomNav active={tab} blurTarget={blurTarget} progress={pageProgress} indicatorStretch={indicatorStretch} onChange={(next) => next === 'Registrar' ? setSheet('entry') : navigateTo(next)} />
    <EntryModal state={sheet} entry={entry} onChange={(value) => { setEntry(value); setApiError(null); }} onClose={() => setSheet('closed')} onRecord={() => setSheet('recording')} onStop={() => setSheet('entry')} onSave={saveEntry} onHistory={() => { setSheet('closed'); navigateTo('Histórico'); }} error={sheet === 'entry' ? apiError : null} saving={saving} successMessage={successMessage} /></View></SafeAreaView></GestureHandlerRootView>;
}

function AuthFlow({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<AuthStage>('onboarding');
  const [slide, setSlide] = useState(0);
  const slides = [
    ['Registre seus gastos do seu jeito', 'Fale ou escreva como se estivesse apenas anotando.'],
    ['Fale ou escreva naturalmente', 'O Fluxo transforma uma frase curta em um lançamento claro.'],
    ['Entenda para onde seu dinheiro vai', 'Veja o que importa sem transformar sua rotina em planilhas.'],
  ];
  if (stage === 'onboarding') return <View style={styles.auth}><Text style={styles.brand}>Fluxo</Text><Text style={styles.authTitle}>{slides[slide][0]}</Text><Text style={styles.authCopy}>{slides[slide][1]}</Text><View style={styles.dots}>{slides.map((_, index) => <View key={index} style={[styles.dot, index === slide && styles.dotActive]} />)}</View><Pressable style={styles.authButton} onPress={() => slide < 2 ? setSlide(slide + 1) : setStage('login')}><LinearGradient pointerEvents="none" colors={['#D4FF54', '#C2F51C', '#AFE516']} locations={[0, 0.5, 1]} style={styles.authButtonGradient} /><View pointerEvents="none" style={styles.authButtonShine} /><Text style={styles.authButtonText}>{slide < 2 ? 'Continuar' : 'Começar'}</Text></Pressable><Pressable onPress={() => setStage('login')}><Text style={styles.authLink}>Pular</Text></Pressable></View>;
  const isRegister = stage === 'register';
  const isRecovery = stage === 'recovery';
  const title = isRecovery ? 'Recupere sua senha' : isRegister ? 'Crie sua conta' : 'Bem-vindo de volta';
  const copy = isRecovery ? 'Enviaremos um link para redefinir sua senha.' : isRegister ? 'Comece a organizar sua vida financeira.' : 'Entre para acessar o seu Fluxo.';
  return <View style={styles.auth}><Pressable onPress={() => setStage('login')}><Text style={styles.back}>← Voltar</Text></Pressable><Text style={styles.brand}>Fluxo</Text><Text style={styles.authTitle}>{title}</Text><Text style={styles.authCopy}>{copy}</Text>
    {isRegister && <><Text style={styles.inputLabel}>Nome</Text><TextInput style={styles.input} placeholder="Seu nome" placeholderTextColor={colors.muted} /></>}
    <Text style={styles.inputLabel}>E-mail</Text><TextInput style={styles.input} placeholder="voce@email.com" placeholderTextColor={colors.muted} keyboardType="email-address" autoCapitalize="none" />
    {!isRecovery && <><Text style={styles.inputLabel}>Senha</Text><TextInput style={styles.input} placeholder="Sua senha" placeholderTextColor={colors.muted} secureTextEntry />{isRegister && <><Text style={styles.inputLabel}>Confirmar senha</Text><TextInput style={styles.input} placeholder="Confirme sua senha" placeholderTextColor={colors.muted} secureTextEntry /><Text style={styles.terms}>Ao criar sua conta, você concorda com os Termos de uso e a Política de privacidade.</Text></>}</>}
    <Pressable style={styles.authButton} onPress={isRecovery ? () => setStage('login') : onComplete}><LinearGradient pointerEvents="none" colors={['#D4FF54', '#C2F51C', '#AFE516']} locations={[0, 0.5, 1]} style={styles.authButtonGradient} /><View pointerEvents="none" style={styles.authButtonShine} /><Text style={styles.authButtonText}>{isRecovery ? 'Enviar link' : isRegister ? 'Criar conta' : 'Entrar'}</Text></Pressable>
    {!isRecovery && <Pressable onPress={() => setStage(stage === 'login' ? 'recovery' : 'login')}><Text style={styles.authLink}>{stage === 'login' ? 'Esqueci minha senha' : 'Já tenho uma conta'}</Text></Pressable>}
    {stage === 'login' && <Pressable onPress={() => setStage('register')}><Text style={styles.authLink}>Criar minha conta</Text></Pressable>}
  </View>;
}

function Home({ compact, onRecord, onHistory, items, summary, apiError, categoryData, barHeights }: { compact: boolean; onRecord: () => void; onHistory: () => void; items: Transaction[]; summary: FinancialSummary | null; apiError: string | null; categoryData: CategoryData; barHeights: number[] }) {
  return <ScrollView style={styles.pageScroll} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
    <ApiNotice message={apiError} />
    <View style={styles.homeHeader}><View style={styles.avatar}><Icon name="person-outline" size={17} color={colors.textSecondary} /></View><View style={styles.headerCopy}><Text style={styles.greeting}>Olá</Text><Text style={styles.subtitle}>Seu dinheiro, sob controle.</Text></View><RoundIcon name="notifications-outline" /></View>
    <View style={styles.balanceHero}>
      <LinearGradient pointerEvents="none" colors={['rgba(111,139,63,0.26)', 'rgba(62,86,38,0.11)', 'rgba(10,16,8,0)']} locations={[0, 0.5, 1]} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={styles.balanceAura} />
      <Text style={styles.balanceLabel}>SALDO GERAL</Text><Text style={[styles.balance, compact && { fontSize: 28 }]}>{summary ? formatCurrency(summary.saldoGeral) : '—'}</Text><Text style={styles.trend}>{summary ? 'Consolidado de receitas e despesas' : 'Aguardando dados do backend'}</Text>
      <View style={styles.bars}>{barHeights.map((height, index) => <View key={`${days[index]}-${index}`} style={styles.barWrap}><View style={[styles.bar, { height }, index === 0 || index === 4 ? styles.barAccent : null]} /><Text style={styles.day}>{days[index]}</Text></View>)}</View>
      <View style={styles.actionRow}><Pressable style={styles.homePrimaryButton} onPress={onRecord}><LinearGradient pointerEvents="none" colors={['#D4FF54', '#C2F51C', '#AFE516']} locations={[0, 0.48, 1]} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={styles.buttonGradient} /><View pointerEvents="none" style={styles.buttonHighlight} /><Icon name="add-circle-outline" size={16} /><Text style={styles.primaryText}>Registrar</Text></Pressable><Pressable style={styles.homeSecondaryButton} onPress={onHistory}><View pointerEvents="none" style={styles.secondaryButtonTint} /><Icon name="arrow-forward" size={16} color="#172012" /><Text style={styles.homeSecondaryText}>Histórico</Text></Pressable></View>
    </View>
    <View style={[styles.spread, styles.sectionHeader]}><Text style={styles.sectionTitle}>Visão do mês</Text><Text style={styles.link}>Ver resumo</Text></View>
    <View style={styles.categoryStrip}>{categoryData.map((category, index) => <GlassCard key={category.name} variant="homeCategory" highlighted={index === 3} style={styles.categoryTile}><View style={styles.categoryGlyph}><Icon name={categoryIcons[category.name]} size={14} color={colors.textSecondary} /></View><Text numberOfLines={1} style={styles.categoryTitle}>{category.name}</Text><Text numberOfLines={1} style={[styles.categoryValue, index === 3 && styles.categoryActiveText]}>{category.value}</Text></GlassCard>)}</View>
    <View style={[styles.spread, styles.sectionHeader, styles.recentHeader]}><Text style={styles.sectionTitle}>Recentes</Text><Text style={styles.link}>Ver todos</Text></View>{items.length ? items.map((item) => <TransactionRow key={item.id} item={item} compact />) : <Text style={styles.emptyState}>Nenhum lançamento disponível.</Text>}
  </ScrollView>;
}

function History({ items, apiError }: { items: Transaction[]; apiError: string | null }) {
  const [filter, setFilter] = useState('Todos');
  const shown = items.filter((item) => filter === 'Todos' || (filter === 'Receitas' ? item.value > 0 : item.value < 0));
  return <ScrollView style={styles.pageScroll} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}><ApiNotice message={apiError} /><Text style={styles.screenTitle}>Lançamentos</Text><Text style={styles.screenSubtitle}>Acompanhe cada movimento do seu mês.</Text>
    <View style={styles.filterRow}>{['Todos', 'Despesas', 'Receitas'].map((name) => <Pressable key={name} onPress={() => setFilter(name)} style={[styles.filter, filter === name && styles.filterActive]}><Text style={[styles.filterText, filter === name && styles.filterActiveText]}>{name}</Text></Pressable>)}</View>{shown.length ? shown.map((item) => <TransactionRow key={item.id} item={item} />) : <Text style={styles.emptyState}>Nenhum lançamento disponível para este filtro.</Text>}</ScrollView>;
}

function Summary({ summary, apiError, categoryData, categoryTotals }: { summary: FinancialSummary | null; apiError: string | null; categoryData: CategoryData; categoryTotals: Record<string, number> | null }) {
  return <ScrollView style={styles.pageScroll} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}><ApiNotice message={apiError} /><Text style={styles.screenTitle}>Resumo</Text><Text style={styles.screenSubtitle}>Visão consolidada</Text>
    <GlassCard variant="balance" style={styles.summaryHero}><Text style={styles.summaryCaption}>SALDO GERAL</Text><Text style={styles.summaryNumber}>{summary ? formatCurrency(summary.saldoGeral) : '—'}</Text><Text style={styles.trend}>Receitas menos despesas</Text></GlassCard>
    <View style={styles.metricRow}><Metric label="Entradas" value={summary ? formatCurrency(summary.totalReceitas) : '—'} color={colors.income} /><Metric label="Saídas" value={summary ? formatCurrency(summary.totalDespesas) : '—'} color={colors.expense} /></View><Text style={styles.sectionTitle}>Por categoria</Text>{!categoryTotals && <Text style={styles.apiCaption}>Aguardando lançamentos do backend.</Text>}<View style={styles.ring}><Text style={styles.ringText}>{categoryTotals ? formatCurrency(Object.values(categoryTotals).reduce((total, value) => total + value, 0)) : '—'}</Text></View>
    {categoryData.map((category) => <GlassCard key={category.name} variant="transaction" style={styles.settingCard}><View style={styles.setting}><View style={styles.settingIcon}><Icon name={categoryIcons[category.name]} size={18} color={colors.lime} /></View><Text style={styles.settingText}>{category.name}</Text><Text style={styles.link}>{category.value}</Text></View></GlassCard>)}</ScrollView>;
}

function Profile() {
  return <ScrollView style={styles.pageScroll} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}><Text style={styles.screenTitle}>Perfil</Text><Text style={styles.screenSubtitle}>Sua conta e preferências.</Text>
    <GlassCard variant="balance" style={styles.profileCard}><View style={styles.profileAvatar}><Icon name="person-outline" size={28} color={colors.ink} /></View><Text style={styles.profileName}>Perfil indisponível</Text><Text style={styles.profileMail}>A API ainda não fornece dados de usuário.</Text></GlassCard></ScrollView>;
}

function Metric({ label, value, color }: { label: string; value: string; color: string }) { return <GlassCard variant="category" style={styles.metric}><Text style={styles.metricLabel}>{label}</Text><Text style={[styles.metricNumber, { color }]}>{value}</Text></GlassCard>; }
function TransactionRow({ item, compact = false }: { item: Transaction; compact?: boolean }) { const income = item.value > 0; const content = <View style={[styles.row, compact && styles.compactRow]}><View style={[styles.transactionIcon, compact && styles.transactionIconCompact]}><Icon name={income ? 'arrow-down-outline' : transactionIcons[item.category] || 'receipt-outline'} size={compact ? 15 : 18} color={income ? colors.lime : colors.white} /></View><View style={{ flex: 1 }}><Text style={[styles.transactionTitle, compact && styles.compactTransactionTitle]}>{item.title}</Text><Text style={[styles.transactionMeta, compact && styles.compactTransactionMeta]}>{item.category} · {item.date}</Text></View><Text style={[styles.transactionValue, compact && styles.compactTransactionValue, { color: income ? colors.income : colors.expense }]}>{income ? '+' : '−'} {formatCurrency(Math.abs(item.value))}</Text></View>; return <GlassCard variant="transaction" style={[styles.transactionCard, !compact && styles.historyTransactionCard]} contentStyle={styles.transactionCardContent}>{content}</GlassCard>; }
function ApiNotice({ message }: { message: string | null }) { if (!message) return null; return <View style={styles.apiNotice}><Icon name="cloud-offline-outline" size={14} color={colors.expense} /><Text style={styles.apiNoticeText}>{message}</Text></View>; }

function BottomNav({ active, blurTarget, progress, indicatorStretch, onChange }: { active: PageTab; blurTarget: RefObject<View | null>; progress: SharedValue<number>; indicatorStretch: SharedValue<number>; onChange: (tab: Tab) => void }) {
  const { width } = useWindowDimensions();
  const navWidth = Math.max(0, width - 40);
  const cellWidth = (navWidth - 8) / 5;
  const firstIndicatorX = 4 + cellWidth / 2 - 14;
  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(progress.value, [0, 1, 2, 3], [firstIndicatorX, firstIndicatorX + cellWidth, firstIndicatorX + cellWidth * 3, firstIndicatorX + cellWidth * 4]) },
      { scaleX: indicatorStretch.value },
      { scaleY: 1 - (indicatorStretch.value - 1) * 0.28 },
    ],
  }), [cellWidth, firstIndicatorX]);
  const nav: { name: Tab; icon: keyof typeof Ionicons.glyphMap }[] = [{ name: 'Início', icon: 'home-outline' }, { name: 'Histórico', icon: 'list-outline' }, { name: 'Registrar', icon: 'add' }, { name: 'Resumo', icon: 'stats-chart-outline' }, { name: 'Perfil', icon: 'person-outline' }];

  return <View style={styles.navOuter}>
    <View style={styles.nav}>
      <BlurView blurTarget={blurTarget} blurMethod="dimezisBlurViewSdk31Plus" intensity={94} tint="dark" style={styles.navBlur} />
      <LinearGradient pointerEvents="none" colors={['rgba(235,245,220,0.18)', 'rgba(171,193,144,0.06)', 'rgba(15,23,12,0.055)']} locations={[0, 0.38, 1]} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={styles.navHighlight} />
      <Animated.View pointerEvents="none" style={[styles.navSelected, styles.navIndicator, indicatorStyle]} />
      {nav.map((item) => item.name === 'Registrar'
        ? <View key={item.name} style={styles.navItem} />
        : <NavDestination key={item.name} name={item.name} icon={item.icon} active={active === item.name} progress={progress} onPress={() => onChange(item.name)} />)}
    </View>
    <Pressable onPress={() => onChange('Registrar')} style={styles.navCenter}>
      <LinearGradient pointerEvents="none" colors={['#25351D', '#101A0D']} start={{ x: 0.25, y: 0 }} end={{ x: 0.8, y: 1 }} style={styles.navCenterGradient} />
      <View pointerEvents="none" style={styles.navCenterShine} />
      <Icon name="add" size={26} color={colors.accent} />
    </Pressable>
  </View>;
}

function NavDestination({ name, icon, active, progress, onPress }: { name: PageTab; icon: keyof typeof Ionicons.glyphMap; active: boolean; progress: SharedValue<number>; onPress: () => void }) {
  const pageIndex = pageTabs.indexOf(name);
  const animatedIconStyle = useAnimatedStyle(() => {
    const focus = Math.max(0, 1 - Math.abs(progress.value - pageIndex));
    return {
      opacity: 0.72 + focus * 0.28,
      transform: [{ scale: 1 + focus * 0.05 }],
    };
  }, [pageIndex, progress]);
  const activeGlyphStyle = useAnimatedStyle(() => ({
    opacity: Math.max(0, 1 - Math.abs(progress.value - pageIndex)),
  }), [pageIndex, progress]);

  return <Pressable onPress={onPress} style={styles.navItem}>
    <Animated.View style={[styles.navIconWrap, animatedIconStyle]}>
      <Icon name={icon} size={17} color="rgba(224,232,214,0.72)" />
      <Animated.View pointerEvents="none" style={[styles.navIconActive, activeGlyphStyle]}>
        <Icon name={icon} size={17} color={colors.ink} />
      </Animated.View>
    </Animated.View>
    <Text style={[styles.navLabel, active && { color: colors.accent }]}>{name}</Text>
  </Pressable>;
}

function EntryModal({ state, entry, onChange, onClose, onRecord, onStop, onSave, onHistory, error, saving, successMessage }: { state: SheetState; entry: string; onChange: (value: string) => void; onClose: () => void; onRecord: () => void; onStop: () => void; onSave: () => void; onHistory: () => void; error: string | null; saving: boolean; successMessage: string }) {
  const sheetDragY = useSharedValue(0);
  const sheetDragStyle = useAnimatedStyle(() => ({ transform: [{ translateY: sheetDragY.value }] }));
  useEffect(() => {
    sheetDragY.value = 0;
  }, [sheetDragY, state]);
  const dismissGesture = useMemo(() => Gesture.Pan()
    .activeOffsetY(12)
    .failOffsetX([-18, 18])
    .onUpdate((event) => {
      sheetDragY.value = Math.max(0, event.translationY);
    })
    .onEnd((event) => {
      if (event.translationY > 105 || event.velocityY > 850) {
        // Após acompanhar o dedo, encerra com um deslocamento curto e rápido;
        // uma mola longa deixava apenas o backdrop escuro visível por tempo demais.
        sheetDragY.value = withTiming(Math.max(event.translationY + 220, 320), { duration: 110 }, (finished) => {
          if (finished) scheduleOnRN(onClose);
        });
      } else {
        sheetDragY.value = withSpring(0, pageSpring);
      }
    })
    .onFinalize((_event, success) => {
      if (!success) sheetDragY.value = withSpring(0, pageSpring);
    }), [onClose, sheetDragY]);

  if (state === 'closed') return null;
  if (state === 'success') return <Modal visible transparent animationType="fade" onRequestClose={onClose}><View style={styles.modalSuccess}><View style={styles.successCard}><View style={styles.successBadge}><Icon name="checkmark" size={34} /></View><Text style={styles.successTitle}>Lançamento processado</Text><Text style={styles.successMeta}>{successMessage}</Text><View style={[styles.sheetActions, { width: '100%', marginTop: 28 }]}><Pressable style={styles.secondaryButton} onPress={onClose}><Text style={styles.secondaryText}>Fechar</Text></Pressable><Pressable style={styles.primaryButton} onPress={onHistory}><Text style={styles.primaryText}>Ver histórico</Text></Pressable></View></View></View></Modal>;
  return <Modal visible transparent animationType="slide" onRequestClose={onClose}>
    <GestureHandlerRootView style={styles.modalKeyboard}>
      <KeyboardAvoidingView style={styles.modalKeyboard} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.overlay}>
        <Pressable accessibilityRole="button" accessibilityLabel="Fechar registro" onPress={onClose} style={styles.modalBackdrop} />
        <GestureDetector gesture={dismissGesture}>
          <Animated.View style={[styles.sheet, sheetDragStyle]}>
          <LinearGradient pointerEvents="none" colors={['#2C3A25', '#172014']} style={styles.sheetGradient} />
          <View style={styles.sheetHandleArea}><View style={styles.sheetHandle} /></View>
          {state === 'recording' ? <View style={styles.recording}>
            <View style={styles.sheetHeader}><Text style={styles.sheetTitle}>Ouvindo...</Text><Pressable accessibilityRole="button" accessibilityLabel="Fechar registro" onPress={onClose} style={styles.sheetClose}><Icon name="close" size={19} color={colors.textPrimary} /></Pressable></View>
            <View style={styles.wave}>{[20, 36, 50, 30, 43, 24, 46].map((height, index) => <View key={index} style={[styles.waveBar, { height }]} />)}</View>
            <Text style={styles.recordingText}>Pode falar naturalmente.</Text>
            <View style={[styles.sheetActions, { width: '100%' }]}><Pressable style={styles.secondaryButton} onPress={onClose}><Text style={styles.secondaryText}>Cancelar</Text></Pressable><Pressable style={[styles.primaryButton, { backgroundColor: colors.expense }]} onPress={onStop}><Icon name="stop" size={15} /><Text style={styles.primaryText}>Parar</Text></Pressable></View>
          </View> : <>
            <View style={styles.sheetHeader}><Text style={styles.sheetTitle}>Registrar agora</Text><Pressable accessibilityRole="button" accessibilityLabel="Fechar registro" onPress={onClose} style={styles.sheetClose}><Icon name="close" size={19} color={colors.textPrimary} /></Pressable></View>
            <Text style={styles.sheetCopy}>Escreva do seu jeito ou fale para registrar.</Text>
            <ScrollView style={styles.entryFormScroll} contentContainerStyle={styles.entryFormContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <TextInput value={entry} onChangeText={onChange} placeholder="Ex.: Gastei 35 reais no Uber" placeholderTextColor={colors.muted} style={styles.textArea} multiline blurOnSubmit={false} returnKeyType="default" />
            </ScrollView>
            {error && <Text style={styles.apiErrorText}>{error}</Text>}
            <View style={styles.sheetActions}><Pressable style={styles.secondaryButton} onPress={onRecord}><Icon name="mic-outline" size={18} /><Text style={styles.secondaryText}>Falar</Text></Pressable><Pressable disabled={saving} style={[styles.primaryButton, saving && { opacity: 0.7 }]} onPress={onSave}><Text style={styles.primaryText}>{saving ? 'Enviando...' : 'Confirmar'}</Text></Pressable></View>
          </>}
          </Animated.View>
        </GestureDetector>
      </View>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  </Modal>;
}

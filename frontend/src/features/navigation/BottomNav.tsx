import React, { type RefObject } from 'react';
import { useAnimatedStyle, interpolate, type SharedValue } from 'react-native-reanimated';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';
import { Icon, type IconName } from '../../shared/components/Icon';
import { pageTabs, type PageTab, type Tab } from '../../shared/domain/navigation';
import { styles } from '../../shared/theme/styles';
import { colors } from '../../shared/theme/tokens';

export function BottomNav({ active, blurTarget, progress, indicatorStretch, onChange }: {
  active: PageTab; blurTarget: RefObject<View | null>; progress: SharedValue<number>;
  indicatorStretch: SharedValue<number>; onChange: (tab: Tab) => void;
}) {
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
  const nav: { name: Tab; icon: IconName }[] = [
    { name: 'Início', icon: 'home-outline' }, { name: 'Histórico', icon: 'list-outline' },
    { name: 'Registrar', icon: 'add' }, { name: 'Resumo', icon: 'stats-chart-outline' }, { name: 'Perfil', icon: 'person-outline' },
  ];

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
      <View pointerEvents="none" style={styles.navCenterShine} /><Icon name="add" size={26} color={colors.accent} />
    </Pressable>
  </View>;
}

function NavDestination({ name, icon, active, progress, onPress }: {
  name: PageTab; icon: IconName; active: boolean; progress: SharedValue<number>; onPress: () => void;
}) {
  const pageIndex = pageTabs.indexOf(name);
  const animatedIconStyle = useAnimatedStyle(() => {
    const focus = Math.max(0, 1 - Math.abs(progress.value - pageIndex));
    return { opacity: 0.72 + focus * 0.28, transform: [{ scale: 1 + focus * 0.05 }] };
  }, [pageIndex, progress]);
  const activeGlyphStyle = useAnimatedStyle(() => ({ opacity: Math.max(0, 1 - Math.abs(progress.value - pageIndex)) }), [pageIndex, progress]);

  return <Pressable onPress={onPress} style={styles.navItem}>
    <Animated.View style={[styles.navIconWrap, animatedIconStyle]}>
      <Icon name={icon} size={17} color="rgba(224,232,214,0.72)" />
      <Animated.View pointerEvents="none" style={[styles.navIconActive, activeGlyphStyle]}><Icon name={icon} size={17} color={colors.ink} /></Animated.View>
    </Animated.View>
    <TextLabel name={name} active={active} />
  </Pressable>;
}

function TextLabel({ name, active }: { name: string; active: boolean }) {
  return <Text style={[styles.navLabel, active && { color: colors.accent }]}>{name}</Text>;
}

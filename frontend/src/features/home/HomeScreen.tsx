import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { ApiNotice } from '../../shared/components/ApiNotice';
import { GlassCard } from '../../shared/components/GlassCard';
import { Icon, RoundIcon, type IconName } from '../../shared/components/Icon';
import { formatCurrency, type Transaction } from '../../shared/domain/finance';
import type { FinancialSummary } from '../../shared/api/client';
import { styles } from '../../shared/theme/styles';
import { colors } from '../../shared/theme/tokens';
import { TransactionRow } from '../transactions/TransactionRow';

const days = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];
const categoryIcons: Record<string, IconName> = {
  Alimentação: 'restaurant-outline', Transporte: 'car-sport-outline', Moradia: 'business-outline', Lazer: 'ticket-outline',
};

type CategoryData = { name: string; value: string }[];

export function HomeScreen({ compact, onRecord, onHistory, items, summary, apiError, categoryData, barHeights }: {
  compact: boolean; onRecord: () => void; onHistory: () => void; items: Transaction[]; summary: FinancialSummary | null;
  apiError: string | null; categoryData: CategoryData; barHeights: number[];
}) {
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
    <View style={[styles.spread, styles.sectionHeader, styles.recentHeader]}><Text style={styles.sectionTitle}>Recentes</Text><Text style={styles.link}>Ver todos</Text></View>
    {items.length ? items.map((item) => <TransactionRow key={item.id} item={item} compact />) : <Text style={styles.emptyState}>Nenhum lançamento disponível.</Text>}
  </ScrollView>;
}

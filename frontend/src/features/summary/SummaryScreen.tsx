import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import type { FinancialSummary } from '../../shared/api/client';
import { ApiNotice } from '../../shared/components/ApiNotice';
import { GlassCard } from '../../shared/components/GlassCard';
import { Icon, type IconName } from '../../shared/components/Icon';
import { formatCurrency } from '../../shared/domain/finance';
import { styles } from '../../shared/theme/styles';
import { colors } from '../../shared/theme/tokens';

const categoryIcons: Record<string, IconName> = {
  Alimentação: 'restaurant-outline', Transporte: 'car-sport-outline', Moradia: 'business-outline', Lazer: 'ticket-outline',
};

export function SummaryScreen({ summary, apiError, categoryData, categoryTotals }: {
  summary: FinancialSummary | null; apiError: string | null; categoryData: { name: string; value: string }[];
  categoryTotals: Record<string, number> | null;
}) {
  const total = categoryTotals ? Object.values(categoryTotals).reduce((sum, value) => sum + value, 0) : null;
  return <ScrollView style={styles.pageScroll} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
    <ApiNotice message={apiError} /><Text style={styles.screenTitle}>Resumo</Text><Text style={styles.screenSubtitle}>Visão consolidada</Text>
    <GlassCard variant="balance" style={styles.summaryHero}><Text style={styles.summaryCaption}>SALDO GERAL</Text><Text style={styles.summaryNumber}>{summary ? formatCurrency(summary.saldoGeral) : '—'}</Text><Text style={styles.trend}>Receitas menos despesas</Text></GlassCard>
    <View style={styles.metricRow}><Metric label="Entradas" value={summary ? formatCurrency(summary.totalReceitas) : '—'} color={colors.income} /><Metric label="Saídas" value={summary ? formatCurrency(summary.totalDespesas) : '—'} color={colors.expense} /></View>
    <Text style={styles.sectionTitle}>Por categoria</Text>{!categoryTotals && <Text style={styles.apiCaption}>Aguardando lançamentos.</Text>}
    <View style={styles.ring}><Text style={styles.ringText}>{total === null ? '—' : formatCurrency(total)}</Text></View>
    {categoryData.map((category) => <GlassCard key={category.name} variant="transaction" style={styles.settingCard}><View style={styles.setting}><View style={styles.settingIcon}><Icon name={categoryIcons[category.name]} size={18} color={colors.lime} /></View><Text style={styles.settingText}>{category.name}</Text><Text style={styles.link}>{category.value}</Text></View></GlassCard>)}
  </ScrollView>;
}

function Metric({ label, value, color }: { label: string; value: string; color: string }) {
  return <GlassCard variant="category" style={styles.metric}><Text style={styles.metricLabel}>{label}</Text><Text style={[styles.metricNumber, { color }]}>{value}</Text></GlassCard>;
}

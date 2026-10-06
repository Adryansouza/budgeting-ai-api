import React from 'react';
import { Text, View } from 'react-native';
import { GlassCard } from '../../shared/components/GlassCard';
import { Icon, type IconName } from '../../shared/components/Icon';
import type { Transaction } from '../../shared/domain/finance';
import { formatCurrency } from '../../shared/domain/finance';
import { styles } from '../../shared/theme/styles';
import { colors } from '../../shared/theme/tokens';

const categoryIcons: Record<string, IconName> = {
  Transporte: 'car-sport-outline',
  Alimentação: 'restaurant-outline',
  Moradia: 'business-outline',
  Salário: 'cash-outline',
  'Novo lançamento': 'add-circle-outline',
};

export function TransactionRow({ item, compact = false }: { item: Transaction; compact?: boolean }) {
  const income = item.value > 0;
  return <GlassCard variant="transaction" style={[styles.transactionCard, !compact && styles.historyTransactionCard]} contentStyle={styles.transactionCardContent}>
    <View style={[styles.row, compact && styles.compactRow]}>
      <View style={[styles.transactionIcon, compact && styles.transactionIconCompact]}>
        <Icon name={income ? 'arrow-down-outline' : categoryIcons[item.category] || 'receipt-outline'} size={compact ? 15 : 18} color={income ? colors.lime : colors.white} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.transactionTitle, compact && styles.compactTransactionTitle]}>{item.title}</Text>
        <Text style={[styles.transactionMeta, compact && styles.compactTransactionMeta]}>{item.category} · {item.date}</Text>
      </View>
      <Text style={[styles.transactionValue, compact && styles.compactTransactionValue, { color: income ? colors.income : colors.expense }]}>
        {income ? '+' : '−'} {formatCurrency(Math.abs(item.value))}
      </Text>
    </View>
  </GlassCard>;
}

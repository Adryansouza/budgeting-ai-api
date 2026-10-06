import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import type { Transaction } from '../../shared/domain/finance';
import { ApiNotice } from '../../shared/components/ApiNotice';
import { styles } from '../../shared/theme/styles';
import { TransactionRow } from '../transactions/TransactionRow';

export function HistoryScreen({ items, apiError }: { items: Transaction[]; apiError: string | null }) {
  const [filter, setFilter] = useState('Todos');
  const shown = items.filter((item) => filter === 'Todos' || (filter === 'Receitas' ? item.value > 0 : item.value < 0));
  return <ScrollView style={styles.pageScroll} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
    <ApiNotice message={apiError} /><Text style={styles.screenTitle}>Lançamentos</Text><Text style={styles.screenSubtitle}>Acompanhe cada movimento do seu mês.</Text>
    <View style={styles.filterRow}>{['Todos', 'Despesas', 'Receitas'].map((name) => <Pressable key={name} onPress={() => setFilter(name)} style={[styles.filter, filter === name && styles.filterActive]}><Text style={[styles.filterText, filter === name && styles.filterActiveText]}>{name}</Text></Pressable>)}</View>
    {shown.length ? shown.map((item) => <TransactionRow key={item.id} item={item} />) : <Text style={styles.emptyState}>Nenhum lançamento disponível para este filtro.</Text>}
  </ScrollView>;
}

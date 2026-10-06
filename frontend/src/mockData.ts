export type Transaction = { id: string; title: string; category: string; date: string; value: number; icon: string };

export const transactions: Transaction[] = [
  { id: '1', title: 'Mercado Pão de Açúcar', category: 'Alimentação', date: 'Hoje, 14:22', value: -143.8, icon: '▦' },
  { id: '2', title: 'Salário', category: 'Receita', date: 'Hoje, 09:10', value: 4200, icon: '↗' },
  { id: '3', title: 'Uber', category: 'Transporte', date: 'Ontem, 21:14', value: -28.4, icon: '◉' },
  { id: '4', title: 'Internet', category: 'Moradia', date: 'Ontem, 10:00', value: -99.9, icon: '⌁' },
  { id: '5', title: 'Cinema', category: 'Lazer', date: '02 out, 20:40', value: -42, icon: '◌' },
];

export const categories = [
  { name: 'Alimentação', value: 'R$ 640,00', icon: '◒' },
  { name: 'Transporte', value: 'R$ 288,00', icon: '◉' },
  { name: 'Moradia', value: 'R$ 1.150,00', icon: '⌂' },
  { name: 'Lazer', value: 'R$ 180,00', icon: '◌' },
];

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

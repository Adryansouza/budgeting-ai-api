export type Transaction = {
  id: string;
  title: string;
  category: string;
  date: string;
  value: number;
  occurredAt?: string;
};

export const categoryNames = ['Alimentação', 'Transporte', 'Moradia', 'Lazer'] as const;

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  category: string;
  type: 'expense' | 'income';
  amount: number;
  icon: string;
}

export interface Category {
  name: string;
  icon: string;
  type: 'expense' | 'income';
}

export type FilterType = 'all' | 'expense' | 'income';

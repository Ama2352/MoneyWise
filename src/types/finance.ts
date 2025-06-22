/**
 * Money Management related type definitions
 */
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  transactionId: string;
  categoryId: string;
  walletId: string;
  type: TransactionType;
  amount: number;
  description: string;
  transactionDate: string;
}

export type CreateTransactionRequest = Omit<Transaction, 'transactionId'>;

export interface SearchTransactionRequest {
  startDate?: string;
  endDate?: string;
  type?: TransactionType;
  categoryName?: string;
  walletName?: string;
  amountRange?: string; // e.g. "100-500"
  keywords?: string; // e.g. "grocery" - Note: using "keywords" to match backend API
  timeRange?: string; // e.g. "18:00-20:00"
  dayOfWeek?: string; // e.g. "Monday"
}

export interface Category {
  categoryId: string;
  name: string;
  createdAt: string;
}

export type CreateCategoryRequest = Pick<Category, 'name'>;
export type UpdateCategoryRequest = Pick<Category, 'categoryId' | 'name'>;

export interface Wallet {
  walletId: string;
  walletName: string;
  balance: number;
}

export type CreateWalletRequest = Omit<Wallet, 'walletId'>;

export interface CashFlow {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

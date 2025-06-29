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

export interface SavingGoalProgress {
  savingGoalId: string;
  categoryId: string;
  walletId: string;
  description: string;
  targetAmount: number;
  savedAmount: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  savedPercentage: number;
  progressStatus: string;
  notification: string;
}

export type SavingGoal = Omit<
  SavingGoalProgress,
  'savedPercentage' | 'progressStatus' | 'notification'
>;

export type CreateSavingGoalRequest = Omit<
  SavingGoal,
  'createdAt' | 'savedAmount' | 'savingGoalId'
>;

export type UpdateSavingGoalRequest = Omit<
  SavingGoal,
  'createdAt' | 'savedAmount'
>;

export interface SearchSavingGoalRequest {
  startDate?: string;
  endDate?: string;
  categoryName?: string;
  walletName?: string;
  minTargetAmount?: number;
  maxTargetAmount?: number;
  keywords?: string;
}

export interface BudgetProgress {
  budgetId: string;
  categoryId: string;
  walletId: string;
  description: string;
  limitAmount: number;
  currentSpending: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  usagePercentage: number;
  progressStatus: string;
  notification: string;
}

export type Budget = Omit<
  BudgetProgress,
  'usagePercentage' | 'progressStatus' | 'notification'
>;

export type CreateBudgetRequest = Omit<
  Budget,
  'createdAt' | 'currentSpending' | 'budgetId'
>;

export type UpdateBudgetRequest = Omit<Budget, 'createdAt' | 'currentSpending'>;

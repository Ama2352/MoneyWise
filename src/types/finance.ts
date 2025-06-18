/**
 * Money Management related type definitions
 */

export interface Category {
  categoryId: string;
  name: string;
  createdAt: string;
}

// With Pick - automatic sync (If Category.name changes, this automatically updates)
export type CreateCategoryRequest = Pick<Category, 'name'>;
export type UpdateCategoryRequest = CreateCategoryRequest & {
  categoryId: string;
};

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: number;
  amount: number;
  description: string;
  date: string;
  type: 'INCOME' | 'EXPENSE';
  categoryId: number;
  accountId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: number;
  name: string;
  type: 'CHECKING' | 'SAVINGS' | 'CREDIT' | 'CASH';
  balance: number;
  currency: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: number;
  name: string;
  amount: number;
  spent: number;
  categoryId: number;
  period: 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  startDate: string;
  endDate: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  period: string;
}

export interface CreateTransactionRequest {
  amount: number;
  description: string;
  date: string;
  type: 'INCOME' | 'EXPENSE';
  categoryId: number;
  accountId: number;
}

export interface CreateAccountRequest {
  name: string;
  type: 'CHECKING' | 'SAVINGS' | 'CREDIT' | 'CASH';
  balance: number;
  currency: string;
}

export interface CreateBudgetRequest {
  name: string;
  amount: number;
  categoryId: number;
  period: 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  startDate: string;
  endDate: string;
}

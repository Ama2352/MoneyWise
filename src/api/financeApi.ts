import httpClient from './httpClient';
import { API_ENDPOINTS } from '../config/api';
import type {
  Wallet,
  CreateWalletRequest,
  Transaction,
  Category,
  CreateTransactionRequest,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  SearchTransactionRequest,
  CashFlow,
} from '../types';

/**
 * Finance-related API services
 */

// Transaction APIs
export const transactionApi = {
  getAll: async (): Promise<Transaction[]> => {
    const response = await httpClient.get<Transaction[]>(
      API_ENDPOINTS.TRANSACTIONS.BASE
    );
    return response.data;
  },

  getById: async (id: string): Promise<Transaction> => {
    const response = await httpClient.get<Transaction>(
      `${API_ENDPOINTS.TRANSACTIONS.BASE}/${id}`
    );
    return response.data;
  },

  create: async (
    transaction: CreateTransactionRequest
  ): Promise<Transaction> => {
    const response = await httpClient.post<Transaction>(
      API_ENDPOINTS.TRANSACTIONS.BASE,
      transaction
    );
    return response.data;
  },

  update: async (transaction: Transaction): Promise<Transaction> => {
    const response = await httpClient.put<Transaction>(
      API_ENDPOINTS.TRANSACTIONS.BASE,
      transaction // ← Direct object, becomes request body
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`${API_ENDPOINTS.TRANSACTIONS.BASE}/${id}`);
  },

  search: async (params: SearchTransactionRequest): Promise<Transaction[]> => {
    const response = await httpClient.get<Transaction[]>(
      API_ENDPOINTS.TRANSACTIONS.SEARCH,
      { params } // ← Wrapped in object, becomes ?key=value&key2=value2
    );
    return response.data;
  },
};

// Category APIs
export const categoryApi = {
  getAll: async (acceptLanguage?: string): Promise<Category[]> => {
    const headers = acceptLanguage ? { 'Accept-Language': acceptLanguage } : {};
    const response = await httpClient.get<Category[]>(
      API_ENDPOINTS.CATEGORIES.BASE,
      { headers }
    );
    return response.data;
  },

  getById: async (categoryId: string): Promise<Category> => {
    const response = await httpClient.get<Category>(
      `${API_ENDPOINTS.CATEGORIES.BASE}/${categoryId}`
    );
    return response.data;
  },

  create: async (category: CreateCategoryRequest): Promise<Category> => {
    const response = await httpClient.post<Category>(
      API_ENDPOINTS.CATEGORIES.BASE,
      category
    );
    return response.data;
  },
  update: async (category: UpdateCategoryRequest): Promise<Category> => {
    const response = await httpClient.put<Category>(
      `${API_ENDPOINTS.CATEGORIES.BASE}`,
      category
    );
    return response.data;
  },
  delete: async (categoryId: string): Promise<string> => {
    const response = await httpClient.delete<string>(
      `${API_ENDPOINTS.CATEGORIES.BASE}/${categoryId}`
    );
    return response.data;
  },
};

// Wallet APIs
export const walletApi = {
  getAll: async (): Promise<Wallet[]> => {
    const response = await httpClient.get<Wallet[]>(API_ENDPOINTS.WALLETS.BASE);
    return response.data;
  },

  getById: async (walletId: string): Promise<Wallet> => {
    const response = await httpClient.get<Wallet>(
      `${API_ENDPOINTS.WALLETS.BASE}/${walletId}`
    );
    return response.data;
  },

  create: async (wallet: CreateWalletRequest): Promise<Wallet> => {
    const response = await httpClient.post<Wallet>(
      API_ENDPOINTS.WALLETS.BASE,
      wallet
    );
    return response.data;
  },

  update: async (wallet: Wallet): Promise<Wallet> => {
    const response = await httpClient.put<Wallet>(
      `${API_ENDPOINTS.WALLETS.BASE}`,
      wallet // ← Direct object, becomes request body
    );
    return response.data;
  },

  delete: async (walletId: string): Promise<void> => {
    await httpClient.delete(`${API_ENDPOINTS.WALLETS.BASE}/${walletId}`);
  },
};

export const statisticsApi = {
  getCashFlow: async (
    startDate: string,
    endDate: string
  ): Promise<CashFlow> => {
    const response = await httpClient.get<CashFlow>(
      `${API_ENDPOINTS.STATISTICS.CASH_FLOW}?startDate=${startDate}&endDate=${endDate}`
    );

    // Calculate balance if not provided by backend
    const data = response.data;
    return {
      ...data,
      balance: data.totalIncome - data.totalExpenses,
    };
  },
};

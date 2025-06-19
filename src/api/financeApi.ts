import httpClient from './httpClient';
import { API_ENDPOINTS } from '../config/api';
import type { 
  Transaction, 
  Category, 
  Account, 
  Budget,
  CreateTransactionRequest,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CreateAccountRequest,
  CreateBudgetRequest,
  TransactionSummary,
  PaginatedResponse
} from '../types';

/**
 * Finance-related API services
 */

// Transaction APIs
export const transactionApi = {
  getAll: async (page = 0, size = 10): Promise<PaginatedResponse<Transaction>> => {
    const response = await httpClient.get<PaginatedResponse<Transaction>>(
      `${API_ENDPOINTS.TRANSACTIONS.BASE}?page=${page}&size=${size}`
    );
    return response.data;
  },

  getById: async (id: number): Promise<Transaction> => {
    const response = await httpClient.get<Transaction>(
      `${API_ENDPOINTS.TRANSACTIONS.BASE}/${id}`
    );
    return response.data;
  },

  create: async (transaction: CreateTransactionRequest): Promise<Transaction> => {
    const response = await httpClient.post<Transaction>(
      API_ENDPOINTS.TRANSACTIONS.BASE,
      transaction
    );
    return response.data;
  },

  update: async (id: number, transaction: Partial<CreateTransactionRequest>): Promise<Transaction> => {
    const response = await httpClient.put<Transaction>(
      `${API_ENDPOINTS.TRANSACTIONS.BASE}/${id}`,
      transaction
    );
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await httpClient.delete(`${API_ENDPOINTS.TRANSACTIONS.BASE}/${id}`);
  },

  getSummary: async (period?: string): Promise<TransactionSummary> => {
    const params = period ? `?period=${period}` : '';
    const response = await httpClient.get<TransactionSummary>(
      `${API_ENDPOINTS.TRANSACTIONS.SUMMARY}${params}`
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
    console.log('🔍 [CategoryAPI] Updating category');
    console.log('📤 [CategoryAPI] Request - URL:', `${API_ENDPOINTS.CATEGORIES.BASE}/${category.categoryId}`);
    console.log('📤 [CategoryAPI] Request - Payload:', JSON.stringify(category, null, 2));
    
    try {
      const response = await httpClient.put<Category>(
        `${API_ENDPOINTS.CATEGORIES.BASE}`,
        category
      );
      
      console.log('✅ [CategoryAPI] Update Success');
      console.log('📥 [CategoryAPI] Response data:', response.data);
      console.log('📥 [CategoryAPI] Response status:', response.status);
      
      return response.data;
    } catch (error) {
      console.error('❌ [CategoryAPI] Update Error:', error);
      console.error('❌ [CategoryAPI] Update Error Details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        status: (error as any)?.response?.status,
        statusText: (error as any)?.response?.statusText,
        data: (error as any)?.response?.data,
      });
      throw error;
    }
  },

  delete: async (categoryId: string): Promise<string> => {
    console.log('🔍 [CategoryAPI] Deleting category');
    console.log('📤 [CategoryAPI] Request - ID:', categoryId);
    console.log('📤 [CategoryAPI] Request - URL:', `${API_ENDPOINTS.CATEGORIES.BASE}/${categoryId}`);
    
    try {
      const response = await httpClient.delete<string>(
        `${API_ENDPOINTS.CATEGORIES.BASE}/${categoryId}`
      );
      
      console.log('✅ [CategoryAPI] Delete Success');
      console.log('📥 [CategoryAPI] Response data:', response.data);
      console.log('📥 [CategoryAPI] Response status:', response.status);
      
      return response.data;
    } catch (error) {
      console.error('❌ [CategoryAPI] Delete Error:', error);
      console.error('❌ [CategoryAPI] Delete Error Details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        status: (error as any)?.response?.status,
        statusText: (error as any)?.response?.statusText,
        data: (error as any)?.response?.data,
      });
      throw error;
    }
  },
};

// Account APIs
export const accountApi = {
  getAll: async (): Promise<Account[]> => {
    const response = await httpClient.get<Account[]>(API_ENDPOINTS.ACCOUNTS.BASE);
    return response.data;
  },

  getById: async (id: number): Promise<Account> => {
    const response = await httpClient.get<Account>(`${API_ENDPOINTS.ACCOUNTS.BASE}/${id}`);
    return response.data;
  },

  create: async (account: CreateAccountRequest): Promise<Account> => {
    const response = await httpClient.post<Account>(API_ENDPOINTS.ACCOUNTS.BASE, account);
    return response.data;
  },

  update: async (id: number, account: Partial<CreateAccountRequest>): Promise<Account> => {
    const response = await httpClient.put<Account>(
      `${API_ENDPOINTS.ACCOUNTS.BASE}/${id}`,
      account
    );
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await httpClient.delete(`${API_ENDPOINTS.ACCOUNTS.BASE}/${id}`);
  },

  getBalance: async (id: number): Promise<{ balance: number }> => {
    const response = await httpClient.get<{ balance: number }>(
      `${API_ENDPOINTS.ACCOUNTS.BASE}/${id}/balance`
    );
    return response.data;
  },
};

// Budget APIs
export const budgetApi = {
  getAll: async (): Promise<Budget[]> => {
    const response = await httpClient.get<Budget[]>(API_ENDPOINTS.BUDGETS.BASE);
    return response.data;
  },

  getById: async (id: number): Promise<Budget> => {
    const response = await httpClient.get<Budget>(`${API_ENDPOINTS.BUDGETS.BASE}/${id}`);
    return response.data;
  },

  create: async (budget: CreateBudgetRequest): Promise<Budget> => {
    const response = await httpClient.post<Budget>(API_ENDPOINTS.BUDGETS.BASE, budget);
    return response.data;
  },

  update: async (id: number, budget: Partial<CreateBudgetRequest>): Promise<Budget> => {
    const response = await httpClient.put<Budget>(
      `${API_ENDPOINTS.BUDGETS.BASE}/${id}`,
      budget
    );
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await httpClient.delete(`${API_ENDPOINTS.BUDGETS.BASE}/${id}`);
  },
};

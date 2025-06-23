/**
 * API Configuration
 * Centralized configuration for API endpoints and settings
 */

// Environment-based API base URL - Use relative path for Vite proxy
export const API_BASE_URL = '/api';

// Debug logging (only in development)
if (import.meta.env.DEV) {
  console.log('🔧 [CONFIG] API Configuration:', {
    API_BASE_URL,
    MODE: import.meta.env.MODE
  });
}

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 10000;

// Default headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/Accounts/SignIn',
    REGISTER: '/Accounts/SignUp',
    REFRESH: '/Accounts/RefreshToken',
    PROFILE: '/Accounts/profile',
  },

  // Users
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    UPDATE: '/users/update',
  },

  // Money Management specific endpoints
  TRANSACTIONS: {
    BASE: '/transactions',
    BY_USER: '/transactions/user',
    BY_CATEGORY: '/transactions/category',
    SUMMARY: '/transactions/summary',
  },
  CATEGORIES: {
    BASE: '/Categories',
    BY_USER: '/Categories/user',
  },

  BUDGETS: {
    BASE: '/budgets',
    BY_USER: '/budgets/user',
    SUMMARY: '/budgets/summary',
  },

  ACCOUNTS: {
    BASE: '/accounts',
    BY_USER: '/accounts/user',
    BALANCE: '/accounts/balance',
  },
} as const;

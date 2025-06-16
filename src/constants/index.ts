/**
 * Application constants
 */

import type {
  Language,
  LanguageOption,
  CurrencyCode,
  CurrencyInfo,
} from '../types';

export const APP_NAME = 'MoneyWise';
export const APP_VERSION = '1.0.0';

// Local storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_PREFERENCES: 'userPreferences',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

// Route paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  TRANSACTIONS: '/transactions',
  CATEGORIES: '/categories',
  ACCOUNTS: '/accounts',
  BUDGETS: '/budgets',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

// Transaction types
export const TRANSACTION_TYPES = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
} as const;

// Account types
export const ACCOUNT_TYPES = {
  CHECKING: 'CHECKING',
  SAVINGS: 'SAVINGS',
  CREDIT: 'CREDIT',
  CASH: 'CASH',
} as const;

// Budget periods
export const BUDGET_PERIODS = {
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
  YEARLY: 'YEARLY',
} as const;

// Default category colors
export const CATEGORY_COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#FFEAA7',
  '#DDA0DD',
  '#98D8C8',
  '#F7DC6F',
  '#BB8FCE',
  '#85C1E9',
] as const;

// Currency related constants
export const CURRENCIES = {
  USD: 'usd' as const,
  VND: 'vnd' as const,
} as const;

export const CURRENCY_INFO: Record<CurrencyCode, CurrencyInfo> = {
  usd: {
    code: 'usd',
    name: 'US Dollar',
    symbol: '$',
    locale: 'en-US',
  },
  vnd: {
    code: 'vnd',
    name: 'Vietnamese Dong',
    symbol: '₫',
    locale: 'vi-VN',
  },
} as const;

export const EXCHANGE_API = {
  PRIMARY_BASE_URL:
    'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1',
  FALLBACK_BASE_URL: 'https://latest.currency-api.pages.dev/v1',
  CACHE_DURATION: 3600000, // 1 hour in milliseconds
} as const;

// Language settings
export const LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
  },
  {
    code: 'vi',
    name: 'Tiếng Việt',
    flag: '🇻🇳',
  },
] as const;

export const DEFAULT_LANGUAGE: Language = 'en';

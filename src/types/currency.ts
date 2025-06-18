/**
 * Currency-related TypeScript types
 */

export type CurrencyCode = 'usd' | 'vnd';

export interface ExchangeRate {
  from: CurrencyCode;
  to: CurrencyCode;
  rate: number;
  lastUpdated: string;
}

export interface CurrencyConversion {
  amount: number;
  fromCurrency: CurrencyCode;
  toCurrency: CurrencyCode;
  convertedAmount: number;
  exchangeRate: number;
  timestamp: string;
}

export interface ExchangeRateResponse {
  date: string;
  [key: string]: number | string;
}

export interface CurrencyApiResponse {
  [currencyCode: string]: number;
}

export interface CurrencyInfo {
  code: CurrencyCode;
  name: string;
  symbol: string;
  locale: string;
}

export interface ConversionRequest {
  amount: number;
  from: CurrencyCode;
  to: CurrencyCode;
}

export interface ConversionResult {
  success: boolean;
  data?: CurrencyConversion;
  error?: string;
}

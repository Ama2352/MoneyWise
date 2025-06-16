/**
 * Currency and number formatting utilities
 * Updated to integrate with the new currency service
 */

import { currencyService } from '../services/currencyService';
import type { CurrencyCode } from '../types';

/**
 * Format currency using the enhanced currency service
 * Supports USD and VND with proper locale formatting
 */
export const formatCurrency = (
  amount: number,
  currency: string | CurrencyCode = 'USD'
): string => {
  // Convert to lowercase for our currency service
  const currencyCode = currency.toLowerCase() as CurrencyCode;

  // Use our enhanced currency service if it's a supported currency
  if (currencyCode === 'usd' || currencyCode === 'vnd') {
    try {
      return currencyService.formatCurrency(amount, currencyCode);
    } catch (error) {
      console.warn(
        'Currency service failed, falling back to basic formatting:',
        error
      );
    }
  }

  // Fallback for unsupported currencies or errors
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount);
};

/**
 * Format currency with explicit currency code (recommended for new code)
 */
export const formatCurrencyWithCode = (
  amount: number,
  currency: CurrencyCode
): string => {
  return currencyService.formatCurrency(amount, currency);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatPercentage = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const parseAmount = (value: string): number => {
  // Remove currency symbols and commas, then parse
  const cleaned = value.replace(/[^0-9.-]/g, '');
  return parseFloat(cleaned) || 0;
};

export const roundToTwoDecimals = (num: number): number => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

/**
 * Enhanced amount parsing that handles VND (no decimals) and USD (with decimals)
 */
export const parseAmountForCurrency = (
  value: string,
  currency: CurrencyCode
): number => {
  const cleaned = value.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned) || 0;

  // VND doesn't use decimal places in practice
  return currency === 'vnd' ? Math.round(parsed) : parsed;
};

/**
 * Format currency amount with sign based on transaction type
 * @param amount - The amount to format (always positive)
 * @param currency - Currency code or string
 * @param type - Transaction type ('income' or 'expense', case insensitive)
 * @returns Formatted currency with appropriate sign (+ for income, - for expense)
 */
export const formatAmountWithSign = (
  amount: number,
  currency: string | CurrencyCode = 'USD',
  type: string
): string => {
  // Normalize the type to lowercase and validate
  const normalizedType = type.toLowerCase().trim();

  if (normalizedType !== 'income' && normalizedType !== 'expense') {
    console.warn(
      `Invalid transaction type: ${type}. Expected 'income' or 'expense'.`
    );
    // Default to expense if type is invalid
  }

  // Always use absolute value to ensure we control the sign
  const absoluteAmount = Math.abs(amount);

  // Format the currency amount
  const formattedAmount = formatCurrency(absoluteAmount, currency);

  // Add appropriate sign based on type
  const isIncome = normalizedType === 'income';
  return isIncome ? `+${formattedAmount}` : `-${formattedAmount}`;
};

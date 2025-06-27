/**
 * React hook for currency operations
 * Provides easy access to currency conversion and formatting
 */

import { useState, useCallback } from 'react';
import { currencyService } from '../services/currencyService';
import type {
  CurrencyCode,
  CurrencyConversion,
  ConversionRequest,
} from '../types';

interface UseCurrencyResult {
  // Conversion functions
  convertCurrency: (request: ConversionRequest) => Promise<CurrencyConversion>;

  // Formatting functions
  formatCurrency: (amount: number, currency: CurrencyCode) => string;

  // Loading and error states
  isLoading: boolean;
  error: string | null;
}

/**
 * Basic currency hook with essential currency operations
 */
export const useCurrency = (): UseCurrencyResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convertCurrency = useCallback(
    async (request: ConversionRequest): Promise<CurrencyConversion> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await currencyService.convertCurrency(request);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Currency conversion failed';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );
  const formatCurrency = useCallback(
    (amount: number, currency: CurrencyCode): string => {
      try {
        return currencyService.formatCurrency(amount, currency);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Currency formatting failed'
        );
        return `${amount} ${currency.toUpperCase()}`;
      }
    },
    []
  );
  return {
    convertCurrency,
    formatCurrency,
    isLoading,
    error,
  };
};

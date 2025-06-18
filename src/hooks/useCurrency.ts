/**
 * React hook for currency operations
 * Provides easy access to currency conversion and formatting
 */

import { useState, useEffect, useCallback } from 'react';
import { currencyService } from '../services/currencyService';
import type {
  CurrencyCode,
  CurrencyConversion,
  ConversionRequest,
  ExchangeRate,
  CurrencyInfo,
} from '../types';

interface UseCurrencyResult {
  // Conversion functions
  convertCurrency: (request: ConversionRequest) => Promise<CurrencyConversion>;
  getExchangeRate: (
    from: CurrencyCode,
    to: CurrencyCode
  ) => Promise<ExchangeRate>;

  // Formatting functions
  formatCurrency: (amount: number, currency: CurrencyCode) => string;

  // Currency information
  getCurrencyInfo: (currency: CurrencyCode) => CurrencyInfo;
  getSupportedCurrencies: () => CurrencyInfo[];

  // Cache management
  clearCache: () => void;
  getCacheStats: () => {
    totalEntries: number;
    validEntries: number;
    oldestEntry: number | null;
  };

  // Loading and error states
  isLoading: boolean;
  error: string | null;
}

interface UseCurrencyWithConversionResult extends UseCurrencyResult {
  // Auto-conversion state
  conversion: CurrencyConversion | null;
  refreshConversion: () => Promise<void>;
}

/**
 * Basic currency hook with all currency operations
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

  const getExchangeRate = useCallback(
    async (from: CurrencyCode, to: CurrencyCode): Promise<ExchangeRate> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await currencyService.getExchangeRate(from, to);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to get exchange rate';
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

  const getCurrencyInfo = useCallback(
    (currency: CurrencyCode): CurrencyInfo => {
      return currencyService.getCurrencyInfo(currency);
    },
    []
  );

  const getSupportedCurrencies = useCallback((): CurrencyInfo[] => {
    return currencyService.getSupportedCurrencies();
  }, []);

  const clearCache = useCallback((): void => {
    currencyService.clearCache();
  }, []);

  const getCacheStats = useCallback(() => {
    return currencyService.getCacheStats();
  }, []);

  return {
    convertCurrency,
    getExchangeRate,
    formatCurrency,
    getCurrencyInfo,
    getSupportedCurrencies,
    clearCache,
    getCacheStats,
    isLoading,
    error,
  };
};

/**
 * Hook with auto-conversion functionality
 * Automatically converts and tracks a specific currency pair
 */
export const useCurrencyWithConversion = (
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
  autoRefresh = true
): UseCurrencyWithConversionResult => {
  const basicHook = useCurrency();
  const [conversion, setConversion] = useState<CurrencyConversion | null>(null);

  const refreshConversion = useCallback(async () => {
    if (amount <= 0) {
      setConversion(null);
      return;
    }

    try {
      const result = await basicHook.convertCurrency({ amount, from, to });
      setConversion(result);
    } catch (error) {
      console.error('Auto-conversion failed:', error);
      setConversion(null);
    }
  }, [amount, from, to, basicHook.convertCurrency]);

  // Auto-refresh conversion when parameters change
  useEffect(() => {
    if (autoRefresh) {
      refreshConversion();
    }
  }, [autoRefresh, refreshConversion]);

  return {
    ...basicHook,
    conversion,
    refreshConversion,
  };
};

/**
 * Hook for getting live exchange rates with periodic updates
 */
export const useExchangeRate = (
  from: CurrencyCode,
  to: CurrencyCode,
  refreshInterval?: number // in milliseconds
) => {
  const { getExchangeRate, isLoading, error } = useCurrency();
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null);

  const fetchRate = useCallback(async () => {
    try {
      const rate = await getExchangeRate(from, to);
      setExchangeRate(rate);
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error);
    }
  }, [from, to, getExchangeRate]);

  useEffect(() => {
    fetchRate();

    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(fetchRate, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchRate, refreshInterval]);

  return {
    exchangeRate,
    isLoading,
    error,
    refresh: fetchRate,
  };
};

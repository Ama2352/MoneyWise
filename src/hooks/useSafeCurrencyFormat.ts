/**
 * Safe Currency Format Hook
 * Provides a hook that safely formats currency without causing crashes
 * Uses real exchange rates from the currency service
 */

import { useState, useCallback } from 'react';
import { useCurrencyContext } from '../contexts/CurrencyContext';
import { useCurrency } from './useCurrency';

interface UseSafeCurrencyFormatReturn {
  formatAmount: (amountInVnd: number) => string;
  formatAmountAsync: (amountInVnd: number) => Promise<string>;
  isConverting: boolean;
}

export const useSafeCurrencyFormat = (): UseSafeCurrencyFormatReturn => {
  const { convertAndFormat, currency } = useCurrencyContext();
  const { formatCurrency } = useCurrency();
  const [isConverting, setIsConverting] = useState(false);

  // Synchronous format for immediate display (VND only, real USD requires async)
  const formatAmount = useCallback((amountInVnd: number): string => {
    if (currency === 'vnd') {
      // For VND, we can format immediately without conversion
      return formatCurrency(amountInVnd, 'vnd');
    } else {
      // For USD, we need real conversion - return a loading placeholder
      // This will be replaced by the async result
      return formatCurrency(Math.abs(amountInVnd), 'vnd') + ' (converting...)';
    }
  }, [currency, formatCurrency]);

  // Asynchronous format for accurate conversion using real exchange rates
  const formatAmountAsync = useCallback(async (amountInVnd: number): Promise<string> => {
    setIsConverting(true);
    try {
      // Use the real convertAndFormat from context which uses live exchange rates
      const result = await convertAndFormat(amountInVnd);
      setIsConverting(false);
      return result;
    } catch (error) {
      console.error('Currency format failed, using VND fallback:', error);
      setIsConverting(false);
      // Fallback to VND formatting if conversion fails
      return formatCurrency(amountInVnd, 'vnd');
    }
  }, [convertAndFormat, formatCurrency]);

  return {
    formatAmount,
    formatAmountAsync,
    isConverting,
  };
};

/**
 * Custom hook for currency formatting and parsing
 * Handles display formatting, input parsing, and currency-aware logic
 */

import { useCallback } from 'react';
import { useCurrencyContext } from '../contexts';
import { currencyService } from '../services';

export const useCurrencyFormatter = () => {
  const { currency } = useCurrencyContext();

  // Format amount for display with proper thousand separators and currency symbol
  const formatAmountForDisplay = useCallback(
    (value: number): string => {
      if (!value) return '';
      return currencyService.formatCurrency(value, currency);
    },
    [currency]
  );

  // Parse formatted amount back to raw number
  const parseAmountFromDisplay = useCallback(
    (formatted: string): number => {
      if (!formatted) return 0;

      // Remove currency symbols and all non-numeric characters except decimal point
      const cleaned = formatted.replace(/[$₫]/g, '').replace(/[^\d.,]/g, '');

      if (currency === 'vnd') {
        // VND: remove dots (thousand separators)
        return parseFloat(cleaned.replace(/\./g, '')) || 0;
      } else {
        // USD: remove commas (thousand separators), keep decimal point
        return parseFloat(cleaned.replace(/,/g, '')) || 0;
      }
    },
    [currency]
  );

  // Get placeholder text for amount input
  const getAmountPlaceholder = useCallback((): string => {
    return currency === 'usd' ? '$0.00' : '0₫';
  }, [currency]);

  // Check if currency should auto-format on every keystroke
  const shouldAutoFormat = useCallback((): boolean => {
    return currency === 'vnd'; // VND auto-formats, USD formats on blur
  }, [currency]);

  return {
    formatAmountForDisplay,
    parseAmountFromDisplay,
    getAmountPlaceholder,
    shouldAutoFormat,
  };
};

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
      if (!formatted || formatted.trim() === '') return 0;

      // Handle basic numeric input first (user typing)
      if (/^-?\d*\.?\d*$/.test(formatted.trim())) {
        const simple = parseFloat(formatted.trim()) || 0;
        return simple;
      }

      // Check for negative sign or (-) indicator
      const isNegative = formatted.includes('-') || formatted.includes('(-)');

      // Remove currency symbols and all non-numeric characters except decimal point and negative sign
      const cleaned = formatted.replace(/[$₫]/g, '').replace(/[^\d.,-]/g, '');

      let value: number;
      
      if (currency === 'vnd') {
        // VND: remove dots (thousand separators), no decimal places
        const numericOnly = cleaned.replace(/\./g, '').replace(/,/g, '');
        value = parseInt(numericOnly) || 0;
      } else {
        // USD: remove commas (thousand separators), keep last decimal point
        let cleanedUsd = cleaned.replace(/,/g, '');
        
        // Handle multiple decimal points by keeping only the last one
        const parts = cleanedUsd.split('.');
        if (parts.length > 2) {
          cleanedUsd = parts.slice(0, -1).join('') + '.' + parts[parts.length - 1];
        }
        
        value = parseFloat(cleanedUsd) || 0;
      }

      return isNegative ? -Math.abs(value) : value;
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

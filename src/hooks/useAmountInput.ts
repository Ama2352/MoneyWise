/**
 * Custom hook for handling amount input with currency-aware formatting
 * Manages display state, raw value, and input event handlers
 */

import { useState, useCallback } from 'react';
import { useCurrencyFormatter } from './useCurrencyFormatter';

interface UseAmountInputOptions {
  initialValue?: number;
  onAmountChange?: (rawValue: number) => void;
  onError?: (error: string | null) => void;
}

export const useAmountInput = (options: UseAmountInputOptions = {}) => {
  const { initialValue = 0, onAmountChange, onError } = options;
  const {
    formatAmountForDisplay,
    parseAmountFromDisplay,
    getAmountPlaceholder,
  } = useCurrencyFormatter();

  const [displayAmount, setDisplayAmount] = useState<string>('');
  const [rawAmount, setRawAmount] = useState<number>(initialValue);

  // Initialize or update the display amount
  const setAmount = useCallback(
    (value: number) => {
      setRawAmount(value);
      if (value > 0) {
        setDisplayAmount(formatAmountForDisplay(value));
      } else {
        setDisplayAmount('');
      }
    },
    [formatAmountForDisplay]
  );

  // Handle input change - no auto-formatting while typing, just track the input
  const handleInputChange = useCallback(
    (value: string) => {
      // Always allow the user to type freely
      setDisplayAmount(value);

      // Handle empty input
      if (!value.trim()) {
        setRawAmount(0);
        onAmountChange?.(0);
        onError?.(null);
        return;
      }

      // Parse the value to get numeric amount
      const rawValue = parseAmountFromDisplay(value);
      setRawAmount(rawValue);

      // Basic validation
      let errorMessage: string | null = null;

      if (isNaN(rawValue) || !isFinite(rawValue)) {
        errorMessage = 'Please enter a valid amount';
      } else if (rawValue < 0) {
        errorMessage = 'Amount cannot be negative';
      }

      // Notify parent
      onAmountChange?.(rawValue);
      onError?.(errorMessage);
    },
    [parseAmountFromDisplay, onAmountChange, onError]
  );

  // Handle when user focuses on amount field
  const handleFocus = useCallback(() => {
    if (rawAmount > 0) {
      // Show raw number for easier editing
      setDisplayAmount(rawAmount.toString());
    } else {
      // Allow empty field for easier editing
      setDisplayAmount('');
    }
  }, [rawAmount]);

  // Handle when user leaves amount field
  const handleBlur = useCallback(() => {
    // Handle empty input on blur
    if (rawAmount <= 0) {
      setDisplayAmount('');
      onError?.(null); // No error for empty in search contexts
      return;
    }

    // Format the value when user finishes editing
    if (rawAmount > 0) {
      const formatted = formatAmountForDisplay(rawAmount);
      setDisplayAmount(formatted);
    }
  }, [rawAmount, formatAmountForDisplay, onError]);
  return {
    displayAmount,
    rawAmount,
    placeholder: getAmountPlaceholder(),
    setAmount,
    handleInputChange,
    handleFocus,
    handleBlur,
  };
};

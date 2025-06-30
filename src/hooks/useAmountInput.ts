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
  allowNegative?: boolean; // New option to allow negative values
}

export const useAmountInput = (options: UseAmountInputOptions = {}) => {
  const { initialValue = 0, onAmountChange, onError, allowNegative = false } = options;
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
      // Only format for display if value is not zero
      // For zero, keep empty to allow user to start typing
      if (value !== 0) {
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
      // Always allow the user to type freely - don't restrict input
      setDisplayAmount(value);
      console.log(`Input changed: ${value}`);

      // Handle empty input
      if (!value.trim()) {
        setRawAmount(0);
        onAmountChange?.(0);
        onError?.(null);
        return;
      }

      // Try to parse the value, but don't fail on partial input
      try {
        const rawValue = parseAmountFromDisplay(value);
        console.log(`Parsed raw value: ${rawValue}`);
        
        // Only update if we got a valid number
        if (!isNaN(rawValue) && isFinite(rawValue)) {
          setRawAmount(rawValue);
          
          // Basic validation
          let errorMessage: string | null = null;
          if (!allowNegative && rawValue < 0) {
            errorMessage = 'Amount cannot be negative';
          }
          
          // Notify parent
          onAmountChange?.(rawValue);
          onError?.(errorMessage);
        }
      } catch (error) {
        // Don't block input on parsing errors - let user continue typing
        console.log('Parse error (user still typing):', error);
      }
    },
    [parseAmountFromDisplay, onAmountChange, onError, allowNegative]
  );

  // Handle when user focuses on amount field
  const handleFocus = useCallback(() => {
    // On focus, convert formatted display to raw number for easier editing
    if (rawAmount !== 0) {
      setDisplayAmount(rawAmount.toString());
    }
    // For zero amount, keep whatever user has typed so far
  }, [rawAmount]);

  // Handle when user leaves amount field
  const handleBlur = useCallback(() => {
    // Handle empty input on blur
    if (rawAmount === 0) {
      setDisplayAmount('');
      onError?.(null); // No error for empty in search contexts
      return;
    }

    // Format the value when user finishes editing
    if (rawAmount !== 0) {
      const formatted = formatAmountForDisplay(rawAmount);
      console.log(`Formatted amount on blur: ${formatted}`);
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

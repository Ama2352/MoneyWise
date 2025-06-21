/**
 * Custom hook for currency conversion and formatting
 * Handles conversion from VND (base currency) to display currency
 */

import { useState, useEffect } from 'react';
import { useCurrencyContext } from '../contexts';

interface UseCurrencyDisplayResult {
  displayAmount: string;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to convert and format an amount from VND (base) to display currency
 * @param amountInVnd - Amount stored in VND (base currency)
 * @returns Formatted string in the current display currency
 */
export const useCurrencyDisplay = (
  amountInVnd: number
): UseCurrencyDisplayResult => {
  const { convertAndFormat, currency } = useCurrencyContext();
  const [displayAmount, setDisplayAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const convertAmount = async () => {
      if (amountInVnd === undefined || amountInVnd === null) {
        setDisplayAmount('');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const formatted = await convertAndFormat(amountInVnd);
        setDisplayAmount(formatted);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Conversion failed');
        setDisplayAmount(`${amountInVnd.toLocaleString()} VND`); // Fallback
      } finally {
        setIsLoading(false);
      }
    };

    convertAmount();
  }, [amountInVnd, currency, convertAndFormat]);

  return {
    displayAmount,
    isLoading,
    error,
  };
};

/**
 * Hook to convert and format multiple amounts
 * @param amounts - Array of amounts in VND
 * @returns Array of formatted strings
 */
export const useCurrencyDisplayMultiple = (
  amounts: number[]
): UseCurrencyDisplayResult[] => {
  const { convertAndFormat, currency } = useCurrencyContext();
  const [results, setResults] = useState<UseCurrencyDisplayResult[]>([]);

  useEffect(() => {
    const convertAllAmounts = async () => {
      const newResults: UseCurrencyDisplayResult[] = [];

      for (const amount of amounts) {
        if (amount === undefined || amount === null) {
          newResults.push({
            displayAmount: '',
            isLoading: false,
            error: null,
          });
          continue;
        }

        try {
          const formatted = await convertAndFormat(amount);
          newResults.push({
            displayAmount: formatted,
            isLoading: false,
            error: null,
          });
        } catch (err) {
          newResults.push({
            displayAmount: `${amount.toLocaleString()} VND`,
            isLoading: false,
            error: err instanceof Error ? err.message : 'Conversion failed',
          });
        }
      }

      setResults(newResults);
    };

    convertAllAmounts();
  }, [amounts, currency, convertAndFormat]);

  return results;
};

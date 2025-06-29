import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { CurrencyCode } from '../types';
import { DEFAULT_CURRENCY, STORAGE_KEYS } from '../constants';
import { useCurrency } from '../hooks/useCurrency';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  toggleCurrency: () => void;
  isLoading: boolean;
  // Conversion helpers
  convertAndFormat: (amountInVnd: number) => Promise<string>;
  convertFromDisplay: (displayAmount: number) => Promise<number>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

export { CurrencyContext };

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({
  children,
}) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(DEFAULT_CURRENCY);
  const [isLoading, setIsLoading] = useState(true);
  const { formatCurrency, convertCurrency } = useCurrency();

  // Load currency from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem(
      STORAGE_KEYS.CURRENCY
    ) as CurrencyCode;
    if (savedCurrency && (savedCurrency === 'usd' || savedCurrency === 'vnd')) {
      setCurrencyState(savedCurrency);
    }
    setIsLoading(false);
  }, []);

  const setCurrency = useCallback((newCurrency: CurrencyCode) => {
    setCurrencyState(newCurrency);
    localStorage.setItem(STORAGE_KEYS.CURRENCY, newCurrency);
  }, []);

  const toggleCurrency = useCallback(() => {
    const newCurrency = currency === 'usd' ? 'vnd' : 'usd';
    setCurrency(newCurrency);
  }, [currency, setCurrency]);

  // Convert from VND (stored) to display currency and format
  const convertAndFormat = useCallback(async (amountInVnd: number): Promise<string> => {
    try {
      if (currency === 'vnd') {
        // No conversion needed, just format VND
        return formatCurrency(amountInVnd, 'vnd');
      } else {
        // Convert VND to USD then format
        const conversion = await convertCurrency({
          amount: amountInVnd,
          from: 'vnd',
          to: 'usd',
        });
        return formatCurrency(conversion.convertedAmount, 'usd');
      }
    } catch (error) {
      console.error('Currency conversion failed:', error);
      // Fallback: format as VND
      return formatCurrency(amountInVnd, 'vnd');
    }
  }, [currency, formatCurrency, convertCurrency]);

  // Convert from display currency back to VND for storage
  const convertFromDisplay = useCallback(async (displayAmount: number): Promise<number> => {
    try {
      if (currency === 'vnd') {
        // No conversion needed
        return displayAmount;
      } else {
        // Convert USD to VND for storage
        const conversion = await convertCurrency({
          amount: displayAmount,
          from: 'usd',
          to: 'vnd',
        });
        return conversion.convertedAmount;
      }
    } catch (error) {
      console.error('Currency conversion failed:', error);
      // Fallback: return as-is
      return displayAmount;
    }
  }, [currency, convertCurrency]);

  const contextValue = useMemo(() => ({
    currency,
    setCurrency,
    toggleCurrency,
    isLoading,
    convertAndFormat,
    convertFromDisplay,
  }), [currency, setCurrency, toggleCurrency, isLoading, convertAndFormat, convertFromDisplay]);
  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrencyContext = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error(
      'useCurrencyContext must be used within a CurrencyProvider'
    );
  }
  return context;
};

/**
 * Currency Amount Display Component
 * Converts and displays amounts from VND (base) to current display currency
 */

import React from 'react';
import { useCurrencyDisplay } from '../../hooks/useCurrencyDisplay';
import Loading from './Loading';

interface CurrencyAmountProps {
  /** Amount in VND (base currency) */
  amountInVnd: number;
  /** CSS class for styling */
  className?: string;
  /** Show loading indicator */
  showLoading?: boolean;
}

export const CurrencyAmount: React.FC<CurrencyAmountProps> = ({
  amountInVnd,
  className = '',
  showLoading = false,
}) => {
  const { displayAmount, isLoading, error } = useCurrencyDisplay(amountInVnd);

  if (isLoading && showLoading) {
    return <Loading />;
  }

  if (error) {
    console.warn('Currency conversion error:', error);
  }

  return <span className={className}>{displayAmount}</span>;
};

/**
 * Currency Amount with Sign Component
 * For transaction amounts with + or - prefix
 */
interface CurrencyAmountWithSignProps extends CurrencyAmountProps {
  /** Transaction type for sign */
  type: 'income' | 'expense';
}

export const CurrencyAmountWithSign: React.FC<CurrencyAmountWithSignProps> = ({
  amountInVnd,
  type,
  className = '',
  showLoading = false,
}) => {
  const { displayAmount, isLoading, error } = useCurrencyDisplay(amountInVnd);

  if (isLoading && showLoading) {
    return <Loading />;
  }

  if (error) {
    console.warn('Currency conversion error:', error);
  }

  // Add sign based on type
  const sign = type === 'income' ? '+' : '-';
  const amountWithSign = `${sign}${displayAmount}`;

  return <span className={className}>{amountWithSign}</span>;
};

/**
 * Currency Amount Display Component
 * Converts and displays amounts from VND (base) to current display currency
 */

import React, { useState, useEffect } from 'react';
import { useSafeCurrencyFormat } from '../../hooks/useSafeCurrencyFormat';
import Loading from './Loading';
import type { TransactionType } from '../../types';

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
  const { formatAmount, formatAmountAsync } = useSafeCurrencyFormat();
  const [displayAmount, setDisplayAmount] = useState<string>(() => formatAmount(amountInVnd));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    // Start with immediate fallback (VND or loading message for USD)
    const fallback = formatAmount(amountInVnd);
    setDisplayAmount(fallback);
    
    // Always get accurate conversion (especially important for USD)
    setIsLoading(true);
    formatAmountAsync(amountInVnd)
      .then(accurate => {
        if (isMounted) {
          setDisplayAmount(accurate);
          setIsLoading(false);
        }
      })
      .catch(error => {
        console.warn('Currency conversion failed:', error);
        if (isMounted) {
          // Keep the fallback if conversion fails
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [amountInVnd, formatAmount, formatAmountAsync]);

  // Show loading for USD conversions
  if (isLoading && showLoading) {
    return <Loading />;
  }

  return <span className={className}>{displayAmount}</span>;
};

/**
 * Currency Amount with Sign Component
 * For transaction amounts with + or - prefix
 */
interface CurrencyAmountWithSignProps extends CurrencyAmountProps {
  /** Transaction type for sign */
  type: TransactionType;
}

export const CurrencyAmountWithSign: React.FC<CurrencyAmountWithSignProps> = ({
  amountInVnd,
  type,
  className = '',
  showLoading = false,
}) => {
  // Ensure positive value for display
  const absoluteAmount = Math.abs(amountInVnd);

  const { formatAmount, formatAmountAsync } = useSafeCurrencyFormat();
  const [displayAmount, setDisplayAmount] = useState<string>(() => formatAmount(absoluteAmount));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    // Show fallback immediately
    const fallback = formatAmount(absoluteAmount);
    setDisplayAmount(fallback);
    
    // Then get accurate conversion
    setIsLoading(true);
    formatAmountAsync(absoluteAmount)
      .then(accurate => {
        if (isMounted && accurate !== fallback) {
          setDisplayAmount(accurate);
        }
        if (isMounted) setIsLoading(false);
      })
      .catch(error => {
        console.warn('Currency conversion failed:', error);
        if (isMounted) {
          setDisplayAmount(fallback);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [absoluteAmount, formatAmount, formatAmountAsync]);

  if (isLoading && showLoading) {
    return <Loading />;
  }

  // Add sign based on type
  const sign = type === 'income' ? '+' : '-';
  const amountWithSign = `${sign}${displayAmount}`;

  return <span className={className}>{amountWithSign}</span>;
};

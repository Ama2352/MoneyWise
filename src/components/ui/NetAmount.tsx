/**
 * Net Amount Component
 * Special component for displaying net amounts that can be negative
 * Uses real exchange rates for accurate conversion
 */

import React, { useState, useEffect } from 'react';
import { useCurrencyContext } from '../../contexts/CurrencyContext';
import Loading from './Loading';

interface NetAmountProps {
  /** Net amount in VND (can be negative) */
  amountInVnd: number;
  /** CSS class for styling */
  className?: string;
  /** Show loading indicator */
  showLoading?: boolean;
}

export const NetAmount: React.FC<NetAmountProps> = ({
  amountInVnd,
  className = '',
  showLoading = false,
}) => {
  const { convertAndFormat, currency } = useCurrencyContext();
  const [displayAmount, setDisplayAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    // For VND, show immediately
    if (currency === 'vnd') {
      const vndFormatted = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amountInVnd);
      setDisplayAmount(vndFormatted);
      setIsLoading(false);
      return;
    }

    // For USD, use real conversion (handles negative amounts correctly)
    setIsLoading(true);
    convertAndFormat(amountInVnd)
      .then(formatted => {
        if (isMounted) {
          setDisplayAmount(formatted);
          setIsLoading(false);
        }
      })
      .catch(error => {
        console.warn('Currency conversion failed for net amount:', error);
        if (isMounted) {
          // Fallback to VND if conversion fails
          const vndFallback = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(amountInVnd);
          setDisplayAmount(vndFallback);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [amountInVnd, convertAndFormat, currency]);

  if (isLoading && showLoading) {
    return <Loading />;
  }

  return <span className={className}>{displayAmount}</span>;
};

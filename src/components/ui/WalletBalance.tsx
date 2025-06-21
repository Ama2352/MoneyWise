/**
 * WalletBalance component that properly formats wallet balance with currency conversion
 */

import React, { useState, useEffect } from 'react';
import { useCurrencyContext } from '../../contexts';

interface WalletBalanceProps {
  balance: number;
}

export const WalletBalance: React.FC<WalletBalanceProps> = ({ balance }) => {
  const { convertAndFormat } = useCurrencyContext();
  const [formattedBalance, setFormattedBalance] = useState<string>('');

  useEffect(() => {
    convertAndFormat(balance).then(formatted => {
      setFormattedBalance(formatted);
    });
  }, [balance, convertAndFormat]);

  return <>{formattedBalance}</>;
};

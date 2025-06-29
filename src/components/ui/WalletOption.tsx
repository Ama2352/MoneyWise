/**
 * Wallet Option Component - handles async currency formatting
 */

import React, { useState, useEffect } from 'react';
import { useCurrencyContext } from '../../contexts/CurrencyContext';
import type { Wallet } from '../../types/finance';

interface WalletOptionProps {
  wallet: Wallet;
}

export const WalletOption: React.FC<WalletOptionProps> = ({ wallet }) => {
  const { convertAndFormat } = useCurrencyContext();
  const [formattedBalance, setFormattedBalance] = useState('');

  useEffect(() => {
    const formatBalance = async () => {
      try {
        const formatted = await convertAndFormat(wallet.balance);
        setFormattedBalance(formatted);
      } catch (error) {
        console.error('Error formatting wallet balance:', error);
        setFormattedBalance(wallet.balance.toString());
      }
    };

    formatBalance();
  }, [wallet.balance, convertAndFormat]);

  return (
    <>
      {wallet.walletName} ({formattedBalance})
    </>
  );
};

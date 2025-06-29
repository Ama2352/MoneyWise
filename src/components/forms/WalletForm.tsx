/**
 * WalletForm Component - Form for creating/editing wallets
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Wallet as WalletIcon, X } from 'lucide-react';
import { useLanguageContext } from '../../contexts/LanguageContext';
import { useCurrencyContext } from '../../contexts/CurrencyContext';
import { useCurrency } from '../../hooks/useCurrency';
import { useAmountInput } from '../../hooks/useAmountInput';
import { Button } from '../ui';
import type { Wallet, CreateWalletRequest, UpdateWalletRequest } from '../../types/finance';
import './WalletForm.css';

interface WalletFormProps {
  wallet?: Wallet | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateWalletRequest | UpdateWalletRequest) => Promise<void>;
  isLoading?: boolean;
}

export const WalletForm: React.FC<WalletFormProps> = ({
  wallet,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const { translations } = useLanguageContext();
  const { currency, convertFromDisplay } = useCurrencyContext();
  const { convertCurrency } = useCurrency();

  const [formData, setFormData] = useState({
    walletName: '',
  });

  // Use amount input hook for balance (allow negative)
  const balanceInput = useAmountInput({
    initialValue: 0,
    onAmountChange: () => {}, // We'll handle validation separately
    onError: () => {}, // We'll handle validation separately
    allowNegative: true, // Allow negative balance for wallets
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when wallet changes or form opens/closes
  useEffect(() => {
    if (!isOpen) return;

    if (wallet) {
      // Edit mode - show wallet balance in current display currency
      setFormData({
        walletName: wallet.walletName || '',
      });
      
      // For edit mode, convert VND balance to display currency using same logic as WalletCard
      if (currency === 'vnd') {
        // Direct VND amount
        balanceInput.setAmount(wallet.balance || 0);
      } else {
        // For USD, use the same conversion logic as CurrencyAmount component
        // Convert from VND to display currency asynchronously
        (async () => {
          try {
            // Inline conversion logic to avoid dependency issues
            const conversion = await convertCurrency({
              amount: wallet.balance || 0,
              from: 'vnd',
              to: 'usd',
            });
            balanceInput.setAmount(conversion.convertedAmount);
          } catch (error) {
            console.error('Error converting balance to display currency:', error);
            // Fallback to direct amount if conversion fails
            balanceInput.setAmount(wallet.balance || 0);
          }
        })();
      }
    } else {
      // Create mode
      setFormData({
        walletName: '',
      });
      balanceInput.setAmount(0);
    }
    setErrors({});
  }, [wallet?.walletId, wallet?.balance, wallet?.walletName, isOpen, currency]); // Remove function dependencies

  // Validation
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.walletName.trim()) {
      newErrors.walletName = translations.wallets.validation.nameRequired;
    } else if (formData.walletName.trim().length < 2) {
      newErrors.walletName = translations.wallets.validation.nameMinLength;
    }

    if (typeof balanceInput.rawAmount !== 'number' || isNaN(balanceInput.rawAmount)) {
      newErrors.balance = translations.wallets.validation.balanceNumber;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.walletName, balanceInput.rawAmount, translations.wallets.validation]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      try {
        // Convert balance from display to VND
        const balanceInVnd = await convertFromDisplay(balanceInput.rawAmount);
        
        const submitData = wallet
          ? ({
              walletId: wallet.walletId,
              walletName: formData.walletName.trim(),
              balance: balanceInVnd,
            } as UpdateWalletRequest)
          : ({
              walletName: formData.walletName.trim(),
              balance: balanceInVnd,
            } as CreateWalletRequest);

        await onSubmit(submitData);
        // Don't close here - let parent handle success and close
      } catch (error) {
        console.error('Form submission error:', error);
      }
    },
    [formData.walletName, balanceInput.rawAmount, wallet?.walletId, validateForm, onSubmit, convertFromDisplay]
  );

  // Handle input changes
  const handleInputChange = useCallback(
    (field: keyof typeof formData, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    },
    [errors]
  );

  if (!isOpen) return null;

  const isEditMode = !!wallet;
  const title = isEditMode
    ? translations.wallets.edit
    : translations.wallets.create;

  return (
    <div className="wallet-form-overlay">
      <div className="wallet-form-modal">
        <div className="wallet-form-header">
          <div className="wallet-form-title">
            <WalletIcon size={24} />
            <h2>{title}</h2>
          </div>
          <button
            type="button"
            className="wallet-form-close"
            onClick={onClose}
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="wallet-form-body">
          <div className="wallet-form-group">
            <label htmlFor="walletName" className="wallet-form-label">
              {translations.wallets.name} *
            </label>
            <input
              id="walletName"
              type="text"
              className={`wallet-form-input ${errors.walletName ? 'error' : ''}`}
              value={formData.walletName}
              onChange={(e) => handleInputChange('walletName', e.target.value)}
              placeholder={translations.wallets.namePlaceholder}
              disabled={isLoading}
              maxLength={100}
              autoFocus
            />
            {errors.walletName && (
              <span className="wallet-form-error">{errors.walletName}</span>
            )}
          </div>

          <div className="wallet-form-group">
            <label htmlFor="balance" className="wallet-form-label">
              {translations.wallets.balance} ({currency})
            </label>
            <input
              id="balance"
              type="text"
              className={`wallet-form-input ${errors.balance ? 'error' : ''}`}
              value={balanceInput.displayAmount}
              onChange={(e) => balanceInput.handleInputChange(e.target.value)}
              onFocus={balanceInput.handleFocus}
              onBlur={balanceInput.handleBlur}
              placeholder={balanceInput.placeholder}
              disabled={isLoading}
            />
            {errors.balance && (
              <span className="wallet-form-error">{errors.balance}</span>
            )}
          </div>

          <div className="wallet-form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              {translations.common.cancel}
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
            >
              {isLoading
                ? isEditMode
                  ? translations.common.updating
                  : translations.common.creating
                : isEditMode
                ? translations.common.update
                : translations.common.create}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

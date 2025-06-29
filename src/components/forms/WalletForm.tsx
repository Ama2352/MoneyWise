/**
 * WalletForm Component - Form for creating/editing wallets
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Wallet as WalletIcon, X } from 'lucide-react';
import { useLanguageContext } from '../../contexts/LanguageContext';
import { useCurrencyContext } from '../../contexts/CurrencyContext';
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
  const { currency } = useCurrencyContext();

  const [formData, setFormData] = useState({
    walletName: '',
    balance: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when wallet changes or form opens/closes
  useEffect(() => {
    if (isOpen) {
      if (wallet) {
        // Edit mode
        setFormData({
          walletName: wallet.walletName || '',
          balance: wallet.balance || 0,
        });
      } else {
        // Create mode
        setFormData({
          walletName: '',
          balance: 0,
        });
      }
      setErrors({});
    }
  }, [wallet, isOpen]);

  // Validation
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.walletName.trim()) {
      newErrors.walletName = 'Wallet name is required';
    } else if (formData.walletName.trim().length < 2) {
      newErrors.walletName = 'Wallet name must be at least 2 characters';
    }

    if (typeof formData.balance !== 'number' || isNaN(formData.balance)) {
      newErrors.balance = 'Please enter a valid balance';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      try {
        const submitData = wallet
          ? {
              walletId: wallet.walletId,
              walletName: formData.walletName.trim(),
              balance: formData.balance,
            }
          : {
              walletName: formData.walletName.trim(),
              balance: formData.balance,
            };

        await onSubmit(submitData);
        onClose();
      } catch (error) {
        console.error('Form submission error:', error);
      }
    },
    [formData, wallet, validateForm, onSubmit, onClose]
  );

  // Handle input changes
  const handleInputChange = useCallback(
    (field: keyof typeof formData, value: string | number) => {
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
    ? `${translations.common.edit} Wallet`
    : `${translations.common.create} Wallet`;

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
              {translations.common.name} *
            </label>
            <input
              id="walletName"
              type="text"
              className={`wallet-form-input ${errors.walletName ? 'error' : ''}`}
              value={formData.walletName}
              onChange={(e) => handleInputChange('walletName', e.target.value)}
              placeholder="Enter wallet name"
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
              Balance ({currency})
            </label>
            <input
              id="balance"
              type="number"
              step="0.01"
              min="0"
              className={`wallet-form-input ${errors.balance ? 'error' : ''}`}
              value={formData.balance}
              onChange={(e) => handleInputChange('balance', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
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

import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, Tag, Wallet } from 'lucide-react';
import { useCategories, useWallets } from '../../hooks/useFinanceData';
import { useLanguageContext } from '../../contexts';
import { CategoryIcon, Button, Input } from '../ui';
import type { CreateTransactionRequest, Transaction } from '../../types';
import './TransactionForm.css';

interface TransactionFormProps {
  onSubmit: (data: CreateTransactionRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Transaction | null;
}

export const TransactionForm: React.FC<TransactionFormProps> = React.memo(
  ({ onSubmit, onCancel, isLoading = false, initialData }) => {
    const { t } = useLanguageContext();
    const { categories, isLoading: categoriesLoading } = useCategories();
    const { wallets, isLoading: walletsLoading } = useWallets();
    const [formData, setFormData] = useState<CreateTransactionRequest>({
      categoryId: initialData?.categoryId || '',
      walletId: initialData?.walletId || '',
      type: initialData?.type || 'expense',
      amount: initialData?.amount || 0,
      description: initialData?.description || '',
      transactionDate: initialData?.transactionDate
        ? new Date(initialData.transactionDate).toISOString().slice(0, 16)
        : (() => {
            // Get current local date and time in YYYY-MM-DDTHH:mm format
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            return `${year}-${month}-${day}T${hours}:${minutes}`;
          })(),
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const validateForm = (): boolean => {
      const newErrors: Record<string, string> = {};

      if (!formData.description.trim()) {
        newErrors.description = t('transactions.form.descriptionRequired');
      }
      if (formData.amount <= 0) {
        newErrors.amount = t('transactions.form.amountRequired');
      }
      if (!formData.categoryId) {
        newErrors.categoryId = t('transactions.form.categoryRequired');
      }
      if (!formData.walletId) {
        newErrors.walletId = t('transactions.form.walletRequired');
      }
      if (!formData.transactionDate) {
        newErrors.transactionDate = t('transactions.form.dateRequired');
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) return;

      setIsSubmitting(true);
      try {
        // Convert datetime-local format to backend format
        const submissionData: CreateTransactionRequest = {
          ...formData,
          transactionDate: formData.transactionDate.replace('T', ' ') + ':00', // Convert to "YYYY-MM-DD HH:mm:ss"
        };

        await onSubmit(submissionData);
        // Note: Success notification is handled by the parent component
      } catch (error) {
        console.error('Form submission error:', error);
        // Note: Error notification is handled by the parent component
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleInputChange = (
      field: keyof CreateTransactionRequest,
      value: any
    ) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    };

    const selectedCategory = categories?.find(
      cat => cat.categoryId === formData.categoryId
    );

    // Prevent background scroll when modal is open
    useEffect(() => {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }, []);

    return (
      <div
        className="transaction-form-overlay"
        onClick={e => e.target === e.currentTarget && onCancel()}
      >
        <div className="transaction-form-container">
          <div className="transaction-form-header">
            <h2 className="transaction-form-title">
              {initialData
                ? t('transactions.editTransaction')
                : t('transactions.addTransaction')}
            </h2>{' '}
            <button
              type="button"
              onClick={onCancel}
              className="transaction-form-close"
              disabled={isLoading || isSubmitting}
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="transaction-form">
            {/* Transaction Type */}
            <div className="form-group">
              <label className="form-label">
                {t('transactions.form.type')}
              </label>
              <div className="transaction-type-selector">
                <button
                  type="button"
                  className={`type-btn ${formData.type === 'income' ? 'type-btn--active type-btn--income' : ''}`}
                  onClick={() => handleInputChange('type', 'income')}
                  disabled={isLoading || isSubmitting}
                >
                  {t('transactions.income')}
                </button>
                <button
                  type="button"
                  className={`type-btn ${formData.type === 'expense' ? 'type-btn--active type-btn--expense' : ''}`}
                  onClick={() => handleInputChange('type', 'expense')}
                  disabled={isLoading || isSubmitting}
                >
                  {t('transactions.expense')}
                </button>
              </div>
            </div>{' '}
            {/* Amount */}
            <div className="form-group">
              <label className="form-label" htmlFor="amount">
                <DollarSign size={16} />
                {t('transactions.form.amount')}
              </label>
              <Input
                type="number"
                value={formData.amount.toString()}
                onChange={value =>
                  handleInputChange('amount', parseFloat(value) || 0)
                }
                error={errors.amount}
                placeholder="0.00"
                disabled={isLoading || isSubmitting}
                className="form-input"
              />
            </div>{' '}
            {/* Description */}
            <div className="form-group">
              <label className="form-label" htmlFor="description">
                {t('transactions.form.description')}
              </label>
              <Input
                type="text"
                value={formData.description}
                onChange={value => handleInputChange('description', value)}
                error={errors.description}
                placeholder={t('transactions.form.descriptionPlaceholder')}
                disabled={isLoading || isSubmitting}
                className="form-input"
              />
            </div>{' '}
            {/* Category */}
            <div className="form-group">
              <label className="form-label" htmlFor="category">
                <Tag size={16} />
                {t('transactions.form.category')}
              </label>
              <div className="category-field-wrapper">
                <select
                  id="category"
                  value={formData.categoryId}
                  onChange={e =>
                    handleInputChange('categoryId', e.target.value)
                  }
                  className={`form-select ${errors.categoryId ? 'form-select--error' : ''}`}
                  disabled={isLoading || isSubmitting || categoriesLoading}
                >
                  <option value="">
                    {t('transactions.form.selectCategory')}
                  </option>
                  {categories?.map(category => (
                    <option
                      key={category.categoryId}
                      value={category.categoryId}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
                {selectedCategory && (
                  <div className="category-icon-indicator">
                    <CategoryIcon
                      categoryName={selectedCategory.name}
                      size={20}
                      withWrapper={true}
                      useColorScheme={true}
                    />
                  </div>
                )}
              </div>
              {errors.categoryId && (
                <span className="form-error">{errors.categoryId}</span>
              )}
            </div>
            {/* Wallet */}
            <div className="form-group">
              <label className="form-label" htmlFor="wallet">
                <Wallet size={16} />
                {t('transactions.form.wallet')}
              </label>{' '}
              <select
                id="wallet"
                value={formData.walletId}
                onChange={e => handleInputChange('walletId', e.target.value)}
                className={`form-select ${errors.walletId ? 'form-select--error' : ''}`}
                disabled={isLoading || isSubmitting || walletsLoading}
              >
                <option value="">{t('transactions.form.selectWallet')}</option>
                {wallets?.map(wallet => (
                  <option key={wallet.walletId} value={wallet.walletId}>
                    {wallet.walletName} (${wallet.balance.toFixed(2)})
                  </option>
                ))}
              </select>
              {errors.walletId && (
                <span className="form-error">{errors.walletId}</span>
              )}
            </div>{' '}
            {/* Date and Time */}
            <div className="form-group">
              <label className="form-label" htmlFor="datetime">
                <Calendar size={16} />
                {t('transactions.form.dateTime')}
              </label>
              <input
                type="datetime-local"
                id="datetime"
                value={formData.transactionDate}
                onChange={e =>
                  handleInputChange('transactionDate', e.target.value)
                }
                disabled={isLoading || isSubmitting}
                className={`form-input ${errors.transactionDate ? 'form-input--error' : ''}`}
              />
              {errors.transactionDate && (
                <span className="form-error">{errors.transactionDate}</span>
              )}
            </div>{' '}
            {/* Form Actions */}
            <div className="form-actions">
              <Button
                type="button"
                onClick={onCancel}
                variant="secondary"
                disabled={isLoading || isSubmitting}
              >
                {t('common.cancel')}
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={
                  isLoading ||
                  isSubmitting ||
                  categoriesLoading ||
                  walletsLoading
                }
              >
                {isSubmitting
                  ? t('common.loading')
                  : isLoading
                    ? t('common.loading')
                    : initialData
                      ? t('common.update')
                      : t('common.create')}{' '}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }
);

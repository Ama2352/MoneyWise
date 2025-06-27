/**
 * Saving Goal Form Component
 */

import React, { useState, useRef, useEffect } from 'react';
import { Calendar, DollarSign, FileText, Folder, Wallet } from 'lucide-react';
import { useLanguageContext } from '../../contexts/LanguageContext';
import { useCurrencyContext } from '../../contexts/CurrencyContext';
import { useCategories, useWallets } from '../../hooks/useFinanceData';
import { useAmountInput, useCurrencyFormatter } from '../../hooks';
import { Button, Loading } from '../ui';
import type { 
  CreateSavingGoalRequest, 
  UpdateSavingGoalRequest,
  SavingGoal,
  SavingGoalProgress 
} from '../../types/finance';
import './SavingGoalForm.css';

interface SavingGoalFormProps {
  goal?: SavingGoal | SavingGoalProgress;
  onSubmit: (data: CreateSavingGoalRequest | UpdateSavingGoalRequest) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const SavingGoalForm: React.FC<SavingGoalFormProps> = ({
  goal,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const { translations } = useLanguageContext();
  const { currency, convertFromDisplay, convertAndFormat } = useCurrencyContext();
  const { parseAmountFromDisplay } = useCurrencyFormatter();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { wallets, isLoading: walletsLoading } = useWallets();

  // Form state
  const [formData, setFormData] = useState({
    description: goal?.description || '',
    startDate: goal?.startDate ? goal.startDate.split('T')[0] : '',
    endDate: goal?.endDate ? goal.endDate.split('T')[0] : '',
    categoryId: goal?.categoryId || '',
    walletId: goal?.walletId || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Use amount input hook for proper currency handling
  const amountInput = useAmountInput({
    initialValue: 0,
    onAmountChange: (_rawValue: number) => {
      // Clear amount error when user starts typing
      if (errors.targetAmount) {
        setErrors(prev => ({ ...prev, targetAmount: '' }));
      }
    },
    onError: (error: string | null) => {
      if (error) {
        setErrors(prev => ({ ...prev, targetAmount: error }));
      } else {
        setErrors(prev => ({ ...prev, targetAmount: '' }));
      }
    },
  });

  // Track initialization to avoid re-setting amount on currency changes
  const initializationRef = useRef<number | null>(null);

  // Helper function to parse date from backend
  const parseDate = (dateString: string): string => {
    if (!dateString) return '';
    try {
      // Backend returns format: "2025-07-07 15:16:42"
      // Extract only the date part: "2025-07-07"
      const datePart = dateString.split(' ')[0];
      console.log('Parsing date:', dateString, '-> extracted:', datePart);
      return datePart;
    } catch (error) {
      console.error('Error parsing date:', dateString, error);
      return '';
    }
  };

  // Initialize amount when editing - similar to TransactionForm
  useEffect(() => {
    if (
      goal?.targetAmount &&
      initializationRef.current !== goal.targetAmount
    ) {
      initializationRef.current = goal.targetAmount;

      // Convert VND amount to display currency as a number
      if (currency === 'vnd') {
        // No conversion needed, amount is already in VND
        amountInput.setAmount(goal.targetAmount);
      } else {
        // Convert VND to USD, extract the numeric value from formatted result
        convertAndFormat(goal.targetAmount).then(formatted => {
          // Extract the numeric value from the formatted string (e.g., "$123.45" -> 123.45)
          const numericValue = parseAmountFromDisplay(formatted);
          amountInput.setAmount(numericValue);
        });
      }
    }
  }, [
    goal?.targetAmount,
    currency,
    convertAndFormat,
    parseAmountFromDisplay,
    amountInput.setAmount,
  ]);

  // Update form data when goal changes
  useEffect(() => {
    if (goal) {
      console.log('Goal data received:', goal); // Debug log
      const startDate = parseDate(goal.startDate);
      const endDate = parseDate(goal.endDate);
      
      setFormData({
        description: goal.description || '',
        startDate,
        endDate,
        categoryId: goal.categoryId || '',
        walletId: goal.walletId || '',
      });
      
      console.log('Form data set with parsed dates:', { // Debug log
        startDate,
        endDate
      });
    } else {
      // Reset form when no goal (creating new)
      setFormData({
        description: '',
        startDate: '',
        endDate: '',
        categoryId: '',
        walletId: '',
      });
      // Reset amount using the hook
      amountInput.setAmount(0);
    }
  }, [goal, amountInput.setAmount]);

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = translations.savingGoals.validation.descriptionRequired;
    }

    if (!amountInput.rawAmount || amountInput.rawAmount <= 0) {
      newErrors.targetAmount = translations.savingGoals.validation.targetAmountRequired;
    }

    if (!formData.startDate) {
      newErrors.startDate = translations.savingGoals.validation.startDateRequired;
    }

    if (!formData.endDate) {
      newErrors.endDate = translations.savingGoals.validation.endDateRequired;
    }

    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      newErrors.endDate = translations.savingGoals.validation.endDateAfterStart;
    }

    if (!formData.categoryId) {
      newErrors.categoryId = translations.savingGoals.validation.categoryRequired;
    }

    if (!formData.walletId) {
      newErrors.walletId = translations.savingGoals.validation.walletRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Convert display amount back to VND for storage using amount input hook
      const vndAmount = await convertFromDisplay(amountInput.rawAmount);
      
      const submitData = {
        ...formData,
        targetAmount: vndAmount,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      };

      if (goal) {
        await onSubmit({
          ...submitData,
          savingGoalId: goal.savingGoalId,
        } as UpdateSavingGoalRequest);
      } else {
        await onSubmit(submitData as CreateSavingGoalRequest);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const isEditing = !!goal;
  const isLoading = categoriesLoading || walletsLoading;

  if (isLoading) {
    return (
      <div className="saving-goal-form">
        <Loading />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="saving-goal-form">
      {/* Description */}
      <div className="form-group">
        <label className="form-label">
          <FileText size={16} />
          {translations.savingGoals.description}
        </label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className={`form-input ${errors.description ? 'form-input--error' : ''}`}
          placeholder={translations.savingGoals.description}
          disabled={isSubmitting}
        />
        {errors.description && (
          <span className="form-error">{errors.description}</span>
        )}
      </div>

        {/* Target Amount */}
        <div className="form-group">
          <label className="form-label">
            <DollarSign size={16} />
            {translations.savingGoals.targetAmount} ({currency.toUpperCase()})
          </label>
          <input
            type="text"
            value={amountInput.displayAmount}
            onChange={(e) => amountInput.handleInputChange(e.target.value)}
            onFocus={amountInput.handleFocus}
            onBlur={amountInput.handleBlur}
            className={`form-input ${errors.targetAmount ? 'form-input--error' : ''}`}
            placeholder={amountInput.placeholder}
            disabled={isSubmitting}
          />
          {errors.targetAmount && (
            <span className="form-error">{errors.targetAmount}</span>
          )}
        </div>

        {/* Date Range */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              <Calendar size={16} />
              {translations.savingGoals.startDate}
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className={`form-input ${errors.startDate ? 'form-input--error' : ''}`}
              disabled={isSubmitting}
            />
            {errors.startDate && (
              <span className="form-error">{errors.startDate}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              <Calendar size={16} />
              {translations.savingGoals.endDate}
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              className={`form-input ${errors.endDate ? 'form-input--error' : ''}`}
              disabled={isSubmitting}
            />
            {errors.endDate && (
              <span className="form-error">{errors.endDate}</span>
            )}
          </div>
        </div>

        {/* Category and Wallet */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              <Folder size={16} />
              {translations.savingGoals.category}
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => handleInputChange('categoryId', e.target.value)}
              className={`form-select ${errors.categoryId ? 'form-select--error' : ''}`}
              disabled={isSubmitting}
            >
              <option value="">{translations.savingGoals.category}</option>
              {categories?.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <span className="form-error">{errors.categoryId}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              <Wallet size={16} />
              {translations.savingGoals.wallet}
            </label>
            <select
              value={formData.walletId}
              onChange={(e) => handleInputChange('walletId', e.target.value)}
              className={`form-select ${errors.walletId ? 'form-select--error' : ''}`}
              disabled={isSubmitting}
            >
              <option value="">{translations.savingGoals.wallet}</option>
              {wallets?.map((wallet) => (
                <option key={wallet.walletId} value={wallet.walletId}>
                  {wallet.walletName}
                </option>
              ))}
            </select>
            {errors.walletId && (
              <span className="form-error">{errors.walletId}</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="saving-goal-form__actions">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {translations.common.cancel}
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? translations.common.loading : (isEditing ? translations.savingGoals.update : translations.savingGoals.create)}
          </Button>
        </div>
    </form>
  );
};

/**
 * Budget Form Component
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Calendar, DollarSign, FileText, Folder, Wallet } from 'lucide-react';
import { useLanguageContext } from '../../contexts/LanguageContext';
import { useCurrencyContext } from '../../contexts/CurrencyContext';
import { useCategories, useWallets } from '../../hooks/useFinanceData';
import { useAmountInput } from '../../hooks';
import { Button, Loading, DateInput } from '../ui';
import { formatDateForInput, parseInputDateToISO, convertDateBetweenLanguages } from '../../utils/dateUtils';
import type {
  CreateBudgetRequest,
  UpdateBudgetRequest,
  Budget,
  BudgetProgress,
} from '../../types/finance';
import './BudgetForm.css';
import { currencyService } from '../../services';

interface BudgetFormProps {
  budget?: Budget | BudgetProgress;
  onSubmit: (
    data: CreateBudgetRequest | UpdateBudgetRequest
  ) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const BudgetForm: React.FC<BudgetFormProps> = ({
  budget,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const { translations, language } = useLanguageContext();
  const { currency, convertFromDisplay } = useCurrencyContext();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { wallets, isLoading: walletsLoading } = useWallets();

  // Form state
  const [formData, setFormData] = useState({
    description: budget?.description || '',
    startDate: budget?.startDate ? budget.startDate.split('T')[0] : '',
    endDate: budget?.endDate ? budget.endDate.split('T')[0] : '',
    categoryId: budget?.categoryId || '',
    walletId: budget?.walletId || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Use amount input hook for proper currency handling
  const amountInput = useAmountInput({
    initialValue: 0,
    onAmountChange: (_rawValue: number) => {
      // Clear amount error when user starts typing
      if (errors.limitAmount) {
        setErrors(prev => ({ ...prev, limitAmount: '' }));
      }
    },
    onError: (error: string | null) => {
      if (error) {
        setErrors(prev => ({ ...prev, limitAmount: error }));
      } else {
        setErrors(prev => ({ ...prev, limitAmount: '' }));
      }
    },
  });

  // Track initialization to avoid re-setting amount on currency changes
  const initializationRef = useRef<number | null>(null);
  const previousLanguageRef = useRef<'en' | 'vi'>(language);

  // Helper function to parse date for display
  const parseDateForDisplay = useCallback((dateString: string) => {
    try {
      return formatDateForInput(dateString, language);
    } catch (error) {
      console.error('Error parsing date:', error);
      return '';
    }
  }, [language]);

  // Initialize amount when editing
  useEffect(() => {
    if (budget && initializationRef.current === null) {
      initializationRef.current = budget.limitAmount;
      amountInput.setAmount(budget.limitAmount);
    }
  }, [budget, amountInput]);

  // Update form data when budget changes
  useEffect(() => {
    if (budget) {
      const startDate = parseDateForDisplay(budget.startDate);
      const endDate = parseDateForDisplay(budget.endDate);

      setFormData({
        description: budget.description || '',
        startDate,
        endDate,
        categoryId: budget.categoryId || '',
        walletId: budget.walletId || '',
      });
    } else {
      // Reset form when no budget (creating new)
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
  }, [budget, parseDateForDisplay]); // Remove amountInput.setAmount

  // Handle language change - convert date formats
  useEffect(() => {
    if (previousLanguageRef.current !== language) {
      const prevLanguage = previousLanguageRef.current;
      previousLanguageRef.current = language;

      // Convert existing dates to new language format
      setFormData(prev => ({
        ...prev,
        startDate: prev.startDate ? convertDateBetweenLanguages(prev.startDate, prevLanguage, language) : prev.startDate,
        endDate: prev.endDate ? convertDateBetweenLanguages(prev.endDate, prevLanguage, language) : prev.endDate,
      }));
    }
  }, [language]);

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description =
        translations.budgets.validation.descriptionRequired;
    }

    if (!amountInput.rawAmount || amountInput.rawAmount <= 0) {
      newErrors.limitAmount =
        translations.budgets.validation.limitAmountRequired;
    }

    if (!formData.startDate) {
      newErrors.startDate =
        translations.budgets.validation.startDateRequired;
    }

    if (!formData.endDate) {
      newErrors.endDate = translations.budgets.validation.endDateRequired;
    }

    if (
      formData.startDate &&
      formData.endDate
    ) {
      try {
        const startDateISO = parseInputDateToISO(formData.startDate, language);
        const endDateISO = parseInputDateToISO(formData.endDate, language);
        
        if (startDateISO >= endDateISO) {
          newErrors.endDate = translations.budgets.validation.endDateAfterStart;
        }
      } catch (error) {
        console.error('Error validating dates:', error);
        newErrors.endDate = translations.budgets.validation.endDateAfterStart;
      }
    }

    if (!formData.categoryId) {
      newErrors.categoryId =
        translations.budgets.validation.categoryRequired;
    }

    if (!formData.walletId) {
      newErrors.walletId = translations.budgets.validation.walletRequired;
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
      console.log(
        `Converted ${amountInput.rawAmount} ${currency.toUpperCase()} to ${vndAmount} VND`
      );

      // Parse dates from input format to ISO format for backend
      const startDateISO = parseInputDateToISO(formData.startDate, language);
      const endDateISO = parseInputDateToISO(formData.endDate, language);

      const submitData = {
        ...formData,
        limitAmount: vndAmount,
        startDate: new Date(startDateISO).toISOString(),
        endDate: new Date(endDateISO).toISOString(),
      };

      if (budget) {
        await onSubmit({
          ...submitData,
          budgetId: budget.budgetId,
        } as UpdateBudgetRequest);
      } else {
        await onSubmit(submitData as CreateBudgetRequest);
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

  const isEditing = !!budget;
  const isLoading = categoriesLoading || walletsLoading;

  if (isLoading) {
    return (
      <div className="budget-form">
        <Loading />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="budget-form">
      {/* Description */}
      <div className="form-group">
        <label className="form-label">
          <FileText size={16} />
          {translations.budgets.description}
        </label>
        <input
          type="text"
          value={formData.description}
          onChange={e => handleInputChange('description', e.target.value)}
          className={`form-input ${errors.description ? 'form-input--error' : ''}`}
          placeholder={translations.budgets.description}
          disabled={isSubmitting}
        />
        {errors.description && (
          <span className="form-error">{errors.description}</span>
        )}
      </div>

      {/* Limit Amount */}
      <div className="form-group">
        <label className="form-label">
          <DollarSign size={16} />
          {translations.budgets.limitAmount} ({currency.toUpperCase()})
        </label>
        <input
          type="text"
          value={amountInput.displayAmount}
          onChange={e => amountInput.handleInputChange(e.target.value)}
          onFocus={amountInput.handleFocus}
          onBlur={amountInput.handleBlur}
          className={`form-input ${errors.limitAmount ? 'form-input--error' : ''}`}
          placeholder={amountInput.placeholder}
          disabled={isSubmitting}
        />
        {errors.limitAmount && (
          <span className="form-error">{errors.limitAmount}</span>
        )}
      </div>

      {/* Date Range */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            <Calendar size={16} />
            {translations.budgets.startDate}
          </label>
          <DateInput
            value={formData.startDate}
            onChange={(value) => handleInputChange('startDate', value)}
            language={language}
            className={`form-input ${errors.startDate ? 'form-input--error' : ''}`}
            disabled={isSubmitting}
            error={!!errors.startDate}
          />
          {errors.startDate && (
            <span className="form-error">{errors.startDate}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            <Calendar size={16} />
            {translations.budgets.endDate}
          </label>
          <DateInput
            value={formData.endDate}
            onChange={(value) => handleInputChange('endDate', value)}
            language={language}
            className={`form-input ${errors.endDate ? 'form-input--error' : ''}`}
            disabled={isSubmitting}
            error={!!errors.endDate}
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
            {translations.budgets.category}
          </label>
          <select
            value={formData.categoryId}
            onChange={e => handleInputChange('categoryId', e.target.value)}
            className={`form-select ${errors.categoryId ? 'form-select--error' : ''}`}
            disabled={isSubmitting}
          >
            <option value="">{translations.budgets.category}</option>
            {categories?.map(category => (
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
            {translations.budgets.wallet}
          </label>
          <select
            value={formData.walletId}
            onChange={e => handleInputChange('walletId', e.target.value)}
            className={`form-select ${errors.walletId ? 'form-select--error' : ''}`}
            disabled={isSubmitting}
          >
            <option value="">{translations.budgets.wallet}</option>
            {wallets?.map(wallet => (
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
      <div className="budget-form__actions">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {translations.common.cancel}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? translations.common.loading
            : isEditing
              ? translations.budgets.update
              : translations.budgets.create}
        </Button>
      </div>
    </form>
  );
}; 
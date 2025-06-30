/**
 * Budget Search Form Component
 */

import React, { useState } from 'react';
import {
  Search,
  Calendar,
  Folder,
  Wallet,
  DollarSign,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useLanguageContext } from '../../contexts/LanguageContext';
import { useCurrencyContext } from '../../contexts/CurrencyContext';
import { useCategories, useWallets } from '../../hooks/useFinanceData';
import { useAmountInput } from '../../hooks';
import { Button, DateInput } from '../ui';
import { parseInputDateToISO } from '../../utils/dateUtils';
import './BudgetSearchForm.css';
import type { SearchBudgetRequest } from '../../types';

interface BudgetSearchFormProps {
  onSearch: (params: SearchBudgetRequest) => void;
  onReset: () => void;
  isSearching?: boolean;
}

export const BudgetSearchForm: React.FC<BudgetSearchFormProps> = ({
  onSearch,
  onReset,
  isSearching = false,
}) => {
  const { translations, language } = useLanguageContext();
  const { convertFromDisplay } = useCurrencyContext();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { wallets, isLoading: walletsLoading } = useWallets();

  const [searchParams, setSearchParams] = useState<SearchBudgetRequest>({});
  const [isExpanded, setIsExpanded] = useState(false);

  // Use amount input hook for limit amount search
  const minAmountInput = useAmountInput({
    initialValue: 0,
    onAmountChange: (_rawValue: number) => {},
    onError: (_error: string | null) => {},
  });

  // Use amount input hook for limit amount search
  const maxAmountInput = useAmountInput({
    initialValue: 0,
    onAmountChange: (_rawValue: number) => {},
    onError: (_error: string | null) => {},
  });

  const handleInputChange = (
    field: keyof SearchBudgetRequest,
    value: string
  ) => {
    setSearchParams(prev => ({ ...prev, [field]: value || undefined }));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    const params = { ...searchParams };

    // Convert dates to ISO format if specified
    if (params.startDate) {
      params.startDate = parseInputDateToISO(params.startDate, language);
    }
    if (params.endDate) {
      params.endDate = parseInputDateToISO(params.endDate, language);
    }

    // Convert amount to VND if specified
    if (minAmountInput.rawAmount > 0)
      params.minLimitAmount = await convertFromDisplay(
        minAmountInput.rawAmount
      );
    if (maxAmountInput.rawAmount > 0)
      params.maxLimitAmount = await convertFromDisplay(
        maxAmountInput.rawAmount
      );
    onSearch(params);
  };

  const handleReset = () => {
    setSearchParams({});
    minAmountInput.setAmount(0);
    maxAmountInput.setAmount(0);
    onReset();
  };

  return (
    <div
      className={`budget-search-form ${isExpanded ? 'expanded' : 'collapsed'}`}
    >
      <div
        className="search-form-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="search-form-title-section">
          <h3 className="search-form-title">
            <Search size={18} />
            {translations.budgets.search.title}
          </h3>
          {!isExpanded && Object.keys(searchParams).length > 0 && (
            <span className="search-active-badge">
              {Object.keys(searchParams).length} filters active
            </span>
          )}
        </div>
        <button type="button" className="search-form-toggle">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {isExpanded && (
        <form onSubmit={handleSearch} className="search-form-content-wrapper">
          <div className="search-form-content">
            {/* Keywords */}
            <div className="form-group">
              <label className="form-label">
                <Search size={16} />
                {translations.budgets.search.keywords}
              </label>
              <input
                type="text"
                value={searchParams.keywords || ''}
                onChange={e => handleInputChange('keywords', e.target.value)}
                className="form-input"
                placeholder={
                  translations.budgets.search.keywordsPlaceholder
                }
                disabled={isSearching}
              />
            </div>

            {/* Date Range */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <Calendar size={16} />
                  {translations.budgets.search.startDate}
                </label>
                <DateInput
                  value={searchParams.startDate || ''}
                  onChange={(value) => handleInputChange('startDate', value)}
                  language={language}
                  className="form-input"
                  disabled={isSearching}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Calendar size={16} />
                  {translations.budgets.search.endDate}
                </label>
                <DateInput
                  value={searchParams.endDate || ''}
                  onChange={(value) => handleInputChange('endDate', value)}
                  language={language}
                  className="form-input"
                  disabled={isSearching}
                />
              </div>
            </div>

            {/* Category and Wallet */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <Folder size={16} />
                  {translations.budgets.search.category}
                </label>
                <select
                  value={searchParams.categoryName || ''}
                  onChange={e =>
                    handleInputChange('categoryName', e.target.value)
                  }
                  className="form-select"
                  disabled={isSearching || categoriesLoading}
                >
                  <option value="">
                    {translations.budgets.search.allCategories}
                  </option>
                  {categories?.map(category => (
                    <option key={category.categoryId} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Wallet size={16} />
                  {translations.budgets.search.wallet}
                </label>
                <select
                  value={searchParams.walletName || ''}
                  onChange={e =>
                    handleInputChange('walletName', e.target.value)
                  }
                  className="form-select"
                  disabled={isSearching || walletsLoading}
                >
                  <option value="">
                    {translations.budgets.search.allWallets}
                  </option>
                  {wallets?.map(wallet => (
                    <option key={wallet.walletId} value={wallet.walletName}>
                      {wallet.walletName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Limit Amount Range */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <DollarSign size={16} />
                  {translations.budgets.search.minLimitAmount}
                </label>
                <input
                  type="text"
                  value={minAmountInput.displayAmount}
                  onChange={e =>
                    minAmountInput.handleInputChange(e.target.value)
                  }
                  onFocus={minAmountInput.handleFocus}
                  onBlur={minAmountInput.handleBlur}
                  className="form-input"
                  placeholder={minAmountInput.placeholder}
                  disabled={isSearching}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <DollarSign size={16} />
                  {translations.budgets.search.maxLimitAmount}
                </label>
                <input
                  type="text"
                  value={maxAmountInput.displayAmount}
                  onChange={e =>
                    maxAmountInput.handleInputChange(e.target.value)
                  }
                  onFocus={maxAmountInput.handleFocus}
                  onBlur={maxAmountInput.handleBlur}
                  className="form-input"
                  placeholder={maxAmountInput.placeholder}
                  disabled={isSearching}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="search-form-actions">
              <Button
                type="button"
                variant="secondary"
                onClick={handleReset}
                disabled={isSearching}
              >
                <RotateCcw size={16} />
                {translations.common.reset}
              </Button>
              <Button type="submit" disabled={isSearching}>
                <Search size={16} />
                {isSearching
                  ? translations.common.searching
                  : translations.common.search}
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}; 
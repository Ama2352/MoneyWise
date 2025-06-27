/**
 * Saving Goal Search Form Component
 */

import React, { useState } from 'react';
import { Search, Calendar, Folder, Wallet, DollarSign, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguageContext } from '../../contexts/LanguageContext';
import { useCurrencyContext } from '../../contexts/CurrencyContext';
import { useCategories, useWallets } from '../../hooks/useFinanceData';
import { useAmountInput } from '../../hooks';
import { Button } from '../ui';
import './SavingGoalSearchForm.css';

export interface SearchSavingGoalsParams {
  startDate?: string;
  endDate?: string;
  keywords?: string;
  categoryName?: string;
  walletName?: string;
  targetAmount?: number;
}

interface SavingGoalSearchFormProps {
  onSearch: (params: SearchSavingGoalsParams) => void;
  onReset: () => void;
  isSearching?: boolean;
}

export const SavingGoalSearchForm: React.FC<SavingGoalSearchFormProps> = ({
  onSearch,
  onReset,
  isSearching = false,
}) => {
  const { translations } = useLanguageContext();
  const { convertFromDisplay } = useCurrencyContext();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { wallets, isLoading: walletsLoading } = useWallets();

  const [searchParams, setSearchParams] = useState<SearchSavingGoalsParams>({});
  const [isExpanded, setIsExpanded] = useState(false);

  // Use amount input hook for target amount search
  const amountInput = useAmountInput({
    initialValue: 0,
    onAmountChange: (_rawValue: number) => {},
    onError: (_error: string | null) => {},
  });

  const handleInputChange = (field: keyof SearchSavingGoalsParams, value: string) => {
    setSearchParams(prev => ({ ...prev, [field]: value || undefined }));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = { ...searchParams };
    
    // Convert amount to VND if specified
    if (amountInput.rawAmount > 0) {
      const vndAmount = await convertFromDisplay(amountInput.rawAmount);
      params.targetAmount = vndAmount;
    }
    
    onSearch(params);
  };

  const handleReset = () => {
    setSearchParams({});
    amountInput.setAmount(0);
    onReset();
  };

  return (
    <div className={`saving-goal-search-form ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="search-form-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3 className="search-form-title">
          <Search size={18} />
          {translations.savingGoals.search.title}
        </h3>
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
            {translations.savingGoals.search.keywords}
          </label>
          <input
            type="text"
            value={searchParams.keywords || ''}
            onChange={(e) => handleInputChange('keywords', e.target.value)}
            className="form-input"
            placeholder={translations.savingGoals.search.keywordsPlaceholder}
            disabled={isSearching}
          />
        </div>

        {/* Date Range */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              <Calendar size={16} />
              {translations.savingGoals.search.startDate}
            </label>
            <input
              type="date"
              value={searchParams.startDate || ''}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className="form-input"
              disabled={isSearching}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Calendar size={16} />
              {translations.savingGoals.search.endDate}
            </label>
            <input
              type="date"
              value={searchParams.endDate || ''}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
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
              {translations.savingGoals.search.category}
            </label>
            <select
              value={searchParams.categoryName || ''}
              onChange={(e) => handleInputChange('categoryName', e.target.value)}
              className="form-select"
              disabled={isSearching || categoriesLoading}
            >
              <option value="">{translations.savingGoals.search.allCategories}</option>
              {categories?.map((category) => (
                <option key={category.categoryId} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              <Wallet size={16} />
              {translations.savingGoals.search.wallet}
            </label>
            <select
              value={searchParams.walletName || ''}
              onChange={(e) => handleInputChange('walletName', e.target.value)}
              className="form-select"
              disabled={isSearching || walletsLoading}
            >
              <option value="">{translations.savingGoals.search.allWallets}</option>
              {wallets?.map((wallet) => (
                <option key={wallet.walletId} value={wallet.walletName}>
                  {wallet.walletName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Target Amount */}
        <div className="form-group">
          <label className="form-label">
            <DollarSign size={16} />
            {translations.savingGoals.search.targetAmount}
          </label>
          <input
            type="text"
            value={amountInput.displayAmount}
            onChange={(e) => amountInput.handleInputChange(e.target.value)}
            onFocus={amountInput.handleFocus}
            onBlur={amountInput.handleBlur}
            className="form-input"
            placeholder={amountInput.placeholder}
            disabled={isSearching}
          />
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
          <Button
            type="submit"
            disabled={isSearching}
          >
            <Search size={16} />
            {isSearching ? translations.common.searching : translations.common.search}
          </Button>
        </div>
          </div>
        </form>
      )}
    </div>
  );
};

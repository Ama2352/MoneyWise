/**
 * Budgets Page
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  Plus,
  Target,
  TrendingUp,
  CheckCircle,
  DollarSign,
  AlertTriangle,
  BarChart3,
} from 'lucide-react';
import {
  useBudgetProgress,
  useSearchBudgets,
  useBudgetMutations,
  useCategories,
  useWallets,
} from '../hooks/useFinanceData';
import { useLanguageContext, useToastContext } from '../contexts';
import { useCurrencyContext } from '../contexts/CurrencyContext';
import { Loading, ConfirmDialog, Modal } from '../components/ui';
import { PageLayout } from '../components/layout/PageLayout';
import { BudgetForm } from '../components/forms/BudgetForm';
import { BudgetCard } from '../components/ui/BudgetCard';
import type {
  BudgetProgress,
  CreateBudgetRequest,
  UpdateBudgetRequest,
  SearchBudgetRequest,
} from '../types/finance';
import './BudgetsPage.css';
import { BudgetSearchForm } from '../components';

const BudgetsPage: React.FC = () => {
  const { translations, language } = useLanguageContext();
  const { showSuccess, showError } = useToastContext();
  const { convertAndFormat, currency } = useCurrencyContext();

  // Data hooks
  const {
    budgetProgress: budgets,
    isLoading,
    error,
    refresh: refreshBudgets,
  } = useBudgetProgress(language, currency);

  const { categories, isLoading: categoriesLoading } = useCategories();
  const { wallets, isLoading: walletsLoading } = useWallets();

  // Mutations
  const { createBudget, updateBudget, deleteBudget } = useBudgetMutations();

  // Local state
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetProgress | null>(
    null
  );
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    budgetId?: string;
    description?: string;
  }>({ show: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search state
  const [searchParams, setSearchParams] = useState<SearchBudgetRequest>({});

  // Search functionality
  const {
    searchResults,
    isSearching: isSearchLoading,
    searchError,
  } = useSearchBudgets(
    Object.keys(searchParams).length > 0 ? searchParams : undefined,
    language
  );

  // Determine which data to display
  const displayData = useMemo(() => {
    if (Object.keys(searchParams).length > 0) {
      return {
        data: searchResults || [],
        isLoading: isSearchLoading,
        error: searchError,
        isSearchMode: true,
      };
    }
    return {
      data: budgets || [],
      isLoading,
      error,
      isSearchMode: false,
    };
  }, [
    searchParams,
    searchResults,
    isSearchLoading,
    searchError,
    budgets,
    isLoading,
    error,
  ]);

  // State for formatted currency values
  const [formattedAmounts, setFormattedAmounts] = useState({
    totalLimitAmount: '',
    totalCurrentSpending: '',
  });

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    if (!budgets || budgets.length === 0) {
      return {
        totalBudgets: 0,
        activeBudgets: 0,
        completedBudgets: 0,
        totalLimitAmount: 0,
        totalCurrentSpending: 0,
        averageUsage: 0,
      };
    }

    const totalBudgets = budgets.length;
    const completedBudgets = budgets.filter(
      budget => budget.usagePercentage >= 100
    ).length;
    const activeBudgets = totalBudgets - completedBudgets;
    const totalLimitAmount = budgets.reduce(
      (sum, budget) => sum + budget.limitAmount,
      0
    );
    const totalCurrentSpending = budgets.reduce(
      (sum, budget) => sum + budget.currentSpending,
      0
    );
    const averageUsage =
      totalBudgets > 0
        ? budgets.reduce((sum, budget) => sum + budget.usagePercentage, 0) /
          totalBudgets
        : 0;

    return {
      totalBudgets,
      activeBudgets,
      completedBudgets,
      totalLimitAmount,
      totalCurrentSpending,
      averageUsage,
    };
  }, [budgets]);

  // Format currency values asynchronously
  React.useEffect(() => {
    const formatAmounts = async () => {
      try {
        const [formattedLimit, formattedSpending] = await Promise.all([
          convertAndFormat(summaryStats.totalLimitAmount),
          convertAndFormat(summaryStats.totalCurrentSpending),
        ]);

        setFormattedAmounts({
          totalLimitAmount: formattedLimit,
          totalCurrentSpending: formattedSpending,
        });
      } catch (error) {
        console.error('Error formatting currency amounts:', error);
        setFormattedAmounts({
          totalLimitAmount: summaryStats.totalLimitAmount.toString(),
          totalCurrentSpending: summaryStats.totalCurrentSpending.toString(),
        });
      }
    };

    formatAmounts();
  }, [
    summaryStats.totalLimitAmount,
    summaryStats.totalCurrentSpending,
    convertAndFormat,
  ]);

  // Force refresh data when language changes
  React.useEffect(() => {
    if (language) {
      refreshBudgets();
    }
  }, [language]); // Remove refreshBudgets from dependencies

  // Force refresh data when currency changes
  React.useEffect(() => {
    if (currency) {
      refreshBudgets();
    }
  }, [currency]); // Remove refreshBudgets from dependencies

  // Helper functions
  const getCategoryById = useCallback(
    (categoryId: string) => {
      return categories?.find(cat => cat.categoryId === categoryId);
    },
    [categories]
  );

  const getWalletById = useCallback(
    (walletId: string) => {
      return wallets?.find(wallet => wallet.walletId === walletId);
    },
    [wallets]
  );

  // Form handlers
  const handleCreateBudget = useCallback(
    async (data: CreateBudgetRequest) => {
      setIsSubmitting(true);
      try {
        const result = await createBudget(data);
        if (result.success) {
          showSuccess(translations.budgets.notifications.createSuccess);
          setShowForm(false);
          setEditingBudget(null);
          refreshBudgets();
        } else {
          showError(
            result.error || translations.budgets.notifications.createError
          );
        }
      } catch (error: any) {
        console.error('Create budget error:', error);
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.title ||
          error.message ||
          translations.budgets.notifications.createError;
        showError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [createBudget, showSuccess, showError, translations, refreshBudgets]
  );

  const handleUpdateBudget = useCallback(
    async (data: UpdateBudgetRequest) => {
      setIsSubmitting(true);
      try {
        const result = await updateBudget(data);
        if (result.success) {
          showSuccess(translations.budgets.notifications.updateSuccess);
          setShowForm(false);
          setEditingBudget(null);
          refreshBudgets();
        } else {
          showError(
            result.error || translations.budgets.notifications.updateError
          );
        }
      } catch (error: any) {
        console.error('Update budget error:', error);
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.title ||
          error.message ||
          translations.budgets.notifications.updateError;
        showError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [updateBudget, showSuccess, showError, translations, refreshBudgets]
  );

  const handleFormSubmit = useCallback(
    async (data: CreateBudgetRequest | UpdateBudgetRequest) => {
      if (editingBudget) {
        await handleUpdateBudget(data as UpdateBudgetRequest);
      } else {
        await handleCreateBudget(data as CreateBudgetRequest);
      }
    },
    [editingBudget, handleCreateBudget, handleUpdateBudget]
  );

  // Action handlers
  const openCreateForm = useCallback(() => {
    setEditingBudget(null);
    setShowForm(true);
  }, []);

  const openEditForm = useCallback((budget: BudgetProgress) => {
    setEditingBudget(budget);
    setShowForm(true);
  }, []);

  const closeForm = useCallback(() => {
    setShowForm(false);
    setEditingBudget(null);
  }, []);

  const openDeleteConfirm = useCallback((budget: BudgetProgress) => {
    setDeleteConfirm({
      show: true,
      budgetId: budget.budgetId,
      description: budget.description,
    });
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteConfirm.budgetId) return;

    try {
      const result = await deleteBudget(deleteConfirm.budgetId);
      if (result.success) {
        showSuccess(translations.budgets.notifications.deleteSuccess);
        refreshBudgets();
      } else {
        showError(
          result.error || translations.budgets.notifications.deleteError
        );
      }
    } catch (error: any) {
      console.error('Delete budget error:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.title ||
        error.message ||
        translations.budgets.notifications.deleteError;
      showError(errorMessage);
    } finally {
      setDeleteConfirm({ show: false });
    }
  }, [
    deleteConfirm.budgetId,
    deleteBudget,
    showSuccess,
    showError,
    translations,
    refreshBudgets,
  ]);

  // Search handlers
  const handleSearch = useCallback(async (params: SearchBudgetRequest) => {
    console.log('Searching with params:', params);
    setSearchParams(params);
  }, []);

  const handleResetSearch = useCallback(() => {
    setSearchParams({});
  }, []);

  // Loading state
  if (isLoading || categoriesLoading || walletsLoading) {
    return (
      <PageLayout
        title={translations.budgets.title}
        subtitle={translations.budgets.subtitle}
      >
        <Loading />
      </PageLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <PageLayout
        title={translations.budgets.title}
        subtitle={translations.budgets.subtitle}
        error={error}
        onRetry={refreshBudgets}
      >
        <div className="budgets-page__error">
          <AlertTriangle size={48} />
          <p>{translations.budgets.notifications.loadError}</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={translations.budgets.title}
      subtitle={translations.budgets.subtitle}
      action={
        <button className="btn btn--primary" onClick={openCreateForm}>
          <Plus size={20} />
          {translations.budgets.addNew}
        </button>
      }
    >
      {/* Summary Statistics */}
      <div className="budgets-page__stats">
        <div className="budgets-page__stat-card">
          <div className="stat-card">
            <div className="stat-card__icon">
              <Target size={24} />
            </div>
            <div className="stat-card__content">
              <h3 className="stat-card__title">
                {translations.budgets.totalBudgets}
              </h3>
              <p className="stat-card__value">{summaryStats.totalBudgets}</p>
            </div>
          </div>
        </div>
        <div className="budgets-page__stat-card">
          <div className="stat-card">
            <div className="stat-card__icon">
              <TrendingUp size={24} />
            </div>
            <div className="stat-card__content">
              <h3 className="stat-card__title">
                {translations.budgets.activeBudgets}
              </h3>
              <p className="stat-card__value">{summaryStats.activeBudgets}</p>
            </div>
          </div>
        </div>
        <div className="budgets-page__stat-card">
          <div className="stat-card stat-card--success">
            <div className="stat-card__icon">
              <CheckCircle size={24} />
            </div>
            <div className="stat-card__content">
              <h3 className="stat-card__title">
                {translations.budgets.completedBudgets}
              </h3>
              <p className="stat-card__value">{summaryStats.completedBudgets}</p>
            </div>
          </div>
        </div>
        <div className="budgets-page__stat-card">
          <div className="stat-card stat-card--warning">
            <div className="stat-card__icon">
              <DollarSign size={24} />
            </div>
            <div className="stat-card__content">
              <h3 className="stat-card__title">
                {translations.budgets.totalLimitAmount}
              </h3>
              <p className="stat-card__value">
                {formattedAmounts.totalLimitAmount}
              </p>
            </div>
          </div>
        </div>
        <div className="budgets-page__stat-card">
          <div className="stat-card stat-card--success">
            <div className="stat-card__icon">
              <BarChart3 size={24} />
            </div>
            <div className="stat-card__content">
              <h3 className="stat-card__title">
                {translations.budgets.totalCurrentSpending}
              </h3>
              <p className="stat-card__value">
                {formattedAmounts.totalCurrentSpending}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <BudgetSearchForm
        onSearch={handleSearch}
        onReset={handleResetSearch}
        isSearching={isSearchLoading}
      />

      {/* Budgets List */}
      <div className="budgets-page__content">
        {displayData.isLoading ? (
          <Loading />
        ) : displayData.error ? (
          <div className="budgets-page__error">
            <AlertTriangle size={48} />
            <h3>{translations.common.error}</h3>
            <p>{translations.budgets.notifications.loadError}</p>
          </div>
        ) : !displayData.data || displayData.data.length === 0 ? (
          <div className="budgets-page__empty">
            <Target size={64} />
            <h3>
              {displayData.isSearchMode
                ? translations.budgets.search.noResults
                : translations.budgets.noBudgets}
            </h3>
            <p>
              {displayData.isSearchMode
                ? translations.budgets.search.clearSearch
                : translations.budgets.noBudgetsDescription}
            </p>
            {!displayData.isSearchMode && (
              <button className="btn btn--primary" onClick={openCreateForm}>
                <Plus size={20} />
                {translations.budgets.addNew}
              </button>
            )}
          </div>
        ) : (
          <div className="budgets-page__results">
            {displayData.isSearchMode && (
              <div className="search-results-header">
                <p className="search-results-count">
                  {displayData.data.length}{' '}
                  {translations.budgets.search.resultsFound}
                </p>
              </div>
            )}
            <div className="budgets-page__grid">
              {displayData.data.map(budget => (
                <BudgetCard
                  key={budget.budgetId}
                  budget={budget}
                  category={getCategoryById(budget.categoryId)}
                  wallet={getWalletById(budget.walletId)}
                  onEdit={openEditForm}
                  onDelete={openDeleteConfirm}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <Modal
          isOpen={true}
          title={
            editingBudget
              ? translations.budgets.editBudget
              : translations.budgets.addNew
          }
          onClose={closeForm}
        >
          <BudgetForm
            key={editingBudget ? `edit-${editingBudget.budgetId}` : 'create'}
            budget={editingBudget || undefined}
            onSubmit={handleFormSubmit}
            onCancel={closeForm}
            isSubmitting={isSubmitting}
          />
        </Modal>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm.show && (
        <ConfirmDialog
          isOpen={true}
          title={translations.budgets.deleteConfirmTitle}
          message={`${translations.budgets.deleteConfirmMessage}\n\n"${deleteConfirm.description}"`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteConfirm({ show: false })}
        />
      )}
    </PageLayout>
  );
};

export default BudgetsPage; 
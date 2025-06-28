/**
 * Saving Goals Page
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  Plus,
  Target,
  TrendingUp,
  CheckCircle,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';
import {
  useSavingGoalProgress,
  useSearchSavingGoals,
  useSavingGoalMutations,
  useCategories,
  useWallets,
} from '../hooks/useFinanceData';
import { useLanguageContext, useToastContext } from '../contexts';
import { useCurrencyContext } from '../contexts/CurrencyContext';
import { Loading, ConfirmDialog, Modal } from '../components/ui';
import { PageLayout } from '../components/layout/PageLayout';
import { SavingGoalForm } from '../components/forms/SavingGoalForm';
import { SavingGoalCard } from '../components/ui/SavingGoalCard';
import type {
  SavingGoalProgress,
  CreateSavingGoalRequest,
  UpdateSavingGoalRequest,
  SearchSavingGoalRequest,
} from '../types/finance';
import './SavingGoalsPage.css';
import { SavingGoalSearchForm } from '../components';

const SavingGoalsPage: React.FC = () => {
  const { translations, language } = useLanguageContext();
  const { showSuccess, showError } = useToastContext();
  const { convertAndFormat } = useCurrencyContext();

  // Data hooks
  const {
    savingGoalProgress: savingGoals,
    isLoading,
    error,
    refresh: refreshSavingGoals,
  } = useSavingGoalProgress(language);

  const { categories, isLoading: categoriesLoading } = useCategories();
  const { wallets, isLoading: walletsLoading } = useWallets();

  // Mutations
  const { createSavingGoal, updateSavingGoal, deleteSavingGoal } =
    useSavingGoalMutations();

  // Local state
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingGoalProgress | null>(
    null
  );
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    goalId?: string;
    description?: string;
  }>({ show: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search state
  const [searchParams, setSearchParams] = useState<SearchSavingGoalRequest>({});

  // Search functionality
  const {
    searchResults,
    isSearching: isSearchLoading,
    searchError,
  } = useSearchSavingGoals(
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
      data: savingGoals || [],
      isLoading,
      error,
      isSearchMode: false,
    };
  }, [
    searchParams,
    searchResults,
    isSearchLoading,
    searchError,
    savingGoals,
    isLoading,
    error,
  ]);

  // State for formatted currency values
  const [formattedAmounts, setFormattedAmounts] = useState({
    totalTargetAmount: '',
    totalSavedAmount: '',
  });

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    if (!savingGoals || savingGoals.length === 0) {
      return {
        totalGoals: 0,
        activeGoals: 0,
        completedGoals: 0,
        totalTargetAmount: 0,
        totalSavedAmount: 0,
        averageProgress: 0,
      };
    }

    const totalGoals = savingGoals.length;
    const completedGoals = savingGoals.filter(
      goal => goal.savedPercentage >= 100
    ).length;
    const activeGoals = totalGoals - completedGoals;
    const totalTargetAmount = savingGoals.reduce(
      (sum, goal) => sum + goal.targetAmount,
      0
    );
    const totalSavedAmount = savingGoals.reduce(
      (sum, goal) => sum + goal.savedAmount,
      0
    );
    const averageProgress =
      totalGoals > 0
        ? savingGoals.reduce((sum, goal) => sum + goal.savedPercentage, 0) /
          totalGoals
        : 0;

    return {
      totalGoals,
      activeGoals,
      completedGoals,
      totalTargetAmount,
      totalSavedAmount,
      averageProgress,
    };
  }, [savingGoals]);

  // Format currency values asynchronously
  React.useEffect(() => {
    const formatAmounts = async () => {
      try {
        const [formattedTarget, formattedSaved] = await Promise.all([
          convertAndFormat(summaryStats.totalTargetAmount),
          convertAndFormat(summaryStats.totalSavedAmount),
        ]);

        setFormattedAmounts({
          totalTargetAmount: formattedTarget,
          totalSavedAmount: formattedSaved,
        });
      } catch (error) {
        console.error('Error formatting currency amounts:', error);
        setFormattedAmounts({
          totalTargetAmount: summaryStats.totalTargetAmount.toString(),
          totalSavedAmount: summaryStats.totalSavedAmount.toString(),
        });
      }
    };

    formatAmounts();
  }, [
    summaryStats.totalTargetAmount,
    summaryStats.totalSavedAmount,
    convertAndFormat,
  ]);

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
  const handleCreateGoal = useCallback(
    async (data: CreateSavingGoalRequest) => {
      setIsSubmitting(true);
      try {
        const result = await createSavingGoal(data);
        if (result.success) {
          showSuccess(translations.savingGoals.notifications.createSuccess);
          setShowForm(false);
          setEditingGoal(null);
          refreshSavingGoals();
        } else {
          showError(
            result.error || translations.savingGoals.notifications.createError
          );
        }
      } catch (error: any) {
        console.error('Create goal error:', error);
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.title ||
          error.message ||
          translations.savingGoals.notifications.createError;
        showError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [createSavingGoal, showSuccess, showError, translations, refreshSavingGoals]
  );

  const handleUpdateGoal = useCallback(
    async (data: UpdateSavingGoalRequest) => {
      setIsSubmitting(true);
      try {
        const result = await updateSavingGoal(data);
        if (result.success) {
          showSuccess(translations.savingGoals.notifications.updateSuccess);
          setShowForm(false);
          setEditingGoal(null);
          refreshSavingGoals();
        } else {
          showError(
            result.error || translations.savingGoals.notifications.updateError
          );
        }
      } catch (error: any) {
        console.error('Update goal error:', error);
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.title ||
          error.message ||
          translations.savingGoals.notifications.updateError;
        showError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [updateSavingGoal, showSuccess, showError, translations, refreshSavingGoals]
  );

  const handleFormSubmit = useCallback(
    async (data: CreateSavingGoalRequest | UpdateSavingGoalRequest) => {
      if (editingGoal) {
        await handleUpdateGoal(data as UpdateSavingGoalRequest);
      } else {
        await handleCreateGoal(data as CreateSavingGoalRequest);
      }
    },
    [editingGoal, handleCreateGoal, handleUpdateGoal]
  );

  // Action handlers
  const openCreateForm = useCallback(() => {
    setEditingGoal(null);
    setShowForm(true);
  }, []);

  const openEditForm = useCallback((goal: SavingGoalProgress) => {
    setEditingGoal(goal);
    setShowForm(true);
  }, []);

  const closeForm = useCallback(() => {
    setShowForm(false);
    setEditingGoal(null);
  }, []);

  const openDeleteConfirm = useCallback((goal: SavingGoalProgress) => {
    setDeleteConfirm({
      show: true,
      goalId: goal.savingGoalId,
      description: goal.description,
    });
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteConfirm.goalId) return;

    try {
      const result = await deleteSavingGoal(deleteConfirm.goalId);
      if (result.success) {
        showSuccess(translations.savingGoals.notifications.deleteSuccess);
        refreshSavingGoals();
      } else {
        showError(
          result.error || translations.savingGoals.notifications.deleteError
        );
      }
    } catch (error: any) {
      console.error('Delete goal error:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.title ||
        error.message ||
        translations.savingGoals.notifications.deleteError;
      showError(errorMessage);
    } finally {
      setDeleteConfirm({ show: false });
    }
  }, [
    deleteConfirm.goalId,
    deleteSavingGoal,
    showSuccess,
    showError,
    translations,
    refreshSavingGoals,
  ]);

  // Search handlers
  const handleSearch = useCallback(async (params: SearchSavingGoalRequest) => {
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
        title={translations.savingGoals.title}
        subtitle={translations.savingGoals.subtitle}
      >
        <Loading />
      </PageLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <PageLayout
        title={translations.savingGoals.title}
        subtitle={translations.savingGoals.subtitle}
        error={error}
        onRetry={refreshSavingGoals}
      >
        <div className="saving-goals-page__error">
          <AlertTriangle size={48} />
          <p>{translations.savingGoals.notifications.loadError}</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={translations.savingGoals.title}
      subtitle={translations.savingGoals.subtitle}
      action={
        <button className="btn btn--primary" onClick={openCreateForm}>
          <Plus size={20} />
          {translations.savingGoals.addNew}
        </button>
      }
    >
      {/* Summary Statistics */}
      <div className="saving-goals-page__stats">
        <div className="saving-goals-page__stat-card">
          <div className="stat-card">
            <div className="stat-card__icon">
              <Target size={24} />
            </div>
            <div className="stat-card__content">
              <h3 className="stat-card__title">
                {translations.savingGoals.totalGoals}
              </h3>
              <p className="stat-card__value">{summaryStats.totalGoals}</p>
            </div>
          </div>
        </div>
        <div className="saving-goals-page__stat-card">
          <div className="stat-card">
            <div className="stat-card__icon">
              <TrendingUp size={24} />
            </div>
            <div className="stat-card__content">
              <h3 className="stat-card__title">
                {translations.savingGoals.activeGoals}
              </h3>
              <p className="stat-card__value">{summaryStats.activeGoals}</p>
            </div>
          </div>
        </div>
        <div className="saving-goals-page__stat-card">
          <div className="stat-card stat-card--success">
            <div className="stat-card__icon">
              <CheckCircle size={24} />
            </div>
            <div className="stat-card__content">
              <h3 className="stat-card__title">
                {translations.savingGoals.completedGoals}
              </h3>
              <p className="stat-card__value">{summaryStats.completedGoals}</p>
            </div>
          </div>
        </div>
        <div className="saving-goals-page__stat-card">
          <div className="stat-card stat-card--warning">
            <div className="stat-card__icon">
              <DollarSign size={24} />
            </div>
            <div className="stat-card__content">
              <h3 className="stat-card__title">
                {translations.savingGoals.totalTargetAmount}
              </h3>
              <p className="stat-card__value">
                {formattedAmounts.totalTargetAmount}
              </p>
            </div>
          </div>
        </div>
        <div className="saving-goals-page__stat-card">
          <div className="stat-card stat-card--success">
            <div className="stat-card__icon">
              <DollarSign size={24} />
            </div>
            <div className="stat-card__content">
              <h3 className="stat-card__title">
                {translations.savingGoals.totalSavedAmount}
              </h3>
              <p className="stat-card__value">
                {formattedAmounts.totalSavedAmount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <SavingGoalSearchForm
        onSearch={handleSearch}
        onReset={handleResetSearch}
        isSearching={isSearchLoading}
      />

      {/* Saving Goals List */}
      <div className="saving-goals-page__content">
        {displayData.isLoading ? (
          <Loading />
        ) : displayData.error ? (
          <div className="saving-goals-page__error">
            <AlertTriangle size={48} />
            <h3>{translations.common.error}</h3>
            <p>{translations.savingGoals.notifications.loadError}</p>
          </div>
        ) : !displayData.data || displayData.data.length === 0 ? (
          <div className="saving-goals-page__empty">
            <Target size={64} />
            <h3>
              {displayData.isSearchMode
                ? translations.savingGoals.search.noResults
                : translations.savingGoals.noGoals}
            </h3>
            <p>
              {displayData.isSearchMode
                ? translations.savingGoals.search.clearSearch
                : translations.savingGoals.noGoalsDescription}
            </p>
            {!displayData.isSearchMode && (
              <button className="btn btn--primary" onClick={openCreateForm}>
                <Plus size={20} />
                {translations.savingGoals.addNew}
              </button>
            )}
          </div>
        ) : (
          <div className="saving-goals-page__results">
            {displayData.isSearchMode && (
              <div className="search-results-header">
                <p className="search-results-count">
                  {displayData.data.length}{' '}
                  {translations.savingGoals.search.resultsFound}
                </p>
              </div>
            )}
            <div className="saving-goals-page__grid">
              {displayData.data.map(goal => (
                <SavingGoalCard
                  key={goal.savingGoalId}
                  goal={goal}
                  category={getCategoryById(goal.categoryId)}
                  wallet={getWalletById(goal.walletId)}
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
            editingGoal
              ? translations.savingGoals.editGoal
              : translations.savingGoals.addNew
          }
          onClose={closeForm}
        >
          <SavingGoalForm
            key={editingGoal ? `edit-${editingGoal.savingGoalId}` : 'create'}
            goal={editingGoal || undefined}
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
          title={translations.savingGoals.deleteConfirmTitle}
          message={`${translations.savingGoals.deleteConfirmMessage}\n\n"${deleteConfirm.description}"`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteConfirm({ show: false })}
        />
      )}
    </PageLayout>
  );
};

export default SavingGoalsPage;

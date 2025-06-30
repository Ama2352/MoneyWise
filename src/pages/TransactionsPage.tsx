import React, { useState, useMemo, useCallback, memo } from 'react';
import {
  Plus,
  TrendingUp,
  ArrowUpCircle,
  ArrowDownCircle,
  ChevronDown,
} from 'lucide-react';
import {
  useTransactions,
  useTransactionMutations,
  useCategories,
  useWallets,
  useTransactionSearch,
} from '../hooks/useFinanceData';
import { useLanguageContext, useToastContext } from '../contexts';
import { Loading, ConfirmDialog, AdvancedSearch } from '../components/ui';
import { StatCard } from '../components/ui/StatCard';
import { PageLayout } from '../components/layout/PageLayout';
import { TransactionForm } from '../components/forms/TransactionForm';
import { TransactionItem } from '../components/TransactionItem';
import type {
  Transaction,
  CreateTransactionRequest,
  SearchTransactionRequest,
} from '../types';
import './TransactionsPage.css';
import { refetchSidebarMonthlySummary } from '../components/layout/Sidebar';

// Memoized transaction list component to prevent unnecessary re-renders
const TransactionList = memo<{
  visibleTransactions: Transaction[];
  getCategoryById: (id: string) => any;
  getWalletById: (id: string) => any;
  categoriesLoading: boolean;
  walletsLoading: boolean;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}>(
  ({
    visibleTransactions,
    getCategoryById,
    getWalletById,
    categoriesLoading,
    walletsLoading,
    onEdit,
    onDelete,
  }) => {
    return (
      <>
        {visibleTransactions.map(transaction => {
          const category = getCategoryById(transaction.categoryId);
          const wallet = getWalletById(transaction.walletId);

          return (
            <TransactionItem
              key={transaction.transactionId}
              transaction={transaction}
              category={category || undefined}
              wallet={wallet || undefined}
              categoriesLoading={categoriesLoading}
              walletsLoading={walletsLoading}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          );
        })}
      </>
    );
  }
);

TransactionList.displayName = 'TransactionList';

// Memoized component to prevent unnecessary re-renders
const TransactionsPage: React.FC = memo(() => {
  const { translations } = useLanguageContext();
  const { showSuccess, showError } = useToastContext();

  // State for search filters
  const [searchFilters, setSearchFilters] = useState<SearchTransactionRequest>(
    {}
  );
  const hasActiveFilters = Object.keys(searchFilters).length > 0;

  const {
    transactions: searchTransactions,
    isLoading: searchLoading,
    error: searchError,
  } = useTransactionSearch(hasActiveFilters ? searchFilters : undefined);

  const {
    transactions: allTransactions,
    isLoading: allLoading,
    error: allError,
    refresh: refreshTransactions,
  } = useTransactions(); // Use search results if we have active filters, otherwise use all transactions

  const transactions = hasActiveFilters ? searchTransactions : allTransactions;
  const isLoading = hasActiveFilters ? searchLoading : allLoading;
  const error = hasActiveFilters ? searchError : allError;
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { wallets, isLoading: walletsLoading } = useWallets();

  const { createTransaction, updateTransaction, deleteTransaction } =
    useTransactionMutations(); // Stabilize data arrays to prevent unnecessary re-renders caused by new array references

  const stableTransactions = useMemo(() => {
    return transactions || [];
  }, [transactions]); // Depend on the actual array, not just length

  const stableCategories = useMemo(() => {
    return categories || [];
  }, [categories?.length]); // Only depend on length

  const stableWallets = useMemo(() => {
    return wallets || [];
  }, [wallets?.length]); // Only depend on length

  // Cash flow statistics - calculating from transactions directly for better performance

  // Pagination constants - reduced for better performance
  const ITEMS_PER_PAGE = 15;
  const LOAD_MORE_INCREMENT = 10;

  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    transactionId?: string;
    description?: string;
  }>({ show: false });

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE); // Get visible transactions (simple slice)

  const visibleTransactions = useMemo(() => {
    return stableTransactions.slice(0, visibleCount);
  }, [stableTransactions, visibleCount]);

  // Calculate summary stats
  const { totalIncome, totalExpenses, netAmount } = useMemo(() => {
    if (stableTransactions.length === 0) {
      return { totalIncome: 0, totalExpenses: 0, netAmount: 0 };
    }

    let income = 0;
    let expenses = 0;

    for (const transaction of stableTransactions) {
      if (transaction.type === 'income') {
        income += transaction.amount;
      } else if (transaction.type === 'expense') {
        expenses += transaction.amount;
      }
    }

    return {
      totalIncome: income,
      totalExpenses: expenses,
      netAmount: income - expenses,
    };
  }, [stableTransactions]);

  const hasMoreTransactions = visibleCount < stableTransactions.length;

  // Optimize callbacks to prevent unnecessary re-renders
  const loadMoreTransactions = useCallback(() => {
    setVisibleCount(prev => prev + LOAD_MORE_INCREMENT);
  }, [LOAD_MORE_INCREMENT]);

  // Handle advanced search with debouncing potential
  const handleAdvancedSearch = useCallback(
    (filters: SearchTransactionRequest) => {
      setSearchFilters(filters);
      setVisibleCount(ITEMS_PER_PAGE);
    },
    [ITEMS_PER_PAGE]
  );

  // Handle clear search
  const handleClearSearch = useCallback(() => {
    setSearchFilters({});
    setVisibleCount(ITEMS_PER_PAGE);
  }, [ITEMS_PER_PAGE]);

  const handleCreateTransaction = useCallback(
    async (data: CreateTransactionRequest) => {
      try {
        const result = await createTransaction(data);
        if (result.success) {
          setShowForm(false);
          refreshTransactions(); // Refresh transactions to update statistics
          refetchSidebarMonthlySummary(); // Trigger sidebar monthly summary refetch
          showSuccess(translations.transactions.notifications.createSuccess);
        } else {
          console.error('Transaction creation failed:', result.error);
          showError(
            result.error || translations.transactions.notifications.createError
          );
        }
      } catch (error) {
        console.error('Error creating transaction:', error);
        showError(translations.transactions.notifications.createError);
      }
    },
    [
      createTransaction,
      refreshTransactions,
      showSuccess,
      showError,
      refetchSidebarMonthlySummary,
    ]
  );

  const handleUpdateTransaction = useCallback(
    async (data: CreateTransactionRequest) => {
      if (!editingTransaction) return;

      try {
        const updateData: Transaction = {
          ...editingTransaction,
          ...data,
        };

        const result = await updateTransaction(updateData);
        if (result.success) {
          setEditingTransaction(null);
          setShowForm(false);
          refreshTransactions(); // Refresh transactions to update statistics
          refetchSidebarMonthlySummary(); // Trigger sidebar monthly summary refetch
          showSuccess(translations.transactions.notifications.updateSuccess);
        } else {
          showError(
            result.error || translations.transactions.notifications.updateError
          );
        }
      } catch (error) {
        console.error('Error updating transaction:', error);
        showError(translations.transactions.notifications.updateError);
      }
    },
    [
      editingTransaction,
      updateTransaction,
      refreshTransactions,
      showSuccess,
      showError,
      refetchSidebarMonthlySummary,
    ]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteConfirm.transactionId) return;

    try {
      const result = await deleteTransaction(deleteConfirm.transactionId);
      if (result.success) {
        refreshTransactions(); // Refresh transactions to update statistics
        refetchSidebarMonthlySummary(); // Trigger sidebar monthly summary refetch
        showSuccess(translations.transactions.notifications.deleteSuccess);
      } else {
        showError(
          result.error || translations.transactions.notifications.deleteError
        );
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      showError(translations.transactions.notifications.deleteError);
    } finally {
      setDeleteConfirm({ show: false });
    }
  }, [
    deleteConfirm.transactionId,
    deleteTransaction,
    refreshTransactions,
    showSuccess,
    showError,
    refetchSidebarMonthlySummary,
  ]);

  // Memoize helper functions to prevent recreation on every render
  const getCategoryById = useCallback(
    (categoryId: string) => {
      if (categoriesLoading) return null; // Still loading
      return stableCategories.find(cat => cat.categoryId === categoryId);
    },
    [stableCategories, categoriesLoading]
  );

  const getWalletById = useCallback(
    (walletId: string) => {
      if (walletsLoading) return null; // Still loading
      return stableWallets.find(wallet => wallet.walletId === walletId);
    },
    [stableWallets, walletsLoading]
  );

  const openEditForm = useCallback((transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  }, []);

  const openDeleteConfirm = useCallback((transaction: Transaction) => {
    setDeleteConfirm({
      show: true,
      transactionId: transaction.transactionId,
      description: transaction.description,
    });
  }, []);

  const closeForm = useCallback(() => {
    setShowForm(false);
    setEditingTransaction(null);
  }, []); // Early return for critical errors or loading
  if (error || (isLoading && !transactions)) {
    return (
      <PageLayout
        title={translations.transactions.title}
        subtitle={translations.transactions.subtitle}
        isLoading={isLoading && !transactions}
        error={error}
        onRetry={() => window.location.reload()}
        action={
          <button
            className="btn btn--primary"
            onClick={() => setShowForm(true)}
          >
            <Plus size={18} />
            {translations.transactions.addTransaction}
          </button>
        }
      >
        <div></div>
      </PageLayout>
    );
  }

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          {' '}
          <h1 className="page-title">{translations.transactions.title}</h1>
          <p className="page-subtitle">{translations.transactions.subtitle}</p>
        </div>{' '}
        <div className="page-actions">
          <button
            className="btn btn--primary"
            onClick={() => setShowForm(true)}
          >
            <Plus size={18} />
            {translations.transactions.addTransaction}
          </button>
        </div>
      </div>{' '}
      {/* Summary Stats */}
      <div className="transactions-stats">
        <StatCard
          title={translations.transactions.totalIncome}
          value={totalIncome}
          type="income"
          icon={ArrowUpCircle}
          color="success"
        />
        <StatCard
          title={translations.transactions.totalExpenses}
          value={totalExpenses}
          type="expense"
          icon={ArrowDownCircle}
          color="error"
        />
        <StatCard
          title={translations.transactions.netAmount}
          value={netAmount}
          icon={TrendingUp}
          color={netAmount >= 0 ? 'primary' : 'warning'}
        />
      </div>{' '}
      {/* Advanced Search */}{' '}
      <AdvancedSearch
        onSearch={handleAdvancedSearch}
        onClear={handleClearSearch}
        categories={stableCategories}
        wallets={stableWallets}
        isLoading={categoriesLoading || walletsLoading}
      />
      {/* Transactions List */}
      <div className="modern-dashboard__card">
        {' '}
        <div className="modern-dashboard__card-header">
          {' '}
          <h2 className="modern-dashboard__card-title">
            {' '}
            {translations.transactions.recentTransactions} (
            {stableTransactions.length})
          </h2>
          {stableTransactions.length > 0 && (
            <p className="transaction-count-info">
              {translations.common.showing} {visibleTransactions.length}{' '}
              {translations.common.of} {stableTransactions.length}
            </p>
          )}
        </div>{' '}
        {isLoading ? (
          <div className="transactions-loading">
            <Loading />
            <p>{translations.common.loading}</p>
          </div>
        ) : (
          <div className="transactions-list">
            {stableTransactions.length === 0 ? (
              <div className="transactions-empty">
                {' '}
                <p>{translations.transactions.noTransactions}</p>
                <button
                  className="btn btn--primary"
                  onClick={() => setShowForm(true)}
                >
                  <Plus size={18} />
                  {translations.transactions.addFirstTransaction}
                </button>
              </div>
            ) : (
              <>
                <TransactionList
                  visibleTransactions={visibleTransactions}
                  getCategoryById={getCategoryById}
                  getWalletById={getWalletById}
                  categoriesLoading={categoriesLoading}
                  walletsLoading={walletsLoading}
                  onEdit={openEditForm}
                  onDelete={openDeleteConfirm}
                />
                {/* Load More Button */}
                {hasMoreTransactions && (
                  <div className="load-more-container">
                    <button
                      className="btn btn--secondary load-more-btn"
                      onClick={loadMoreTransactions}
                    >
                      <ChevronDown size={18} />{' '}
                      {translations.transactions.loadMore} (
                      {stableTransactions.length - visibleCount}{' '}
                      {translations.transactions.remaining})
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>{' '}
      {/* Transaction Form Modal */}
      {showForm && (
        <TransactionForm
          onSubmit={
            editingTransaction
              ? handleUpdateTransaction
              : handleCreateTransaction
          }
          onCancel={closeForm}
          initialData={editingTransaction}
          isLoading={categoriesLoading || walletsLoading}
        />
      )}
      {/* Delete Confirmation Dialog */}{' '}
      <ConfirmDialog
        isOpen={deleteConfirm.show}
        title={translations.transactions.deleteConfirmTitle}
        message={`${translations.transactions.deleteConfirmMessage} "${deleteConfirm.description || ''}"`}
        confirmText={translations.common.delete}
        cancelText={translations.common.cancel}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ show: false })}
        type="danger"
      />{' '}
    </div>
  );
});

// Add display name for debugging
TransactionsPage.displayName = 'TransactionsPage';

export default TransactionsPage;

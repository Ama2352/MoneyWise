import React, { useState, useMemo } from 'react';
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
  useCashFlow,
  useTransactionSearch,
} from '../hooks/useFinanceData';
import { useLanguageContext, useToastContext } from '../contexts';
import {
  Loading,
  ConfirmDialog,
  CurrencyAmount,
  AdvancedSearch,
} from '../components/ui';
import { TransactionForm } from '../components/forms/TransactionForm';
import { TransactionItem } from '../components/TransactionItem';
import type {
  Transaction,
  CreateTransactionRequest,
  SearchTransactionRequest,
} from '../types';
import './TransactionsPage.css';

const TransactionsPage: React.FC = () => {
  const { t } = useLanguageContext();
  const { showSuccess, showError } = useToastContext();

  // State for search filters
  const [searchFilters, setSearchFilters] = useState<SearchTransactionRequest>(
    {}
  );

  // Use search hook if filters are active, otherwise use regular transactions
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
  } = useTransactions();

  // Use search results if we have active filters, otherwise use all transactions
  const transactions = hasActiveFilters ? searchTransactions : allTransactions;
  const isLoading = hasActiveFilters ? searchLoading : allLoading;
  const error = hasActiveFilters ? searchError : allError;

  const { categories, isLoading: categoriesLoading } = useCategories();
  const { wallets, isLoading: walletsLoading } = useWallets();
  const { createTransaction, updateTransaction, deleteTransaction } =
    useTransactionMutations();

  // Cash flow statistics from API (full-time data)
  const {
    cashFlow,
    isLoading: cashFlowLoading,
    refresh: refreshCashFlow,
  } = useCashFlow(null, null);

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
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Get visible transactions for display (only show limited number)
  const visibleTransactions = useMemo(() => {
    if (!transactions) return [];
    return transactions.slice(0, visibleCount);
  }, [transactions, visibleCount]); // Calculate summary stats - Use API cash flow data with fallback to local calculation
  const { totalIncome, totalExpenses, netAmount } = useMemo(() => {
    // If cash flow data is available from API, use it
    if (cashFlow && !cashFlowLoading) {
      return {
        totalIncome: cashFlow.totalIncome,
        totalExpenses: cashFlow.totalExpenses,
        netAmount: cashFlow.balance,
      };
    }

    // Fallback to local calculation from current transactions
    const income = (transactions || [])
      .filter((t: Transaction) => t.type === 'income')
      .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

    const expenses = (transactions || [])
      .filter((t: Transaction) => t.type === 'expense')
      .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

    return {
      totalIncome: income,
      totalExpenses: expenses,
      netAmount: income - expenses,
    };
  }, [cashFlow, cashFlowLoading, transactions]);

  const hasMoreTransactions = visibleCount < (transactions?.length || 0);

  const loadMoreTransactions = () => {
    setVisibleCount(prev => prev + LOAD_MORE_INCREMENT);
  };

  // Handle advanced search
  const handleAdvancedSearch = (filters: SearchTransactionRequest) => {
    setSearchFilters(filters);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchFilters({});
    setVisibleCount(ITEMS_PER_PAGE);
  };
  const handleCreateTransaction = async (data: CreateTransactionRequest) => {
    try {
      const result = await createTransaction(data);

      if (result.success) {
        setShowForm(false);
        refreshCashFlow(); // Refresh cash flow statistics
        showSuccess(t('transactions.notifications.createSuccess'));
      } else {
        console.error('Transaction creation failed:', result.error);
        showError(result.error || t('transactions.notifications.createError'));
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
      showError(t('transactions.notifications.createError'));
    }
  };
  const handleUpdateTransaction = async (data: CreateTransactionRequest) => {
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
        refreshCashFlow(); // Refresh cash flow statistics
        showSuccess(t('transactions.notifications.updateSuccess'));
      } else {
        showError(result.error || t('transactions.notifications.updateError'));
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
      showError(t('transactions.notifications.updateError'));
    }
  };
  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.transactionId) return;

    try {
      const result = await deleteTransaction(deleteConfirm.transactionId);

      if (result.success) {
        refreshCashFlow(); // Refresh cash flow statistics
        showSuccess(t('transactions.notifications.deleteSuccess'));
      } else {
        showError(result.error || t('transactions.notifications.deleteError'));
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      showError(t('transactions.notifications.deleteError'));
    } finally {
      setDeleteConfirm({ show: false });
    }
  };
  const getCategoryById = (categoryId: string) => {
    if (categoriesLoading) return null; // Still loading
    return categories?.find(cat => cat.categoryId === categoryId);
  };

  const getWalletById = (walletId: string) => {
    if (walletsLoading) return null; // Still loading
    return wallets?.find(wallet => wallet.walletId === walletId);
  };

  const openEditForm = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const openDeleteConfirm = (transaction: Transaction) => {
    setDeleteConfirm({
      show: true,
      transactionId: transaction.transactionId,
      description: transaction.description,
    });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  if (error) {
    return (
      <div className="page-container">
        <div className="error-state">
          <p>Error loading transactions: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('transactions.title')}</h1>
          <p className="page-subtitle">{t('transactions.subtitle')}</p>
        </div>{' '}
        <div className="page-actions">
          <button
            className="btn btn--primary"
            onClick={() => setShowForm(true)}
          >
            <Plus size={18} />
            {t('transactions.addTransaction')}
          </button>
        </div>
      </div>
      {/* Summary Stats */}
      <div className="transactions-stats">
        <div className="modern-dashboard__stat-card modern-dashboard__stat-card--success">
          <div className="modern-dashboard__stat-header">
            <div className="modern-dashboard__stat-icon">
              <ArrowUpCircle size={24} />
            </div>
          </div>
          <div className="modern-dashboard__stat-content">
            <h3 className="modern-dashboard__stat-title">
              {t('transactions.totalIncome')}
            </h3>{' '}
            <div className="modern-dashboard__stat-value">
              <CurrencyAmount amountInVnd={totalIncome} />
            </div>
          </div>
        </div>

        <div className="modern-dashboard__stat-card modern-dashboard__stat-card--error">
          <div className="modern-dashboard__stat-header">
            <div className="modern-dashboard__stat-icon">
              <ArrowDownCircle size={24} />
            </div>
          </div>
          <div className="modern-dashboard__stat-content">
            <h3 className="modern-dashboard__stat-title">
              {t('transactions.totalExpenses')}
            </h3>{' '}
            <div className="modern-dashboard__stat-value">
              <CurrencyAmount amountInVnd={totalExpenses} />
            </div>
          </div>
        </div>

        <div
          className={`modern-dashboard__stat-card ${
            netAmount >= 0
              ? 'modern-dashboard__stat-card--primary'
              : 'modern-dashboard__stat-card--warning'
          }`}
        >
          <div className="modern-dashboard__stat-header">
            <div className="modern-dashboard__stat-icon">
              <TrendingUp size={24} />
            </div>
          </div>
          <div className="modern-dashboard__stat-content">
            <h3 className="modern-dashboard__stat-title">
              {t('transactions.netAmount')}
            </h3>{' '}
            <div className="modern-dashboard__stat-value">
              <CurrencyAmount amountInVnd={netAmount} />
            </div>
          </div>
        </div>
      </div>{' '}
      {/* Advanced Search */}
      <AdvancedSearch
        onSearch={handleAdvancedSearch}
        onClear={handleClearSearch}
        categories={categories || []}
        wallets={wallets || []}
        isLoading={categoriesLoading || walletsLoading}
      />
      {/* Transactions List */}
      <div className="modern-dashboard__card">
        {' '}
        <div className="modern-dashboard__card-header">
          {' '}
          <h2 className="modern-dashboard__card-title">
            {t('transactions.recentTransactions')} ({transactions?.length || 0})
          </h2>
          {(transactions?.length || 0) > 0 && (
            <p className="transaction-count-info">
              {t('common.showing')} {visibleTransactions.length}{' '}
              {t('common.of')} {transactions?.length || 0}
            </p>
          )}
        </div>{' '}
        {isLoading ? (
          <div className="transactions-loading">
            <Loading />
            <p>{t('common.loading')}</p>
          </div>
        ) : (
          <div className="transactions-list">
            {(transactions?.length || 0) === 0 ? (
              <div className="transactions-empty">
                <p>{t('transactions.noTransactions')}</p>
                <button
                  className="btn btn--primary"
                  onClick={() => setShowForm(true)}
                >
                  <Plus size={18} />
                  {t('transactions.addFirstTransaction')}
                </button>
              </div>
            ) : (
              <>
                {' '}
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
                      onEdit={openEditForm}
                      onDelete={openDeleteConfirm}
                    />
                  );
                })}
                {/* Load More Button */}
                {hasMoreTransactions && (
                  <div className="load-more-container">
                    <button
                      className="btn btn--secondary load-more-btn"
                      onClick={loadMoreTransactions}
                    >
                      <ChevronDown size={18} />
                      {t('transactions.loadMore')} (
                      {(transactions?.length || 0) - visibleCount}{' '}
                      {t('transactions.remaining')})
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
        title={t('transactions.deleteConfirmTitle')}
        message={`${t('transactions.deleteConfirmMessage')} "${deleteConfirm.description || ''}"`}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ show: false })}
        type="danger"
      />
    </div>
  );
};

export default TransactionsPage;

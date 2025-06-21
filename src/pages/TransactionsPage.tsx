import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
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
} from '../hooks/useFinanceData';
import { useLanguageContext, useToastContext } from '../contexts';
import { Loading, ConfirmDialog, CurrencyAmount } from '../components/ui';
import { TransactionForm } from '../components/forms/TransactionForm';
import { TransactionItem } from '../components/TransactionItem';
import type { Transaction, CreateTransactionRequest } from '../types';
import './TransactionsPage.css';

const TransactionsPage: React.FC = () => {
  const { t } = useLanguageContext();
  const { showSuccess, showError } = useToastContext();
  const { transactions, isLoading, error } = useTransactions();
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>(
    'all'
  );
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    transactionId?: string;
    description?: string;
  }>({ show: false });
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Filter transactions based on search and type (optimized with useMemo)
  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];

    return transactions.filter(transaction => {
      const matchesSearch = transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType =
        filterType === 'all' || transaction.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [transactions, searchTerm, filterType]);

  // Get visible transactions for display (only show limited number)
  const visibleTransactions = useMemo(() => {
    return filteredTransactions.slice(0, visibleCount);
  }, [filteredTransactions, visibleCount]);
  // Calculate summary stats - Use API cash flow data with fallback to local calculation
  const { totalIncome, totalExpenses, netAmount } = useMemo(() => {
    // If cash flow data is available from API, use it
    if (cashFlow && !cashFlowLoading) {
      return {
        totalIncome: cashFlow.totalIncome,
        totalExpenses: cashFlow.totalExpenses,
        netAmount: cashFlow.balance,
      };
    }

    // Fallback to local calculation from filtered transactions
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome: income,
      totalExpenses: expenses,
      netAmount: income - expenses,
    };
  }, [cashFlow, cashFlowLoading, filteredTransactions]);

  const hasMoreTransactions = visibleCount < filteredTransactions.length;

  const loadMoreTransactions = () => {
    setVisibleCount(prev => prev + LOAD_MORE_INCREMENT);
  };

  // Reset visible count when search or filter changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleFilterChange = (type: 'all' | 'income' | 'expense') => {
    setFilterType(type);
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
        </div>
        <div className="page-actions">
          <button className="btn btn--secondary">
            <Download size={18} />
            {t('transactions.export')}
          </button>
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
      </div>
      {/* Filters */}
      <div className="modern-dashboard__card">
        <div className="transactions-filters">
          <div className="filter-group">
            <div className="search-input">
              <Search size={20} />{' '}
              <input
                type="text"
                placeholder={t('transactions.searchPlaceholder')}
                value={searchTerm}
                onChange={e => handleSearchChange(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-group">
            <button className="filter-btn">
              <Calendar size={18} />
              {t('transactions.dateRange')}
            </button>
            <button className="filter-btn">
              <Filter size={18} />
              {t('transactions.category')}
            </button>{' '}
            <select
              value={filterType}
              onChange={e => handleFilterChange(e.target.value as any)}
              className="filter-select"
            >
              <option value="all">{t('transactions.allTypes')}</option>
              <option value="income">{t('transactions.income')}</option>
              <option value="expense">{t('transactions.expense')}</option>
            </select>
          </div>
        </div>
      </div>
      {/* Transactions List */}
      <div className="modern-dashboard__card">
        {' '}
        <div className="modern-dashboard__card-header">
          <h2 className="modern-dashboard__card-title">
            {t('transactions.recentTransactions')} (
            {filteredTransactions.length})
          </h2>
          {filteredTransactions.length > 0 && (
            <p className="transaction-count-info">
              {t('common.showing')} {visibleTransactions.length}{' '}
              {t('common.of')} {filteredTransactions.length}
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
            {filteredTransactions.length === 0 ? (
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
                      {filteredTransactions.length - visibleCount}{' '}
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

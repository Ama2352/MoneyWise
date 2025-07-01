import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  DollarSign,
  PieChart,
  Target,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  AlertCircle,
  Settings,
} from 'lucide-react';
import { useLanguageContext, useToastContext } from '../contexts';
import { useProfile } from '../hooks';
import { useAnalytics } from '../hooks/useAnalytics';
import {
  useWallets,
  useTransactions,
  useCashFlow,
  useBudgetProgress,
  useSavingGoalProgress,
  useCategories,
  useTransactionMutations,
} from '../hooks/useFinanceData';
import { CurrencyAmount } from '../components/ui/CurrencyAmount';
import { TransactionItem } from '../components/TransactionItem';
import { Loading, ConfirmDialog } from '../components/ui';
import { TransactionForm } from '../components/forms/TransactionForm';
import { AnalyticsBarChart, AnalyticsPieChart } from '../components/charts';
import type { Transaction, CreateTransactionRequest } from '../types';
import './ModernDashboard.css';

const ModernDashboard: React.FC = () => {
  const { translations } = useLanguageContext();
  const { showSuccess, showError } = useToastContext();
  const { userProfile } = useProfile();
  const navigate = useNavigate();

  // Modal states
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    transactionId?: string;
    description?: string;
  }>({ show: false });

  // Data hooks
  const {
    wallets,
    isLoading: walletsLoading,
    refresh: refreshWallets,
  } = useWallets();
  const {
    transactions,
    isLoading: transactionsLoading,
    refresh: refreshTransactions,
  } = useTransactions();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const {
    cashFlow,
    isLoading: cashFlowLoading,
    refresh: refreshCashFlow,
  } = useCashFlow(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split('T')[0],
    new Date().toISOString().split('T')[0]
  );
  const { budgetProgress, refresh: refreshBudgetProgress } =
    useBudgetProgress();
  const { savingGoalProgress, refresh: refreshSavingGoalProgress } =
    useSavingGoalProgress();
  const { createTransaction, updateTransaction, deleteTransaction } =
    useTransactionMutations();
  const {
    categoryBreakdown,
    fetchCategoryBreakdown,
    loading,
    fetchMonthlySummary,
  } = useAnalytics();

  // DRY helper to refresh all analytics data
  const refreshAnalytics = useCallback(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    fetchCategoryBreakdown({
      startDate: startOfMonth.toISOString().split('T')[0],
      endDate: now.toISOString().split('T')[0],
    });
  }, [fetchCategoryBreakdown]);

  // Check for login success message on component mount
  useEffect(() => {
    const loginSuccess = sessionStorage.getItem('loginSuccess');
    if (loginSuccess) {
      showSuccess(loginSuccess);
      sessionStorage.removeItem('loginSuccess');
    }
  }, [showSuccess]);

  // Load analytics data for charts
  useEffect(() => {
    refreshAnalytics();
  }, [refreshAnalytics]);

  // Calculate statistics from real data
  const stats = useMemo(() => {
    const totalBalance =
      wallets?.reduce((sum, wallet) => sum + wallet.balance, 0) || 0;
    const totalWallets = wallets?.length || 0;
    const positiveWallets = wallets?.filter(w => w.balance > 0).length || 0;
    const negativeWallets = wallets?.filter(w => w.balance < 0).length || 0;

    const monthlyIncome = cashFlow?.totalIncome || 0;
    const monthlyExpenses = cashFlow?.totalExpenses || 0;
    const netIncome = monthlyIncome - monthlyExpenses;

    return {
      totalBalance,
      totalWallets,
      positiveWallets,
      negativeWallets,
      monthlyIncome,
      monthlyExpenses,
      netIncome,
    };
  }, [wallets, cashFlow]);

  // Recent transactions (latest 5)
  const recentTransactions = useMemo(() => {
    return transactions?.slice(0, 5) || [];
  }, [transactions]);

  // Transaction handlers
  const handleEditTransaction = useCallback((transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowTransactionForm(true);
  }, []);

  const handleDeleteTransaction = useCallback((transaction: Transaction) => {
    setDeleteConfirm({
      show: true,
      transactionId: transaction.transactionId,
      description: transaction.description,
    });
  }, []);

  const handleCreateTransaction = useCallback(
    async (data: CreateTransactionRequest) => {
      try {
        const result = await createTransaction(data);
        if (result.success) {
          setShowTransactionForm(false);
          refreshTransactions();
          refreshWallets();
          refreshCashFlow();
          refreshBudgetProgress();
          refreshSavingGoalProgress();
          refreshAnalytics();
          showSuccess(translations.transactions.notifications.createSuccess);
        } else {
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
      refreshWallets,
      refreshCashFlow,
      refreshBudgetProgress,
      refreshSavingGoalProgress,
      refreshAnalytics,
      showSuccess,
      showError,
      translations,
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
          setShowTransactionForm(false);
          refreshTransactions();
          refreshWallets();
          refreshCashFlow();
          refreshBudgetProgress();
          refreshSavingGoalProgress();
          refreshAnalytics();
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
      refreshWallets,
      refreshCashFlow,
      refreshBudgetProgress,
      refreshSavingGoalProgress,
      refreshAnalytics,
      showSuccess,
      showError,
      translations,
    ]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteConfirm.transactionId) return;

    try {
      const result = await deleteTransaction(deleteConfirm.transactionId);
      if (result.success) {
        refreshTransactions();
        refreshWallets();
        refreshCashFlow();
        refreshBudgetProgress();
        refreshSavingGoalProgress();
        refreshAnalytics();
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
    refreshWallets,
    refreshCashFlow,
    refreshBudgetProgress,
    refreshSavingGoalProgress,
    refreshAnalytics,
    showSuccess,
    showError,
    translations,
  ]);

  const closeTransactionForm = useCallback(() => {
    setShowTransactionForm(false);
    setEditingTransaction(null);
  }, []);

  // Prepare data for charts
  const chartData = useMemo(() => {
    // Cash flow data for bar chart
    const cashFlowData = cashFlow
      ? [
          {
            name: translations.dashboard.stats.thisMonth,
            income: cashFlow.totalIncome || 0,
            expense: cashFlow.totalExpenses || 0,
            net: (cashFlow.totalIncome || 0) - (cashFlow.totalExpenses || 0),
          },
        ]
      : [];

    // Category breakdown for pie charts
    const incomeCategories = categoryBreakdown
      .filter(cat => cat.totalIncome > 0)
      .map((cat, index) => ({
        name: cat.category,
        value: cat.totalIncome,
        color: `hsl(${120 + ((index * 30) % 360)}, 70%, 50%)`, // Green variations for income
        percentage: 0, // Will be calculated by the pie chart component
      }));

    const expenseCategories = categoryBreakdown
      .filter(cat => cat.totalExpense > 0)
      .map((cat, index) => ({
        name: cat.category,
        value: cat.totalExpense,
        color: `hsl(${0 + ((index * 30) % 360)}, 70%, 50%)`, // Red variations for expense
        percentage: 0, // Will be calculated by the pie chart component
      }));

    // Calculate percentages
    const totalIncome = incomeCategories.reduce(
      (sum, cat) => sum + cat.value,
      0
    );
    const totalExpense = expenseCategories.reduce(
      (sum, cat) => sum + cat.value,
      0
    );

    incomeCategories.forEach(cat => {
      cat.percentage = totalIncome > 0 ? (cat.value / totalIncome) * 100 : 0;
    });

    expenseCategories.forEach(cat => {
      cat.percentage = totalExpense > 0 ? (cat.value / totalExpense) * 100 : 0;
    });

    return {
      cashFlowData,
      incomeCategories,
      expenseCategories,
    };
  }, [cashFlow, categoryBreakdown, translations]);

  const isLoading =
    walletsLoading ||
    transactionsLoading ||
    cashFlowLoading ||
    categoriesLoading;
  return (
    <div className="modern-dashboard">
      {/* Page Header */}
      <div className="modern-dashboard__header">
        <div className="modern-dashboard__header-content">
          <div>
            <h1 className="modern-dashboard__title">
              {translations.dashboard.title}
            </h1>
            <p className="modern-dashboard__subtitle">
              {translations.dashboard.welcome},{' '}
              {userProfile?.firstName || userProfile?.username || 'User'}!{' '}
              {translations.dashboard.subtitle}
            </p>
          </div>
          <div className="modern-dashboard__header-actions">
            {' '}
            <button
              className="modern-dashboard__action-btn modern-dashboard__action-btn--primary"
              onClick={() => setShowTransactionForm(true)}
            >
              <Plus size={18} />
              {translations.dashboard.actions.addTransaction}
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="modern-dashboard__loading">
          <Loading />
          <p>{translations.dashboard.loading}</p>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="modern-dashboard__stats">
            {/* Total Balance */}
            <div className="modern-dashboard__stat-card modern-dashboard__stat-card--primary">
              <div className="modern-dashboard__stat-header">
                <div className="modern-dashboard__stat-icon">
                  <DollarSign size={24} />
                </div>
              </div>
              <div className="modern-dashboard__stat-content">
                <h3 className="modern-dashboard__stat-title">
                  {translations.dashboard.totalBalance}
                </h3>
                <div className="modern-dashboard__stat-value">
                  <CurrencyAmount amountInVnd={stats.totalBalance} />
                </div>
                <div className="modern-dashboard__stat-meta">
                  {stats.totalWallets} {translations.dashboard.totalWallets}
                </div>
              </div>
            </div>

            {/* Monthly Income */}
            <div className="modern-dashboard__stat-card modern-dashboard__stat-card--success">
              <div className="modern-dashboard__stat-header">
                <div className="modern-dashboard__stat-icon">
                  <TrendingUp size={24} />
                </div>
              </div>
              <div className="modern-dashboard__stat-content">
                <h3 className="modern-dashboard__stat-title">
                  {translations.dashboard.monthlyIncome}
                </h3>
                <div className="modern-dashboard__stat-value">
                  <CurrencyAmount amountInVnd={stats.monthlyIncome} />
                </div>
                <div className="modern-dashboard__stat-meta">
                  {translations.dashboard.stats.thisMonth}
                </div>
              </div>
            </div>

            {/* Monthly Expenses */}
            <div className="modern-dashboard__stat-card modern-dashboard__stat-card--error">
              <div className="modern-dashboard__stat-header">
                <div className="modern-dashboard__stat-icon">
                  <TrendingDown size={24} />
                </div>
              </div>
              <div className="modern-dashboard__stat-content">
                <h3 className="modern-dashboard__stat-title">
                  {translations.dashboard.monthlyExpenses}
                </h3>
                <div className="modern-dashboard__stat-value">
                  <CurrencyAmount
                    amountInVnd={Math.abs(stats.monthlyExpenses)}
                  />
                </div>
                <div className="modern-dashboard__stat-meta">
                  {translations.dashboard.stats.thisMonth}
                </div>
              </div>
            </div>

            {/* Net Income */}
            <div
              className={`modern-dashboard__stat-card ${stats.netIncome >= 0 ? 'modern-dashboard__stat-card--success' : 'modern-dashboard__stat-card--error'}`}
            >
              <div className="modern-dashboard__stat-header">
                <div className="modern-dashboard__stat-icon">
                  {stats.netIncome >= 0 ? (
                    <ArrowUpRight size={24} />
                  ) : (
                    <ArrowDownRight size={24} />
                  )}
                </div>
              </div>
              <div className="modern-dashboard__stat-content">
                <h3 className="modern-dashboard__stat-title">
                  {translations.dashboard.netIncome}
                </h3>
                <div className="modern-dashboard__stat-value">
                  <CurrencyAmount amountInVnd={Math.abs(stats.netIncome)} />
                </div>
                <div className="modern-dashboard__stat-meta">
                  {stats.netIncome >= 0
                    ? translations.dashboard.stats.income
                    : translations.dashboard.stats.expenses}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="modern-dashboard__content">
            {/* Charts Section */}
            <div className="modern-dashboard__charts-section">
              {/* Cash Flow Bar Chart */}
              <div className="modern-dashboard__chart-container">
                <AnalyticsBarChart
                  data={chartData.cashFlowData}
                  title={translations.dashboard.spendingTrends}
                  loading={cashFlowLoading}
                  height={400}
                  showNet={true}
                  translations={{
                    income: translations.dashboard.stats.income,
                    expense: translations.dashboard.stats.expenses,
                    net: translations.dashboard.netIncome,
                    loading: translations.common.loading,
                    noData: translations.dashboard.noData,
                  }}
                />
              </div>

              {/* Category Pie Charts */}
              <div className="modern-dashboard__pie-charts">
                <div className="modern-dashboard__chart-container">
                  <AnalyticsPieChart
                    data={chartData.incomeCategories}
                    title={`${translations.dashboard.stats.income} ${translations.analytics.byCategory}`}
                    loading={loading.categoryBreakdown}
                    height={600}
                    translations={{
                      loading: translations.common.loading,
                      noData: translations.dashboard.noData,
                      categoriesCount: translations.categories.categoriesCount,
                    }}
                  />
                </div>

                <div className="modern-dashboard__chart-container">
                  <AnalyticsPieChart
                    data={chartData.expenseCategories}
                    title={`${translations.dashboard.stats.expenses} ${translations.analytics.byCategory}`}
                    loading={loading.categoryBreakdown}
                    height={600}
                    translations={{
                      loading: translations.common.loading,
                      noData: translations.dashboard.noData,
                      categoriesCount: translations.categories.categoriesCount,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Sidebar Content */}
            <div className="modern-dashboard__sidebar">
              {/* Recent Transactions */}
              <div className="modern-dashboard__card">
                <div className="modern-dashboard__card-header">
                  <h2 className="modern-dashboard__card-title">
                    <CreditCard size={20} />
                    {translations.dashboard.recentTransactions}
                  </h2>
                  <button
                    className="modern-dashboard__card-link"
                    onClick={() => navigate('/transactions')}
                  >
                    {translations.dashboard.viewAll}
                  </button>
                </div>
                <div className="modern-dashboard__transactions">
                  {recentTransactions.length > 0 ? (
                    recentTransactions.map(transaction => {
                      const wallet = wallets?.find(
                        w => w.walletId === transaction.walletId
                      );
                      const category = categories?.find(
                        c => c.categoryId === transaction.categoryId
                      );
                      return (
                        <TransactionItem
                          key={transaction.transactionId}
                          transaction={transaction}
                          wallet={wallet}
                          category={category}
                          onEdit={() => handleEditTransaction(transaction)}
                          onDelete={() => handleDeleteTransaction(transaction)}
                        />
                      );
                    })
                  ) : (
                    <div className="modern-dashboard__empty">
                      <AlertCircle size={32} />
                      <p>{translations.dashboard.noData}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Wallet Overview */}
              <div className="modern-dashboard__card">
                <div className="modern-dashboard__card-header">
                  <h2 className="modern-dashboard__card-title">
                    <Wallet size={20} />
                    {translations.dashboard.walletOverview}
                  </h2>
                  <button
                    className="modern-dashboard__card-link"
                    onClick={() => navigate('/wallets')}
                  >
                    {translations.dashboard.actions.manageWallets}
                  </button>
                </div>
                <div className="modern-dashboard__wallets">
                  <div className="modern-dashboard__wallet-stat">
                    <div className="modern-dashboard__wallet-stat-header">
                      <span className="modern-dashboard__wallet-stat-label">
                        {translations.dashboard.stats.positiveWallets}
                      </span>
                      <span className="modern-dashboard__wallet-stat-value modern-dashboard__wallet-stat-value--positive">
                        {stats.positiveWallets}
                      </span>
                    </div>
                  </div>
                  <div className="modern-dashboard__wallet-stat">
                    <div className="modern-dashboard__wallet-stat-header">
                      <span className="modern-dashboard__wallet-stat-label">
                        {translations.dashboard.stats.negativeWallets}
                      </span>
                      <span className="modern-dashboard__wallet-stat-value modern-dashboard__wallet-stat-value--negative">
                        {stats.negativeWallets}
                      </span>
                    </div>
                  </div>
                  {wallets &&
                    wallets.slice(0, 3).map(wallet => (
                      <div
                        key={wallet.walletId}
                        className="modern-dashboard__wallet-item"
                      >
                        <div className="modern-dashboard__wallet-info">
                          <span className="modern-dashboard__wallet-name">
                            {wallet.walletName}
                          </span>
                          <div className="modern-dashboard__wallet-balance">
                            <CurrencyAmount amountInVnd={wallet.balance} />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Budget Progress */}
              <div className="modern-dashboard__card">
                <div className="modern-dashboard__card-header">
                  <h2 className="modern-dashboard__card-title">
                    <Target size={20} />
                    {translations.dashboard.budgetProgress}
                  </h2>
                  <button
                    className="modern-dashboard__card-link"
                    onClick={() => navigate('/budget')}
                  >
                    {translations.dashboard.viewAll}
                  </button>
                </div>
                <div className="modern-dashboard__budgets">
                  {budgetProgress && budgetProgress.length > 0 ? (
                    budgetProgress.slice(0, 3).map(budget => {
                      const percentage =
                        (budget.currentSpending / budget.limitAmount) * 100;
                      return (
                        <div
                          key={budget.budgetId}
                          className="modern-dashboard__budget"
                        >
                          <div className="modern-dashboard__budget-header">
                            <span className="modern-dashboard__budget-category">
                              {budget.description}
                            </span>
                            <span className="modern-dashboard__budget-amount">
                              <CurrencyAmount
                                amountInVnd={budget.currentSpending}
                              />{' '}
                              /{' '}
                              <CurrencyAmount
                                amountInVnd={budget.limitAmount}
                              />
                            </span>
                          </div>
                          <div className="modern-dashboard__budget-progress">
                            <div
                              className="modern-dashboard__budget-bar"
                              style={{
                                width: `${Math.min(percentage, 100)}%`,
                                backgroundColor:
                                  percentage > 90
                                    ? 'var(--error-500)'
                                    : 'var(--primary-500)',
                              }}
                            />
                          </div>
                          <div className="modern-dashboard__budget-percentage">
                            {percentage.toFixed(0)}% used
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="modern-dashboard__empty">
                      <AlertCircle size={24} />
                      <p>{translations.dashboard.noData}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Savings Goals */}
              <div className="modern-dashboard__card">
                <div className="modern-dashboard__card-header">
                  <h2 className="modern-dashboard__card-title">
                    <PieChart size={20} />
                    {translations.dashboard.savingsGoals}
                  </h2>
                  <button
                    className="modern-dashboard__card-link"
                    onClick={() => navigate('/saving-goals')}
                  >
                    {translations.dashboard.viewAll}
                  </button>
                </div>
                <div className="modern-dashboard__savings">
                  {savingGoalProgress && savingGoalProgress.length > 0 ? (
                    savingGoalProgress.slice(0, 3).map(goal => {
                      const percentage =
                        (goal.savedAmount / goal.targetAmount) * 100;
                      return (
                        <div
                          key={goal.savingGoalId}
                          className="modern-dashboard__saving-goal"
                        >
                          <div className="modern-dashboard__saving-goal-header">
                            <span className="modern-dashboard__saving-goal-name">
                              {goal.description}
                            </span>
                            <span className="modern-dashboard__saving-goal-amount">
                              <CurrencyAmount amountInVnd={goal.savedAmount} />{' '}
                              /{' '}
                              <CurrencyAmount amountInVnd={goal.targetAmount} />
                            </span>
                          </div>
                          <div className="modern-dashboard__saving-goal-progress">
                            <div
                              className="modern-dashboard__saving-goal-bar"
                              style={{
                                width: `${Math.min(percentage, 100)}%`,
                                backgroundColor:
                                  percentage >= 100
                                    ? 'var(--success-500)'
                                    : 'var(--primary-500)',
                              }}
                            />
                          </div>
                          <div className="modern-dashboard__saving-goal-percentage">
                            {percentage.toFixed(0)}% complete
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="modern-dashboard__empty">
                      <AlertCircle size={24} />
                      <p>{translations.dashboard.noData}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="modern-dashboard__quick-actions">
            <div className="modern-dashboard__card">
              <div className="modern-dashboard__card-header">
                <h2 className="modern-dashboard__card-title">
                  <Settings size={20} />
                  {translations.dashboard.quickActions}
                </h2>
              </div>
              <div className="modern-dashboard__actions-grid">
                <button
                  className="modern-dashboard__quick-action"
                  onClick={() => setShowTransactionForm(true)}
                >
                  <Plus size={20} />
                  <span>{translations.dashboard.actions.addTransaction}</span>
                </button>
                <button
                  className="modern-dashboard__quick-action"
                  onClick={() => navigate('/wallets')}
                >
                  <Wallet size={20} />
                  <span>{translations.dashboard.actions.addWallet}</span>
                </button>
                <button
                  className="modern-dashboard__quick-action"
                  onClick={() => navigate('/budget')}
                >
                  <Target size={20} />
                  <span>{translations.dashboard.actions.setBudget}</span>
                </button>
                <button
                  className="modern-dashboard__quick-action"
                  onClick={() => navigate('/saving-goals')}
                >
                  <PieChart size={20} />
                  <span>{translations.dashboard.actions.setGoal}</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Transaction Form Modal */}
      {showTransactionForm && (
        <TransactionForm
          onSubmit={
            editingTransaction
              ? handleUpdateTransaction
              : handleCreateTransaction
          }
          onCancel={closeTransactionForm}
          initialData={editingTransaction}
          isLoading={categoriesLoading || walletsLoading}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.show}
        title={translations.transactions.deleteConfirmTitle}
        message={`${translations.transactions.deleteConfirmMessage} "${deleteConfirm.description || ''}"`}
        confirmText={translations.common.delete}
        cancelText={translations.common.cancel}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ show: false })}
        type="danger"
      />
    </div>
  );
};

export default ModernDashboard;

import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PiggyBank,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Plus,
  Calendar,
  Filter,
  Download,
} from 'lucide-react';
import './ModernDashboard.css';

const ModernDashboard: React.FC = () => {
  const stats = [
    {
      id: 'balance',
      title: 'Total Balance',
      value: '$24,680.42',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'primary',
    },
    {
      id: 'income',
      title: 'Monthly Income',
      value: '$8,240.00',
      change: '+8.2%',
      trend: 'up',
      icon: TrendingUp,
      color: 'success',
    },
    {
      id: 'expenses',
      title: 'Monthly Expenses',
      value: '$3,567.89',
      change: '-3.1%',
      trend: 'down',
      icon: TrendingDown,
      color: 'error',
    },
    {
      id: 'savings',
      title: 'Total Savings',
      value: '$12,450.67',
      change: '+15.3%',
      trend: 'up',
      icon: PiggyBank,
      color: 'info',
    },
  ];

  const recentTransactions = [
    {
      id: 1,
      description: 'Salary Deposit',
      category: 'Income',
      amount: '+$4,500.00',
      date: '2 hours ago',
      type: 'income',
    },
    {
      id: 2,
      description: 'Grocery Shopping',
      category: 'Food & Dining',
      amount: '-$126.47',
      date: '1 day ago',
      type: 'expense',
    },
    {
      id: 3,
      description: 'Electric Bill',
      category: 'Utilities',
      amount: '-$89.23',
      date: '2 days ago',
      type: 'expense',
    },
    {
      id: 4,
      description: 'Investment Return',
      category: 'Investment',
      amount: '+$234.56',
      date: '3 days ago',
      type: 'income',
    },
    {
      id: 5,
      description: 'Netflix Subscription',
      category: 'Entertainment',
      amount: '-$15.99',
      date: '5 days ago',
      type: 'expense',
    },
  ];

  const budgets = [
    {
      id: 1,
      category: 'Food & Dining',
      spent: 847.32,
      limit: 1200,
      color: 'var(--primary-500)',
    },
    {
      id: 2,
      category: 'Transportation',
      spent: 234.56,
      limit: 400,
      color: 'var(--success-500)',
    },
    {
      id: 3,
      category: 'Entertainment',
      spent: 456.78,
      limit: 500,
      color: 'var(--warning-500)',
    },
    {
      id: 4,
      category: 'Shopping',
      spent: 789.12,
      limit: 800,
      color: 'var(--error-500)',
    },
  ];

  return (
    <div className="modern-dashboard">
      {/* Page Header */}
      <div className="modern-dashboard__header">
        <div className="modern-dashboard__header-content">
          <div>
            <h1 className="modern-dashboard__title">Dashboard</h1>
            <p className="modern-dashboard__subtitle">
              Welcome back, John! Here's what's happening with your finances.
            </p>
          </div>
          <div className="modern-dashboard__header-actions">
            <button className="modern-dashboard__action-btn modern-dashboard__action-btn--secondary">
              <Calendar size={18} />
              Last 30 days
            </button>
            <button className="modern-dashboard__action-btn modern-dashboard__action-btn--secondary">
              <Filter size={18} />
              Filter
            </button>
            <button className="modern-dashboard__action-btn modern-dashboard__action-btn--secondary">
              <Download size={18} />
              Export
            </button>
            <button className="modern-dashboard__action-btn modern-dashboard__action-btn--primary">
              <Plus size={18} />
              Add Transaction
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="modern-dashboard__stats">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className={`modern-dashboard__stat-card modern-dashboard__stat-card--${stat.color}`}
            >
              <div className="modern-dashboard__stat-header">
                <div className="modern-dashboard__stat-icon">
                  <Icon size={24} />
                </div>
                <button className="modern-dashboard__stat-menu">
                  <MoreHorizontal size={16} />
                </button>
              </div>
              <div className="modern-dashboard__stat-content">
                <h3 className="modern-dashboard__stat-title">{stat.title}</h3>
                <div className="modern-dashboard__stat-value">{stat.value}</div>
                <div
                  className={`modern-dashboard__stat-change modern-dashboard__stat-change--${stat.trend}`}
                >
                  {stat.trend === 'up' ? (
                    <ArrowUpRight size={16} />
                  ) : (
                    <ArrowDownRight size={16} />
                  )}
                  <span>{stat.change} from last month</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="modern-dashboard__content">
        {/* Chart Section */}
        <div className="modern-dashboard__chart-section">
          <div className="modern-dashboard__card">
            <div className="modern-dashboard__card-header">
              <h2 className="modern-dashboard__card-title">
                Spending Overview
              </h2>
              <div className="modern-dashboard__card-actions">
                <select className="modern-dashboard__select">
                  <option>Last 6 months</option>
                  <option>Last 3 months</option>
                  <option>Last month</option>
                </select>
              </div>
            </div>
            <div className="modern-dashboard__chart-placeholder">
              <div className="modern-dashboard__chart-mock">
                <div className="modern-dashboard__chart-bars">
                  <div
                    className="modern-dashboard__chart-bar"
                    style={{ height: '60%' }}
                  ></div>
                  <div
                    className="modern-dashboard__chart-bar"
                    style={{ height: '80%' }}
                  ></div>
                  <div
                    className="modern-dashboard__chart-bar"
                    style={{ height: '45%' }}
                  ></div>
                  <div
                    className="modern-dashboard__chart-bar"
                    style={{ height: '90%' }}
                  ></div>
                  <div
                    className="modern-dashboard__chart-bar"
                    style={{ height: '70%' }}
                  ></div>
                  <div
                    className="modern-dashboard__chart-bar"
                    style={{ height: '55%' }}
                  ></div>
                </div>
                <div className="modern-dashboard__chart-legend">
                  <div className="modern-dashboard__legend-item">
                    <div
                      className="modern-dashboard__legend-color"
                      style={{ background: 'var(--primary-500)' }}
                    ></div>
                    <span>Income</span>
                  </div>
                  <div className="modern-dashboard__legend-item">
                    <div
                      className="modern-dashboard__legend-color"
                      style={{ background: 'var(--error-500)' }}
                    ></div>
                    <span>Expenses</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="modern-dashboard__sidebar">
          {/* Recent Transactions */}
          <div className="modern-dashboard__card">
            <div className="modern-dashboard__card-header">
              <h2 className="modern-dashboard__card-title">
                Recent Transactions
              </h2>
              <button className="modern-dashboard__card-link">View all</button>
            </div>
            <div className="modern-dashboard__transactions">
              {recentTransactions.map(transaction => (
                <div
                  key={transaction.id}
                  className="modern-dashboard__transaction"
                >
                  <div className="modern-dashboard__transaction-info">
                    <div className="modern-dashboard__transaction-description">
                      {transaction.description}
                    </div>
                    <div className="modern-dashboard__transaction-meta">
                      <span className="modern-dashboard__transaction-category">
                        {transaction.category}
                      </span>
                      <span className="modern-dashboard__transaction-date">
                        {transaction.date}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`modern-dashboard__transaction-amount modern-dashboard__transaction-amount--${transaction.type}`}
                  >
                    {transaction.amount}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Budget Progress */}
          <div className="modern-dashboard__card">
            <div className="modern-dashboard__card-header">
              <h2 className="modern-dashboard__card-title">Budget Overview</h2>
              <button className="modern-dashboard__card-link">Manage</button>
            </div>
            <div className="modern-dashboard__budgets">
              {budgets.map(budget => {
                const percentage = (budget.spent / budget.limit) * 100;
                return (
                  <div key={budget.id} className="modern-dashboard__budget">
                    <div className="modern-dashboard__budget-header">
                      <span className="modern-dashboard__budget-category">
                        {budget.category}
                      </span>
                      <span className="modern-dashboard__budget-amount">
                        ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                      </span>
                    </div>
                    <div className="modern-dashboard__budget-progress">
                      <div
                        className="modern-dashboard__budget-bar"
                        style={{
                          width: `${Math.min(percentage, 100)}%`,
                          backgroundColor:
                            percentage > 90 ? 'var(--error-500)' : budget.color,
                        }}
                      />
                    </div>
                    <div className="modern-dashboard__budget-percentage">
                      {percentage.toFixed(0)}% used
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="modern-dashboard__quick-actions">
        <div className="modern-dashboard__card">
          <div className="modern-dashboard__card-header">
            <h2 className="modern-dashboard__card-title">Quick Actions</h2>
          </div>
          <div className="modern-dashboard__actions-grid">
            <button className="modern-dashboard__quick-action">
              <Plus size={20} />
              <span>Add Income</span>
            </button>
            <button className="modern-dashboard__quick-action">
              <Target size={20} />
              <span>Set Goal</span>
            </button>
            <button className="modern-dashboard__quick-action">
              <PiggyBank size={20} />
              <span>Start Saving</span>
            </button>
            <button className="modern-dashboard__quick-action">
              <DollarSign size={20} />
              <span>Transfer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernDashboard;

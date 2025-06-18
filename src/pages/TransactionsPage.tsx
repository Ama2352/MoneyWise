import React from 'react';
import {
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import '../styles/pages.css';

const TransactionsPage: React.FC = () => {
  const transactions = [
    {
      id: 1,
      date: '2024-01-15',
      description: 'Salary Deposit',
      category: 'Income',
      amount: 4500.0,
      type: 'income',
      account: 'Checking Account',
    },
    {
      id: 2,
      date: '2024-01-14',
      description: 'Grocery Shopping - Whole Foods',
      category: 'Food & Dining',
      amount: -126.47,
      type: 'expense',
      account: 'Credit Card',
    },
    {
      id: 3,
      date: '2024-01-13',
      description: 'Electric Bill Payment',
      category: 'Utilities',
      amount: -89.23,
      type: 'expense',
      account: 'Checking Account',
    },
    // Add more transactions...
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-subtitle">
            Manage all your financial transactions
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn--secondary">
            <Filter size={18} />
            Filter
          </button>
          <button className="btn btn--secondary">
            <Download size={18} />
            Export
          </button>
          <button className="btn btn--primary">
            <Plus size={18} />
            Add Transaction
          </button>
        </div>
      </div>

      <div className="page-content">
        <div className="card">
          <div className="card-header">
            <div className="search-bar">
              <Search size={18} />
              <input type="text" placeholder="Search transactions..." />
            </div>
            <div className="filters">
              <select className="select">
                <option>All Categories</option>
                <option>Income</option>
                <option>Food & Dining</option>
                <option>Utilities</option>
              </select>
              <select className="select">
                <option>Last 30 days</option>
                <option>Last 3 months</option>
                <option>Last 6 months</option>
              </select>
            </div>
          </div>

          <div className="transactions-table">
            <div className="table-header">
              <div>Date</div>
              <div>Description</div>
              <div>Category</div>
              <div>Account</div>
              <div>Amount</div>
            </div>
            {transactions.map(transaction => (
              <div key={transaction.id} className="table-row">
                <div className="transaction-date">
                  <Calendar size={16} />
                  {new Date(transaction.date).toLocaleDateString()}
                </div>
                <div className="transaction-description">
                  {transaction.description}
                </div>
                <div className="transaction-category">
                  <span className="category-badge">{transaction.category}</span>
                </div>
                <div className="transaction-account">{transaction.account}</div>
                <div
                  className={`transaction-amount amount--${transaction.type}`}
                >
                  {transaction.type === 'income' ? (
                    <TrendingUp size={16} />
                  ) : (
                    <TrendingDown size={16} />
                  )}
                  $
                  {Math.abs(transaction.amount).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;

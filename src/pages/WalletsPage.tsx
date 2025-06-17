import React from 'react';
import {
  Plus,
  CreditCard,
  PiggyBank,
  Banknote,
  TrendingUp,
  MoreHorizontal,
} from 'lucide-react';
import '../styles/pages.css';

const WalletsPage: React.FC = () => {
  const wallets = [
    {
      id: 1,
      name: 'Main Checking',
      type: 'checking',
      balance: 15420.5,
      bank: 'Chase Bank',
      lastActivity: '2 hours ago',
      icon: Banknote,
      color: 'var(--primary-500)',
    },
    {
      id: 2,
      name: 'Savings Account',
      type: 'savings',
      balance: 8750.25,
      bank: 'Chase Bank',
      lastActivity: '1 day ago',
      icon: PiggyBank,
      color: 'var(--success-500)',
    },
    {
      id: 3,
      name: 'Credit Card',
      type: 'credit',
      balance: -1250.75,
      bank: 'American Express',
      lastActivity: '3 hours ago',
      icon: CreditCard,
      color: 'var(--warning-500)',
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Wallets & Accounts</h1>
          <p className="page-subtitle">
            Manage your financial accounts and track balances
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn--primary">
            <Plus size={18} />
            Add Wallet
          </button>
        </div>
      </div>

      <div className="page-content">
        <div className="wallets-grid">
          {wallets.map(wallet => {
            const Icon = wallet.icon;
            return (
              <div key={wallet.id} className="wallet-card">
                <div className="wallet-header">
                  <div
                    className="wallet-icon"
                    style={{ backgroundColor: wallet.color }}
                  >
                    <Icon size={24} color="white" />
                  </div>
                  <button className="wallet-menu">
                    <MoreHorizontal size={16} />
                  </button>
                </div>

                <div className="wallet-content">
                  <h3 className="wallet-name">{wallet.name}</h3>
                  <p className="wallet-bank">{wallet.bank}</p>

                  <div
                    className={`wallet-balance ${wallet.balance < 0 ? 'wallet-balance--negative' : ''}`}
                  >
                    {wallet.balance < 0 ? '-' : ''}$
                    {Math.abs(wallet.balance).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>

                  <div className="wallet-meta">
                    <span className="wallet-type">{wallet.type}</span>
                    <span className="wallet-activity">
                      Last activity: {wallet.lastActivity}
                    </span>
                  </div>
                </div>

                <div className="wallet-actions">
                  <button className="wallet-action-btn">
                    <TrendingUp size={16} />
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="summary-cards">
          <div className="summary-card">
            <h3>Total Assets</h3>
            <div className="summary-value positive">$24,170.75</div>
            <div className="summary-change">
              <TrendingUp size={16} />
              +2.5% from last month
            </div>
          </div>

          <div className="summary-card">
            <h3>Total Liabilities</h3>
            <div className="summary-value negative">$1,250.75</div>
            <div className="summary-change">
              <TrendingUp size={16} />
              -8.3% from last month
            </div>
          </div>

          <div className="summary-card">
            <h3>Net Worth</h3>
            <div className="summary-value positive">$22,920.00</div>
            <div className="summary-change">
              <TrendingUp size={16} />
              +4.1% from last month
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletsPage;

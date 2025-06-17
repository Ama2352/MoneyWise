import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../contexts';
import { useToastContext } from '../contexts'; // Renamed to avoid confusion with hook
import { useLanguageContext } from '../contexts';
import { ROUTES } from '../constants';
import Layout from '../components/layout/Layout';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import './DashboardPage.css';

const DashboardPage: React.FC = () => {
  const { userProfile, logout } = useAuthContext();
  const { showSuccess } = useToastContext();
  const { t } = useLanguageContext();

  // Check for login success message and show toast
  useEffect(() => {
    const loginSuccessMessage = sessionStorage.getItem('loginSuccess');
    if (loginSuccessMessage) {
      showSuccess(loginSuccessMessage);
      // Remove the message so it doesn't show again
      sessionStorage.removeItem('loginSuccess');
    }
  }, [showSuccess]);

  const handleLogout = () => {
    logout(true); // Manual logout - App.tsx will handle navigation automatically
  };

  return (
    <Layout
      header={
        <Header
          title={t('dashboard.title')}
          userName={userProfile?.firstName}
          onLogout={handleLogout}
        />
      }
    >
      <div className="dashboard-container">
        <h2 className="dashboard-title">{t('dashboard.financialOverview')}</h2>{' '}
        <div className="dashboard-grid">
          <Card title={t('dashboard.totalBalance')} className="stat-card">
            <div className="stat-value">$5,245.00</div>
            <div className="stat-change positive">
              +2.5% {t('dashboard.fromLastMonth')}
            </div>
          </Card>

          <Card title={t('dashboard.monthlyIncome')} className="stat-card">
            <div className="stat-value">$3,200.00</div>
            <div className="stat-change positive">
              +5.2% {t('dashboard.fromLastMonth')}
            </div>
          </Card>

          <Card title={t('dashboard.monthlyExpenses')} className="stat-card">
            <div className="stat-value">$2,180.00</div>
            <div className="stat-change negative">
              +12.1% {t('dashboard.fromLastMonth')}
            </div>
          </Card>

          <Card title={t('dashboard.savingsRate')} className="stat-card">
            <div className="stat-value">32%</div>
            <div className="stat-change neutral">
              {t('dashboard.sameAsLastMonth')}
            </div>
          </Card>
        </div>{' '}        <div className="dashboard-content">
          <Card title={t('dashboard.quickActions')}>
            <div className="quick-actions">
              <Link to={ROUTES.CATEGORIES} className="action-button">
                <span className="action-icon">📁</span>
                <span className="action-text">{t('nav.categories')}</span>
              </Link>
              <Link to={ROUTES.TRANSACTIONS} className="action-button">
                <span className="action-icon">💳</span>
                <span className="action-text">{t('nav.transactions')}</span>
              </Link>
              <Link to={ROUTES.BUDGETS} className="action-button">
                <span className="action-icon">💰</span>
                <span className="action-text">{t('nav.budgets')}</span>
              </Link>
              <Link to={ROUTES.ACCOUNTS} className="action-button">
                <span className="action-icon">🏦</span>
                <span className="action-text">{t('nav.accounts')}</span>
              </Link>
            </div>
          </Card>
          
          <Card title={t('dashboard.recentTransactions')}>
            <div className="transaction-list">
              <div className="transaction-item">
                <div className="transaction-info">
                  <div className="transaction-title">
                    {t('dashboard.transactions.groceryStore')}
                  </div>
                  <div className="transaction-date">
                    {t('dashboard.today')}, 2:30 PM
                  </div>
                </div>
                <div className="transaction-amount expense">-$85.42</div>
              </div>

              <div className="transaction-item">
                <div className="transaction-info">
                  <div className="transaction-title">
                    {t('dashboard.transactions.salaryDeposit')}
                  </div>
                  <div className="transaction-date">
                    {t('dashboard.yesterday')}, 9:00 AM
                  </div>
                </div>
                <div className="transaction-amount income">+$3,200.00</div>
              </div>

              <div className="transaction-item">
                <div className="transaction-info">
                  <div className="transaction-title">
                    {t('dashboard.transactions.coffeeShop')}
                  </div>
                  <div className="transaction-date">June 12, 8:15 AM</div>
                </div>
                <div className="transaction-amount expense">-$4.50</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;

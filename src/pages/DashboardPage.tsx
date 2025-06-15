import React, { useEffect } from 'react';
import { useAuth } from '../contexts';
import { useToastContext } from '../contexts'; // Renamed to avoid confusion with hook
import Layout from '../components/layout/Layout';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import './DashboardPage.css';

const DashboardPage: React.FC = () => {
  const { userProfile, logout } = useAuth();
  const { showSuccess } = useToastContext();

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
          title="MoneyWise Dashboard"
          userName={userProfile?.firstName}
          onLogout={handleLogout}
        />
      }
    >
      <div className="dashboard-container">
        <h2 className="dashboard-title">Financial Overview</h2>

        <div className="dashboard-grid">
          <Card title="Total Balance" className="stat-card">
            <div className="stat-value">$5,245.00</div>
            <div className="stat-change positive">+2.5% from last month</div>
          </Card>

          <Card title="Monthly Income" className="stat-card">
            <div className="stat-value">$3,200.00</div>
            <div className="stat-change positive">+5.2% from last month</div>
          </Card>

          <Card title="Monthly Expenses" className="stat-card">
            <div className="stat-value">$2,180.00</div>
            <div className="stat-change negative">+12.1% from last month</div>
          </Card>

          <Card title="Savings Rate" className="stat-card">
            <div className="stat-value">32%</div>
            <div className="stat-change neutral">Same as last month</div>
          </Card>
        </div>

        <div className="dashboard-content">
          <Card title="Recent Transactions">
            <div className="transaction-list">
              <div className="transaction-item">
                <div className="transaction-info">
                  <div className="transaction-title">Grocery Store</div>
                  <div className="transaction-date">Today, 2:30 PM</div>
                </div>
                <div className="transaction-amount expense">-$85.42</div>
              </div>

              <div className="transaction-item">
                <div className="transaction-info">
                  <div className="transaction-title">Salary Deposit</div>
                  <div className="transaction-date">Yesterday, 9:00 AM</div>
                </div>
                <div className="transaction-amount income">+$3,200.00</div>
              </div>

              <div className="transaction-item">
                <div className="transaction-info">
                  <div className="transaction-title">Coffee Shop</div>
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

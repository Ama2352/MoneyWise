import React from 'react';
import './Header.css';

interface HeaderProps {
  title: string;
  userName?: string;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, userName, onLogout }) => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">{title}</h1>
        
        <nav className="header-nav">
          <a href="/dashboard" className="nav-link">Dashboard</a>
          <a href="/transactions" className="nav-link">Transactions</a>
          <a href="/budgets" className="nav-link">Budgets</a>
          <a href="/accounts" className="nav-link">Accounts</a>
        </nav>
        
        {userName && (
          <div className="header-user">
            <span className="user-name">Welcome, {userName}</span>
            {onLogout && (
              <button className="logout-btn" onClick={onLogout}>
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

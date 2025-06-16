import React from 'react';
import { useLanguageContext } from '../../contexts';
import { LanguageSwitcher } from '../ui';
import './Header.css';

interface HeaderProps {
  title: string;
  userName?: string;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, userName, onLogout }) => {
  const { t } = useLanguageContext();

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">{title}</h1>
        <nav className="header-nav">
          <a href="/dashboard" className="nav-link">
            {t('nav.dashboard')}
          </a>
          <a href="/transactions" className="nav-link">
            {t('nav.transactions')}
          </a>
          <a href="/budgets" className="nav-link">
            {t('nav.budgets')}
          </a>
          <a href="/accounts" className="nav-link">
            {t('nav.accounts')}
          </a>
        </nav>

        <div className="header-actions">
          <LanguageSwitcher variant="toggle" showText={false} />
          {userName && (
            <div className="header-user">
              <span className="user-name">
                {t('dashboard.welcome')}, {userName}
              </span>
              {onLogout && (
                <button className="logout-btn" onClick={onLogout}>
                  {t('auth.logout')}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

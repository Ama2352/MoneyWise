import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguageContext } from '../../contexts';
import { LanguageSwitcher } from '../ui';
import { ROUTES } from '../../constants';
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
        <h1 className="header-title">{title}</h1>        <nav className="header-nav">
          <Link to={ROUTES.DASHBOARD} className="nav-link">
            {t('nav.dashboard')}
          </Link>
          <Link to={ROUTES.TRANSACTIONS} className="nav-link">
            {t('nav.transactions')}
          </Link>
          <Link to={ROUTES.CATEGORIES} className="nav-link">
            {t('nav.categories')}
          </Link>
          <Link to={ROUTES.BUDGETS} className="nav-link">
            {t('nav.budgets')}
          </Link>
          <Link to={ROUTES.ACCOUNTS} className="nav-link">
            {t('nav.accounts')}
          </Link>
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

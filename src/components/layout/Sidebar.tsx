import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants';
import {
  LayoutDashboard,
  ArrowUpDown,
  Wallet,
  FolderOpen,
  BarChart3,
  FileText,
  PiggyBank,
  Target,
  Menu,
  X,
  TrendingUp,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import './Sidebar.css';
import { useAnalytics, useTranslations } from '../../hooks';
import { useCurrencyContext, useLanguageContext } from '../../contexts';
import { useTransactions } from '../../hooks/useFinanceData';

interface NavigationItem {
  id: string;
  icon: React.ComponentType<any>;
  path: string;
  badge?: string;
  isNew?: boolean;
}

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

// Use a custom event to trigger sidebar monthly summary refetch from anywhere
export const refetchSidebarMonthlySummary = () => {
  window.dispatchEvent(new CustomEvent('refetchSidebarMonthlySummary'));
};

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { translations } = useLanguageContext();
  const { convertAndFormat } = useCurrencyContext();
  const { monthlySummary, fetchMonthlySummary } = useAnalytics();
  const { transactions } = useTransactions();

  // Listen for the custom event and refetch monthly summary
  React.useEffect(() => {
    const handler = () => {
      const now = new Date();
      fetchMonthlySummary({
        year: now.getFullYear(),
        month: now.getMonth() + 1,
      });
    };
    window.addEventListener('refetchSidebarMonthlySummary', handler);
    return () =>
      window.removeEventListener('refetchSidebarMonthlySummary', handler);
  }, [fetchMonthlySummary]);

  const isActiveRoute = (path: string) => {
    return (
      location.pathname === path ||
      (path !== '/' && location.pathname.startsWith(path + '/'))
    );
  };

  useEffect(() => {
    const now = new Date();
    fetchMonthlySummary({
      year: now.getFullYear(),
      month: now.getMonth() + 1,
    });
  }, [fetchMonthlySummary, transactions]);

  // Safely extract values
  const totalIncome =
    typeof monthlySummary?.totalIncome === 'number'
      ? monthlySummary.totalIncome
      : 0;
  const totalExpenses =
    typeof monthlySummary?.totalExpenses === 'number'
      ? monthlySummary.totalExpenses
      : 0;

  // State for formatted values
  const [formattedAmounts, setFormattedAmounts] = useState({
    totalIncome: '',
    totalExpenses: '',
  });

  useEffect(() => {
    let isMounted = true;
    const formatAmounts = async () => {
      try {
        const [formattedIncome, formattedExpenses] = await Promise.all([
          convertAndFormat(totalIncome),
          convertAndFormat(totalExpenses),
        ]);
        if (isMounted) {
          setFormattedAmounts({
            totalIncome: formattedIncome,
            totalExpenses: formattedExpenses,
          });
        }
      } catch (error) {
        if (isMounted) {
          setFormattedAmounts({
            totalIncome: totalIncome.toString(),
            totalExpenses: totalExpenses.toString(),
          });
        }
      }
    };
    formatAmounts();
    return () => {
      isMounted = false;
    };
  }, [totalIncome, totalExpenses, convertAndFormat]);

  // Navigation items with translations
  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      icon: LayoutDashboard,
      path: ROUTES.DASHBOARD,
    },
    {
      id: 'transactions',
      icon: ArrowUpDown,
      path: ROUTES.TRANSACTIONS,
    },
    {
      id: 'wallets',
      icon: Wallet,
      path: ROUTES.WALLETS,
    },
    {
      id: 'categories',
      icon: FolderOpen,
      path: ROUTES.CATEGORIES,
    },
    {
      id: 'analytics',
      icon: BarChart3,
      path: ROUTES.ANALYTICS,
    },
    {
      id: 'reports',
      icon: FileText,
      path: ROUTES.REPORTS,
    },
    {
      id: 'budget',
      icon: PiggyBank,
      path: ROUTES.BUDGET,
    },
    {
      id: 'savings',
      icon: Target,
      path: ROUTES.SAVING_GOALS,
    },
  ];

  // Get navigation label by ID
  const getNavigationLabel = (id: string): string => {
    const navMap: Record<string, keyof typeof translations.nav> = {
      dashboard: 'dashboard',
      transactions: 'transactions',
      wallets: 'wallets',
      categories: 'categories',
      analytics: 'analytics',
      reports: 'reports',
      budget: 'budgets',
      savings: 'savingGoals',
    };
    return translations.nav[navMap[id]] || id;
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'sidebar--collapsed' : ''}`}>
      {/* Header */}
      <div className="sidebar__header">
        <div className="sidebar__brand">
          {!isCollapsed && (
            <>
              <TrendingUp className="sidebar__logo-icon" />
              <span className="sidebar__brand-text">MoneyWise</span>
            </>
          )}
          <button
            className="sidebar__toggle"
            onClick={onToggle}
            aria-label={
              isCollapsed
                ? translations.sidebar.expandSidebar
                : translations.sidebar.collapseSidebar
            }
          >
            {isCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar__nav">
        <div className="sidebar__nav-section">
          {!isCollapsed && (
            <div className="sidebar__section-title">
              <span>{translations.sidebar.mainMenu}</span>
            </div>
          )}

          <ul className="sidebar__nav-list">
            {navigationItems.map(item => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.path);
              const isHovered = hoveredItem === item.id;

              return (
                <li key={item.id} className="sidebar__nav-item">
                  <NavLink
                    to={item.path}
                    className={`sidebar__nav-link ${
                      isActive ? 'sidebar__nav-link--active' : ''
                    }`}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div className="sidebar__nav-content">
                      <div className="sidebar__nav-icon">
                        <Icon size={20} />
                      </div>

                      {!isCollapsed && (
                        <>
                          <span className="sidebar__nav-label">
                            {getNavigationLabel(item.id)}
                          </span>

                          <div className="sidebar__nav-meta">
                            {item.isNew && (
                              <span className="sidebar__badge sidebar__badge--new">
                                <Sparkles size={12} />
                                {translations.sidebar.new}
                              </span>
                            )}
                            {item.badge && (
                              <span className="sidebar__badge sidebar__badge--count">
                                {item.badge}
                              </span>
                            )}
                            {(isHovered || isActive) && (
                              <ChevronRight
                                size={16}
                                className="sidebar__nav-arrow"
                              />
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Collapsed state tooltip */}
                    {isCollapsed && (
                      <div className="sidebar__tooltip">
                        <span>{getNavigationLabel(item.id)}</span>
                        {item.badge && (
                          <span className="sidebar__tooltip-badge">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Active indicator */}
                    {isActive && <div className="sidebar__active-indicator" />}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="sidebar__footer">
          <div className="sidebar__summary-card">
            <div className="sidebar__summary-icon">
              <TrendingUp size={24} />
            </div>
            <div className="sidebar__summary-content">
              <h3>{translations.sidebar.thisMonth}</h3>
              <div className="sidebar__summary-stats">
                <div className="sidebar__summary-item">
                  <span className="sidebar__summary-label">
                    {translations.sidebar.totalIncome}
                  </span>
                  <span className="sidebar__summary-value positive">
                    {formattedAmounts.totalIncome}
                  </span>
                </div>
                <div className="sidebar__summary-item">
                  <span className="sidebar__summary-label">
                    {translations.sidebar.totalExpenses}
                  </span>
                  <span className="sidebar__summary-value negative">
                    {formattedAmounts.totalExpenses}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

import React, { useState } from 'react';
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
  Settings,
  Menu,
  X,
  TrendingUp,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import './Sidebar.css';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path: string;
  badge?: string;
  isNew?: boolean;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: ROUTES.DASHBOARD,
  },
  {
    id: 'transactions',
    label: 'Transactions',
    icon: ArrowUpDown,
    path: ROUTES.TRANSACTIONS,
    badge: '',
  },
  {
    id: 'wallets',
    label: 'Wallets',
    icon: Wallet,
    path: ROUTES.WALLETS,
  },
  {
    id: 'categories',
    label: 'Categories',
    icon: FolderOpen,
    path: ROUTES.CATEGORIES,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    path: ROUTES.ANALYTICS,
    isNew: true,
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: FileText,
    path: ROUTES.REPORTS,
  },
  {
    id: 'budget',
    label: 'Budget',
    icon: PiggyBank,
    path: ROUTES.BUDGET,
    badge: '3',
  },
  {
    id: 'savings',
    label: 'Saving Goals',
    icon: Target,
    path: ROUTES.SAVING_GOALS,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    path: ROUTES.SETTINGS,
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const isActiveRoute = (path: string) => {
    // For absolute paths, check if current path matches exactly or starts with the path
    return (
      location.pathname === path ||
      (path !== '/' && location.pathname.startsWith(path + '/'))
    );
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'sidebar--collapsed' : ''}`}>
      {/* Header */}
      <div className="sidebar__header">
        <div
          className="sidebar__brand"
          style={{ gap: isCollapsed ? '0' : 'var(--space-3)' }}
        >
          {!isCollapsed && (
            <>
              <TrendingUp className="sidebar__logo-icon" />
              <span className="sidebar__brand-text">MoneyWise</span>
            </>
          )}
          <div className="sidebar__logo"></div>
          <button
            className="sidebar__toggle"
            onClick={onToggle}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
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
              <span>Main Menu</span>
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
                            {item.label}
                          </span>

                          <div className="sidebar__nav-meta">
                            {item.isNew && (
                              <span className="sidebar__badge sidebar__badge--new">
                                <Sparkles size={12} />
                                New
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
                        <span>{item.label}</span>
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
      </nav>{' '}
      {/* Footer */}
      {!isCollapsed && (
        <div className="sidebar__footer">
          <div className="sidebar__summary-card">
            <div className="sidebar__summary-icon">
              <TrendingUp size={24} />
            </div>
            <div className="sidebar__summary-content">
              <h3>This Month</h3>
              <div className="sidebar__summary-stats">
                <div className="sidebar__summary-item">
                  <span className="sidebar__summary-label">Balance</span>
                  <span className="sidebar__summary-value positive">
                    $24,680
                  </span>
                </div>
                <div className="sidebar__summary-item">
                  <span className="sidebar__summary-label">Savings</span>
                  <span className="sidebar__summary-value positive">
                    +$1,240
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

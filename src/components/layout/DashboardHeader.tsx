import React from 'react';
import {
  Search,
  Bell,
  User,
  Menu,
  Sun,
  Moon,
  Globe,
  ChevronDown,
  Settings,
  LogOut,
  HelpCircle,
} from 'lucide-react';
import './DashboardHeader.css';

interface DashboardHeaderProps {
  onMobileMenuToggle: () => void;
  sidebarCollapsed: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onMobileMenuToggle,
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Here you would implement your theme switching logic
  };

  return (
    <header className="dashboard-header">
      <div className="dashboard-header__left">
        {/* Mobile menu button */}
        <button
          className="dashboard-header__mobile-menu"
          onClick={onMobileMenuToggle}
          aria-label="Toggle mobile menu"
        >
          <Menu size={20} />
        </button>

        {/* Search */}
        <div className="dashboard-header__search">
          <Search size={18} className="dashboard-header__search-icon" />
          <input
            type="text"
            placeholder="Search transactions, categories..."
            className="dashboard-header__search-input"
          />
          <kbd className="dashboard-header__search-kbd">⌘K</kbd>
        </div>
      </div>

      <div className="dashboard-header__right">
        {/* Theme toggle */}
        <button
          className="dashboard-header__action"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Language selector */}
        <button
          className="dashboard-header__action"
          aria-label="Change language"
        >
          <Globe size={18} />
        </button>

        {/* Notifications */}
        <button className="dashboard-header__action dashboard-header__notifications">
          <Bell size={18} />
          <span className="dashboard-header__notification-badge">3</span>
        </button>

        {/* Profile dropdown */}
        <div className="dashboard-header__profile">
          <button
            className="dashboard-header__profile-trigger"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            aria-label="User menu"
          >
            <div className="dashboard-header__avatar">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="User avatar"
                className="dashboard-header__avatar-image"
              />
              <div className="dashboard-header__avatar-status"></div>
            </div>
            <div className="dashboard-header__user-info">
              <span className="dashboard-header__user-name">John Doe</span>
              <span className="dashboard-header__user-role">Premium User</span>
            </div>
            <ChevronDown
              size={16}
              className={`dashboard-header__dropdown-arrow ${isProfileMenuOpen ? 'dashboard-header__dropdown-arrow--open' : ''}`}
            />
          </button>

          {/* Profile dropdown menu */}
          {isProfileMenuOpen && (
            <div className="dashboard-header__dropdown">
              <div className="dashboard-header__dropdown-header">
                <div className="dashboard-header__dropdown-avatar">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="User avatar"
                  />
                </div>
                <div>
                  <div className="dashboard-header__dropdown-name">
                    John Doe
                  </div>
                  <div className="dashboard-header__dropdown-email">
                    john@example.com
                  </div>
                </div>
              </div>

              <div className="dashboard-header__dropdown-section">
                <button className="dashboard-header__dropdown-item">
                  <User size={16} />
                  <span>Profile</span>
                </button>
                <button className="dashboard-header__dropdown-item">
                  <Settings size={16} />
                  <span>Settings</span>
                </button>
                <button className="dashboard-header__dropdown-item">
                  <HelpCircle size={16} />
                  <span>Help & Support</span>
                </button>
              </div>

              <div className="dashboard-header__dropdown-section">
                <button className="dashboard-header__dropdown-item dashboard-header__dropdown-item--danger">
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

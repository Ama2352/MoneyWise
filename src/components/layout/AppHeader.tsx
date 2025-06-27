import React from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useLanguageContext } from '../../contexts';
import { CurrencySelector } from '../ui';
import { LANGUAGE_OPTIONS } from '../../constants';
import { useAuthContext } from '../../contexts/AuthContext';
import './AppHeader.css';

interface AppHeaderProps {
  onMobileMenuToggle: () => void;
  sidebarCollapsed: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onMobileMenuToggle }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const { language, setLanguage, translations } = useLanguageContext();
  const { logout, userProfile } = useAuthContext();
  const navigate = useNavigate();

  // Get display data from userProfile (AuthContext)
  const displayName = userProfile?.displayName || 
                     `${userProfile?.firstName || ''} ${userProfile?.lastName || ''}`.trim() || 
                     'User';
  const userEmail = userProfile?.email || 'user@example.com';
  const avatarSrc = userProfile?.avatar || 
                   "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        !target.closest('.app-header__language') &&
        !target.closest('.app-header__profile')
      ) {
        setIsLanguageMenuOpen(false);
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Here you would implement your theme switching logic
  };

  // Navigation handlers
  const handleProfileClick = () => {
    setIsProfileMenuOpen(false);
    navigate('/settings');
  };

  const handleSettingsClick = () => {
    setIsProfileMenuOpen(false);
    navigate('/settings');
  };

  const handleHelpClick = () => {
    setIsProfileMenuOpen(false);
    // Navigate to help page or open help modal
    console.log('Help & Support clicked');
  };

  const handleLogout = () => {
    setIsProfileMenuOpen(false);
    logout(true);
  };

  return (
    <header className="app-header">
      <div className="app-header__left">
        {/* Mobile menu button */}
        <button
          className="app-header__mobile-menu"
          onClick={onMobileMenuToggle}
          aria-label="Toggle mobile menu"
        >
          <Menu size={20} />
        </button>

        {/* Search */}
        <div className="app-header__search">
          <Search size={18} className="app-header__search-icon" />{' '}
          <input
            type="text"
            placeholder={translations.common.searchPlaceholder}
            className="app-header__search-input"
          />
          <kbd className="app-header__search-kbd">âŒ˜K</kbd>
        </div>
      </div>

      <div className="app-header__right">
        {/* Theme toggle */}
        <button
          className="app-header__action"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}{' '}
        </button>{' '}
        {/* Language selector */}
        <div className="app-header__language">
          {' '}
          <button
            className="app-header__language-trigger"
            onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
            aria-label={translations.language.switchTo}
          >
            {' '}
            <div className="app-header__language-display">
              <span className="app-header__language-code">
                {language.toUpperCase()}
              </span>
            </div>
            <ChevronDown
              size={14}
              className={`app-header__language-chevron ${
                isLanguageMenuOpen ? 'app-header__language-chevron--open' : ''
              }`}
            />
          </button>
          {/* Language dropdown menu */}
          {isLanguageMenuOpen && (
            <div className="app-header__language-dropdown">
              <div className="app-header__language-dropdown-header">
                <Globe
                  size={16}
                  className="app-header__language-dropdown-icon"
                />{' '}
                <span className="app-header__language-dropdown-title">
                  {translations.language.selectLanguage}
                </span>
              </div>
              <div className="app-header__language-options">
                {LANGUAGE_OPTIONS.map(langOption => (
                  <button
                    key={langOption.code}
                    className={`app-header__language-option ${
                      language === langOption.code
                        ? 'app-header__language-option--active'
                        : ''
                    }`}
                    onClick={() => {
                      setLanguage(langOption.code);
                      setIsLanguageMenuOpen(false);
                    }}
                  >
                    {' '}
                    <div className="app-header__language-option-content">
                      <div className="app-header__language-option-text">
                        <span className="app-header__language-option-name">
                          {langOption.name}
                        </span>
                        <span className="app-header__language-option-code">
                          {langOption.code.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    {language === langOption.code && (
                      <div className="app-header__language-option-check">✓</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}{' '}
        </div>
        {/* Currency selector */}
        <CurrencySelector />
        {/* Notifications */}
        <button className="app-header__action app-header__notifications">
          <Bell size={18} />
          <span className="app-header__notification-badge">3</span>
        </button>
        {/* Profile dropdown */}
        <div className="app-header__profile">
          <button
            className="app-header__profile-trigger"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            aria-label="User menu"
          >
            <div className="app-header__avatar">
              <img
                src={avatarSrc}
                alt="User avatar"
                className="app-header__avatar-image"
              />
              <div className="app-header__avatar-status"></div>
            </div>
            <div className="app-header__user-info">
              <span className="app-header__user-name">{displayName}</span>
              <span className="app-header__user-role">Premium User</span>
            </div>
            <ChevronDown
              size={16}
              className={`app-header__dropdown-arrow ${isProfileMenuOpen ? 'app-header__dropdown-arrow--open' : ''}`}
            />
          </button>

          {/* Profile dropdown menu */}
          {isProfileMenuOpen && (
            <div className="app-header__dropdown">
              <div className="app-header__dropdown-header">
                <div className="app-header__dropdown-avatar">
                  <img
                    src={avatarSrc}
                    alt="User avatar"
                  />
                </div>
                <div>
                  <div className="app-header__dropdown-name">{displayName}</div>
                  <div className="app-header__dropdown-email">
                    {userEmail}
                  </div>
                </div>
              </div>{' '}
              <div className="app-header__dropdown-section">
                <button 
                  className="app-header__dropdown-item"
                  onClick={handleProfileClick}
                >
                  <User size={16} />
                  <span>{translations.common.profile}</span>
                </button>
                <button 
                  className="app-header__dropdown-item"
                  onClick={handleSettingsClick}
                >
                  <Settings size={16} />
                  <span>{translations.common.settings}</span>
                </button>
                <button 
                  className="app-header__dropdown-item"
                  onClick={handleHelpClick}
                >
                  <HelpCircle size={16} />
                  <span>{translations.common.helpSupport}</span>
                </button>
              </div>
              <div className="app-header__dropdown-section">
                <button
                  className="app-header__dropdown-item app-header__dropdown-item--danger"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  <span>{translations.common.signOut}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;

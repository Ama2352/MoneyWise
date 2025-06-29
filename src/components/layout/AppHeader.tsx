import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Menu, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { CurrencySelector, LanguageSelector } from '../ui';
import './AppHeader.css';
import { useProfile } from '../../hooks';
import { useLanguageContext } from '../../contexts';

interface AppHeaderProps {
  onMobileMenuToggle: () => void;
  sidebarCollapsed: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onMobileMenuToggle }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);
  const { logout } = useAuthContext();
  const { userProfile } = useProfile();
  const { translations } = useLanguageContext();
  const navigate = useNavigate();

  // Get display data from userProfile (AuthContext)
  const displayName =
    userProfile?.displayName ||
    `${userProfile?.firstName || ''} ${userProfile?.lastName || ''}`.trim() ||
    'User';
  const userEmail = userProfile?.email || 'user@example.com';
  const avatarSrc = userProfile?.avatarUrl || '/default-avatar.png'; // Use a default avatar image if none exists
  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.app-header__profile')) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navigation handlers
  const handleProfileClick = () => {
    setIsProfileMenuOpen(false);
    navigate('/settings');
  };

  const handleSettingsClick = () => {
    setIsProfileMenuOpen(false);
    navigate('/settings');
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
      </div>

      <div className="app-header__right">
        {/* Language selector */}
        <LanguageSelector />
        {/* Currency selector */}
        <CurrencySelector />
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
              <span className="app-header__user-status">
                {translations.header.userStatus}
              </span>
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
                  <img src={avatarSrc} alt="User avatar" />
                </div>
                <div>
                  <div className="app-header__dropdown-name">{displayName}</div>
                  <div className="app-header__dropdown-email">{userEmail}</div>
                </div>
              </div>
              <div className="app-header__dropdown-section">
                <button
                  className="app-header__dropdown-item"
                  onClick={handleProfileClick}
                >
                  <User size={16} />
                  <span>Profile</span>
                </button>
                <button
                  className="app-header__dropdown-item"
                  onClick={handleSettingsClick}
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </button>
              </div>
              <div className="app-header__dropdown-section">
                <button
                  className="app-header__dropdown-item app-header__dropdown-item--danger"
                  onClick={handleLogout}
                >
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

export default AppHeader;

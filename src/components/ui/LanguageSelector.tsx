import React from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useLanguageContext } from '../../contexts';
import { LANGUAGE_OPTIONS } from '../../constants';
import './LanguageSelector.css';

const LanguageSelector: React.FC = () => {
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = React.useState(false);
  const { language, setLanguage, translations } = useLanguageContext();

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.app-header__language')) {
        setIsLanguageMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="app-header__language">
      <button
        className="app-header__language-trigger"
        onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
        aria-label={translations.language.switchTo}
      >
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
      {isLanguageMenuOpen && (
        <div className="app-header__language-dropdown">
          <div className="app-header__language-dropdown-header">
            <Globe size={16} className="app-header__language-dropdown-icon" />
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
      )}
    </div>
  );
};

export default LanguageSelector;

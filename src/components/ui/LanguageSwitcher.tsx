import React from 'react';
import { useLanguageContext } from '../../contexts';
import { LANGUAGE_OPTIONS } from '../../constants';
import type { Language } from '../../types';
import './LanguageSwitcher.css';

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'toggle' | 'buttons';
  className?: string;
  showFlag?: boolean;
  showText?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'toggle',
  className = '',
  showFlag = true,
  showText = true,
}) => {
  const { language, setLanguage, toggleLanguage, isLoading } =
    useLanguageContext();

  const handleLanguageChange = (newLanguage: Language) => {
    if (newLanguage !== language) {
      setLanguage(newLanguage);
    }
  };

  if (variant === 'toggle') {
    return (
      <button
        className={`language-switcher language-switcher--toggle ${className}`}
        onClick={toggleLanguage}
        disabled={isLoading}
        aria-label="Toggle language"
      >
        {isLoading ? (
          <span className="language-switcher__loading">⏳</span>
        ) : (
          <>
            {showFlag && (
              <span className="language-switcher__flag">
                {LANGUAGE_OPTIONS.find(lang => lang.code === language)?.flag}
              </span>
            )}
            {showText && (
              <span className="language-switcher__text">
                {LANGUAGE_OPTIONS.find(lang => lang.code === language)?.name}
              </span>
            )}
          </>
        )}
      </button>
    );
  }

  if (variant === 'buttons') {
    return (
      <div
        className={`language-switcher language-switcher--buttons ${className}`}
      >
        {LANGUAGE_OPTIONS.map(lang => (
          <button
            key={lang.code}
            className={`language-switcher__button ${
              language === lang.code ? 'active' : ''
            }`}
            onClick={() => handleLanguageChange(lang.code)}
            disabled={isLoading}
            aria-label={`Switch to ${lang.name}`}
          >
            {showFlag && (
              <span className="language-switcher__flag">{lang.flag}</span>
            )}
            {showText && (
              <span className="language-switcher__text">{lang.name}</span>
            )}
          </button>
        ))}
      </div>
    );
  }

  // Dropdown variant
  return (
    <div
      className={`language-switcher language-switcher--dropdown ${className}`}
    >
      <select
        value={language}
        onChange={e => handleLanguageChange(e.target.value as Language)}
        disabled={isLoading}
        className="language-switcher__select"
        aria-label="Select language"
      >
        {LANGUAGE_OPTIONS.map(lang => (
          <option key={lang.code} value={lang.code}>
            {showFlag ? `${lang.flag} ` : ''}
            {showText ? lang.name : lang.code}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;

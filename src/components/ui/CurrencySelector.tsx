import React, { useState, useEffect } from 'react';
import { ChevronDown, DollarSign } from 'lucide-react';
import { useCurrencyContext, useLanguageContext } from '../../contexts';
import { CURRENCY_INFO } from '../../constants';
import './CurrencySelector.css';

interface CurrencySelectorProps {
  className?: string;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  className = '',
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { currency, setCurrency } = useCurrencyContext();
  const { t } = useLanguageContext();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.currency-selector')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentCurrency = CURRENCY_INFO[currency];

  // Create currency options from CURRENCY_INFO
  const currencyOptions = Object.values(CURRENCY_INFO);

  return (
    <div className={`currency-selector ${className}`}>
      <button
        className="currency-selector__trigger"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        aria-label={t ? t('currency.switchTo') : 'Change currency'}
      >
        <div className="currency-selector__display">
          <span className="currency-selector__code">
            {currency.toUpperCase()}
          </span>
        </div>
        <ChevronDown
          size={14}
          className={`currency-selector__chevron ${
            isDropdownOpen ? 'currency-selector__chevron--open' : ''
          }`}
        />
      </button>

      {/* Currency dropdown menu */}
      {isDropdownOpen && (
        <div className="currency-selector__dropdown">
          <div className="currency-selector__dropdown-header">
            <DollarSign
              size={16}
              className="currency-selector__dropdown-icon"
            />{' '}
            <span className="currency-selector__dropdown-title">
              {t ? t('currency.selectCurrency') : 'Select Currency'}
            </span>
          </div>
          <div className="currency-selector__options">
            {currencyOptions.map(option => (
              <button
                key={option.code}
                className={`currency-selector__option ${
                  currency === option.code
                    ? 'currency-selector__option--active'
                    : ''
                }`}
                onClick={() => {
                  setCurrency(option.code);
                  setIsDropdownOpen(false);
                }}
              >
                {' '}
                <div className="currency-selector__option-content">
                  <div className="currency-selector__option-text">
                    <span className="currency-selector__option-name">
                      {option.name}
                    </span>
                    <span className="currency-selector__option-symbol">
                      {option.symbol} • {option.code.toUpperCase()}
                    </span>
                  </div>
                </div>
                {currency === option.code && (
                  <div className="currency-selector__option-check">✓</div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;

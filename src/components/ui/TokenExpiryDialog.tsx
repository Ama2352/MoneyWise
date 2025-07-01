import React from 'react';
import { Button } from '../ui';
import './TokenExpiryDialog.css';
import { useLanguageContext } from '../../contexts/LanguageContext';

interface TokenExpiryDialogProps {
  isOpen: boolean;
  onStayLoggedIn: () => void;
  onLogout: () => void;
}

export const TokenExpiryDialog: React.FC<TokenExpiryDialogProps> = ({
  isOpen,
  onStayLoggedIn,
  onLogout,
}) => {
  const { translations } = useLanguageContext();
  if (!isOpen) return null;

  return (
    <div className="token-expiry-overlay">
      <div className="token-expiry-dialog">
        <div className="token-expiry-header">
          <h3 className="token-expiry-title">{translations.auth.sessionExpired}</h3>
          <p className="token-expiry-message">
            {translations.auth.sessionExpiredMessage}
          </p>
        </div>

        <div className="token-expiry-actions">
          <Button
            variant="secondary"
            onClick={onStayLoggedIn}
            className="token-expiry-button"
          >
            {translations.auth.stayLoggedIn}
          </Button>
          <Button
            variant="primary"
            onClick={onLogout}
            className="token-expiry-button"
          >
            {translations.auth.logout}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TokenExpiryDialog;

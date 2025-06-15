import React from 'react';
import { Button } from '../ui';
import './TokenExpiryDialog.css';

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
  if (!isOpen) return null;

  return (
    <div className="token-expiry-overlay">
      <div className="token-expiry-dialog">
        <div className="token-expiry-header">
          <h3 className="token-expiry-title">Session Expired</h3>
          <p className="token-expiry-message">
            Your session has expired. Would you like to stay logged in or log
            out?
          </p>
        </div>

        <div className="token-expiry-actions">
          {' '}
          <Button
            variant="secondary"
            onClick={onStayLoggedIn}
            className="token-expiry-button"
          >
            Stay Logged In
          </Button>
          <Button
            variant="primary"
            onClick={onLogout}
            className="token-expiry-button"
          >
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TokenExpiryDialog;

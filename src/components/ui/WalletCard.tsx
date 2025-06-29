/**
 * WalletCard Component - Individual wallet display card
 */

import React from 'react';
import { Wallet as WalletIcon, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { useCurrencyContext } from '../../contexts/CurrencyContext';
import { CurrencyAmount } from '../ui/CurrencyAmount';
import type { Wallet } from '../../types/finance';
import './WalletCard.css';

interface WalletCardProps {
  wallet: Wallet;
  onEdit: (wallet: Wallet) => void;
  onDelete: (wallet: Wallet) => void;
  className?: string;
}

export const WalletCard: React.FC<WalletCardProps> = ({
  wallet,
  onEdit,
  onDelete,
  className = '',
}) => {
  const { currency } = useCurrencyContext();

  const [showMenu, setShowMenu] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleEdit = React.useCallback(() => {
    onEdit(wallet);
    setShowMenu(false);
  }, [wallet, onEdit]);

  const handleDelete = React.useCallback(() => {
    onDelete(wallet);
    setShowMenu(false);
  }, [wallet, onDelete]);

  return (
    <div className={`wallet-card ${className}`}>
      <div className="wallet-card-header">
        <div className="wallet-card-icon">
          <WalletIcon size={24} />
        </div>
        <div className="wallet-card-menu" ref={menuRef}>
          <button
            className="wallet-card-menu-trigger"
            onClick={() => setShowMenu(!showMenu)}
            aria-label="Wallet options"
          >
            <MoreHorizontal size={20} />
          </button>
          {showMenu && (
            <div className="wallet-card-menu-dropdown">
              <button className="wallet-card-menu-item" onClick={handleEdit}>
                <Edit size={16} />
                Edit
              </button>
              <button className="wallet-card-menu-item danger" onClick={handleDelete}>
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="wallet-card-body">
        <h3 className="wallet-card-name" title={wallet.walletName}>
          {wallet.walletName}
        </h3>
        
        <div className="wallet-card-balance">
          <CurrencyAmount amountInVnd={wallet.balance} />
        </div>

        <div className="wallet-card-meta">
          <span className="wallet-card-currency">{currency}</span>
        </div>
      </div>
    </div>
  );
};

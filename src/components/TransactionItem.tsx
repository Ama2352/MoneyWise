import React from 'react';
import { Edit3, Trash2, MoreHorizontal } from 'lucide-react';
import { useLanguageContext } from '../contexts';
import { CategoryIcon, CurrencyAmountWithSign } from './ui';
import { useDateFormatter } from '../hooks/useDateFormatter';
import type { Transaction, Category, Wallet } from '../types';

interface TransactionItemProps {
  transaction: Transaction;
  category?: Category;
  wallet?: Wallet;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  categoriesLoading?: boolean;
  walletsLoading?: boolean;
}

export const TransactionItem: React.FC<TransactionItemProps> = React.memo(
  ({
    transaction,
    category,
    wallet,
    onEdit,
    onDelete,
    categoriesLoading,
    walletsLoading,
  }) => {
    const { translations } = useLanguageContext();
    const { formatDate } = useDateFormatter();

    return (
      <div className="transaction-item">
        <div className="transaction-icon">
          {category?.name ? (
            <CategoryIcon
              categoryName={category.name}
              withWrapper={true}
              useColorScheme={true}
            />
          ) : (
            <div className="transaction-icon-fallback">
              <MoreHorizontal size={24} />
            </div>
          )}
        </div>{' '}
        <div className="transaction-details">
          <h4 className="transaction-description">{transaction.description}</h4>
          <div className="transaction-meta">
            <span className="transaction-category">
              {categoriesLoading
                ? translations.common.loading
                : category?.name || translations.transactions.unknownCategory}
            </span>
            <span className="transaction-separator">•</span>
            <span className="transaction-wallet">
              {walletsLoading
                ? translations.common.loading
                : wallet?.walletName || translations.transactions.unknownWallet}
            </span>
            <span className="transaction-separator">•</span>
            <span className="transaction-date">
              {formatDate(transaction.transactionDate)}
            </span>{' '}
          </div>
        </div>
        <div className="transaction-amount-section">
          {' '}
          <div
            className={`transaction-amount transaction-amount--${transaction.type}`}
          >
            {' '}
            <CurrencyAmountWithSign
              amountInVnd={transaction.amount}
              type={transaction.type as 'income' | 'expense'}
            />
          </div>
        </div>
        <div className="transaction-actions">
          <button
            className="action-btn"
            onClick={() => onEdit(transaction)}
            title={translations.common.edit}
          >
            <Edit3 size={16} />
          </button>
          <button
            className="action-btn action-btn--danger"
            onClick={() => onDelete(transaction)}
            title={translations.common.delete}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    );
  }
);

TransactionItem.displayName = 'TransactionItem';

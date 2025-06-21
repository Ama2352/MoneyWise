import React from 'react';
import { Edit3, Trash2, MoreHorizontal } from 'lucide-react';
import { useLanguageContext } from '../contexts';
import { CategoryIcon, CurrencyAmountWithSign } from './ui';
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
    const { t } = useLanguageContext();

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
                ? t('common.loading')
                : category?.name || t('transactions.unknownCategory')}
            </span>
            <span className="transaction-separator">•</span>
            <span className="transaction-wallet">
              {walletsLoading
                ? t('common.loading')
                : wallet?.walletName || t('transactions.unknownWallet')}
            </span>
            <span className="transaction-separator">•</span>
            <span className="transaction-date">
              {new Date(transaction.transactionDate).toLocaleDateString()}
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
            title={t('common.edit')}
          >
            <Edit3 size={16} />
          </button>
          <button
            className="action-btn action-btn--danger"
            onClick={() => onDelete(transaction)}
            title={t('common.delete')}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    );
  }
);

TransactionItem.displayName = 'TransactionItem';

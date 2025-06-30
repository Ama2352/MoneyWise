/**
 * Budget Card Component
 */

import React, { useMemo, useState, useEffect } from 'react';
import {
  Target,
  Calendar,
  Edit2,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  BarChart3,
  TrendingDown,
} from 'lucide-react';
import { useLanguageContext } from '../../contexts/LanguageContext';
import { useCurrencyContext } from '../../contexts/CurrencyContext';
import { CategoryIcon } from '../ui/CategoryIcon';
import { formatDateForLanguage } from '../../utils/dateUtils';
import type { BudgetProgress, Category, Wallet } from '../../types/finance';
import './BudgetCard.css';

interface BudgetCardProps {
  budget: BudgetProgress;
  category?: Category;
  wallet?: Wallet;
  onEdit: (budget: BudgetProgress) => void;
  onDelete: (budget: BudgetProgress) => void;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({
  budget,
  category,
  wallet,
  onEdit,
  onDelete,
}) => {
  const { translations, language } = useLanguageContext();
  const { convertAndFormat } = useCurrencyContext();

  // State for formatted currency values
  const [formattedAmounts, setFormattedAmounts] = useState({
    currentSpending: '',
    limitAmount: '',
    remainingAmount: '',
  });

  // Calculate progress and remaining days
  const progressData = useMemo(() => {
    const limitAmount = budget.limitAmount || 0;
    const currentSpending = budget.currentSpending || 0;
    const percentage = Math.min(budget.usagePercentage, 100);

    const endDate = new Date(budget.endDate);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const isCompleted = percentage >= 100;
    const isOverdue = daysRemaining < 0 && !isCompleted;

    return {
      percentage: Math.min(percentage, 100),
      daysRemaining,
      isCompleted,
      isOverdue,
      remainingAmount: Math.max(limitAmount - currentSpending, 0),
    };
  }, [budget.limitAmount, budget.currentSpending, budget.endDate]);

  // Format currency values asynchronously
  useEffect(() => {
    const formatAmounts = async () => {
      try {
        const [formattedSpending, formattedLimit, formattedRemaining] =
          await Promise.all([
            convertAndFormat(budget.currentSpending),
            convertAndFormat(budget.limitAmount),
            convertAndFormat(progressData.remainingAmount),
          ]);

        setFormattedAmounts({
          currentSpending: formattedSpending,
          limitAmount: formattedLimit,
          remainingAmount: formattedRemaining,
        });
      } catch (error) {
        console.error('Error formatting currency amounts:', error);
        setFormattedAmounts({
          currentSpending: budget.currentSpending.toString(),
          limitAmount: budget.limitAmount.toString(),
          remainingAmount: progressData.remainingAmount.toString(),
        });
      }
    };

    formatAmounts();
  }, [
    budget.currentSpending,
    budget.limitAmount,
    progressData.remainingAmount,
    convertAndFormat,
  ]);

  // Get status icon and color based on backend status
  const getStatusInfo = useMemo(() => {
    const status = budget.progressStatus?.toLowerCase() || '';

    // Map backend status to UI elements (including Vietnamese)
    switch (status) {
      case 'not started':
      case 'chưa bắt đầu':
        return {
          icon: Clock,
          color: 'warning',
          text: translations.budgets.status.notStarted,
        };
      case 'over budget':
      case 'vượt ngân sách':
        return {
          icon: AlertTriangle,
          color: 'danger',
          text: translations.budgets.status.overBudget,
        };
      case 'nearly maxed':
      case 'gần hết hạn':
        return {
          icon: Clock,
          color: 'warning',
          text: translations.budgets.status.nearlyMaxed,
        };
      case 'under budget':
      case 'dưới ngân sách':
        return {
          icon: CheckCircle,
          color: 'success',
          text: translations.budgets.status.underBudget,
        };
      case 'critical':
      case 'nguy hiểm':
        return {
          icon: AlertTriangle,
          color: 'danger',
          text: translations.budgets.status.critical,
        };
      case 'warning':
      case 'cảnh báo':
        return {
          icon: AlertTriangle,
          color: 'warning',
          text: translations.budgets.status.warning,
        };
      case 'on track':
      case 'đúng tiến độ':
        return {
          icon: Target,
          color: 'safe',
          text: translations.budgets.status.onTrack,
        };
      case 'minimal spending':
      case 'chi tiêu tối thiểu':
        return {
          icon: TrendingDown,
          color: 'info',
          text: translations.budgets.status.minimalSpending,
        };
      default:
        // Fallback to old logic for backward compatibility
        if (progressData.isCompleted) {
          return {
            icon: CheckCircle,
            color: 'success',
            text: translations.budgets.completed,
          };
        }

        if (progressData.isOverdue) {
          return {
            icon: AlertTriangle,
            color: 'danger',
            text: translations.budgets.status.critical,
          };
        }

        return {
          icon: Target,
          color: 'safe',
          text: translations.budgets.status.onTrack,
        };
    }
  }, [
    budget.progressStatus,
    progressData.isCompleted,
    progressData.isOverdue,
    translations.budgets,
  ]);

  const statusInfo = getStatusInfo;
  const StatusIcon = statusInfo.icon;

  // Format date for display
  const formatDate = (dateString: string) => {
    return formatDateForLanguage(dateString, language);
  };

  return (
    <div className={`budget-card budget-card--${statusInfo.color}`}>
      {/* Header */}
      <div className="budget-card__header">
        <div className="budget-card__icon">
          {category ? (
            <CategoryIcon categoryName={category.name} size={24} />
          ) : (
            <BarChart3 size={24} />
          )}
        </div>

        <div className="budget-card__title-section">
          <h3 className="budget-card__title">{budget.description}</h3>
          <div className="budget-card__meta">
            <span className="budget-card__category">
              {category?.name || 'Unknown Category'}
            </span>
            {wallet && (
              <>
                <span className="budget-card__separator">•</span>
                <span className="budget-card__wallet">{wallet.walletName}</span>
              </>
            )}
          </div>
        </div>

        <div className="budget-card__actions">
          <button
            className="budget-card__action-btn"
            onClick={() => onEdit(budget)}
            title={translations.budgets.edit}
          >
            <Edit2 size={16} />
          </button>
          <button
            className="budget-card__action-btn budget-card__action-btn--danger"
            onClick={() => onDelete(budget)}
            title={translations.budgets.delete}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Progress Section */}
      <div className="budget-card__progress">
        {/* Amount Progress */}
        <div className="budget-card__amounts">
          <div className="budget-card__amount-item">
            <span className="budget-card__amount-label">
              {translations.budgets.currentSpending}
            </span>
            <span className="budget-card__amount-value">
              {formattedAmounts.currentSpending}
            </span>
          </div>
          <div className="budget-card__amount-separator">/</div>
          <div className="budget-card__amount-item">
            <span className="budget-card__amount-label">
              {translations.budgets.limitAmount}
            </span>
            <span className="budget-card__amount-value">
              {formattedAmounts.limitAmount}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="budget-card__progress-bar-container">
          <div className="budget-card__progress-bar">
            <div
              className={`budget-card__progress-fill budget-card__progress-fill--${statusInfo.color}`}
              style={{ width: `${progressData.percentage}%` }}
            />
          </div>
          <span className="budget-card__progress-text">
            {progressData.percentage.toFixed(1)}%
          </span>
        </div>

        {/* Remaining Info */}
        {!progressData.isCompleted && (
          <div className="budget-card__remaining">
            <span className="budget-card__remaining-amount">
              {formattedAmounts.remainingAmount} {translations.budgets?.remaining || translations.common.remaining}
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="budget-card__footer">
        {/* Status */}
        <div
          className={`budget-card__status budget-card__status--${statusInfo.color}`}
        >
          <StatusIcon size={16} />
          <span>{budget.progressStatus || statusInfo.text}</span>
        </div>

        {/* Date Info */}
        <div className="budget-card__date-info">
          <Calendar size={14} />
          {progressData.isOverdue ? (
            <span className="budget-card__overdue">
              {translations.budgets.daysOverdue
                ? translations.budgets.daysOverdue.replace('{n}', String(Math.abs(progressData.daysRemaining)))
                : `${Math.abs(progressData.daysRemaining)} days overdue`}
            </span>
          ) : progressData.isCompleted ? (
            <span className="budget-card__completed">
              {formatDate(budget.endDate)}
            </span>
          ) : (
            <span>
              {progressData.daysRemaining} {translations.budgets.daysRemaining}
            </span>
          )}
        </div>
      </div>

      {/* Notification */}
      {budget.notification && (
        <div className="budget-card__notification">{budget.notification}</div>
      )}
    </div>
  );
};

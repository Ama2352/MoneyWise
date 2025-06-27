/**
 * Saving Goal Card Component
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
} from 'lucide-react';
import { useLanguageContext } from '../../contexts/LanguageContext';
import { useCurrencyContext } from '../../contexts/CurrencyContext';
import { CategoryIcon } from '../ui/CategoryIcon';
import type { SavingGoalProgress, Category, Wallet } from '../../types/finance';
import './SavingGoalCard.css';

interface SavingGoalCardProps {
  goal: SavingGoalProgress;
  category?: Category;
  wallet?: Wallet;
  onEdit: (goal: SavingGoalProgress) => void;
  onDelete: (goal: SavingGoalProgress) => void;
}

export const SavingGoalCard: React.FC<SavingGoalCardProps> = ({
  goal,
  category,
  wallet,
  onEdit,
  onDelete,
}) => {
  const { translations } = useLanguageContext();
  const { convertAndFormat } = useCurrencyContext();

  // State for formatted currency values
  const [formattedAmounts, setFormattedAmounts] = useState({
    savedAmount: '',
    targetAmount: '',
    remainingAmount: '',
  });

  // Calculate progress and remaining days
  const progressData = useMemo(() => {
    const targetAmount = goal.targetAmount || 0;
    const savedAmount = goal.savedAmount || 0;
    const percentage = targetAmount > 0 ? (savedAmount / targetAmount) * 100 : 0;
    
    const endDate = new Date(goal.endDate);
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
      remainingAmount: Math.max(targetAmount - savedAmount, 0),
    };
  }, [goal.targetAmount, goal.savedAmount, goal.endDate]);

  // Format currency values asynchronously
  useEffect(() => {
    const formatAmounts = async () => {
      try {
        const [formattedSaved, formattedTarget, formattedRemaining] = await Promise.all([
          convertAndFormat(goal.savedAmount),
          convertAndFormat(goal.targetAmount),
          convertAndFormat(progressData.remainingAmount),
        ]);
        
        setFormattedAmounts({
          savedAmount: formattedSaved,
          targetAmount: formattedTarget,
          remainingAmount: formattedRemaining,
        });
      } catch (error) {
        console.error('Error formatting currency amounts:', error);
        setFormattedAmounts({
          savedAmount: goal.savedAmount.toString(),
          targetAmount: goal.targetAmount.toString(),
          remainingAmount: progressData.remainingAmount.toString(),
        });
      }
    };

    formatAmounts();
  }, [goal.savedAmount, goal.targetAmount, progressData.remainingAmount, convertAndFormat]);

  // Get status icon and color based on backend status
  const getStatusInfo = useMemo(() => {
    const status = goal.progressStatus?.toLowerCase() || '';
    
    // Map backend status to UI elements
    switch (status) {
      case 'not started':
      case 'chưa bắt đầu':
        return {
          icon: Clock,
          color: 'warning',
          text: translations.savingGoals.status.notStarted,
        };
      case 'achieved':
      case 'đã đạt được':
        return {
          icon: CheckCircle,
          color: 'success',
          text: translations.savingGoals.status.achieved,
        };
      case 'partially achieved':
      case 'đạt một phần':
        return {
          icon: CheckCircle,
          color: 'warning',
          text: translations.savingGoals.status.partiallyAchieved,
        };
      case 'missed target':
      case 'không đạt mục tiêu':
        return {
          icon: AlertTriangle,
          color: 'danger',
          text: translations.savingGoals.status.missedTarget,
        };
      case 'achieved early':
      case 'đạt sớm':
        return {
          icon: CheckCircle,
          color: 'success',
          text: translations.savingGoals.status.achievedEarly,
        };
      case 'ahead':
      case 'tiến trước':
        return {
          icon: TrendingUp,
          color: 'success',
          text: translations.savingGoals.status.ahead,
        };
      case 'on track':
      case 'đúng tiến độ':
        return {
          icon: Target,
          color: 'safe',
          text: translations.savingGoals.status.onTrack,
        };
      case 'slightly behind':
      case 'hơi chậm':
        return {
          icon: Clock,
          color: 'warning',
          text: translations.savingGoals.status.slightlyBehind,
        };
      case 'at risk':
      case 'rủi ro':
        return {
          icon: AlertTriangle,
          color: 'danger',
          text: translations.savingGoals.status.atRisk,
        };
      default:
        // Fallback to old logic for backward compatibility
        if (progressData.isCompleted) {
          return {
            icon: CheckCircle,
            color: 'success',
            text: translations.savingGoals.completed,
          };
        }
        
        if (progressData.isOverdue) {
          return {
            icon: AlertTriangle,
            color: 'danger',
            text: translations.savingGoals.status.danger,
          };
        }
        
        return {
          icon: Target,
          color: 'safe',
          text: translations.savingGoals.status.safe,
        };
    }
  }, [goal.progressStatus, progressData.isCompleted, progressData.isOverdue, translations.savingGoals]);

  const statusInfo = getStatusInfo;
  const StatusIcon = statusInfo.icon;

  // Format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className={`saving-goal-card saving-goal-card--${statusInfo.color}`}>
      {/* Header */}
      <div className="saving-goal-card__header">
        <div className="saving-goal-card__icon">
          {category ? (
            <CategoryIcon categoryName={category.name} size={24} />
          ) : (
            <Target size={24} />
          )}
        </div>
        
        <div className="saving-goal-card__title-section">
          <h3 className="saving-goal-card__title">{goal.description}</h3>
          <div className="saving-goal-card__meta">
            <span className="saving-goal-card__category">
              {category?.name || 'Unknown Category'}
            </span>
            {wallet && (
              <>
                <span className="saving-goal-card__separator">•</span>
                <span className="saving-goal-card__wallet">{wallet.walletName}</span>
              </>
            )}
          </div>
        </div>

        <div className="saving-goal-card__actions">
          <button
            className="saving-goal-card__action-btn"
            onClick={() => onEdit(goal)}
            title={translations.savingGoals.edit}
          >
            <Edit2 size={16} />
          </button>
          <button
            className="saving-goal-card__action-btn saving-goal-card__action-btn--danger"
            onClick={() => onDelete(goal)}
            title={translations.savingGoals.delete}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Progress Section */}
      <div className="saving-goal-card__progress-section">
        {/* Amount Progress */}
        <div className="saving-goal-card__amounts">
          <div className="saving-goal-card__amount-item">
            <span className="saving-goal-card__amount-label">
              {translations.savingGoals.savedAmount}
            </span>
            <span className="saving-goal-card__amount-value">
              {formattedAmounts.savedAmount}
            </span>
          </div>
          <div className="saving-goal-card__amount-separator">/</div>
          <div className="saving-goal-card__amount-item">
            <span className="saving-goal-card__amount-label">
              {translations.savingGoals.targetAmount}
            </span>
            <span className="saving-goal-card__amount-value">
              {formattedAmounts.targetAmount}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="saving-goal-card__progress-bar-container">
          <div className="saving-goal-card__progress-bar">
            <div
              className={`saving-goal-card__progress-fill saving-goal-card__progress-fill--${statusInfo.color}`}
              style={{ width: `${progressData.percentage}%` }}
            />
          </div>
          <span className="saving-goal-card__progress-text">
            {progressData.percentage.toFixed(1)}%
          </span>
        </div>

        {/* Remaining Info */}
        {!progressData.isCompleted && (
          <div className="saving-goal-card__remaining">
            <span className="saving-goal-card__remaining-amount">
              {formattedAmounts.remainingAmount} remaining
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="saving-goal-card__footer">
        {/* Status */}
        <div className={`saving-goal-card__status saving-goal-card__status--${statusInfo.color}`}>
          <StatusIcon size={16} />
          <span>{statusInfo.text}</span>
        </div>

        {/* Date Info */}
        <div className="saving-goal-card__date-info">
          <Calendar size={14} />
          {progressData.isOverdue ? (
            <span className="saving-goal-card__overdue">
              {Math.abs(progressData.daysRemaining)} days overdue
            </span>
          ) : progressData.isCompleted ? (
            <span className="saving-goal-card__completed">
              {formatDate(goal.endDate)}
            </span>
          ) : (
            <span>
              {progressData.daysRemaining} {translations.savingGoals.daysRemaining}
            </span>
          )}
        </div>
      </div>

      {/* Notification */}
      {goal.notification && (
        <div className="saving-goal-card__notification">
          {goal.notification}
        </div>
      )}
    </div>
  );
};

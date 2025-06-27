import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react';
import { CurrencyAmountWithSign } from './CurrencyAmount';
import type { TransactionType } from '../../types';

interface StatCardProps {
  title: string;
  value: number;
  type?: TransactionType;
  icon: LucideIcon;
  change?: string;
  trend?: 'up' | 'down';
  color?: 'primary' | 'success' | 'error' | 'info' | 'warning';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  type,
  icon: Icon,
  change,
  trend,
  color = 'primary',
  className = '',
}) => {
  return (
    <div
      className={`modern-dashboard__stat-card modern-dashboard__stat-card--${color} ${className}`}
    >
      <div className="modern-dashboard__stat-header">
        <div className="modern-dashboard__stat-icon">
          <Icon size={24} />
        </div>
        <button className="modern-dashboard__stat-menu">
          <MoreHorizontal size={16} />
        </button>
      </div>
      <div className="modern-dashboard__stat-content">
        <h3 className="modern-dashboard__stat-title">{title}</h3>
        <div className="modern-dashboard__stat-value">
          <CurrencyAmountWithSign
            amountInVnd={value}
            type={type ? type : value >= 0 ? 'income' : 'expense'}
          />
        </div>
        {change && trend && (
          <div
            className={`modern-dashboard__stat-change modern-dashboard__stat-change--${trend}`}
          >
            {trend === 'up' ? (
              <ArrowUpRight size={16} />
            ) : (
              <ArrowDownRight size={16} />
            )}
            <span>{change} from last month</span>
          </div>
        )}
      </div>
    </div>
  );
};

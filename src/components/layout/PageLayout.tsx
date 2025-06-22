import React from 'react';
import { Loading } from '../ui';
import '../../styles/pages.css';

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  subtitle,
  action,
  isLoading,
  error,
  onRetry,
  children,
  className = '',
}) => {
  // Loading state
  if (isLoading) {
    return (
      <div className={`page-container ${className}`}>
        <div className="page-header">
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
        <div className="page-loading">
          <Loading />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`page-container ${className}`}>
        <div className="page-header">
          <h1 className="page-title">{title}</h1>
        </div>
        <div className="page-error">
          <div className="error-state">
            <h3>Error loading data</h3>
            <p>{error.message}</p>
            {onRetry && (
              <button className="btn btn--primary" onClick={onRetry}>
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Normal state
  return (
    <div className={`page-container ${className}`}>
      <div className="page-header">
        <div>
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
        {action && <div className="page-actions">{action}</div>}
      </div>
      <div className="page-content">{children}</div>
    </div>
  );
};

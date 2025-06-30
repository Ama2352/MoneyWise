import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout';
import {
  ModernDashboard,
  TransactionsPage,
  CategoriesPage,
  SettingsPage,
  AnalyticsPage,
  ReportsPage,
  SavingGoalsPage,
  BudgetsPage,
  WalletsPage,
} from '../pages';
import { ErrorBoundary } from '../components/ui';
import { ROUTES } from '../constants';
import '../styles/pages.css';

/**
 * Main router component for the dashboard application
 * Handles all routes within the root path structure
 */
const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        <Route path={ROUTES.DASHBOARD} element={<ModernDashboard />} />
        <Route path={ROUTES.TRANSACTIONS} element={<TransactionsPage />} />
        <Route path={ROUTES.WALLETS} element={<WalletsPage />} />{' '}
        <Route path={ROUTES.CATEGORIES} element={<CategoriesPage />} />{' '}
        <Route
          path={ROUTES.ANALYTICS}
          element={
            <ErrorBoundary>
              <AnalyticsPage />
            </ErrorBoundary>
          }
        />{' '}
        <Route path={ROUTES.REPORTS} element={<ReportsPage />} />
        <Route
          path={ROUTES.BUDGET}
          element={
            <ErrorBoundary>
              <BudgetsPage />
            </ErrorBoundary>
          }
        />{' '}
        <Route
          path={ROUTES.SAVING_GOALS}
          element={
            <ErrorBoundary>
              <SavingGoalsPage />
            </ErrorBoundary>
          }
        />{' '}
        <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;

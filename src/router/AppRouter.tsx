import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { BarChart3, FileText, PiggyBank, Target, Settings } from 'lucide-react';
import { AppLayout } from '../components/layout';
import {
  ModernDashboard,
  TransactionsPage,
  WalletsPage,
  CategoriesPage,
} from '../pages';
import { PlaceholderPage } from '../components/ui';
import '../styles/pages.css';
import { ROUTES } from '../constants';

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
            <PlaceholderPage
              title="Analytics"
              description="Deep insights into your financial habits with advanced charts and metrics"
              icon={BarChart3}
              comingSoon={true}
            />
          }
        />{' '}
        <Route
          path={ROUTES.REPORTS}
          element={
            <PlaceholderPage
              title="Reports"
              description="Generate detailed financial reports and export your data"
              icon={FileText}
              comingSoon={true}
            />
          }
        />
        <Route
          path={ROUTES.BUDGET}
          element={
            <PlaceholderPage
              title="Budget"
              description="Set spending limits and track your budget progress"
              icon={PiggyBank}
              comingSoon={true}
            />
          }
        />{' '}
        <Route
          path={ROUTES.SAVING_GOALS}
          element={
            <PlaceholderPage
              title="Saving Goals"
              description="Set and track your savings goals to achieve financial milestones"
              icon={Target}
              comingSoon={true}
            />
          }
        />{' '}
        <Route
          path={ROUTES.SETTINGS}
          element={
            <PlaceholderPage
              title="Settings"
              description="Customize your experience and manage account preferences"
              icon={Settings}
            />
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRouter;

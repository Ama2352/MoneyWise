/**
 * SWR Demo Component
 * Shows the difference between old useApi and new SWR hooks
 */

import React from 'react';
import { useCategories, useApi } from '../../hooks';
import { categoryApi } from '../../api/financeApi';
import { Card } from '../ui';

// Simple styles for demo
const demoCardStyle = {
  flex: 1,
  minHeight: '400px',
};

export const SWRExample: React.FC = () => {
  // Old way using useApi
  const {
    data: oldCategories,
    isLoading: oldLoading,
    error: oldError,
    refetch: oldRefetch,
  } = useApi(() => categoryApi.getAll(), []);

  // New way using SWR
  const {
    categories: newCategories,
    isLoading: newLoading,
    error: newError,
    refresh: newRefresh,
  } = useCategories();
  return (
    <div style={{ padding: '2rem', display: 'flex', gap: '2rem' }}>
      <div style={demoCardStyle}>
        <Card>
          <h3>🔴 Old useApi Hook</h3>
          <p>
            <strong>Status:</strong> {oldLoading ? 'Loading...' : 'Ready'}
          </p>
          <p>
            <strong>Data:</strong> {oldCategories?.length || 0} categories
          </p>
          <p>
            <strong>Error:</strong> {oldError || 'None'}
          </p>
          <button onClick={oldRefetch}>Manual Refresh</button>

          <h4>Issues:</h4>
          <ul>
            <li>❌ Each component makes separate API calls</li>
            <li>❌ No caching between components</li>
            <li>❌ Manual refresh only</li>
            <li>❌ No background updates</li>
          </ul>
        </Card>
      </div>

      <div style={demoCardStyle}>
        <Card>
          <h3>🟢 New SWR Hook</h3>
          <p>
            <strong>Status:</strong> {newLoading ? 'Loading...' : 'Ready'}
          </p>
          <p>
            <strong>Data:</strong> {newCategories?.length || 0} categories
          </p>
          <p>
            <strong>Error:</strong> {newError || 'None'}
          </p>
          <button onClick={newRefresh}>Manual Refresh</button>

          <h4>Benefits:</h4>
          <ul>
            <li>✅ Automatic caching and deduplication</li>
            <li>✅ Background refresh on focus</li>
            <li>✅ Shared data between components</li>
            <li>✅ Auto-retry on failure</li>
            <li>✅ Optimistic updates</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

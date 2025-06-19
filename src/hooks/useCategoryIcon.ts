/**
 * Category Icon Hook
 *
 * Custom hook for working with category icons and suggestions.
 * Provides easy access to icon functionality throughout the app.
 */

import { useMemo } from 'react';
import {
  getCategoryIcon,
  getCategorySuggestions,
  getCategoryColorScheme,
} from '../services/categoryIconService';
import type { LucideIcon } from 'lucide-react';

/**
 * Hook for category icon management
 */
export const useCategoryIcon = () => {
  // Memoize category suggestions to avoid recreation on every render
  const suggestions = useMemo(() => getCategorySuggestions(), []);

  /**
   * Get icon component for a category name
   */
  const getIcon = (categoryName: string): LucideIcon => {
    return getCategoryIcon(categoryName);
  };

  /**
   * Get color scheme for a category name
   */
  const getColorScheme = (categoryName: string) => {
    return getCategoryColorScheme(categoryName);
  };

  return {
    // Core functions
    getIcon,
    getColorScheme,

    // Suggestions
    suggestions,
  };
};

/**
 * CategoryIcon Component
 *
 * A reusable component for displaying category icons with consistent styling.
 * Automatically selects the appropriate icon based on category name.
 */

import React from 'react';
import {
  getCategoryIcon,
  getCategoryColorScheme,
} from '../../services/categoryIconService';

export interface CategoryIconProps {
  /** The category name to get icon for */
  categoryName: string;
  /** Icon size in pixels */
  size?: number;
  /** Additional CSS class names */
  className?: string;
  /** Whether to show icon in a styled wrapper */
  withWrapper?: boolean;
  /** Wrapper CSS class names */
  wrapperClassName?: string;
  /** Whether to use dynamic colors based on category name */
  useColorScheme?: boolean;
}

/**
 * CategoryIcon component with smart icon selection
 */
export const CategoryIcon: React.FC<CategoryIconProps> = ({
  categoryName,
  size = 24,
  className = '',
  withWrapper = false,
  wrapperClassName = '',
  useColorScheme = true,
}) => {
  const IconComponent = getCategoryIcon(categoryName);
  const colorScheme = useColorScheme
    ? getCategoryColorScheme(categoryName)
    : null;

  const iconElement = <IconComponent size={size} className={className} />;

  if (withWrapper) {
    const wrapperStyle = colorScheme
      ? {
          background: colorScheme.bg,
          color: colorScheme.text,
        }
      : {};

    return (
      <div
        className={`category-icon-wrapper ${wrapperClassName}`}
        style={wrapperStyle}
      >
        {iconElement}
      </div>
    );
  }

  return iconElement;
};

/**
 * CategoryIconWithWrapper - Pre-configured with wrapper styling
 */
export const CategoryIconWithWrapper: React.FC<
  Omit<CategoryIconProps, 'withWrapper'>
> = props => <CategoryIcon {...props} withWrapper={true} />;

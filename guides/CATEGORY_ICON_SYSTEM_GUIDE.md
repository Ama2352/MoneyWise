# Category Icon System

A clean, reusable, and intelligent icon mapping system for financial categories.

## 🎯 Overview

The Category Icon System automatically selects appropriate icons for categories based on name patterns, providing a consistent and intuitive visual experience across the money management application.

## 📁 Architecture

```
src/
├── services/
│   └── categoryIconService.ts    # Core icon mapping logic
├── components/ui/
│   └── CategoryIcon.tsx          # Reusable icon component
├── hooks/
│   └── useCategoryIcon.ts        # React hook for icon functionality
└── pages/
    └── CategoriesPage.tsx        # Updated to use modular system
```

## 🚀 Usage

### Basic Component Usage

```tsx
import { CategoryIcon } from '../components/ui';

// Simple icon display
<CategoryIcon categoryName="Food & Dining" size={24} />

// With wrapper styling
<CategoryIcon
  categoryName="Transportation"
  size={28}
  withWrapper={true}
  className="custom-icon"
/>
```

### Using the Hook

```tsx
import { useCategoryIcon } from '../hooks';

const MyComponent = () => {
  const { suggestions, getIcon, hasKnownIcon, getRandomSuggestion } =
    useCategoryIcon();

  return (
    <div>
      {suggestions.map(({ name, icon }) => (
        <div key={name}>
          <CategoryIcon categoryName={name} />
          {name}
        </div>
      ))}
    </div>
  );
};
```

### Direct Service Usage

```tsx
import {
  getCategoryIcon,
  getCategorySuggestions,
  searchCategoryPatterns,
} from '../services/categoryIconService';

// Get icon component
const IconComponent = getCategoryIcon('Salary');

// Get all suggestions
const suggestions = getCategorySuggestions();

// Search patterns
const patterns = searchCategoryPatterns('food');
```

## 🎨 Supported Categories

The system intelligently maps **22+ icon types** based on category names:

### Financial Categories

- **Income**: Salary, Income, Wage, Earning → 💰
- **Investment**: Investment, Profit → 📈
- **Savings**: Saving, Emergency, Fund → 🐷

### Expense Categories

- **Food & Dining**: Food, Dining, Restaurant, Grocery → 🍴
- **Transportation**: Transport, Car, Vehicle, Gas → 🚗
- **Shopping**: Shopping, Retail, Clothes → 🛍️
- **Entertainment**: Entertainment, Game, Movie → 🎮
- **Health**: Health, Medical, Doctor, Fitness → ❤️
- **Education**: Education, School, Course → 🎓
- **Travel**: Travel, Vacation, Trip → ✈️
- **Housing**: Rent, Mortgage, Home → 🏠
- **Utilities**: Utilities, Electricity, Water → ⚡

### Specialized Categories

- **Coffee**: Coffee, Drink, Cafe → ☕
- **Bills**: Bill, Service, Subscription → 🏢
- **Gifts**: Gift, Donation, Charity → 🎁
- **Maintenance**: Maintenance, Repair → 🔧

## 🔧 Customization

### Adding New Icon Patterns

```typescript
// In categoryIconService.ts
export const CATEGORY_ICON_PATTERNS: CategoryPattern[] = [
  // Add new pattern
  {
    keywords: ['crypto', 'bitcoin', 'ethereum'],
    icon: Bitcoin, // Import from lucide-react
    description: 'Cryptocurrency',
  },
  // ...existing patterns
];
```

### Custom Icon Component

```tsx
// Create specialized version
export const LargeCategoryIcon: React.FC<{ categoryName: string }> = ({
  categoryName,
}) => (
  <CategoryIcon
    categoryName={categoryName}
    size={48}
    withWrapper={true}
    wrapperClassName="large-icon-wrapper"
  />
);
```

## 📊 Benefits

### ✅ **Maintainable**

- Centralized icon logic
- Easy to add new patterns
- Consistent across the app

### ✅ **Reusable**

- Component-based architecture
- Hook for complex logic
- Service for direct access

### ✅ **Intelligent**

- Keyword-based matching
- Fallback to default icon
- Handles edge cases

### ✅ **Type-Safe**

- Full TypeScript support
- Proper interfaces
- IntelliSense support

### ✅ **Performance**

- Memoized suggestions
- Efficient pattern matching
- Tree-shakable exports

## 🎯 Examples in Action

### Categories Page

- **Quick suggestions**: 16 pre-defined category examples
- **Live preview**: Icon updates as you type
- **Smart matching**: Automatic icon selection

### Future Usage

- **Transaction forms**: Auto-icon selection
- **Category filters**: Visual category selection
- **Analytics dashboards**: Consistent category visualization
- **Mobile app**: Same icon system across platforms

## 🔄 Migration from Old System

The old inline `getCategoryIcon` function has been completely replaced with:

1. **Service**: `categoryIconService.ts` - Core logic
2. **Component**: `CategoryIcon.tsx` - UI component
3. **Hook**: `useCategoryIcon.ts` - React integration

All existing functionality is preserved while adding new capabilities for future features.

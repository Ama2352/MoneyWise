# Currency Module Guide

## Overview

This currency module provides comprehensive support for USD and VND currency operations in the Money Management application. It includes exchange rate fetching, caching, conversion, locale-aware formatting, and React components for seamless currency display. **All amounts are stored in VND (base currency) and converted to the selected display currency in real-time.**

## Key Architecture Principles

- **VND as Base Currency**: All transaction amounts are stored in VND in the database
- **Real-time Conversion**: Amounts are converted to the selected display currency (USD/VND) using live exchange rates
- **Component-Based**: Uses dedicated React components (`CurrencyAmount`, `CurrencyAmountWithSign`) for consistent display
- **Context-Driven**: Currency selection and conversion logic managed through React Context
- **Type-Safe**: Full TypeScript support with proper type definitions

## Features

- **Exchange Rate API**: Uses the fawazahmed0/exchange-api with fallback URLs
- **Caching**: Intelligent caching with 1-hour TTL to minimize API calls
- **Currency Conversion**: Convert between USD and VND with live rates
- **Locale-aware Formatting**: Proper formatting for each currency
- **React Components**: Pre-built components for currency display
- **Context Provider**: Centralized currency state management
- **Real-time Updates**: Currency switching updates all amounts instantly
- **TypeScript Support**: Full type safety

## Quick Start

### 1. Currency Context Usage

```typescript
import { useCurrencyContext } from '../contexts';

const MyComponent = () => {
  const { currency, setCurrency, toggleCurrency } = useCurrencyContext();

  return (
    <div>
      <p>Current currency: {currency.toUpperCase()}</p>
      <button onClick={toggleCurrency}>
        Switch to {currency === 'usd' ? 'VND' : 'USD'}
      </button>
    </div>
  );
};
```

### 2. Currency Amount Components

```typescript
import { CurrencyAmount, CurrencyAmountWithSign } from '../components';

const TransactionList = () => {
  return (
    <div>
      {transactions.map(transaction => (
        <div key={transaction.id}>
          <span>{transaction.description}</span>

          {/* For regular amounts */}
          <CurrencyAmount amountInVnd={transaction.amount} />

          {/* For transaction amounts with +/- signs */}
          <CurrencyAmountWithSign
            amountInVnd={transaction.amount}
            type={transaction.type as 'income' | 'expense'}
          />
        </div>
      ))}
    </div>
  );
};
```

### 3. Currency Selector Component

```typescript
import { CurrencySelector } from '../components/ui';

const AppHeader = () => {
  return (
    <header>
      <div className="header-controls">
        <CurrencySelector />
        {/* Other header elements */}
      </div>
    </header>
  );
};
```

### Direct Service Usage

````typescript
import { currencyService } from '../services/currencyService';

// Format currency
const formatted = currencyService.formatCurrency(1000, 'usd');

// Convert currency
### 4. Direct Hook Usage (Advanced)

```typescript
import { useCurrency, useCurrencyDisplay } from '../hooks';

const MyComponent = () => {
  const { formatCurrency, convertCurrency } = useCurrency();

  // For a single amount conversion and display
  const { displayAmount, isLoading, error } = useCurrencyDisplay(25000); // VND amount

  // For manual conversion
  const handleConvert = async () => {
    const result = await convertCurrency({
      amount: 100,
      from: 'usd',
      to: 'vnd',
    });
    console.log(result.convertedAmount);
  };

  return (
    <div>
      {isLoading ? 'Loading...' : displayAmount}
    </div>
  );
};
````

## Architecture Overview

### Storage and Display Pattern

```
Database (Storage)     →     Display Layer
     VND (Base)       →     VND or USD (User Choice)
```

1. **Storage**: All amounts stored in VND (Vietnamese Dong) as the base currency
2. **Conversion**: Live exchange rates used to convert VND to USD when needed
3. **Display**: User sees amounts in their selected currency (VND or USD)
4. **Components**: `CurrencyAmount` and `CurrencyAmountWithSign` handle conversion automatically

### Components Architecture

```
CurrencyProvider (Context)
├── CurrencySelector (Header component)
├── CurrencyAmount (Display component)
├── CurrencyAmountWithSign (Transaction display)
└── useCurrencyDisplay (Hook for custom components)
```

### File Structure

```
src/
├── components/
│   ├── TransactionItem.tsx            # Domain component (uses CurrencyAmountWithSign)
│   ├── forms/
│   │   └── TransactionForm.tsx        # Form component (handles currency input)
│   └── ui/
│       ├── CurrencyAmount.tsx         # Pure UI components for currency display
│       └── CurrencySelector.tsx       # Pure UI component for currency selection
├── contexts/
│   └── CurrencyContext.tsx            # Context provider for currency state
├── hooks/
│   ├── useCurrency.ts                 # Basic currency operations
│   └── useCurrencyDisplay.ts          # Display hook for conversion
├── services/
│   └── currencyService.ts             # Business logic and API calls
├── constants/
│   └── index.ts                       # Currency constants and configuration
└── types/
    └── currency.ts                    # Currency-related TypeScript types
```

## Migration from Old Implementation

If you have components using `formatAmountWithSign` or direct `formatCurrency` calls, migrate them to use the new components:

### Before (Old)

```typescript
// DON'T use this anymore
{
  formatAmountWithSign(transaction.amount, currency, transaction.type);
}
```

### After (New)

```typescript
// USE this instead
<CurrencyAmountWithSign
  amountInVnd={transaction.amount}
  type={transaction.type as 'income' | 'expense'}
/>
```

### Benefits of New Approach

- **Real-time updates**: Currency changes update all displays instantly
- **Consistent conversion**: All amounts use the same exchange rates
- **Better performance**: Optimized with React hooks and context
- **Type safety**: Full TypeScript support
- **Maintainable**: Centralized currency logic

## API Reference

### Context API

```typescript
interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  toggleCurrency: () => void;
  isLoading: boolean;
  convertAndFormat: (amountInVnd: number) => Promise<string>;
  convertFromDisplay: (displayAmount: number) => Promise<number>;
}
```

### Component Props

```typescript
// CurrencyAmount
interface CurrencyAmountProps {
  amountInVnd: number;
  className?: string;
  showLoading?: boolean;
}

// CurrencyAmountWithSign
interface CurrencyAmountWithSignProps extends CurrencyAmountProps {
  type: 'income' | 'expense';
}
```

### Types

```typescript
type CurrencyCode = 'usd' | 'vnd';

interface CurrencyInfo {
  code: CurrencyCode;
  name: string;
  symbol: string;
  locale: string;
}

interface ConversionRequest {
  amount: number;
  from: CurrencyCode;
  to: CurrencyCode;
}
```

### Hooks

#### `useCurrency()`

Basic currency operations hook.

**Returns:**

- `formatCurrency(amount, currency)` - Format currency with locale
- `convertCurrency(request)` - Convert between currencies
- `getExchangeRate(from, to)` - Get current exchange rate
- `getCurrencyInfo(currency)` - Get currency information
- `getSupportedCurrencies()` - Get all supported currencies
- `clearCache()` - Clear exchange rate cache
- `isLoading` - Loading state
- `error` - Error state

#### `useCurrencyWithConversion(amount, from, to, autoRefresh?)`

Auto-conversion hook that tracks a specific conversion.

**Parameters:**

- `amount` - Amount to convert
- `from` - Source currency
- `to` - Target currency
- `autoRefresh` - Auto-refresh on parameter changes (default: true)

**Returns:** All `useCurrency` methods plus:

- `conversion` - Current conversion result
- `refreshConversion()` - Manually refresh conversion

#### `useExchangeRate(from, to, refreshInterval?)`

Live exchange rate hook with optional auto-refresh.

**Parameters:**

- `from` - Source currency
- `to` - Target currency
- `refreshInterval` - Auto-refresh interval in ms (optional)

**Returns:**

- `exchangeRate` - Current exchange rate
- `isLoading` - Loading state
- `error` - Error state
- `refresh()` - Manually refresh rate

### Services

#### `currencyService`

Main service for currency operations.

**Methods:**

- `formatCurrency(amount, currency)` - Format with locale
- `convertCurrency(request)` - Convert between currencies
- `getExchangeRate(from, to)` - Get exchange rate with caching
- `getCurrencyInfo(currency)` - Get currency metadata
- `getSupportedCurrencies()` - Get all supported currencies
- `clearCache()` - Clear rate cache
- `getCacheStats()` - Get cache statistics

### Updated formatUtils

The existing `formatUtils.ts` has been enhanced to use the currency service and includes new transaction-specific formatting:

```typescript
import {
  formatCurrency,
  formatCurrencyWithCode,
  formatAmountWithSign,
} from '../utils/formatUtils';

// Backward compatible (supports any currency but uses enhanced service for USD/VND)
const amount1 = formatCurrency(100, 'USD');

// Recommended for new code (type-safe, only USD/VND)
const amount2 = formatCurrencyWithCode(100, 'usd');

// NEW: Format with transaction signs (+ for income, - for expense)
const incomeAmount = formatAmountWithSign(1234.56, 'USD', 'income'); // "+$1,234.56"
const expenseAmount = formatAmountWithSign(1234.56, 'USD', 'expense'); // "-$1,234.56"
const vndIncome = formatAmountWithSign(25000, 'VND', 'income'); // "+25,000đ"

// Case insensitive type handling
const flexibleIncome = formatAmountWithSign(100, 'USD', 'INCOME'); // "+$100.00"
const flexibleExpense = formatAmountWithSign(100, 'USD', 'Expense'); // "-$100.00"
```

## Constants and Configuration

### Currency Information

```typescript
export const DEFAULT_CURRENCY: CurrencyCode = 'vnd';

export const CURRENCY_INFO: Record<CurrencyCode, CurrencyInfo> = {
  usd: {
    code: 'usd',
    name: 'US Dollar',
    symbol: '$',
    locale: 'en-US',
  },
  vnd: {
    code: 'vnd',
    name: 'Vietnamese Dong',
    symbol: 'đ',
    locale: 'vi-VN',
  },
};
```

### Exchange Rate API Configuration

```typescript
export const EXCHANGE_API = {
  PRIMARY_BASE_URL:
    'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1',
  FALLBACK_BASE_URL: 'https://latest.currency-api.pages.dev/v1',
  CACHE_DURATION: 3600000, // 1 hour in milliseconds
};
```

## Best Practices

### 1. Always Store in VND

```typescript
// ✅ CORRECT - Store in VND
const transaction = {
  amount: 250000, // VND
  currency: 'vnd', // Base currency
};

// ❌ WRONG - Don't store in display currency
const transaction = {
  amount: 10.5, // USD - This would break conversion
  currency: 'usd',
};
```

### 2. Use Components for Display

```typescript
// ✅ CORRECT - Use components
<CurrencyAmountWithSign amountInVnd={transaction.amount} type="expense" />

// ❌ WRONG - Manual formatting
{currency === 'usd' ? `$${amount}` : `${amount}đ`}
```

### 3. Handle Loading States

```typescript
// ✅ CORRECT - Show loading state for conversions
<CurrencyAmount
  amountInVnd={amount}
  showLoading={true}
  className="transaction-amount"
/>

// ❌ WRONG - Ignore loading states
<CurrencyAmount amountInVnd={amount} />
```

### 4. Error Handling

```typescript
// ✅ CORRECT - Components handle errors gracefully
const { displayAmount, error } = useCurrencyDisplay(amount);
if (error) {
  console.warn('Currency conversion failed, showing VND fallback');
}

// ❌ WRONG - Not handling conversion errors
const amount = await convertCurrency(request); // Might throw
```

## Testing Recommendations

### Unit Tests

```typescript
// Test currency components
it('should display VND amount when currency is VND', () => {
  render(
    <CurrencyProvider>
      <CurrencyAmount amountInVnd={25000} />
    </CurrencyProvider>
  );
  expect(screen.getByText(/25,000đ/)).toBeInTheDocument();
});

// Test currency conversion
it('should convert VND to USD correctly', async () => {
  const result = await convertCurrency({
    amount: 25000,
    from: 'vnd',
    to: 'usd'
  });
  expect(result.success).toBe(true);
});
```

### Integration Tests

```typescript
// Test currency switching
it('should update all amounts when currency changes', async () => {
  render(<App />);
  // Check initial VND display
  expect(screen.getByText(/25,000đ/)).toBeInTheDocument();

  // Switch to USD
  fireEvent.click(screen.getByText('USD'));

  // Wait for conversion and check USD display
  await waitFor(() => {
    expect(screen.getByText(/\$10\.50/)).toBeInTheDocument();
  });
});
```

## Performance Considerations

### 1. Exchange Rate Caching

- Exchange rates are cached for 1 hour to minimize API calls
- Use the same rate for all conversions within the cache period
- Fallback to cached rates if API is unavailable

### 2. Component Optimization

- `CurrencyAmount` components are optimized with React.memo
- `useCurrencyDisplay` hook includes proper dependency arrays
- Context updates only trigger re-renders when currency actually changes

### 3. Error Recovery

- Graceful fallback to VND formatting if conversion fails
- Retry mechanism for failed API calls
- User-friendly error messages

## Troubleshooting

### Common Issues

1. **Amounts not updating when currency changes**

   - Ensure components use `CurrencyAmount` or `CurrencyAmountWithSign`
   - Check that components are wrapped in `CurrencyProvider`

2. **Conversion errors**

   - Verify internet connection for exchange rate API
   - Check that amounts are stored as numbers, not strings
   - Ensure amounts are positive VND values

3. **TypeScript errors**
   - Use `CurrencyCode` type for currency values
   - Ensure transaction types are `'income' | 'expense'`
   - Import types from the correct modules

### Debug Tools

```typescript
// Check currency context state
const { currency, isLoading } = useCurrencyContext();
console.log('Current currency:', currency, 'Loading:', isLoading);

// Debug conversion
const { displayAmount, error } = useCurrencyDisplay(amount);
console.log('Display amount:', displayAmount, 'Error:', error);
```

## Changelog

### v2.0.0 (Current)

- ✅ Added `CurrencyAmount` and `CurrencyAmountWithSign` components
- ✅ Implemented `CurrencyContext` for state management
- ✅ Added `useCurrencyDisplay` hook
- ✅ Set VND as default and base currency
- ✅ Real-time currency switching
- ✅ Improved TypeScript support
- ✅ Updated all pages to use new components

### v1.0.0 (Legacy)

- ❌ Direct `formatAmountWithSign` usage (deprecated)
- ❌ Manual currency formatting (deprecated)
- ❌ Component-level currency state (deprecated)

---

**For questions or support, refer to the main development team or check the component implementations in the codebase.**

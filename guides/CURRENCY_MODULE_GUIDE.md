# Currency Module Guide

## Overview

This currency module provides comprehensive support for USD and VND currency operations in the Money Management application. It includes exchange rate fetching, caching, conversion, locale-aware formatting, and transaction-specific formatting with signs.

## Features

- **Exchange Rate API**: Uses the fawazahmed0/exchange-api with fallback URLs
- **Caching**: Intelligent caching with 1-hour TTL to minimize API calls
- **Currency Conversion**: Convert between USD and VND
- **Locale-aware Formatting**: Proper formatting for each currency
- **Transaction Sign Formatting**: Automatic + for income, - for expense
- **React Hooks**: Easy-to-use hooks for React components
- **TypeScript Support**: Full type safety

## Quick Start

### Basic Usage with Hooks

```typescript
import { useCurrency } from '../hooks';

const MyComponent = () => {
  const { formatCurrency, convertCurrency } = useCurrency();

  // Format currency
  const usdAmount = formatCurrency(1234.56, 'usd'); // "$1,234.56"
  const vndAmount = formatCurrency(25000, 'vnd'); // "25,000₫"

  // Convert currency
  const handleConvert = async () => {
    const result = await convertCurrency({
      amount: 100,
      from: 'usd',
      to: 'vnd',
    });
    console.log(result.convertedAmount);
  };
};
```

### Auto-conversion Hook

```typescript
import { useCurrencyWithConversion } from '../hooks';

const CurrencyConverter = () => {
  const { conversion, isLoading } = useCurrencyWithConversion(
    100,    // amount
    'usd',  // from
    'vnd'   // to
  );

  if (isLoading) return <div>Converting...</div>;

  return (
    <div>
      {conversion && (
        <p>
          {conversion.amount} USD = {conversion.convertedAmount} VND
        </p>
      )}
    </div>
  );
};
```

### Transaction Amount Formatting with Signs

```typescript
import { formatAmountWithSign } from '../utils/formatUtils';

const TransactionList = () => {
  // Format amounts with + for income, - for expense
  const incomeAmount = formatAmountWithSign(1234.56, 'USD', 'income');   // "+$1,234.56"
  const expenseAmount = formatAmountWithSign(1234.56, 'USD', 'expense'); // "-$1,234.56"

  // Works with VND too
  const vndIncome = formatAmountWithSign(25000, 'VND', 'income');        // "+25,000₫"
  const vndExpense = formatAmountWithSign(25000, 'VND', 'expense');      // "-25,000₫"

  // Case insensitive
  const flexibleIncome = formatAmountWithSign(100, 'USD', 'INCOME');     // "+$100.00"
  const flexibleExpense = formatAmountWithSign(100, 'USD', 'Expense');   // "-$100.00"

  return (
    <div>
      {transactions.map(transaction => (
        <div key={transaction.id}>
          <span>{transaction.description}</span>
          <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
            {formatAmountWithSign(transaction.amount, 'USD', transaction.type)}
          </span>
        </div>
      ))}
    </div>
  );
};
```

### Direct Service Usage

```typescript
import { currencyService } from '../services/currencyService';

// Format currency
const formatted = currencyService.formatCurrency(1000, 'usd');

// Convert currency
const conversion = await currencyService.convertCurrency({
  amount: 100,
  from: 'usd',
  to: 'vnd',
});

// Get exchange rate
const rate = await currencyService.getExchangeRate('usd', 'vnd');

// Get currency info
const usdInfo = currencyService.getCurrencyInfo('usd');
```

## formatAmountWithSign Feature

### Overview

The `formatAmountWithSign` function provides automatic transaction sign formatting for the Money Management application. This function formats currency amounts with appropriate signs (+ for income, - for expense) based on transaction type.

### Key Features

- ✅ **Automatic Sign Addition**: + for income, - for expense
- ✅ **Case Insensitive**: Accepts 'INCOME', 'income', 'Income', etc.
- ✅ **Smart Amount Handling**: Uses absolute value - sign controlled by type
- ✅ **Enhanced Currency Support**: Integrates with currency service for USD/VND
- ✅ **Fallback Protection**: Invalid types default to expense (-)
- ✅ **Full Integration**: Works with existing currency module

### Usage Examples

```typescript
import { formatAmountWithSign } from '../utils/formatUtils';

// Basic usage
const incomeAmount = formatAmountWithSign(1234.56, 'USD', 'income'); // "+$1,234.56"
const expenseAmount = formatAmountWithSign(1234.56, 'USD', 'expense'); // "-$1,234.56"

// VND support
const vndIncome = formatAmountWithSign(25000, 'VND', 'income'); // "+25,000₫"
const vndExpense = formatAmountWithSign(25000, 'VND', 'expense'); // "-25,000₫"

// Case insensitive
const flexibleIncome = formatAmountWithSign(100, 'USD', 'INCOME'); // "+$100.00"
const flexibleExpense = formatAmountWithSign(100, 'USD', 'Expense'); // "-$100.00"

// Handles negative amounts by using absolute value - sign is controlled by type
const correctedAmount = formatAmountWithSign(-100, 'USD', 'income'); // "+$100.00"
```

### React Component Usage

```typescript
const TransactionItem = ({ transaction }) => (
  <div className="transaction-item">
    <span>{transaction.description}</span>
    <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
      {formatAmountWithSign(transaction.amount, 'USD', transaction.type)}
    </span>
  </div>
);
```

### API Reference

```typescript
formatAmountWithSign(
  amount: number,              // Amount to format (uses absolute value)
  currency: string | CurrencyCode = 'USD',  // Currency code or string
  type: string                 // 'income' or 'expense' (case insensitive)
): string
```

### Benefits

1. **Consistent UX**: Standardized + and - formatting across the app
2. **Developer Friendly**: Simple API that handles edge cases
3. **Type Safe**: Integration with existing TypeScript types
4. **Flexible**: Works with any currency, enhanced for USD/VND
5. **Robust**: Handles negative amounts and invalid inputs gracefully

## API Reference

### Types

```typescript
type CurrencyCode = 'usd' | 'vnd';

interface ConversionRequest {
  amount: number;
  from: CurrencyCode;
  to: CurrencyCode;
}

interface CurrencyConversion {
  amount: number;
  fromCurrency: CurrencyCode;
  toCurrency: CurrencyCode;
  convertedAmount: number;
  exchangeRate: number;
  timestamp: string;
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
const vndIncome = formatAmountWithSign(25000, 'VND', 'income'); // "+25,000₫"

// Case insensitive type handling
const flexibleIncome = formatAmountWithSign(100, 'USD', 'INCOME'); // "+$100.00"
const flexibleExpense = formatAmountWithSign(100, 'USD', 'Expense'); // "-$100.00"
```

## Configuration

### Constants

Currency configuration is defined in `src/constants/index.ts`:

```typescript
export const CURRENCIES = {
  USD: 'usd' as const,
  VND: 'vnd' as const,
};

export const CURRENCY_INFO = {
  usd: {
    code: 'usd',
    name: 'US Dollar',
    symbol: '$',
    locale: 'en-US',
  },
  vnd: {
    code: 'vnd',
    name: 'Vietnamese Dong',
    symbol: '₫',
    locale: 'vi-VN',
  },
};

export const EXCHANGE_API = {
  PRIMARY_BASE_URL:
    'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1',
  FALLBACK_BASE_URL: 'https://latest.currency-api.pages.dev/v1',
  CACHE_DURATION: 3600000, // 1 hour
};
```

## Architecture

```
src/
├── types/
│   └── currency.ts          # TypeScript types
├── constants/
│   └── index.ts             # Currency constants and config
├── api/
│   └── exchangeRateApi.ts   # Exchange rate API client
├── services/
│   └── currencyService.ts   # Business logic service
├── hooks/
│   └── useCurrency.ts       # React hooks
└── utils/
    └── formatUtils.ts       # Enhanced formatting utilities
```

## Error Handling

The module includes comprehensive error handling:

- **Network failures**: Automatic fallback to secondary API
- **Invalid currencies**: Type-safe validation
- **API errors**: Graceful error messages
- **Cache failures**: Automatic retry without cache

## Performance

- **Caching**: Exchange rates cached for 1 hour
- **Efficient fetching**: Only fetches when needed
- **Fallback mechanism**: Secondary API for reliability
- **Type safety**: Compile-time error prevention

## Testing

- **Interactive Testing**: Available in `CurrencyExample.tsx` component
- **Example Functions**: See `src/examples/currencyFormattingExamples.ts`
- **Live Demo**: Test section in currency example with real-time formatting

## Example Component

See `src/components/examples/CurrencyExample.tsx` for a complete example demonstrating all features of the currency module, including:

- Currency conversion and exchange rates
- Locale-aware formatting for USD and VND
- Interactive testing of `formatAmountWithSign` with income/expense examples
- Cache management and statistics
- Error handling demonstrations

The example component includes a dedicated "Amount with Sign Testing" section that showcases the new transaction formatting feature with live examples and interactive testing.

## Files Modified

- `src/utils/formatUtils.ts` - Added the main function
- `src/components/examples/CurrencyExample.tsx` - Added interactive testing section
- `src/examples/currencyFormattingExamples.ts` - Added usage examples
- `guides/CURRENCY_MODULE_GUIDE.md` - This comprehensive guide

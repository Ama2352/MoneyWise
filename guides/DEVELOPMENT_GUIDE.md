# MoneyWise Frontend Development Guide

A comprehensive guide for building features in the MoneyWise React + TypeScript application while maintaining clean architecture and code consistency.

## 📋 Table of Contents

- [🏗️ Architecture Overview](#️-architecture-overview)
- [🚀 Feature Development Workflow](#-feature-development-workflow)
- [📂 Project Structure Rules](#-project-structure-rules)
- [🛣️ Routing Architecture](#️-routing-architecture)
- [📊 Data Fetching with SWR](#-data-fetching-with-swr)
- [🎯 Step-by-Step Feature Development](#-step-by-step-feature-development)
- [🔄 DRY Patterns & Reusable Components](#-dry-patterns--reusable-components)
- [🧩 Component Development Guidelines](#-component-development-guidelines)
- [🎨 CSS Architecture & Styling Guidelines](#-css-architecture--styling-guidelines)
- [🔔 Notification & Dialog Systems](#-notification--dialog-systems)
- [🎨 Category Icon System](#-category-icon-system)
- [🔌 API Integration Best Practices](#-api-integration-best-practices)
- [🪝 Custom Hooks Guidelines](#-custom-hooks-guidelines)
- [🌐 Language and Internationalization](#-language-and-internationalization)
- [✅ Code Quality Standards](#-code-quality-standards)
- [🚨 Common Mistakes to Avoid](#-common-mistakes-to-avoid)
- [📝 Examples](#-examples)
- [🚀 Migration Guide](#-migration-guide)
- [📚 Related Guides](#-related-guides)

## 🏗️ Architecture Overview

Our frontend follows a **layered architecture** with clear separation of concerns:

```
┌─────────────────┐
│   Components    │ ← UI logic, user interaction, form handling
│   (Pages/UI)    │
└─────────────────┘
         ↓
┌─────────────────┐
│   Contexts      │ ← Global state management (Auth, Toast, Language)
│   (Providers)   │
└─────────────────┘
         ↓
┌─────────────────┐
│     Hooks       │ ← React state, effects, SWR data fetching
│ (useFinanceData)│
└─────────────────┘
         ↓
┌─────────────────┐
│    Services     │ ← Business logic, icon mapping, i18n services
│ (categoryIcon)  │
└─────────────────┘
         ↓
┌─────────────────┐
│   API Layer     │ ← HTTP requests, data transformation, SWR config
│  (financeApi)   │
└─────────────────┘
         ↓
┌─────────────────┐
│    Backend      │ ← Spring Boot API
└─────────────────┘
```

### 🎯 Layer Responsibilities

| Layer          | Purpose                         | What Goes Here                                  | What NOT to Put Here                     |
| -------------- | ------------------------------- | ----------------------------------------------- | ---------------------------------------- |
| **Components** | UI rendering & user interaction | JSX, form handling, event handlers, validation  | API calls, business logic, complex state |
| **Contexts**   | Global state management         | Auth state, toast notifications, language       | Component-specific state, API calls      |
| **Hooks**      | React state & API orchestration | useState, useEffect, SWR integration, mutations | Direct JSX, business calculations        |
| **Services**   | Business logic & calculations   | Icon mapping, i18n logic, data processing       | React state, UI logic                    |
| **API**        | Backend communication           | HTTP requests, data transformation, SWR config  | UI logic, React state                    |

### 🚀 Recent Major Changes

#### SWR Data Fetching Integration

- **Migration from manual fetch**: All finance data now uses SWR for caching, synchronization, and automatic revalidation
- **New hook pattern**: `useCategories()`, `useCategoryMutations()` replace manual API state management
- **Cache management**: Automatic background updates, optimistic updates, and error recovery

#### Modern Layout System (AppLayout)

- **Replaced old layout**: Migrated from `DashboardLayout`/`DashboardHeader` to `AppLayout`/`AppHeader`
- **Enhanced responsive design**: Mobile-first approach with collapsible sidebar and overlay
- **Improved navigation**: Centralized routing with `ROUTES` constants and smart active states

#### Notification & Dialog Systems

- **Toast notifications**: Replaced browser `alert()` with custom toast system (`ToastContext`, `ToastContainer`)
- **Confirmation dialogs**: Replaced browser `confirm()` with `ConfirmDialog` component
- **UX best practices**: Toasts for feedback, dialogs for user decisions

#### Category Icon System

- **Modular architecture**: Separate service (`categoryIconService`), component (`CategoryIcon`), and hook (`useCategoryIcon`)
- **Intelligent mapping**: Keyword-based icon selection with 22+ supported categories
- **Internationalization**: Category suggestions use translation keys for multi-language support

#### Session Management & Token Expiry

- **TokenExpiryDialog**: Graceful session expiry handling with user choice
- **Automatic token refresh**: Background token renewal and expiry detection

#### DRY Refactoring & Component Architecture

- **Centralized CRUD operations**: `useCrudOperations` hook provides consistent error handling and notifications
- **Universal page layout**: `PageLayout` component standardizes page structure, loading states, and error handling
- **Reusable components**: `StatCard`, `Modal`, `AuthLayout` eliminate code duplication
- **Form management**: `useForm` hook and validation services centralize form logic
- **Date formatting**: `useDateFormatter` provides language-aware date display
- **Code reduction**: 20-67% reduction in duplicate code across major components
- **Global dialog integration**: Centralized session management in App.tsx

#### Example Components & Learning Resources

- **SWRExample**: Live demonstration of SWR vs legacy patterns
- **CurrencyExample**: Multi-currency system demonstration
- **Educational routes**: `/swr-example`, `/currency-example` for learning

## 🚀 Feature Development Workflow

Follow this **exact order** when building any new feature:

### Phase 1: Planning & Types

1. **Define Types** (`src/types/`)
2. **Plan API Endpoints** (check with backend team)
3. **Design Component Hierarchy**

### Phase 2: Foundation

4. **Create API Functions** (`src/api/`)
5. **Configure SWR Keys** (`src/config/swr.ts`)
6. **Build Custom Hooks** (`src/hooks/`) _with SWR integration_
7. **Add Business Services** (`src/services/`) _for complex logic_

### Phase 3: UI

8. **Create UI Components** (`src/components/ui/`)
9. **Build Feature Components** (`src/components/`)
10. **Create Pages** (`src/pages/`)
11. **Add Internationalization** (`src/locales/`)

### Phase 4: Integration

12. **Add Routes** (`src/router/AppRouter.tsx` & `src/constants/index.ts`)
13. **Update Navigation** (`src/components/layout/Sidebar.tsx`)
14. **Test Integration**
15. **Add Error Handling** and loading states
16. **Configure Session Management** if needed
17. **Update Export Structure** (`index.ts` files)

### Phase 5: Polish & Documentation

18. **Add Example Components** for complex features
19. **Update Documentation** (guides and README files)
20. **Validate Migration Checklist**
21. **Integrate Notifications** (toasts and dialogs)
22. **Test Integration**
23. **Add Error Handling**

## 📂 Project Structure Rules

### ✅ DO Follow These Patterns

```
src/
├── components/
│   ├── ui/                # Reusable UI components (Button, Input, Toast, ConfirmDialog)
│   ├── layout/            # Layout components (AppLayout, AppHeader, Sidebar)
│   └── examples/          # Example/demo components (SWRExample, CurrencyExample)
├── contexts/              # Global state providers (Auth, Toast, Language)
├── hooks/                 # Custom React hooks (useFinanceData, useCategoryIcon)
├── pages/                 # Route components (ModernDashboard, CategoriesPage)
├── router/                # Application routing configuration
│   └── AppRouter.tsx      # Main router component
├── services/              # Business logic services (categoryIconService, languageService)
├── types/                 # TypeScript definitions
├── utils/                 # Pure utility functions
├── constants/             # App constants (ROUTES, LANGUAGE_OPTIONS)
├── styles/                # Global styles
├── assets/                # Static files
├── locales/               # Internationalization files (en.ts, vi.ts)
├── config/                # Configuration (SWR, API endpoints)
└── api/                   # HTTP client and API functions
```

### ❌ DON'T Break These Rules

- ❌ **Don't put API calls in components**
- ❌ **Don't put React state in services**
- ❌ **Don't put business logic in API layer**
- ❌ **Don't create circular dependencies**
- ❌ **Don't skip TypeScript types**

## 🛣️ Routing Architecture

### Router Structure Overview

The application uses a **centralized routing system** with modern layout architecture:

```
App.tsx (Main Routes)
├── Public Routes (/login, /register)
├── Protected Routes (/)
└── AppRouter (/*)
    ├── AppLayout (Sidebar + Header)
    └── Nested Routes
        ├── /dashboard (index)
        ├── /transactions
        ├── /wallets
        ├── /categories
        └── /settings, etc.
```

### Key Files

| File                                  | Purpose                 | Contains                                               |
| ------------------------------------- | ----------------------- | ------------------------------------------------------ |
| `src/App.tsx`                         | Main application router | Public/private route separation, authentication guards |
| `src/router/AppRouter.tsx`            | Dashboard routes        | All dashboard pages with shared layout                 |
| `src/components/layout/AppLayout.tsx` | Dashboard layout        | Sidebar, header, and outlet for page content           |
| `src/components/layout/AppHeader.tsx` | Top navigation bar      | Search, notifications, profile, language switcher      |
| `src/components/layout/Sidebar.tsx`   | Side navigation         | Navigation menu with icons, badges, and active states  |
| `src/constants/index.ts`              | Route constants         | Centralized route path definitions                     |

### Routing Best Practices

#### ✅ DO: Use ROUTES Constants

```typescript
// ✅ Good - Use constants for maintainability
import { ROUTES } from '../constants';

<Route path={ROUTES.DASHBOARD} element={<ModernDashboard />} />
<NavLink to={ROUTES.DASHBOARD}>Dashboard</NavLink>
```

#### ✅ DO: Use Absolute Paths in AppRouter

```typescript
// ✅ Good - Absolute paths work correctly with your ROUTES constants
// src/router/AppRouter.tsx
<Route path="/" element={<DashboardLayout />}>
  <Route index element={<Navigate to={ROUTES.DASHBOARD} replace />} />
  <Route path={ROUTES.DASHBOARD} element={<ModernDashboard />} />
  <Route path={ROUTES.TRANSACTIONS} element={<TransactionsPage />} />
</Route>
```

#### ✅ DO: Use ROUTES Constants Directly in Navigation

```typescript
// ✅ Good - ROUTES constants already include the leading slash
// src/components/layout/Sidebar.tsx
const navigationItems = [
  {
    path: ROUTES.DASHBOARD, // Already "/dashboard"
    label: 'Dashboard',
  },
];
];
```

#### ❌ DON'T: Forget to Use ROUTES Constants

```typescript
// ❌ Bad - Hardcoded paths are harder to maintain
<Route path="/dashboard" element={<ModernDashboard />} />
<NavLink to="/dashboard">Dashboard</NavLink>

// ✅ Good - Use ROUTES constants
<Route path={ROUTES.DASHBOARD} element={<ModernDashboard />} />
<NavLink to={ROUTES.DASHBOARD}>Dashboard</NavLink>
```

### Adding New Routes

When adding a new route, follow these steps:

1. **Add to ROUTES constants** (`src/constants/index.ts`):

```typescript
export const ROUTES = {
  // Authentication routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',

  // Dashboard routes
  DASHBOARD: '/dashboard',
  WALLETS: '/wallets',
  TRANSACTIONS: '/transactions',
  CATEGORIES: '/categories',
  ANALYTICS: '/analytics',
  REPORTS: '/reports',
  SAVING_GOALS: '/saving-goals',
  BUDGET: '/budget',
  SETTINGS: '/settings',

  // Example routes
  SWR_EXAMPLE: '/swr-example',
  CURRENCY_EXAMPLE: '/currency-example',
} as const;
```

2. **Add to AppRouter** (`src/router/AppRouter.tsx`):

```typescript
<Route path={ROUTES.BUDGETS} element={<BudgetsPage />} />
```

3. **Add to navigation** (`src/components/layout/Sidebar.tsx`):

```typescript
{
  id: 'budgets',
  label: 'Budgets',
  icon: PiggyBank,
  path: ROUTES.BUDGETS, // Already includes leading slash
},
```

### Route Protection

All dashboard routes are automatically protected through the main App.tsx:

```typescript
// src/App.tsx
<Route
  path="/*"
  element={
    isAuthenticated ? (
      <AppRouter />
    ) : (
      <Navigate to={ROUTES.LOGIN} replace />
    )
  }
/>
```

## 📊 Data Fetching with SWR

MoneyWise uses **SWR (Stale-While-Revalidate)** for all data fetching, providing automatic caching, background updates, and optimistic mutations.

### SWR Configuration

```typescript
// src/config/swr.ts
export const swrConfig: SWRConfiguration = {
  fetcher: swrFetcher,
  dedupingInterval: 5 * 60 * 1000, // Cache for 5 minutes
  revalidateOnFocus: true, // Refresh on window focus
  revalidateOnReconnect: true, // Refresh on network reconnect
  refreshInterval: 10 * 60 * 1000, // Background refresh every 10 minutes
  errorRetryCount: 3, // Retry failed requests
  shouldRetryOnError: error => error.status >= 500, // Only retry server errors
};

// Consistent SWR keys
export const SWR_KEYS = {
  CATEGORIES: {
    ALL: '/Categories',
    BY_ID: (id: string) => `/Categories/${id}`,
  },
  TRANSACTIONS: {
    ALL: '/transactions',
    BY_USER: '/transactions/user',
  },
  // ... more keys
};
```

### SWR-based Hooks Pattern

**✅ Modern Pattern (Current)**:

```typescript
// src/hooks/useFinanceData.ts
export const useCategories = () => {
  const { data, error, isLoading } = useSWR<Category[]>(
    SWR_KEYS.CATEGORIES.ALL,
    () => categoryApi.getAll()
  );

  return {
    categories: data,
    isLoading,
    error,
    refresh: () => mutate(SWR_KEYS.CATEGORIES.ALL),
  };
};

export const useCategoryMutations = () => {
  const createCategory = async (data: CreateCategoryRequest) => {
    try {
      const newCategory = await categoryApi.create(data);
      mutate(SWR_KEYS.CATEGORIES.ALL); // Auto-refresh cache
      return { success: true, data: newCategory };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message };
    }
  };

  return { createCategory, updateCategory, deleteCategory };
};
```

**❌ Old Pattern (Deprecated)**:

```typescript
// DON'T: Manual state management
export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const data = await transactionApi.getAll();
      setTransactions(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return { transactions, isLoading, fetchTransactions };
};
```

### Key Benefits of SWR Integration

- **Automatic caching**: Data is cached and shared between components
- **Background updates**: Data refreshes automatically when stale
- **Optimistic mutations**: UI updates immediately, reverts on error
- **Error recovery**: Automatic retries and error handling
- **Performance**: Eliminates unnecessary re-renders and requests

### SWR Usage Examples

```typescript
// In components - use the SWR-based hooks
const CategoriesPage = () => {
  const { categories, isLoading, error } = useCategories();
  const { createCategory } = useCategoryMutations();
  const { showSuccess, showError } = useToastContext();

  const handleCreate = async (data) => {
    const result = await createCategory(data);
    if (result.success) {
      showSuccess('Category created!');
      // SWR automatically updates the cache
    } else {
      showError(result.error);
    }
  };

  // No manual refresh needed - SWR handles everything
  return (
    <div>
      {isLoading && <Loading />}
      {categories?.map(category => (
        <CategoryCard key={category.categoryId} category={category} />
      ))}
    </div>
  );
};
```

## 🎯 Step-by-Step Feature Development

Let's walk through building a **Transaction Management** feature:

### Step 1: Define Types (`src/types/finance.ts`)

```typescript
// Add to existing finance.ts or create new file
export interface Transaction {
  id: number;
  amount: number;
  description: string;
  date: string;
  type: 'INCOME' | 'EXPENSE';
  categoryId: number;
  accountId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionRequest {
  amount: number;
  description: string;
  date: string;
  type: 'INCOME' | 'EXPENSE';
  categoryId: number;
  accountId: number;
}

export interface TransactionFilters {
  dateFrom?: string;
  dateTo?: string;
  categoryId?: number;
  type?: 'INCOME' | 'EXPENSE';
  minAmount?: number;
  maxAmount?: number;
}
```

### Step 2: Create API Functions (`src/api/financeApi.ts`)

```typescript
import httpClient from './httpClient';
import { API_ENDPOINTS } from '../config/api';
import type {
  Transaction,
  CreateTransactionRequest,
  TransactionFilters,
  PaginatedResponse,
} from '../types';

export const transactionApi = {
  // Get all transactions with filters
  getAll: async (
    filters?: TransactionFilters,
    page = 0,
    size = 10
  ): Promise<PaginatedResponse<Transaction>> => {
    const params = new URLSearchParams();
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    if (filters?.categoryId)
      params.append('categoryId', filters.categoryId.toString());
    params.append('page', page.toString());
    params.append('size', size.toString());

    const response = await httpClient.get<PaginatedResponse<Transaction>>(
      `${API_ENDPOINTS.TRANSACTIONS.BASE}?${params}`
    );
    return response.data;
  },

  // Get single transaction
  getById: async (id: number): Promise<Transaction> => {
    const response = await httpClient.get<Transaction>(
      `${API_ENDPOINTS.TRANSACTIONS.BASE}/${id}`
    );
    return response.data;
  },

  // Create new transaction
  create: async (
    transaction: CreateTransactionRequest
  ): Promise<Transaction> => {
    const response = await httpClient.post<Transaction>(
      API_ENDPOINTS.TRANSACTIONS.BASE,
      transaction
    );
    return response.data;
  },

  // Update transaction
  update: async (
    id: number,
    transaction: Partial<CreateTransactionRequest>
  ): Promise<Transaction> => {
    const response = await httpClient.put<Transaction>(
      `${API_ENDPOINTS.TRANSACTIONS.BASE}/${id}`,
      transaction
    );
    return response.data;
  },

  // Delete transaction
  delete: async (id: number): Promise<void> => {
    await httpClient.delete(`${API_ENDPOINTS.TRANSACTIONS.BASE}/${id}`);
  },
};
```

### Step 3: Configure SWR Keys (`src/config/swr.ts`)

```typescript
// Add to existing SWR_KEYS
export const SWR_KEYS = {
  // ...existing keys
  TRANSACTIONS: {
    ALL: '/transactions',
    BY_USER: '/transactions/user',
    BY_CATEGORY: (categoryId: string) => `/transactions/category/${categoryId}`,
    SUMMARY: '/transactions/summary',
  },
} as const;
```

### Step 4: Create SWR-based Hooks (`src/hooks/useTransactionData.ts`)

```typescript
import useSWR, { mutate } from 'swr';
import { transactionApi } from '../api/financeApi';
import { SWR_KEYS } from '../config/swr';
import type {
  Transaction,
  CreateTransactionRequest,
  TransactionFilters,
} from '../types';

/**
 * Hook to fetch all transactions using SWR
 */
export const useTransactions = (filters?: TransactionFilters) => {
  const { data, error, isLoading } = useSWR<Transaction[]>(
    SWR_KEYS.TRANSACTIONS.ALL,
    () => transactionApi.getAll(filters)
  );

  return {
    transactions: data,
    isLoading,
    error,
    refresh: () => mutate(SWR_KEYS.TRANSACTIONS.ALL),
  };
};

/**
 * Hook for transaction mutations with SWR cache updates
 */
export const useTransactionMutations = () => {
  const createTransaction = async (data: CreateTransactionRequest) => {
    try {
      const newTransaction = await transactionApi.create(data);
      mutate(SWR_KEYS.TRANSACTIONS.ALL); // Refresh cache
      return { success: true, data: newTransaction };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create transaction',
      };
    }
  };

  const updateTransaction = async (
    id: number,
    data: Partial<CreateTransactionRequest>
  ) => {
    try {
      const updatedTransaction = await transactionApi.update(id, data);
      mutate(SWR_KEYS.TRANSACTIONS.ALL); // Refresh cache
      return { success: true, data: updatedTransaction };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update transaction',
      };
    }
  };

  const deleteTransaction = async (id: number) => {
    try {
      await transactionApi.delete(id);
      mutate(SWR_KEYS.TRANSACTIONS.ALL); // Refresh cache
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete transaction',
      };
    }
  };

  return {
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
};
```

### Step 5: Create Feature Page (`src/pages/TransactionsPage.tsx`)

```typescript
import React, { useState } from 'react';
import { useTransactions, useTransactionMutations } from '../hooks/useTransactionData';
import { useToastContext } from '../contexts';
import { TransactionCard, Button, Loading, ConfirmDialog } from '../components/ui';
import type { Transaction } from '../types';
import './TransactionsPage.css';

const TransactionsPage: React.FC = () => {
  const { transactions, isLoading, error } = useTransactions();
  const { createTransaction, updateTransaction, deleteTransaction } = useTransactionMutations();
  const { showSuccess, showError } = useToastContext();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    transactionId: 0,
    transactionName: '',
  });

  const handleCreateTransaction = async (data: CreateTransactionRequest) => {
    const result = await createTransaction(data);
    if (result.success) {
      showSuccess('Transaction created successfully!');
      setShowCreateForm(false);
    } else {
      showError(result.error || 'Failed to create transaction');
    }
  };

  const handleDeleteTransaction = (transaction: Transaction) => {
    setConfirmDialog({
      isOpen: true,
      transactionId: transaction.id,
      transactionName: transaction.description,
    });
  };

  const confirmDelete = async () => {
    const result = await deleteTransaction(confirmDialog.transactionId);
    if (result.success) {
      showSuccess('Transaction deleted successfully!');
    } else {
      showError(result.error || 'Failed to delete transaction');
    }
    setConfirmDialog({ isOpen: false, transactionId: 0, transactionName: '' });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="transactions-page">
      <div className="page-header">
        <h1>Transactions</h1>
        <Button
          variant="primary"
          onClick={() => setShowCreateForm(true)}
        >
          Add Transaction
        </Button>
      </div>

      {error && (
        <div className="error-message">
          {error.message}
        </div>
      )}

      <div className="transactions-list">
        {transactions?.length === 0 ? (
          <div className="empty-state">
            <p>No transactions found</p>
            <Button
              variant="primary"
              onClick={() => setShowCreateForm(true)}
            >
              Add Your First Transaction
            </Button>
          </div>
        ) : (
          transactions?.map(transaction => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              onDelete={() => handleDeleteTransaction(transaction)}
            />
          ))
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Transaction"
        message={`Are you sure you want to delete "${confirmDialog.transactionName}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, transactionId: 0, transactionName: '' })}
      />

      {/* TODO: Add CreateTransactionModal */}
      {showCreateForm && (
        <div>Create Transaction Form/Modal</div>
      )}
    </div>
  );
};

export default TransactionsPage;
```

### Step 6: Add Routes

#### Update Constants (`src/constants/index.ts`)

```typescript
export const ROUTES = {
  // ...existing routes
  TRANSACTIONS: 'transactions',
} as const;
```

#### Update AppRouter (`src/router/AppRouter.tsx`)

```typescript
import { TransactionsPage } from '../pages';

// Add to existing routes
<Route path={ROUTES.TRANSACTIONS} element={<TransactionsPage />} />
```

#### Update Navigation (`src/components/layout/Sidebar.tsx`)

```typescript
const navigationItems: NavigationItem[] = [
  // ...existing items
  {
    id: 'transactions',
    label: 'Transactions',
    icon: ArrowUpDown,
    path: `/${ROUTES.TRANSACTIONS}`,
    badge: '24', // Optional
  },
];
```

### Step 7: Export Everything (`index.ts` files)

```typescript
// src/hooks/index.ts
export { useTransactions } from './useTransactions';

// src/components/ui/index.tsx
export { TransactionCard } from './TransactionCard';

// src/pages/index.ts
export { default as TransactionsPage } from './TransactionsPage';

// src/api/index.ts
export { transactionApi } from './transactionApi';
```

## 🔄 DRY Patterns & Reusable Components

Our codebase follows DRY (Don't Repeat Yourself) principles through a comprehensive set of reusable components and hooks. **Always check for existing patterns before creating new functionality.**

### 📋 Core DRY Components

#### 1. PageLayout - Universal Page Structure

**Use for**: All main application pages that need consistent headers, loading states, and error handling.

```tsx
import { PageLayout } from '../components/layout/PageLayout';

export const MyPage: React.FC = () => {
  const { data, isLoading, error, refresh } = useMyData();

  return (
    <PageLayout
      title="Page Title"
      subtitle="Optional description"
      isLoading={isLoading}
      error={error}
      onRetry={refresh}
      action={
        <button className="btn btn--primary" onClick={handleAdd}>
          Add Item
        </button>
      }
    >
      {/* Your page content */}
    </PageLayout>
  );
};
```

**Features**:

- Automatic loading states with spinner
- Error handling with retry functionality
- Consistent page headers and styling
- Action button placement
- Responsive design

#### 2. useCrudOperations - Centralized CRUD Logic

**Use for**: Any page with create, update, delete operations.

```tsx
import { useCrudOperations } from '../hooks';

export const MyPage: React.FC = () => {
  const { handleCreate, handleUpdate, handleDelete } = useCrudOperations(
    {
      create: createItem, // Your API function
      update: updateItem, // Your API function
      delete: deleteItem, // Your API function
    },
    {
      createSuccess: 'Item created successfully',
      createError: 'Failed to create item',
      updateSuccess: 'Item updated successfully',
      updateError: 'Failed to update item',
      deleteSuccess: 'Item deleted successfully',
      deleteError: 'Failed to delete item',
    },
    refresh // Optional refresh function after operations
  );

  // Use handleCreate, handleUpdate, handleDelete instead of custom handlers
};
```

**Benefits**:

- Automatic error handling with toast notifications
- Consistent loading states during operations
- Centralized success/error messaging
- Automatic data refresh after operations

#### 3. StatCard - Statistics Display

**Use for**: Displaying numerical statistics with trends and icons.

```tsx
import { StatCard } from '../components/ui';

<StatCard
  title="Total Income"
  value="$2,450.00"
  icon={ArrowUpCircle}
  change="+12.5%"
  trend="up"
  color="success"
/>;
```

**Features**:

- Flexible value display (string or number)
- Trend indicators with directional icons
- Color theming (primary, success, error, info, warning)
- Consistent styling across all statistics

#### 4. Modal - Reusable Dialog Component

**Use for**: Forms, confirmations, and content overlays.

```tsx
import { Modal } from '../components/ui';

<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Dialog Title"
  subtitle="Optional description"
>
  {/* Modal content */}
</Modal>;
```

#### 5. AuthLayout - Authentication Pages

**Use for**: Login, register, and other authentication pages.

```tsx
import { AuthLayout } from '../components/layout';

<AuthLayout
  title="Sign In"
  subtitle="Welcome back to MoneyWise"
  footerText="Don't have an account?"
  footerLinkText="Sign up"
  footerLinkTo="/register"
>
  <form onSubmit={handleSubmit}>{/* Form content */}</form>
</AuthLayout>;
```

### 🪝 DRY Hooks

#### 1. useForm - Form State Management

**Use for**: Any form with validation and submission handling.

```tsx
import { useForm } from '../hooks';

const { values, errors, handleSubmit, setValue } = useForm({
  initialValues: { name: '', email: '' },
  validate: values => {
    const errors = {};
    if (!values.name) errors.name = 'Name is required';
    if (!values.email) errors.email = 'Email is required';
    return errors;
  },
  onSubmit: async values => {
    // Handle form submission
  },
});
```

#### 2. useDateFormatter - Language-Aware Dates

**Use for**: All date displays to ensure consistency and i18n support.

```tsx
import { useDateFormatter } from '../hooks';

const { formatDate } = useDateFormatter();
const displayDate = formatDate(dateString); // Respects current language
```

### 🛠️ Services for Complex Logic

#### Form Validation Service

**Use for**: Centralized validation logic across different forms.

```tsx
import { createFormValidationService } from '../services';

const validationService = createFormValidationService(translations);
const result = validationService.validateLoginForm(formData);

if (!result.isValid) {
  setErrors(result.errors);
}
```

### 📏 DRY Development Rules

#### ✅ DO: Check for Existing Patterns First

```tsx
// ✅ Good - Use existing CRUD operations
const { handleCreate } = useCrudOperations(operations, messages, refresh);

// ❌ Bad - Creating custom CRUD handlers
const handleCreate = async data => {
  setLoading(true);
  try {
    const result = await createItem(data);
    if (result.success) {
      showSuccess('Created successfully');
      refresh();
    } else {
      showError(result.error);
    }
  } finally {
    setLoading(false);
  }
};
```

#### ✅ DO: Use PageLayout for All Main Pages

```tsx
// ✅ Good - Consistent page structure
return (
  <PageLayout title="My Page" isLoading={isLoading} error={error}>
    {/* Content */}
  </PageLayout>
);

// ❌ Bad - Manual page structure
return (
  <div className="page-container">
    <div className="page-header">
      <h1>My Page</h1>
    </div>
    {isLoading && <Loading />}
    {error && <ErrorMessage error={error} />}
    {/* Content */}
  </div>
);
```

#### ✅ DO: Use StatCard for Statistics

```tsx
// ✅ Good - Consistent statistics display
<StatCard title="Total" value="$1,234" icon={DollarSign} color="primary" />

// ❌ Bad - Custom stat implementation
<div className="custom-stat-card">
  <div className="stat-header">
    <DollarSign />
    <span>Total</span>
  </div>
  <div className="stat-value">$1,234</div>
</div>
```

#### ✅ DO: Use Centralized Date Formatting

```tsx
// ✅ Good - Language-aware formatting
const { formatDate } = useDateFormatter();
return <span>{formatDate(transaction.createdAt)}</span>;

// ❌ Bad - Manual date formatting
return <span>{new Date(transaction.createdAt).toLocaleDateString()}</span>;
```

### 📖 Quick Reference

| Need               | Use                     | Import From            |
| ------------------ | ----------------------- | ---------------------- |
| Page structure     | `PageLayout`            | `../components/layout` |
| CRUD operations    | `useCrudOperations`     | `../hooks`             |
| Statistics display | `StatCard`              | `../components/ui`     |
| Modal/Dialog       | `Modal`                 | `../components/ui`     |
| Form handling      | `useForm`               | `../hooks`             |
| Date formatting    | `useDateFormatter`      | `../hooks`             |
| Auth page layout   | `AuthLayout`            | `../components/layout` |
| Form validation    | `formValidationService` | `../services`          |

**💡 Pro Tip**: When adding new functionality, ask yourself: "Could this be useful elsewhere?" If yes, consider making it a reusable component or hook.

## 🧩 Component Development Guidelines

### Layout Components Architecture

The application uses a **hierarchical layout system** that provides consistent structure across all dashboard pages:

```
DashboardLayout
├── Sidebar (Navigation)
├── DashboardHeader (Top bar)
└── Outlet (Page content)
```

#### Key Layout Components

| Component   | Purpose                                        | Location                              | Features                                          |
| ----------- | ---------------------------------------------- | ------------------------------------- | ------------------------------------------------- |
| `AppLayout` | Main layout wrapper with sidebar and header    | `src/components/layout/AppLayout.tsx` | Mobile overlay, responsive design                 |
| `Sidebar`   | Navigation menu with collapsible functionality | `src/components/layout/Sidebar.tsx`   | Route detection, icon integration                 |
| `AppHeader` | Top header with user info and actions          | `src/components/layout/AppHeader.tsx` | Search, notifications, profile, language switcher |

#### Layout Best Practices

**✅ DO: Use AppLayout for all dashboard pages**

```typescript
// src/router/AppRouter.tsx
<Route path="/" element={<AppLayout />}>
  <Route path="dashboard" element={<ModernDashboard />} />
  <Route path="transactions" element={<TransactionsPage />} />
</Route>
```

**✅ DO: Keep layout-specific logic in layout components**

```typescript
// ✅ Good - Sidebar handles its own collapse state
const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  // Sidebar-specific logic here
};

// ✅ Good - AppHeader handles dropdowns and theme switching
const AppHeader: React.FC<AppHeaderProps> = ({ onMobileMenuToggle }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);

  // Header-specific state and logic
  return (
    <header className="app-header">
      <Search />
      <Notifications />
      <LanguageDropdown />
      <ProfileDropdown />
    </header>
  );
};
```

#### AppHeader Features

The `AppHeader` provides several built-in features:

- **🔍 Search Bar**: Global search functionality
- **🔔 Notifications**: Bell icon with notification count
- **🌍 Language Switcher**: Dropdown for English/Vietnamese
- **🌓 Theme Toggle**: Dark/light mode switching (ready for implementation)
- **👤 Profile Menu**: User avatar with dropdown (settings, logout)
- **📱 Mobile Menu**: Hamburger icon for mobile sidebar

**❌ DON'T: Duplicate layout structure in pages**

```typescript
// ❌ Bad - Don't recreate sidebar/header in each page
const TransactionsPage = () => (
  <div>
    <Sidebar /> {/* Don't do this - use AppLayout */}
    <Header />    <TransactionContent />
  </div>
);
```

## 💅 CSS Architecture & Styling Guidelines

MoneyWise follows a **component-centric CSS architecture** with clear separation of concerns between shared and component-specific styles.

### CSS Organization Strategy

```
src/styles/
├── global.css          # Global CSS variables, resets, utilities
├── pages.css           # Shared page layout patterns
└── Component.css       # Component-specific styles (co-located)

src/components/ui/
├── Button.tsx
├── Button.css          # Button-specific styles
├── Card.tsx
└── Card.css            # Card-specific styles

src/pages/
├── CategoriesPage.tsx
└── CategoriesPage.css  # Page-specific styles and overrides
```

### Styling Architecture Principles

#### ✅ DO: Component-Specific CSS Files

**Principle**: Each component with significant styling should have its own CSS file co-located with the component.

```css
/* CategoriesPage.css - Component-specific styles */

/* Grid Layout */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 320px));
  gap: var(--space-6);
  padding: var(--space-8) var(--space-6);
  justify-content: center;
  max-width: 1400px;
  margin: 0 auto;
}

/* Category Cards */
.category-card {
  background: var(--white);
  border: 1px solid var(--gray-100);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  transition: all var(--transition-normal);
}

/* Component-specific icon sizing */
.category-icon-wrapper {
  width: 48px !important;
  height: 48px !important;
}
```

#### ✅ DO: Shared Pattern Styles in pages.css

**Principle**: Common page layout patterns go in `pages.css`, component-specific styles stay with components.

```css
/* pages.css - Shared page patterns */

/* Reusable page structure */
.page-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  animation: fadeInUp 0.3s ease-out;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.page-title {
  font-size: 2rem;
  font-weight: var(--font-weight-bold);
  color: var(--gray-900);
}
```

#### ❌ DON'T: Mix Component Styles in Shared Files

```css
/* ❌ Bad - Don't put component-specific styles in pages.css */
.pages.css {
  .categories-grid {
    /* This belongs in CategoriesPage.css */
  }
  .transaction-form {
    /* This belongs in TransactionForm.css */
  }
}

/* ✅ Good - Keep shared patterns in pages.css */
.pages.css {
  .page-container {
    /* Shared across all pages */
  }
  .page-header {
    /* Common header pattern */
  }
}
```

### Modern UI Design Patterns

#### Dialog-Based Forms Pattern

**Use Case**: Complex forms that need focus and avoid inline editing complexity.

```css
/* Dialog-based creation pattern */
. {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog-content {
  background: var(--white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
}
```

**When to Use:**

- ✅ Complex forms with multiple fields
- ✅ Creation flows that need focus
- ✅ Forms with validation and suggestions
- ❌ Simple inline edits
- ❌ Quick toggles or single-field updates

#### Colorful Icon System Pattern

**Use Case**: Visual category identification with consistent color schemes.

```css
/* Colorful icon pattern with color scheme integration */
.category-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  /* Background color set by getCategoryColorScheme() */
}

.category-icon {
  width: 28px;
  height: 28px;
  color: var(--white);
}
```

**Implementation**: Use the `CategoryIcon` component with `useColorScheme` prop:

```tsx
<CategoryIcon
  categoryName="Food & Dining"
  useColorScheme={true}
  size={28}
  withWrapper={true}
/>
```

#### Soft CRUD Button Styling

**Use Case**: Visually distinct but not overwhelming action buttons.

```css
/* Modern CRUD button pattern - soft, muted colors */

/* Edit button - Soft Blue theme */
.edit-btn {
  background: #f1f5f9 !important;
  color: #475569 !important;
  border: 1px solid #e2e8f0 !important;
  transition: all 0.2s ease;
}

.edit-btn:hover {
  background: #e2e8f0 !important;
  color: #334155 !important;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Delete button - Soft Red theme */
.delete-btn {
  background: #fef2f2 !important;
  color: #b91c1c !important;
  border: 1px solid #fecaca !important;
}

.delete-btn:hover {
  background: #fee2e2 !important;
  color: #991b1b !important;
  transform: translateY(-1px);
}
```

**Design Philosophy**:

- Muted backgrounds instead of bold colors
- Subtle hover animations
- Clear visual hierarchy without being aggressive

### Responsive Design Patterns

#### Progressive Grid Enhancement

```css
/* Mobile-first responsive grid pattern */
.categories-grid {
  /* Base: Single column on mobile */
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-3);
  padding: var(--space-4);
}

@media (min-width: 768px) {
  .categories-grid {
    /* Tablet: Auto-fit with larger cards */
    grid-template-columns: repeat(auto-fill, minmax(300px, 320px));
    gap: var(--space-6);
    padding: var(--space-8) var(--space-6);
  }
}

@media (min-width: 1200px) {
  .categories-grid {
    /* Desktop: Centered with max width */
    grid-template-columns: repeat(auto-fill, minmax(320px, 340px));
    gap: var(--space-8);
    max-width: 1400px;
    margin: 0 auto;
  }
}
```

#### Centered Layout with Generous Spacing

```css
/* Centered content pattern with breathing room */
.categories-grid {
  justify-content: center; /* Center the grid items */
  max-width: 1400px; /* Prevent over-stretching */
  margin: 0 auto; /* Center the entire grid */
  padding: var(--space-8); /* Generous outer padding */
}
```

### CSS Architecture Best Practices

#### ✅ DO: Follow These Patterns

1. **Component CSS Co-location**

   ```
   CategoriesPage.tsx
   CategoriesPage.css  ← Component-specific styles
   ```

2. **Clear Separation of Concerns**

   ```css
   /* pages.css - Shared patterns only */
   .page-container {
   }
   .page-header {
   }

   /* CategoriesPage.css - Category-specific only */
   .categories-grid {
   }
   .category-card {
   }
   ```

3. **CSS Variable Usage**

   ```css
   /* Use design system variables */
   gap: var(--space-6);
   color: var(--gray-900);
   border-radius: var(--radius-lg);
   ```

4. **BEM-like Naming**
   ```css
   .category-card {
   }
   .category-card__header {
   }
   .category-card--loading {
   }
   ```

#### ❌ DON'T: Avoid These Antipatterns

1. **Mixing Component Styles in Shared Files**

   ```css
   /* ❌ Don't put these in pages.css */
   .categories-grid {
   }
   .transaction-form {
   }
   .wallet-card {
   }
   ```

2. **Hardcoded Values Instead of Variables**

   ```css
   /* ❌ Don't hardcode design tokens */
   gap: 24px;
   color: #374151;

   /* ✅ Use design system variables */
   gap: var(--space-6);
   color: var(--gray-700);
   ```

3. **Overly Specific Selectors**

   ```css
   /* ❌ Overly specific */
   .page .container .categories .grid .card .header .title {
   }

   /* ✅ Simple, clear naming */
   .category-card__title {
   }
   ```

### CSS Migration and Refactoring

When refactoring existing CSS or adding new components:

1. **Audit Current Styles**: Check what's in shared vs component files
2. **Move Component-Specific Styles**: Extract to co-located CSS files
3. **Keep Shared Patterns**: Maintain common layout patterns in `pages.css`
4. **Update Imports**: Ensure CSS files are properly imported
5. **Test Responsive Behavior**: Verify layouts work across screen sizes

The **Categories Page** serves as the **reference implementation** for this CSS architecture, demonstrating proper separation, modern UI patterns, and responsive design.

## 🔔 Notification & Dialog Systems

MoneyWise uses a **dual notification system** that replaces browser alerts and confirms with custom UI components:

### Toast Notification System

**Purpose**: Provide non-blocking feedback to users about successful operations or errors.

```typescript
// src/contexts/ToastContext.tsx
export const useToastContext = () => {
  const { showSuccess, showError, showInfo, showWarning } = useToastContext();

  // Usage in components
  const handleAction = async () => {
    const result = await performAction();
    if (result.success) {
      showSuccess('Operation completed successfully!');
    } else {
      showError('Operation failed. Please try again.');
    }
  };
};
```

#### Toast Usage Patterns

```typescript
// ✅ Good - Use toasts for feedback
const { showSuccess, showError } = useToastContext();

// Success operations
const result = await createCategory(data);
if (result.success) {
  showSuccess('Category created successfully!');
}

// Error handling
if (result.error) {
  showError(`Failed to create category: ${result.error}`);
}

// ❌ Don't use browser alerts
alert('Category created!'); // Don't do this
```

### Confirmation Dialog System

**Purpose**: Ask users to confirm destructive or important actions.

```typescript
// src/components/ui/ConfirmDialog.tsx
const [confirmDialog, setConfirmDialog] = useState({
  isOpen: false,
  categoryId: '',
  categoryName: '',
});

const handleDelete = (category) => {
  setConfirmDialog({
    isOpen: true,
    categoryId: category.categoryId,
    categoryName: category.name,
  });
};

const confirmDelete = async () => {
  const result = await deleteCategory(confirmDialog.categoryId);
  // Handle result...
  setConfirmDialog({ isOpen: false, categoryId: '', categoryName: '' });
};

return (
  <ConfirmDialog
    isOpen={confirmDialog.isOpen}
    title="Delete Category"
    message={`Are you sure you want to delete "${confirmDialog.categoryName}"?`}
    confirmText="Delete"
    cancelText="Cancel"
    type="danger"
    onConfirm={confirmDelete}
    onCancel={() => setConfirmDialog({ isOpen: false, categoryId: '', categoryName: '' })}
  />
);
```

#### Dialog Usage Patterns

```typescript
// ✅ Good - Use custom dialogs for confirmations
<ConfirmDialog
  isOpen={showDeleteDialog}
  title={t('categories.confirmDelete.title')}
  message={`${t('categories.confirmDelete.message')} "${itemName}"`}
  confirmText={t('categories.confirmDelete.confirm')}
  cancelText={t('categories.confirmDelete.cancel')}
  type="danger"
  onConfirm={handleConfirmDelete}
  onCancel={handleCancelDelete}
/>

// ❌ Don't use browser confirms
if (window.confirm('Are you sure?')) { // Don't do this
  deleteItem();
}
```

### Token Expiry Dialog System

**Purpose**: Handle session expiry gracefully with user choice to extend session or logout.

```typescript
// src/components/ui/TokenExpiryDialog.tsx
const [tokenExpired, setTokenExpired] = useState(false);

const handleStayLoggedIn = () => {
  refreshToken(); // Extend session
  setTokenExpired(false);
};

const handleTokenExpiryLogout = () => {
  logout(); // Clean logout
  setTokenExpired(false);
};

return (
  <TokenExpiryDialog
    isOpen={tokenExpired}
    onStayLoggedIn={handleStayLoggedIn}
    onLogout={handleTokenExpiryLogout}
  />
);
```

#### Token Dialog Integration

```typescript
// App.tsx - Global token expiry handling
import { TokenExpiryDialog } from './components/ui';

function AppContent() {
  const { tokenExpired, handleStayLoggedIn, handleTokenExpiryLogout } = useAuthContext();

  return (
    <>
      {/* Main app content */}
      <Routes>...</Routes>

      {/* Global dialogs */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      <TokenExpiryDialog
        isOpen={tokenExpired}
        onStayLoggedIn={handleStayLoggedIn}
        onLogout={handleTokenExpiryLogout}
      />
    </>
  );
}
```

### When to Use Each System

| Scenario                    | Use               | Example                             |
| --------------------------- | ----------------- | ----------------------------------- |
| **Success feedback**        | Toast             | "Category created successfully!"    |
| **Error feedback**          | Toast             | "Failed to save. Please try again." |
| **Destructive actions**     | Dialog            | "Delete this category?"             |
| **Important confirmations** | Dialog            | "Logout from your account?"         |
| **Loading states**          | Loading Component | `<Loading />`                       |
| **Form validation**         | Inline errors     | Field-specific error messages       |

## 🎨 Category Icon System

MoneyWise includes an **intelligent icon mapping system** that automatically selects appropriate icons for financial categories based on name patterns.

> 📚 **For complete documentation**, see [CATEGORY_ICON_SYSTEM_GUIDE.md](./CATEGORY_ICON_SYSTEM_GUIDE.md)

### Architecture Overview

```typescript
// Service Layer - Icon mapping logic
export const getCategoryIcon = (categoryName: string): LucideIcon => {
  const normalizedName = categoryName.toLowerCase().trim();
  const matchingPattern = CATEGORY_ICON_PATTERNS.find(pattern =>
    pattern.keywords.some(keyword => normalizedName.includes(keyword))
  );
  return matchingPattern?.icon || Folder;
};

// Component Layer - UI rendering
<CategoryIcon categoryName="Food & Dining" size={24} />

// Hook Layer - React integration
const { suggestions, getIcon, hasKnownIcon } = useCategoryIcon();
```

### Quick Usage Examples

#### Basic Icon Display

```typescript
import { CategoryIcon } from '../components/ui';

// Simple usage
<CategoryIcon categoryName="Food & Dining" size={24} />

// With wrapper styling
<CategoryIcon
  categoryName="Transportation"
  size={28}
  withWrapper={true}
  className="custom-icon"
/>
```

#### Category Suggestions with Icons

```typescript
import { useCategoryIcon } from '../hooks';

const CreateCategoryForm = () => {
  const { suggestions } = useCategoryIcon();
  const { t } = useLanguageContext();

  return (
    <div className="icon-examples">
      <p>{t('categories.examplesTitle')}</p>
      <div className="example-tags">
        {suggestions.map(({ translationKey }) => {
          const translatedName = t(translationKey);
          return (
            <span
              key={translationKey}
              className="example-tag"
              onClick={() => setFormData({ name: translatedName })}
            >
              {translatedName}
            </span>
          );
        })}
      </div>
    </div>
  );
};
```

### Supported Categories (22+ Icons)

- **Financial**: Salary, Income, Investment, Savings → 💰📈🐷
- **Food & Dining**: Food, Restaurant, Grocery → 🍴
- **Transportation**: Car, Gas, Taxi, Uber → 🚗
- **Shopping**: Clothes, Retail → 🛍️
- **Entertainment**: Movies, Games → 🎮
- **Health**: Medical, Fitness, Gym → ❤️💪
- **Travel**: Vacation, Flight, Hotel → ✈️
- **Housing**: Rent, Utilities → 🏠⚡
- **And 14+ more categories...**

### Key Benefits

- **Intelligent**: Keyword-based matching with fallback
- **Internationalized**: Works with translated category names
- **Extensible**: Easy to add new icon patterns
- **Performance**: Memoized suggestions and efficient matching
- **Type-safe**: Full TypeScript support

### Development Guidelines

**✅ DO:**

- Use `CategoryIcon` component for all category displays
- Use `useCategoryIcon()` hook for suggestions and logic
- Add new patterns to `CATEGORY_ICON_PATTERNS` for new categories

**❌ DON'T:**

- Hardcode icon selections in components
- Duplicate icon mapping logic
- Skip the service layer for icon operations

### ✅ Good Component Structure

```typescript
// 1. Imports (external first, then internal)
import React, { useState, useEffect } from 'react';
import { SomeExternalLib } from 'external-lib';
import { useAuthContext } from '../contexts';
import { Button } from '../components/ui';
import type { User } from '../types';
import './ComponentName.css';

// 2. Interface definitions
interface ComponentProps {
  user: User;
  onSave?: (user: User) => void;
  className?: string;
}

// 3. Component implementation
export const ComponentName: React.FC<ComponentProps> = ({
  user,
  onSave,
  className = '',
}) => {
  // 4. Hooks (state first, then effects)
  const [isEditing, setIsEditing] = useState(false);
  const { isAuthenticated } = useAuthContext();

  useEffect(() => {
    // Side effects
  }, []);

  // 5. Event handlers
  const handleSave = () => {
    onSave?.(user);
    setIsEditing(false);
  };

  // 6. Early returns
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  // 7. Main render
  return (
    <div className={`component-name ${className}`}>
      {/* JSX */}
    </div>
  );
};

export default ComponentName;
```

### 🎨 CSS Guidelines

```css
/* ComponentName.css */

/* 1. Main component styles */
.component-name {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

/* 2. Element styles (use BEM-like naming) */
.component-name__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.component-name__title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

/* 3. State modifiers */
.component-name--loading {
  opacity: 0.6;
  pointer-events: none;
}

.component-name--error {
  border: 1px solid var(--color-error);
}

/* 4. Responsive design */
@media (max-width: 768px) {
  .component-name {
    padding: 0.5rem;
  }

  .component-name__header {
    flex-direction: column;
    gap: 0.5rem;
  }
}
```

## 🔌 API Integration Best Practices

### ✅ DO

```typescript
// Good: Transform data in API layer
export const userApi = {
  getProfile: async (): Promise<UserProfile> => {
    const response =
      await httpClient.get<BackendUserResponse>('/users/profile');

    // Transform backend format to frontend format
    return {
      id: response.data.user_id,
      name: response.data.full_name,
      email: response.data.email_address,
      avatar: response.data.profile_image_url,
    };
  },
};

// Good: Handle errors consistently
export const transactionApi = {
  create: async (data: CreateTransactionRequest): Promise<Transaction> => {
    try {
      const response = await httpClient.post<Transaction>(
        '/transactions',
        data
      );
      return response.data;
    } catch (error) {
      // Let the httpClient interceptor handle the error
      throw error;
    }
  },
};
```

### ❌ DON'T

```typescript
// Bad: Don't put UI logic in API
export const badApi = {
  login: async (credentials: LoginRequest) => {
    const response = await httpClient.post('/auth/login', credentials);
    // ❌ Don't do this - UI concerns don't belong here
    toast.success('Login successful!');
    router.navigate('/dashboard');
    return response.data;
  },
};

// Bad: Don't put React state in API
export const badApi2 = {
  transactions: [], // ❌ No state in API layer
  setTransactions: (data: Transaction[]) => {
    // ❌ No setters
    badApi2.transactions = data;
  },
};
```

## 🪝 Custom Hooks Guidelines

### When to Create a Custom Hook

✅ **DO create hooks for:**

- SWR-based data fetching with cache management
- Reusable logic across multiple components
- Complex state management with mutations
- Side effects coordination and error handling

❌ **DON'T create hooks for:**

- Simple state that's only used in one component
- Pure functions (use utils instead)
- Direct API calls without caching (use SWR directly)

### Modern Hook Structure Template (SWR-based)

```typescript
// src/hooks/useFeatureData.ts
import useSWR, { mutate } from 'swr';
import { featureApi } from '../api';
import { SWR_KEYS } from '../config/swr';
import type { FeatureData, CreateFeatureRequest } from '../types';

/**
 * Hook for fetching feature data with SWR
 */
export const useFeatureData = () => {
  const { data, error, isLoading } = useSWR<FeatureData[]>(
    SWR_KEYS.FEATURES.ALL,
    () => featureApi.getAll()
  );

  return {
    data,
    isLoading,
    error,
    refresh: () => mutate(SWR_KEYS.FEATURES.ALL),
  };
};

/**
 * Hook for feature mutations with SWR cache management
 */
export const useFeatureMutations = () => {
  const createItem = async (data: CreateFeatureRequest) => {
    try {
      const newItem = await featureApi.create(data);
      mutate(SWR_KEYS.FEATURES.ALL); // Auto-refresh cache
      return { success: true, data: newItem };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create item',
      };
    }
  };

  const updateItem = async (
    id: string,
    data: Partial<CreateFeatureRequest>
  ) => {
    try {
      const updatedItem = await featureApi.update(id, data);
      mutate(SWR_KEYS.FEATURES.ALL);
      mutate(SWR_KEYS.FEATURES.BY_ID(id));
      return { success: true, data: updatedItem };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update item',
      };
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await featureApi.delete(id);
      mutate(SWR_KEYS.FEATURES.ALL);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete item',
      };
    }
  };

  return {
    createItem,
    updateItem,
    deleteItem,
  };
};
```

### Legacy Hook Pattern (Deprecated)

```typescript
// ❌ Old Pattern - Don't use manual state management
export const useFeature = (initialLoad = true): UseFeatureReturn => {
  const [data, setData] = useState<FeatureData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await featureApi.getAll();
      setData(result);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Manual effects and state management...
  useEffect(() => {
    if (initialLoad) {
      fetchData();
    }
  }, [fetchData, initialLoad]);

  return { data, isLoading, error, fetchData };
};
```

## 🌐 Language and Internationalization

The MoneyWise application supports multiple languages (English and Vietnamese) through a robust i18n system.

> 📚 **For complete documentation**, see [INTERNATIONALIZATION_GUIDE.md](./INTERNATIONALIZATION_GUIDE.md)

### Hook Naming Conventions

To avoid confusion, we use distinct naming conventions:

**Language Hooks:**

- `useLanguageContext()` - Context hook for standard usage (recommended)
- `useTranslations()` - Direct hook for custom language features

**Authentication Hooks:**

- `useAuthContext()` - Context hook for standard usage (recommended)
- `useAuthentication()` - Direct hook for custom auth features

**Data Fetching Hooks:**

- `useCategories()` - Fetch all categories with SWR
- `useCategory(id)` - Fetch single category with SWR
- `useCategoryMutations()` - Category CRUD operations
- `useCategoryIcon()` - Category icon system hook

**Utility Hooks:**

- `useCurrency()` - Currency formatting and conversion
- `useCurrencyFormatter()` - Advanced currency formatting, parsing, and validation
- `useAmountInput()` - Currency-aware amount input with real-time formatting and validation
- `useApi()` - Legacy hook (deprecated, use SWR hooks instead)
- `useToast()` - Toast notification management

### Quick Usage Examples

#### Standard Component (Most Common)

```typescript
import { useLanguageContext, useAuthContext } from '../contexts';

const MyComponent = () => {
  const { t } = useLanguageContext();
  const { user, logout } = useAuthContext();

  return (
    <div>
      <h1>{t('dashboard.welcome')}</h1>
      <p>{t('common.hello')}, {user?.firstName}!</p>
      <button onClick={logout}>{t('auth.logout')}</button>
    </div>
  );
};
```

#### Custom Language Feature

```typescript
import { useTranslations } from '../hooks';

const AdvancedLanguageSwitcher = () => {
  const { language, setLanguage, toggleLanguage, isLoading } = useTranslations();

  // Custom language switching logic
  return (
    <div>
      <button onClick={toggleLanguage} disabled={isLoading}>
        {language === 'en' ? 'Switch to Vietnamese' : 'Chuyển sang tiếng Anh'}
      </button>
    </div>
  );
};
```

### Quick Translation Reference

```typescript
// Use hierarchical keys for better organization
const MyComponent = () => {
  const { t } = useLanguageContext();

  return (
    <div>
      <h1>{t('auth.loginTitle')}</h1>           {/* 'Welcome Back' */}
      <p>{t('dashboard.welcome')}</p>           {/* 'Welcome to your dashboard' */}
      <span>{t('common.loading')}</span>        {/* 'Loading...' */}
      <button>{t('common.save')}</button>       {/* 'Save' */}
    </div>
  );
};
```

### Key Development Rules

✅ **DO:**

- Use `useLanguageContext()` for standard components
- Use `useAuthContext()` for authentication needs
- Always use `t('key.path')` for user-facing text
- Organize keys by feature: `auth.validation.emailRequired`

❌ **DON'T:**

- Hardcode strings: `<h1>Welcome</h1>`
- Use old hook names: `useLanguage` from hooks
- Mix hook types in same component

> 📚 **For complete implementation details, architecture, and extension guide**, see [INTERNATIONALIZATION_GUIDE.md](./INTERNATIONALIZATION_GUIDE.md)

## ✅ Code Quality Standards

### TypeScript Requirements

```typescript
// ✅ Always define interfaces for props
interface ComponentProps {
  user: User;
  onSave: (user: User) => void;
  className?: string; // Optional props with ?
}

// ✅ Use proper return types for functions
const calculateTotal = (items: Item[]): number => {
  return items.reduce((sum, item) => sum + item.price, 0);
};

// ✅ Use type guards when needed
const isUser = (obj: unknown): obj is User => {
  return typeof obj === 'object' && obj !== null && 'id' in obj;
};
```

### Error Handling

```typescript
// ✅ Handle errors at the right level
const MyComponent = () => {
  const { createTransaction, isLoading } = useTransactions();
  const { showError, showSuccess } = useToastContext();

  const handleSubmit = async (data: CreateTransactionRequest) => {
    try {
      const result = await createTransaction(data);
      if (result.success) {
        showSuccess('Transaction created!');
      } else {
        showError(result.error || 'Failed to create transaction');
      }
    } catch (error) {
      // This should rarely happen if your hook handles errors properly
      showError('An unexpected error occurred');
    }
  };

  // ... rest of component
};
```

### Naming Conventions

| Type                 | Convention                                      | Example                                                   |
| -------------------- | ----------------------------------------------- | --------------------------------------------------------- |
| **Components**       | PascalCase                                      | `TransactionCard`, `UserProfile`                          |
| **Files**            | PascalCase for components, camelCase for others | `TransactionCard.tsx`, `userUtils.ts`                     |
| **Functions**        | camelCase                                       | `calculateTotal`, `handleSubmit`                          |
| **Variables**        | camelCase                                       | `userName`, `isLoading`                                   |
| **Constants**        | UPPER_SNAKE_CASE                                | `API_BASE_URL`, `MAX_RETRIES`                             |
| **CSS Classes**      | kebab-case                                      | `.transaction-card`, `.user-profile`                      |
| **Hooks**            | camelCase starting with 'use'                   | `useTransactions`, `useAuthContext`, `useLanguageContext` |
| **Types/Interfaces** | PascalCase                                      | `User`, `CreateTransactionRequest`                        |

## 🚨 Common Mistakes to Avoid

### ❌ Architecture Violations

```typescript
// ❌ DON'T: API calls in components
const BadComponent = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // ❌ Direct API call in component
    fetch('/api/transactions')
      .then(res => res.json())
      .then(setData);
  }, []);
};

// ✅ DO: Use SWR-based hooks for data fetching
const GoodComponent = () => {
  const { transactions, isLoading } = useTransactions();
  // Component focuses on UI logic only
};
```

```typescript
// ❌ DON'T: Manual state management for server data
const BadComponent = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await categoryApi.getAll();
      setCategories(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      {isLoading ? <Loading /> : categories.map(cat => <div key={cat.id}>{cat.name}</div>)}
    </div>
  );
};

// ✅ DO: Use SWR for automatic caching and updates
const GoodComponent = () => {
  const { categories, isLoading } = useCategories();

  return (
    <div>
      {isLoading ? <Loading /> : categories?.map(cat => <div key={cat.categoryId}>{cat.name}</div>)}
    </div>
  );
};
```

```typescript
// ❌ DON'T: Business logic in API layer
export const badTransactionApi = {
  create: async (data: CreateTransactionRequest) => {
    // ❌ Business logic doesn't belong here
    if (data.amount > 10000) {
      throw new Error('Amount too large');
    }

    // ❌ UI logic doesn't belong here
    toast.success('Transaction created!');

    return httpClient.post('/transactions', data);
  },
};

// ✅ DO: Pure API operations
export const goodTransactionApi = {
  create: async (data: CreateTransactionRequest): Promise<Transaction> => {
    const response = await httpClient.post<Transaction>('/transactions', data);
    return response.data;
  },
};
```

### ❌ Notification & Dialog Issues

```typescript
// ❌ DON'T: Use browser alerts and confirms
const handleDelete = async (id: string) => {
  if (window.confirm('Are you sure?')) {
    // Don't do this
    await deleteItem(id);
    alert('Item deleted!'); // Don't do this
  }
};

// ✅ DO: Use custom notifications and dialogs
const handleDelete = (item: Item) => {
  setConfirmDialog({
    isOpen: true,
    itemId: item.id,
    itemName: item.name,
  });
};

const confirmDelete = async () => {
  const result = await deleteItem(confirmDialog.itemId);
  if (result.success) {
    showSuccess('Item deleted successfully!');
  } else {
    showError(result.error);
  }
  setConfirmDialog({ isOpen: false, itemId: '', itemName: '' });
};
```

### ❌ SWR Usage Issues

```typescript
// ❌ DON'T: Mix manual state with SWR
const BadComponent = () => {
  const [categories, setCategories] = useState([]);
  const { data } = useSWR('/categories', fetcher);

  useEffect(() => {
    if (data) {
      setCategories(data); // Don't duplicate state
    }
  }, [data]);
};

// ✅ DO: Use SWR state directly
const GoodComponent = () => {
  const { categories, isLoading } = useCategories();
  // Use SWR state directly
};
```

```typescript
// ❌ DON'T: Manual cache invalidation
const BadComponent = () => {
  const handleCreate = async data => {
    await categoryApi.create(data);
    // Manual refetch
    window.location.reload(); // Very bad
    fetchCategories(); // Still bad
  };
};

// ✅ DO: Let SWR handle cache updates
const GoodComponent = () => {
  const { createCategory } = useCategoryMutations();

  const handleCreate = async data => {
    const result = await createCategory(data);
    // SWR automatically updates cache
    if (result.success) {
      showSuccess('Category created!');
    }
  };
};
```

### ❌ State Management Issues

```typescript
// ❌ DON'T: Prop drilling
const App = () => {
  const [user, setUser] = useState(null);
  return <Page1 user={user} setUser={setUser} />;
};

const Page1 = ({ user, setUser }) => {
  return <Page2 user={user} setUser={setUser} />;
};

// ✅ DO: Use context for global state
const { user, logout } = useAuthContext();
```

### ❌ Import Issues

```typescript
// ❌ DON'T: Circular imports
// fileA.ts
import { functionB } from './fileB';

// fileB.ts
import { functionA } from './fileA'; // ❌ Circular dependency

// ❌ DON'T: Import from implementation files
import { useAuthContext } from '../contexts/AuthContext'; // ❌ Import from implementation

// ✅ DO: Import from index files
import { useAuthContext } from '../contexts'; // ✅ Import from index
```

## 📝 Examples

This guide includes several real-world examples from the MoneyWise application that demonstrate best practices:

### 1. Categories Page - Reference Implementation ⭐

The **Categories Page** serves as the **complete reference implementation** of MoneyWise's modern architecture and is the **gold standard** for all new feature development:

**Architecture Completeness:**

- ✅ **SWR Integration**: Full `useCategories()` and `useCategoryMutations()` implementation
- ✅ **Toast Notifications**: Comprehensive success/error feedback for all CRUD operations
- ✅ **Confirmation Dialogs**: Modern dialog system replacing browser confirms
- ✅ **Internationalization**: 100% translation coverage with hierarchical keys
- ✅ **Category Icon System**: Intelligent icon selection with colorful schemes
- ✅ **Dialog-Based Forms**: Modern UI pattern with focused creation flow
- ✅ **CSS Architecture**: Proper separation with component-specific styling
- ✅ **Responsive Design**: Mobile-first with progressive enhancement
- ✅ **Modern CRUD Patterns**: Soft, muted button styling and visual hierarchy

**UI/UX Excellence:**

- **Dialog-Based Creation**: Header-mounted "Add Category" button with focused modal
- **Colorful Icon System**: Each category gets a unique, consistent color scheme
- **Generous Spacing**: Cards properly spaced with breathing room
- **Modern Button Styling**: Soft, muted colors instead of aggressive bright buttons
- **Progressive Grid Layout**: Responsive grid that adapts from mobile to desktop
- **Hover Animations**: Subtle card elevation and color transitions

**Files to Study (Reference Implementation):**

- `src/pages/CategoriesPage.tsx` - **Gold standard page implementation**
- `src/pages/CategoriesPage.css` - **Complete CSS architecture example**
- `src/hooks/useFinanceData.ts` - **Perfect SWR integration patterns**
- `src/components/ui/CategoryIcon.tsx` - **Colorful icon component system**
- `src/services/categoryIconService.ts` - **Business logic separation example**

> 💡 **For New Developers**: Start by studying the Categories Page implementation. It demonstrates every pattern, principle, and best practice outlined in this guide. Use it as your blueprint for all new features.

### 2. Modern Layout System

The **App Layout System** demonstrates the new layout architecture:

**Key Features Demonstrated:**

- **Responsive Design**: Mobile-first with collapsible sidebar
- **Navigation Integration**: Smart active states and ROUTES constants
- **Header Features**: Search, notifications, profile, language switcher
- **Context Integration**: Auth, language, and toast contexts

**Files to Study:**

- `src/components/layout/AppLayout.tsx` - Main layout wrapper
- `src/components/layout/AppHeader.tsx` - Top navigation
- `src/components/layout/Sidebar.tsx` - Side navigation
- `src/router/AppRouter.tsx` - Route structure

### 3. SWR Data Fetching Pattern

The **Finance Data Hooks** show the complete SWR integration:

**Key Features Demonstrated:**

- **Cache Management**: Automatic cache updates on mutations
- **Error Handling**: Consistent error patterns across all operations
- **Optimistic Updates**: UI updates before server confirmation
- **Type Safety**: Full TypeScript support for all operations

**Files to Study:**

- `src/hooks/useFinanceData.ts` - Complete SWR integration
- `src/config/swr.ts` - SWR configuration and keys
- `src/api/financeApi.ts` - API layer integration

### 4. SWR Migration Demonstration

The **SWR Example Component** provides a live comparison of old vs new patterns:

**Key Features Demonstrated:**

- **Side-by-side comparison**: Old `useApi` vs new SWR hooks
- **Cache behavior**: Shows SWR caching and deduplication in action
- **Performance benefits**: Demonstrates background updates and shared state
- **Migration guide**: Visual proof of SWR advantages

**Files to Study:**

- `src/components/examples/SWRExample.tsx` - Live comparison demo
- `src/hooks/useApi.ts` - Legacy hook (deprecated)
- `src/hooks/useFinanceData.ts` - Modern SWR hooks

**Usage**: Visit `/swr-example` route to see the live comparison and understand why SWR is superior for data fetching.

### 5. Available Example Components

The application includes several **educational examples** that you can access for learning:

#### SWR vs Legacy Comparison (`/swr-example`)

- **Component**: `src/components/examples/SWRExample.tsx`
- **Purpose**: Side-by-side comparison of old `useApi` vs modern SWR hooks
- **Learn**: Cache behavior, performance benefits, background updates

#### Currency System Demo

- **Components**: `src/components/forms/TransactionForm.tsx`, `src/components/ui/AdvancedSearch.tsx`
- **Hooks**: `src/hooks/useAmountInput.ts`, `src/hooks/useCurrencyFormatter.ts`
- **Purpose**: Demonstrates currency-aware amount input with real-time formatting and validation
- **Learn**: Currency input patterns, format/parse logic, validation handling

**Key Features Demonstrated:**

- **Real-time formatting**: Amount fields auto-format as users type
- **Currency awareness**: Display currency symbols and appropriate decimal places
- **Input validation**: Real-time and on-blur validation with user-friendly error messages
- **Parse/format separation**: Clean separation between display and raw values
- **Reusable logic**: Centralized currency logic in custom hooks

#### UI Component Showcase

- **Toast Notifications**: Examples of success, error, warning, info toasts
- **Confirmation Dialogs**: Various dialog types and usage patterns
- **Category Icons**: Live icon selection and smart suggestions
- **Layout Responsive**: Mobile and desktop layout behavior

These examples serve as **live documentation** and help developers understand implementation patterns before building new features.

### 6. Currency-Aware Input Pattern

The **Currency Input Hooks** demonstrate the modern approach to handling currency input with real-time formatting and validation:

**Key Features Demonstrated:**

- **Real-time formatting**: Amount fields format as users type
- **Currency awareness**: Display appropriate currency symbols and decimal places
- **Input validation**: Real-time and on-blur validation with error messages
- **Parse/format separation**: Clean separation between display and raw values
- **Reusable logic**: Centralized currency handling in custom hooks

**Example Implementation:**

```typescript
// Modern currency input with hooks
import { useAmountInput } from '../hooks';

const MyForm = () => {
  const amountInput = useAmountInput({
    initialValue: 0,
    onAmountChange: (amount) => {
      console.log('Raw amount:', amount); // Always in base currency (VND)
    },
    onError: (error) => {
      console.log('Validation error:', error);
    },
  });

  return (
    <TextField
      label={`Amount (${currency.toUpperCase()})`}
      value={amountInput.displayAmount}        // Formatted for display
      onChange={e => amountInput.handleInputChange(e.target.value)}
      onFocus={amountInput.handleFocus}        // Clear formatting for editing
      onBlur={amountInput.handleBlur}          // Apply formatting
      error={!!amountInput.error}
      helperText={amountInput.error}
      placeholder={amountInput.placeholder}    // e.g., "0.00 USD"
    />
  );
};
```

**Files to Study:**

- `src/hooks/useAmountInput.ts` - Complete amount input state management
- `src/hooks/useCurrencyFormatter.ts` - Currency formatting and parsing logic
- `src/components/forms/TransactionForm.tsx` - Real implementation example
- `src/components/ui/AdvancedSearch.tsx` - Min/max amount input example

## 🚀 Migration Guide

### From Old to New Architecture

If you're working with older parts of the codebase, here's how to migrate:

#### 1. Data Fetching Migration

```typescript
// OLD: Manual state management
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);

const fetchData = async () => {
  setLoading(true);
  try {
    const result = await api.getData();
    setData(result);
  } finally {
    setLoading(false);
  }
};

// NEW: SWR-based hooks
const { data, isLoading } = useDataWithSWR();
```

#### 2. Notification Migration

```typescript
// OLD: Browser alerts
alert('Success!');
if (confirm('Delete?')) deleteItem();

// NEW: Custom notifications
showSuccess('Success!');
<ConfirmDialog onConfirm={deleteItem} />
```

#### 3. Layout Migration

```typescript
// OLD: Individual layout imports
import DashboardLayout from '../layout/DashboardLayout';
import Header from '../layout/Header';

// NEW: Centralized layout system
// Pages use AppRouter with AppLayout - no individual imports needed
```

#### 4. Icon System Migration

```typescript
// OLD: Hardcoded icons
const getIcon = (category) => {
  if (category.includes('food')) return <Utensils />;
  return <Folder />;
};

// NEW: Service-based system
import { CategoryIcon } from '../components/ui';
<CategoryIcon categoryName={category.name} />
```

#### 5. CSS Architecture Migration

```css
/* OLD: Mixed component styles in shared files */
/* pages.css */
.categories-grid {
} /* ❌ Component-specific */
.transaction-form {
} /* ❌ Component-specific */
.page-header {
} /* ✅ Shared pattern */

/* NEW: Proper separation of concerns */
/* pages.css - Shared patterns only */
.page-container {
}
.page-header {
}

/* CategoriesPage.css - Component-specific */
.categories-grid {
  grid-template-columns: repeat(auto-fill, minmax(300px, 320px));
  justify-content: center;
  max-width: 1400px;
  margin: 0 auto;
}
```

#### 6. Modern UI Pattern Migration

```css
/* OLD: Inline forms and aggressive button colors */
.edit-btn {
  background: #3b82f6; /* Bright blue */
  color: white;
}

/* NEW: Dialog-based forms and soft button styling */
.modal {
  position: fixed;
  /* Dialog overlay pattern */
}

.edit-btn {
  background: #f1f5f9; /* Soft blue background */
  color: #475569; /* Muted text */
  border: 1px solid #e2e8f0;`
}
```

#### 7. Currency Input Migration

```typescript
// OLD: Manual currency formatting and parsing
const [amount, setAmount] = useState('');
const [rawAmount, setRawAmount] = useState(0);

const handleAmountChange = (value: string) => {
  setAmount(value);
  const parsed = parseFloat(value.replace(/[^0-9.]/g, ''));
  setRawAmount(isNaN(parsed) ? 0 : parsed);
};

const formatAmount = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

// NEW: Currency-aware hooks with automatic formatting
const amountInput = useAmountInput({
  initialValue: editingTransaction?.amount || 0,
  onAmountChange: (amount) => {
    // Handle the raw amount change
    console.log('Raw amount:', amount);
  },
  onError: (error) => {
    // Handle validation errors
    console.log('Error:', error);
  },
});

// Usage in JSX
<TextField
  value={amountInput.displayAmount}      // Auto-formatted display
  onChange={e => amountInput.handleInputChange(e.target.value)}
  onFocus={amountInput.handleFocus}      // Clear formatting for editing
  onBlur={amountInput.handleBlur}        // Apply formatting
  error={!!amountInput.error}
  helperText={amountInput.error}
/>
```

### Best Practices Summary

**✅ DO:**

- Use SWR for all server state management
- Use toasts for feedback, dialogs for confirmations
- Use `CategoryIcon` component with colorful schemes
- Use `useLanguageContext()` for translations
- Use `AppLayout` for all dashboard pages
- Follow component-specific CSS architecture
- Use dialog-based forms for complex creation flows
- Use soft, muted colors for CRUD buttons
- Center layouts with generous spacing

**❌ DON'T:**

- Mix manual state management with SWR
- Use browser alerts or confirms
- Hardcode icons or text strings
- Mix component styles in shared CSS files
- Use aggressive button colors
- Create inline forms for complex flows
- Let grids stretch without max-width constraints

### Migration Checklist

When updating or creating new features:

- [ ] **Data Fetching**: Use SWR-based hooks (`useCategories`, etc.)
- [ ] **Notifications**: Use `ToastContext` instead of alerts
- [ ] **Confirmations**: Use `ConfirmDialog` instead of browser confirms
- [ ] **Icons**: Use `CategoryIcon` component and service with color schemes
- [ ] **Translations**: Use `useLanguageContext()` and translation keys
- [ ] **Currency Input**: Use `useAmountInput()` and `useCurrencyFormatter()` hooks
- [ ] **CSS Architecture**: Separate component styles from shared patterns
- [ ] **UI Patterns**: Use dialog-based forms for complex creation
- [ ] **Button Styling**: Use soft, muted color schemes instead of bright colors
- [ ] **Layout**: Center grids with max-width and generous padding
- [ ] **Layout**: Use `AppLayout` and `AppRouter` structure
- [ ] **Types**: Define TypeScript interfaces for all data
- [ ] **Error Handling**: Use consistent error patterns
- [ ] **Export Structure**: Update index.ts files
- [ ] **Documentation**: Update relevant guide sections

This architecture ensures consistency, maintainability, and excellent user experience across the entire MoneyWise application.

## 📚 Related Guides

The MoneyWise project includes several specialized guides for different aspects of the system:

### 🎨 [Category Icon System Guide](./CATEGORY_ICON_SYSTEM_GUIDE.md)

- **Complete icon system documentation**
- Icon pattern definitions and keyword mapping
- Component usage and customization examples
- Service architecture and extension guide

### 🔄 [DRY Refactoring Guide](./DRY_REFACTORING_GUIDE.md)

- **Complete DRY refactoring documentation**
- Before/after code comparisons and benefits achieved
- Reusable component and hook documentation
- Best practices for maintaining DRY principles

### 🌐 [Internationalization Guide](./INTERNATIONALIZATION_GUIDE.md)

- **Complete i18n system documentation**
- Translation key organization and hierarchy
- Language switching implementation
- Context vs hook usage patterns

### 💰 [Currency Module Guide](./CURRENCY_MODULE_GUIDE.md)

- **Multi-currency system documentation**
- Currency formatting and conversion
- Exchange rate integration
- Regional formatting patterns

### 📊 [App Layout & Navigation Guide](./APP_LAYOUT_GUIDE.md)

- **Complete layout system documentation**
- AppLayout, AppHeader, and Sidebar architecture
- Responsive design and mobile optimization
- Navigation patterns and routing integration

### Development Workflow

**For new features**, follow this guide order:

1. **Start here**: DEVELOPMENT_GUIDE.md (this guide)
2. **Check DRY patterns**: DRY_REFACTORING_GUIDE.md (for reusable components)
3. **Study reference**: CategoriesPage.tsx and CategoriesPage.css ⭐
4. **For icons**: CATEGORY_ICON_SYSTEM_GUIDE.md
5. **For text**: INTERNATIONALIZATION_GUIDE.md
6. **For currency**: CURRENCY_MODULE_GUIDE.md
7. **For layout**: APP_LAYOUT_GUIDE.md

> 💡 **Quick Start**: Always check the **DRY Refactoring Guide** first to see if there are existing components or hooks that solve your needs. Then study the **Categories Page implementation** (`src/pages/CategoriesPage.tsx` + `.css`) - it's the perfect reference implementation that demonstrates every pattern and principle in this guide.

Each guide complements this main development guide with specialized information for specific system components.

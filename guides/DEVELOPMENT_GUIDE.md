# MoneyWise Frontend Development Guide

A comprehensive guide for building features in the MoneyWise React + TypeScript application while maintaining clean architecture and code consistency.

## 📋 Table of Contents

- [🏗️ Architecture Overview](#️-architecture-overview)
- [🚀 Feature Development Workflow](#-feature-development-workflow)
- [📂 Project Structure Rules](#-project-structure-rules)
- [🛣️ Routing Architecture](#️-routing-architecture)
- [🎯 Step-by-Step Feature Development](#-step-by-step-feature-development)
- [🧩 Component Development Guidelines](#-component-development-guidelines)
- [🔌 API Integration Best Practices](#-api-integration-best-practices)
- [🪝 Custom Hooks Guidelines](#-custom-hooks-guidelines)
- [🌐 Language and Internationalization](#-language-and-internationalization)
- [🎨 Styling Guidelines](#-styling-guidelines)
- [✅ Code Quality Standards](#-code-quality-standards)
- [🚨 Common Mistakes to Avoid](#-common-mistakes-to-avoid)
- [📝 Examples](#-examples)

## 🏗️ Architecture Overview

Our frontend follows a **layered architecture** with clear separation of concerns:

```
┌─────────────────┐
│   Components    │ ← UI logic, user interaction, form handling
│   (Pages/UI)    │
└─────────────────┘
         ↓
┌─────────────────┐
│   Contexts      │ ← Global state management (Auth, Toast)
│   (Providers)   │
└─────────────────┘
         ↓
┌─────────────────┐
│     Hooks       │ ← React state, effects, API orchestration
│   (useAuth)     │
└─────────────────┘
         ↓
┌─────────────────┐
│    Services     │ ← Business logic, complex calculations
│  (Future use)   │   (Currently empty - use when needed)
└─────────────────┘
         ↓
┌─────────────────┐
│   API Layer     │ ← HTTP requests, data transformation
│  (authApi, etc) │
└─────────────────┘
         ↓
┌─────────────────┐
│    Backend      │ ← Spring Boot API
└─────────────────┘
```

### 🎯 Layer Responsibilities

| Layer          | Purpose                         | What Goes Here                                 | What NOT to Put Here                     |
| -------------- | ------------------------------- | ---------------------------------------------- | ---------------------------------------- |
| **Components** | UI rendering & user interaction | JSX, form handling, event handlers, validation | API calls, business logic, complex state |
| **Contexts**   | Global state management         | Auth state, toast notifications, theme         | Component-specific state, API calls      |
| **Hooks**      | React state & API orchestration | useState, useEffect, API coordination          | Direct JSX, business calculations        |
| **Services**   | Business logic & calculations   | Complex algorithms, data processing            | React state, UI logic                    |
| **API**        | Backend communication           | HTTP requests, data transformation             | UI logic, React state                    |

## 🚀 Feature Development Workflow

Follow this **exact order** when building any new feature:

### Phase 1: Planning & Types

1. **Define Types** (`src/types/`)
2. **Plan API Endpoints** (check with backend team)
3. **Design Component Hierarchy**

### Phase 2: Foundation

4. **Create API Functions** (`src/api/`)
5. **Build Custom Hooks** (`src/hooks/`)
6. **Add Business Services** (`src/services/`) _if needed_

### Phase 3: UI

7. **Create UI Components** (`src/components/ui/`)
8. **Build Feature Components** (`src/components/`)
9. **Create Pages** (`src/pages/`)

### Phase 4: Integration

10. **Add Routes** (`src/router/AppRouter.tsx` & `src/constants/index.ts`)
11. **Update Navigation** (`src/components/layout/Sidebar.tsx`)
12. **Test Integration**
13. **Add Error Handling**

## 📂 Project Structure Rules

### ✅ DO Follow These Patterns

```
src/
├── api/                    # HTTP requests only
├── components/
│   ├── ui/                # Reusable UI components
│   ├── layout/            # Layout-specific components (Sidebar, Header, etc.)
│   └── examples/          # Example components for demonstrations
├── contexts/              # Global state providers
├── hooks/                 # Custom React hooks
├── pages/                 # Route components (page-level components)
├── router/                # Application routing configuration
│   └── AppRouter.tsx      # Main router component
├── services/              # Business logic (when needed)
├── types/                 # TypeScript definitions
├── utils/                 # Pure utility functions
├── constants/             # App constants (ROUTES, etc.)
├── styles/                # Global styles
├── assets/                # Static files
├── locales/               # Internationalization files
└── config/                # Configuration
```

### ❌ DON'T Break These Rules

- ❌ **Don't put API calls in components**
- ❌ **Don't put React state in services**
- ❌ **Don't put business logic in API layer**
- ❌ **Don't create circular dependencies**
- ❌ **Don't skip TypeScript types**

## 🛣️ Routing Architecture

### Router Structure Overview

The application uses a **centralized routing system** with a clear separation between the main app router and individual route definitions.

```
App.tsx (Main Routes)
├── Public Routes (/login, /register)
├── Protected Routes (/)
└── AppRouter (/*)
    ├── DashboardLayout (Sidebar + Header)
    └── Nested Routes
        ├── /dashboard (index)
        ├── /transactions
        ├── /wallets
        └── /settings, etc.
```

### Key Files

| File                                        | Purpose                 | Contains                                               |
| ------------------------------------------- | ----------------------- | ------------------------------------------------------ |
| `src/App.tsx`                               | Main application router | Public/private route separation, authentication guards |
| `src/router/AppRouter.tsx`                  | Dashboard routes        | All dashboard pages with shared layout                 |
| `src/components/layout/DashboardLayout.tsx` | Dashboard layout        | Sidebar, header, and outlet for page content           |
| `src/constants/index.ts`                    | Route constants         | Centralized route path definitions                     |

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
  // ...existing routes
  BUDGETS: '/budgets', // Add new route (absolute path)
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

### Step 2: Create API Functions (`src/api/transactionApi.ts`)

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

### Step 3: Create Custom Hook (`src/hooks/useTransactions.ts`)

```typescript
import { useState, useCallback, useEffect } from 'react';
import { transactionApi } from '../api';
import type {
  Transaction,
  CreateTransactionRequest,
  TransactionFilters,
} from '../types';

export interface UseTransactionsReturn {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  filters: TransactionFilters;
  fetchTransactions: () => Promise<void>;
  createTransaction: (
    data: CreateTransactionRequest
  ) => Promise<{ success: boolean; error?: string }>;
  updateTransaction: (
    id: number,
    data: Partial<CreateTransactionRequest>
  ) => Promise<{ success: boolean; error?: string }>;
  deleteTransaction: (
    id: number
  ) => Promise<{ success: boolean; error?: string }>;
  setFilters: (filters: TransactionFilters) => void;
  setPage: (page: number) => void;
}

export const useTransactions = (): UseTransactionsReturn => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState<TransactionFilters>({});

  // Fetch transactions with current filters and pagination
  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await transactionApi.getAll(filters, currentPage, 10);
      setTransactions(response.content);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError('Failed to fetch transactions');
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters, currentPage]);

  // Create new transaction
  const createTransaction = useCallback(
    async (data: CreateTransactionRequest) => {
      try {
        const newTransaction = await transactionApi.create(data);
        setTransactions(prev => [newTransaction, ...prev]);
        return { success: true };
      } catch (err) {
        return { success: false, error: 'Failed to create transaction' };
      }
    },
    []
  );

  // Update existing transaction
  const updateTransaction = useCallback(
    async (id: number, data: Partial<CreateTransactionRequest>) => {
      try {
        const updatedTransaction = await transactionApi.update(id, data);
        setTransactions(prev =>
          prev.map(t => (t.id === id ? updatedTransaction : t))
        );
        return { success: true };
      } catch (err) {
        return { success: false, error: 'Failed to update transaction' };
      }
    },
    []
  );

  // Delete transaction
  const deleteTransaction = useCallback(async (id: number) => {
    try {
      await transactionApi.delete(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to delete transaction' };
    }
  }, []);

  // Set page number
  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Fetch transactions when filters or page changes
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    isLoading,
    error,
    totalPages,
    currentPage,
    filters,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    setFilters,
    setPage,
  };
};
```

### Step 4: Create UI Components (`src/components/ui/TransactionCard.tsx`)

```typescript
import React from 'react';
import { formatCurrency, formatDate } from '../../utils';
import { Button } from './Button';
import type { Transaction } from '../../types';
import './TransactionCard.css';

interface TransactionCardProps {
  transaction: Transaction;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: number) => void;
  showActions?: boolean;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  const isIncome = transaction.type === 'INCOME';

  return (
    <div className={`transaction-card ${isIncome ? 'income' : 'expense'}`}>
      <div className="transaction-info">
        <div className="transaction-header">
          <h3 className="transaction-description">{transaction.description}</h3>
          <span className={`transaction-amount ${isIncome ? 'positive' : 'negative'}`}>
            {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
          </span>
        </div>
        <div className="transaction-meta">
          <span className="transaction-date">{formatDate(transaction.date)}</span>
          <span className="transaction-type">{transaction.type}</span>
        </div>
      </div>

      {showActions && (
        <div className="transaction-actions">
          {onEdit && (
            <Button
              variant="secondary"
              size="small"
              onClick={() => onEdit(transaction)}
            >
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              variant="danger"
              size="small"
              onClick={() => onDelete(transaction.id)}
            >
              Delete
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionCard;
```

### Step 5: Create Feature Page (`src/pages/TransactionsPage.tsx`)

```typescript
import React, { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { useToastContext } from '../contexts';
import { TransactionCard, Button, Loading } from '../components/ui';
import Layout from '../components/layout/Layout';
import type { Transaction } from '../types';
import './TransactionsPage.css';

const TransactionsPage: React.FC = () => {
  const {
    transactions,
    isLoading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions();

  const { showSuccess, showError } = useToastContext();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateTransaction = async (data: CreateTransactionRequest) => {
    const result = await createTransaction(data);
    if (result.success) {
      showSuccess('Transaction created successfully!');
      setShowCreateForm(false);
    } else {
      showError(result.error || 'Failed to create transaction');
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    // Open edit modal/form
    console.log('Edit transaction:', transaction);
  };

  const handleDeleteTransaction = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      const result = await deleteTransaction(id);
      if (result.success) {
        showSuccess('Transaction deleted successfully!');
      } else {
        showError(result.error || 'Failed to delete transaction');
      }
    }
  };

  if (isLoading) return <Loading />;

  return (
    <Layout>
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
            {error}
          </div>
        )}

        <div className="transactions-list">
          {transactions.length === 0 ? (
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
            transactions.map(transaction => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                onEdit={handleEditTransaction}
                onDelete={handleDeleteTransaction}
              />
            ))
          )}
        </div>

        {/* TODO: Add CreateTransactionModal */}
        {showCreateForm && (
          <div>Create Transaction Form/Modal</div>
        )}
      </div>
    </Layout>
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

| Component         | Purpose                                        | Location                                    |
| ----------------- | ---------------------------------------------- | ------------------------------------------- |
| `DashboardLayout` | Main layout wrapper with sidebar and header    | `src/components/layout/DashboardLayout.tsx` |
| `Sidebar`         | Navigation menu with collapsible functionality | `src/components/layout/Sidebar.tsx`         |
| `DashboardHeader` | Top header with user info and actions          | `src/components/layout/DashboardHeader.tsx` |

#### Layout Best Practices

**✅ DO: Use DashboardLayout for all dashboard pages**

```typescript
// src/router/AppRouter.tsx
<Route path="/" element={<DashboardLayout />}>
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
```

**❌ DON'T: Duplicate layout structure in pages**

```typescript
// ❌ Bad - Don't recreate sidebar/header in each page
const TransactionsPage = () => (
  <div>
    <Sidebar /> {/* Don't do this - use DashboardLayout */}
    <Header />
    <TransactionContent />
  </div>
);
```

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

- Managing component state + API calls
- Reusable logic across multiple components
- Complex state management
- Side effects coordination

❌ **DON'T create hooks for:**

- Simple state that's only used in one component
- Pure functions (use utils instead)
- API calls without state (use API layer directly)

### Hook Structure Template

```typescript
// src/hooks/useFeatureName.ts
import { useState, useEffect, useCallback } from 'react';
import { featureApi } from '../api';
import type { FeatureData, CreateFeatureRequest } from '../types';

export interface UseFeatureReturn {
  // State
  data: FeatureData[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchData: () => Promise<void>;
  createItem: (
    data: CreateFeatureRequest
  ) => Promise<{ success: boolean; error?: string }>;
  updateItem: (
    id: number,
    data: Partial<CreateFeatureRequest>
  ) => Promise<{ success: boolean; error?: string }>;
  deleteItem: (id: number) => Promise<{ success: boolean; error?: string }>;
}

export const useFeature = (initialLoad = true): UseFeatureReturn => {
  // State
  const [data, setData] = useState<FeatureData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Actions
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

  // More actions...

  // Effects
  useEffect(() => {
    if (initialLoad) {
      fetchData();
    }
  }, [fetchData, initialLoad]);

  return {
    data,
    isLoading,
    error,
    fetchData,
    createItem,
    updateItem,
    deleteItem,
  };
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

// ✅ DO: Use hooks for API calls
const GoodComponent = () => {
  const { transactions, isLoading } = useTransactions();
  // Component focuses on UI logic only
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

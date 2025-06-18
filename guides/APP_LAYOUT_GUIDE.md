# App Layout & Navigation Guide

This guide covers the modern AppLayout system that provides consistent navigation, responsive design, and user experience across the MoneyWise application.

## 🏗️ Architecture Overview

The dashboard is built with a **modern centralized routing system**:

- **App.tsx**: Handles authentication protection and route delegation
- **AppRouter.tsx**: Manages all dashboard routes with shared layout
- **AppLayout**: Provides consistent sidebar and header across all pages
- **AppHeader**: Modern header with search, notifications, language switcher, and profile
- **ROUTES Constants**: Centralized route definitions for maintainability

## 🚀 Features

### Dashboard Layout

- **Modern Sidebar**: Responsive, collapsible sidebar with smooth animations
- **Mobile-First Design**: Mobile overlay with backdrop, tablet and desktop optimization
- **AppHeader Features**: Search, notifications, language switcher, theme toggle, profile dropdown
- **Responsive Navigation**: Smart active states and ROUTES constants integration

### Dashboard Pages

1. **📊 Dashboard** - Overview with stats, charts, and quick actions
2. **💸 Transactions** - Transaction management with filtering and search
3. **👛 Wallets** - Account management and balance tracking
4. **📁 Categories** - Category management with intelligent icon system
5. **📈 Analytics** - Advanced financial insights (Coming Soon)
6. **📄 Reports** - Financial reporting and exports (Coming Soon)
7. **💰 Budget** - Budget planning and tracking (Coming Soon)
8. **🎯 Saving Goals** - Goal setting and progress tracking (Coming Soon)
9. **⚙️ Settings** - Account and app preferences

## 🎨 Design System

The dashboard uses a comprehensive design system with:

- **Color Palette**: Professional green-based theme with semantic colors
- **Typography**: Modern font weights and sizes
- **Spacing**: Consistent spacing scale
- **Components**: Reusable UI components
- **Animations**: Smooth transitions and micro-interactions

## 🛠️ Technology Stack

- **React 19** with TypeScript
- **React Router v6** with nested routing
- **SWR** for data fetching and caching
- **Lucide React** for icons
- **CSS Custom Properties** for theming
- **Modern CSS** with Grid and Flexbox
- **Centralized Constants** for route management
- **Internationalization** with context-based i18n system

## 🚀 Getting Started

1. Navigate to `/dashboard` to see the main dashboard
2. Use the sidebar to navigate between different sections
3. Try collapsing the sidebar using the toggle button
4. Test responsive behavior by resizing the window
5. **Try the example routes**:
   - Visit `/swr-example` to see SWR vs legacy data fetching
   - Visit `/currency-example` to explore multi-currency features
6. **Explore the Categories page** at `/categories` for the complete modern architecture

## 📱 Responsive Features

- **Desktop**: Full sidebar with labels and descriptions, complete AppHeader with all features
- **Tablet**: Collapsible sidebar for more content space, responsive header layout
- **Mobile**: Overlay sidebar with backdrop, mobile-optimized header with hamburger menu

## 🔔 Modern Features

### Notification System

- **Toast Notifications**: Success, error, warning, and info toasts replace browser alerts
- **Confirmation Dialogs**: Custom dialogs replace browser confirms
- **Session Management**: Graceful token expiry handling with user choice

### Data Management

- **SWR Integration**: Automatic caching, background updates, and optimistic mutations
- **Real-time Updates**: Data refreshes automatically across components
- **Error Recovery**: Automatic retries and consistent error handling

### User Experience

- **Internationalization**: Full English/Vietnamese support with context switching
- **Category Icon System**: Intelligent icon selection based on category names
- **Smart Navigation**: Active route detection and breadcrumb-style navigation

## 🎯 Navigation Routes

- `/dashboard` - Main dashboard
- `/transactions` - Transaction management
- `/wallets` - Wallet and account management
- `/categories` - Category management with icon system
- `/analytics` - Analytics dashboard (placeholder)
- `/reports` - Reports section (placeholder)
- `/budget` - Budget management (placeholder)
- `/saving-goals` - Savings goals (placeholder)
- `/settings` - Settings page (placeholder)

**Example Routes:**

- `/swr-example` - SWR vs legacy data fetching demonstration
- `/currency-example` - Multi-currency system demonstration

## 🎨 Customization

The design system is built with CSS custom properties, making it easy to customize:

- Colors can be modified in `src/index.css`
- Component styles are modular and in their respective `.css` files
- Layout can be adjusted in the `AppLayout` component
- AppHeader features can be configured via props and context

## 🔧 Components Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx         # Main navigation sidebar with ROUTES integration
│   │   ├── AppLayout.tsx       # Layout wrapper with mobile overlay support
│   │   └── AppHeader.tsx       # Modern header with search, notifications, profile
│   ├── ui/
│   │   ├── PlaceholderPage.tsx # Placeholder for future pages
│   │   ├── Toast.tsx           # Notification system
│   │   ├── ConfirmDialog.tsx   # Confirmation dialogs
│   │   ├── TokenExpiryDialog.tsx # Session management
│   │   └── CategoryIcon.tsx    # Intelligent category icon system
│   └── examples/
│       ├── SWRExample.tsx      # SWR vs legacy data fetching demo
│       └── CurrencyExample.tsx # Multi-currency system demo
├── pages/
│   ├── ModernDashboard.tsx     # Main dashboard page
│   ├── TransactionsPage.tsx    # Transactions management
│   ├── WalletsPage.tsx         # Wallet management
│   └── CategoriesPage.tsx      # Category management with SWR integration
├── router/
│   └── AppRouter.tsx           # Centralized routing with nested structure
├── constants/
│   └── index.ts                # ROUTES constants and app constants
├── hooks/
│   ├── useFinanceData.ts       # SWR-based data fetching hooks
│   ├── useCategoryIcon.ts      # Category icon system hook
│   └── useAuth.ts              # Authentication management
├── services/
│   ├── categoryIconService.ts  # Icon mapping business logic
│   ├── currencyService.ts      # Currency formatting and conversion
│   └── languageService.ts      # Internationalization logic
├── contexts/
│   ├── AuthContext.tsx         # Authentication state
│   ├── ToastContext.tsx        # Notification management
│   └── LanguageContext.tsx     # i18n state management
└── styles/
    └── pages.css               # Shared page styles
```

## 🎯 Routing Architecture

### Route Flow

```
App.tsx (Authentication Guard + Global Dialogs)
├── Public Routes: /login, /register
├── Example Routes: /swr-example, /currency-example
└── Protected Routes: /* → AppRouter
    ├── Layout: AppLayout (Sidebar + AppHeader + Mobile Overlay)
    └── Pages: /dashboard, /transactions, /wallets, /categories, etc.
```

### Key Features

- **Authentication Protection**: All dashboard routes automatically protected
- **Session Management**: TokenExpiryDialog for graceful session handling
- **Nested Routing**: Clean URL structure without `/app` prefix
- **ROUTES Constants**: Centralized route definitions in `src/constants/index.ts`
- **Mobile-First Navigation**: Responsive sidebar with overlay on mobile
- **Index Redirect**: Root `/` automatically redirects to `/dashboard`
- **Example Routes**: Educational routes for learning SWR and currency systems

Enjoy exploring the modern dashboard! 🎉

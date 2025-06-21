/**
 * Common type definitions used across the application
 */

export interface SelectOption {
  value: string | number;
  label: string;
}

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: string;
  direction: SortDirection;
}

// Language and Internationalization types
export type Language = 'en' | 'vi';

export interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
}

export interface TranslationKeys {
  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    confirm: string;
    yes: string;
    no: string;
    ok: string;
    save: string;
    edit: string;
    delete: string;
    add: string;
    create: string;
    update: string;
    creating: string;
    updating: string;
    retry: string;
    createdAt: string;
    search: string;
    back: string;
    next: string;
    previous: string;
    submit: string;
    reset: string;
    close: string;
    email: string;
    password: string;
    name: string;
    firstName: string;
    lastName: string;
    confirmPassword: string;
    searchPlaceholder: string;
    profile: string;
    settings: string;
    helpSupport: string;
    signOut: string;
    showing: string;
    of: string;
    actions: string;
    view: string;
    clear: string;
  };

  // Navigation
  nav: {
    dashboard: string;
    transactions: string;
    categories: string;
    accounts: string;
    budgets: string;
    profile: string;
    settings: string;
    logout: string;
  };

  // Authentication
  auth: {
    login: string;
    register: string;
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    forgotPassword: string;
    rememberMe: string;
    loginTitle: string;
    loginSubtitle: string;
    registerTitle: string;
    registerSubtitle: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    firstNamePlaceholder: string;
    lastNamePlaceholder: string;
    emailAddressPlaceholder: string;
    confirmPasswordPlaceholder: string;
    loginButton: string;
    registerButton: string;
    loggingIn: string;
    registering: string;
    hasAccount: string;
    noAccount: string;
    signIn: string;
    signUp: string;
    loginSuccess: string;
    loginFailed: string;
    registerSuccess: string;
    registerFailed: string;
    logout: string;
    logoutSuccess: string;
    sessionExpired: string;
    stayLoggedIn: string;
  };

  // App
  app: {
    title: string;
    description: string;
  };

  // Header
  header: {
    dashboard: string;
    welcome: string;
    logout: string;
  };

  // Dashboard
  dashboard: {
    title: string;
    welcome: string;
    totalBalance: string;
    monthlyIncome: string;
    monthlyExpenses: string;
    savingsRate: string;
    recentTransactions: string;
    quickActions: string;
    financialOverview: string;
    fromLastMonth: string;
    sameAsLastMonth: string;
    today: string;
    yesterday: string;
    transactions: {
      groceryStore: string;
      salaryDeposit: string;
      coffeeShop: string;
    };
  }; // Transactions
  transactions: {
    title: string;
    subtitle: string;
    addTransaction: string;
    editTransaction: string;
    deleteTransaction: string;
    addFirstTransaction: string;
    recentTransactions: string;
    description: string;
    amount: string;
    date: string;
    category: string;
    account: string;
    type: string;
    income: string;
    expense: string;
    totalIncome: string;
    totalExpenses: string;
    netAmount: string;
    export: string;
    dateRange: string;
    allTypes: string;
    unknownCategory: string;
    unknownWallet: string;
    searchPlaceholder: string;
    noTransactions: string;
    loadMore: string;
    remaining: string;
    deleteConfirm: string;
    deleteConfirmTitle: string;
    deleteConfirmMessage: string;
    form: {
      type: string;
      amount: string;
      description: string;
      category: string;
      wallet: string;
      date: string;
      dateTime: string;
      descriptionPlaceholder: string;
      selectCategory: string;
      selectWallet: string;
      amountRequired: string;
      descriptionRequired: string;
      categoryRequired: string;
      walletRequired: string;
      dateRequired: string;
    };
    notifications: {
      createSuccess: string;
      createError: string;
      updateSuccess: string;
      updateError: string;
      deleteSuccess: string;
      deleteError: string;
      searchError: string;
    };
  }; // Category
  category: {
    title: string;
    add: string;
    create: string;
    edit: string;
    delete: string;
    name: string;
    namePlaceholder: string;
    createDescription: string;
    editDescription: string;
    previewDescription: string;
    nameHint: string;
    icon: string;
    color: string;
    type: string;
    income: string;
    expense: string;
    loading: string;
    creating: string;
    updating: string;
    noCategories: string;
    noCategoriesDesc: string;
    createFirst: string;
    deleteConfirm: string;
    deleteTitle: string;
    deleteMessage: string;
  };
  // Categories (page-level)
  categories: {
    title: string;
    subtitle: string;
    addNewCategory: string;
    createDescription: string;
    categoryName: string;
    categoryNamePlaceholder: string;
    examplesTitle: string;
    iconPreview: string;
    createButton: string;
    creating: string;
    yourCategories: string;
    categoryCount: string;
    categoriesCount: string;
    refresh: string;
    noCategoriesTitle: string;
    noCategoriesDescription: string;
    createdOn: string;
    edit: string;
    delete: string;
    save: string;
    cancel: string;
    deleteConfirm: string;
    errorLoad: string;
    retry: string;
    invalidCategoryId: string;
    errorPrefix: string;
    notifications: {
      categoryCreated: string;
      categoryUpdated: string;
      categoryDeleted: string;
      createError: string;
      updateError: string;
      deleteError: string;
    };
    confirmDelete: {
      title: string;
      message: string;
      confirm: string;
      cancel: string;
    };
    suggestions: {
      foodDining: string;
      transportation: string;
      shopping: string;
      entertainment: string;
      healthFitness: string;
      salary: string;
      coffee: string;
      travel: string;
      education: string;
      housing: string;
      utilities: string;
      gifts: string;
      investment: string;
      savings: string;
      bills: string;
      maintenance: string;
    };
  };

  // Validation
  validation: {
    required: string;
    minLength: string;
    emailInvalid: string;
    emailRequired: string;
    passwordRequired: string;
    passwordTooShort: string;
    passwordMissingUppercase: string;
    passwordMissingLowercase: string;
    passwordMissingNumber: string;
    passwordMissingSpecial: string;
    confirmPasswordRequired: string;
    passwordsNotMatch: string;
    firstNameRequired: string;
    lastNameRequired: string;
    amountInvalid: string;
    dateInvalid: string;
  };
  // Language
  language: {
    english: string;
    vietnamese: string;
    switchTo: string;
    selectLanguage: string;
  }; // Errors
  errors: {
    networkError: string;
    serverError: string;
    unauthorized: string;
    notFound: string;
    unexpected: string;
    transactions: {
      createError: string;
      updateError: string;
      deleteError: string;
      searchError: string;
    };
  };
}

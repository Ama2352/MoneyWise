/**
 * Common type definitions used across the application
 */

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  error: string;
  timestamp: string;
}

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
    searching: string;
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
    all: string;
    allCategories: string;
    allWallets: string;
    anyDay: string;
    advancedSearch: string;
    days: {
      monday: string;
      tuesday: string;
      wednesday: string;
      thursday: string;
      friday: string;
      saturday: string;
      sunday: string;
    };
    remaining: string;
    daysOverdue: string;
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
    wallets: string;
    analytics: string;
    reports: string;
    savingGoals: string;
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
    userStatus: string;
  };

  // Dashboard
  dashboard: {
    title: string;
    subtitle: string;
    welcome: string;
    financialOverview: string;
    totalBalance: string;
    totalWallets: string;
    monthlyIncome: string;
    monthlyExpenses: string;
    netIncome: string;
    recentTransactions: string;
    walletOverview: string;
    quickActions: string;
    spendingTrends: string;
    budgetProgress: string;
    savingsGoals: string;
    viewAll: string;
    noData: string;
    loading: string;
    actions: {
      addTransaction: string;
      addWallet: string;
      setBudget: string;
      setGoal: string;
      viewTransactions: string;
      manageWallets: string;
      viewReports: string;
      exportData: string;
    };
    stats: {
      thisMonth: string;
      lastMonth: string;
      change: string;
      income: string;
      expenses: string;
      balance: string;
      positiveWallets: string;
      negativeWallets: string;
    };
    savingsRate: string;
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
    advancedSearch: string;
    keyword: string;
    keywordPlaceholder: string;
    wallet: string;
    startDate: string;
    endDate: string;
    minAmount: string;
    maxAmount: string;
    startTime: string;
    endTime: string;
    dayOfWeek: string;
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

  // Budgets
  budgets: {
    title: string;
    subtitle: string;
    addNew: string;
    editBudget: string;
    deleteBudget: string;
    budgetDetails: string;
    progress: string;
    noBudgets: string;
    noBudgetsDescription: string;

    // Form fields
    description: string;
    limitAmount: string;
    startDate: string;
    endDate: string;
    category: string;
    wallet: string;
    currentSpending: string;

    // Status
    status: {
      notStarted: string;
      overBudget: string;
      nearlyMaxed: string;
      underBudget: string;
      critical: string;
      warning: string;
      onTrack: string;
      minimalSpending: string;
    };

    // Stats
    totalBudgets: string;
    activeBudgets: string;
    completedBudgets: string;
    totalLimitAmount: string;
    totalCurrentSpending: string;

    // Actions
    create: string;
    update: string;
    delete: string;
    edit: string;
    view: string;

    // Progress
    progressPercentage: string;
    daysRemaining: string;
    completed: string;

    // Confirmations
    deleteConfirmTitle: string;
    deleteConfirmMessage: string;

    // Search
    search: {
      title: string;
      keywords: string;
      keywordsPlaceholder: string;
      startDate: string;
      endDate: string;
      category: string;
      wallet: string;
      minLimitAmount: string;
      maxLimitAmount: string;
      allCategories: string;
      allWallets: string;
      resultsFound: string;
      noResults: string;
      clearSearch: string;
    };

    notifications: {
      createSuccess: string;
      updateSuccess: string;
      deleteSuccess: string;
      createError: string;
      updateError: string;
      deleteError: string;
      loadError: string;
    };

    // Validation
    validation: {
      descriptionRequired: string;
      limitAmountRequired: string;
      limitAmountPositive: string;
      startDateRequired: string;
      endDateRequired: string;
      endDateAfterStart: string;
      categoryRequired: string;
      walletRequired: string;
    };

    remaining: string;
    daysOverdue: string;
  };

  // Wallets
  wallets: {
    title: string;
    subtitle: string;
    addNew: string;
    create: string;
    edit: string;
    delete: string;
    
    // Summary stats
    totalBalance: string;
    positiveWallets: string;
    negativeWallets: string;
    walletsCount: string;
    
    // Empty state
    noWallets: string;
    noWalletsDescription: string;
    
    // Form fields
    name: string;
    namePlaceholder: string;
    balance: string;
    balancePlaceholder: string;
    currency: string;
    type: string;
    description: string;
    descriptionPlaceholder: string;
    
    // Wallet types
    types: {
      cash: string;
      bank: string;
      card: string;
      savings: string;
      investment: string;
      other: string;
    };
    
    // Actions
    refresh: string;
    tryAgain: string;
    
    // Confirmations
    deleteConfirmTitle: string;
    deleteConfirmMessage: string;
    
    // Notifications
    notifications: {
      createSuccess: string;
      updateSuccess: string;
      deleteSuccess: string;
      createError: string;
      updateError: string;
      deleteError: string;
      loadError: string;
    };
    
    // Validation
    validation: {
      nameRequired: string;
      nameMinLength: string;
      balanceRequired: string;
      balanceNumber: string;
      typeRequired: string;
    };
  };
  // Saving Goals
  savingGoals: {
    title: string;
    subtitle: string;
    addNew: string;
    editGoal: string;
    deleteGoal: string;
    goalDetails: string;
    progress: string;
    noGoals: string;
    noGoalsDescription: string;

    // Form fields
    description: string;
    targetAmount: string;
    startDate: string;
    endDate: string;
    category: string;
    wallet: string;
    savedAmount: string;

    // Status
    status: {
      notStarted: string;
      achieved: string;
      partiallyAchieved: string;
      missedTarget: string;
      achievedEarly: string;
      ahead: string;
      onTrack: string;
      slightlyBehind: string;
      atRisk: string;
      safe: string;
      warning: string;
      danger: string;
    };

    // Stats
    totalGoals: string;
    activeGoals: string;
    completedGoals: string;
    totalTargetAmount: string;
    totalSavedAmount: string;

    // Actions
    create: string;
    update: string;
    delete: string;
    edit: string;
    view: string;

    // Progress
    progressPercentage: string;
    daysRemaining: string;
    completed: string;

    // Confirmations
    deleteConfirmTitle: string;
    deleteConfirmMessage: string;

    // Search
    search: {
      title: string;
      keywords: string;
      keywordsPlaceholder: string;
      startDate: string;
      endDate: string;
      category: string;
      wallet: string;
      minTargetAmount: string;
      maxTargetAmount: string;
      allCategories: string;
      allWallets: string;
      resultsFound: string;
      noResults: string;
      clearSearch: string;
    };

    notifications: {
      createSuccess: string;
      updateSuccess: string;
      deleteSuccess: string;
      createError: string;
      updateError: string;
      deleteError: string;
      loadError: string;
    };

    // Validation
    validation: {
      descriptionRequired: string;
      targetAmountRequired: string;
      targetAmountPositive: string;
      startDateRequired: string;
      endDateRequired: string;
      endDateAfterStart: string;
      categoryRequired: string;
      walletRequired: string;
    };

    remaining: string;
    daysOverdue: string;
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
  }; // Language
  language: {
    english: string;
    vietnamese: string;
    switchTo: string;
    selectLanguage: string;
  };
  // Currency
  currency: {
    usd: string;
    vnd: string;
    selectCurrency: string;
    switchTo: string;
  };
  // Analytics
  analytics: {
    title: string;
    subtitle: string;
    daily: string;
    weekly: string;
    monthly: string;
    yearly: string;
    income: string;
    expenses: string;
    net: string;
    overview: string;
    categoryBreakdown: string;
    incomeVsExpenses: string;
    totalIncome: string;
    totalExpenses: string;
    netAmount: string;
    refresh: string;
    refreshing: string;
    loading: string;
    noData: string;
    noDataDescription: string;
    chartView: string;
    pieChartType: string;
    customDateRange: string;
    selectDateRange: string;
    startDate: string;
    endDate: string;
    applyDateRange: string;
    dateRange: string;
    preset: string;
    custom: string;
    byCategory: string;
    failedToLoad: string;
    errorTitle: string;
    dismiss: string;
    retry: string;
    categories: string;
    categoriesCount: string;
  };

  // Reports
  reports: {
    title: string;
    subtitle: string;
    generateReport: string;
    generating: string;
    downloadReport: string;
    reportGenerated: string;
    reportFailed: string;

    types: {
      categoryBreakdown: {
        title: string;
        description: string;
      };
      cashFlow: {
        title: string;
        description: string;
      };
      dailySummary: {
        title: string;
        description: string;
      };
      weeklySummary: {
        title: string;
        description: string;
      };
      monthlySummary: {
        title: string;
        description: string;
      };
      yearlySummary: {
        title: string;
        description: string;
      };
    };

    form: {
      reportType: string;
      selectReportType: string;
      dateRange: string;
      startDate: string;
      endDate: string;
      currency: string;
      format: string;
      language: string;
      generate: string;
      cancel: string;
      reset: string;
    };

    categories: {
      breakdown: string;
      summary: string;
      flow: string;
    };

    messages: {
      selectType: string;
      selectStartDate: string;
      selectEndDate: string;
      invalidDateRange: string;
      generating: string;
      downloadStarted: string;
      generationFailed: string;
      downloadFailed: string;
    };

    progress: {
      preparing: string;
      processing: string;
      generating: string;
      downloading: string;
    };
  };

  // Errors
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

  // Settings
  settings: {
    title: string;
    subtitle: string;
    profileSettings: string;
    profileDescription: string;
    security: string;
    securityDescription: string;
    securitySettings: string;
    securitySubtitle: string;
    avatarHint: string;
    avatarFileHint: string;
    firstName: string;
    firstNamePlaceholder: string;
    lastName: string;
    lastNamePlaceholder: string;
    emailAddress: string;
    emailPlaceholder: string;
    displayName: string;
    displayNamePlaceholder: string;
    editProfile: string;
    saveChanges: string;
    updating: string;
    cancel: string;
    currentPassword: string;
    currentPasswordPlaceholder: string;
    newPassword: string;
    newPasswordPlaceholder: string;
    confirmNewPassword: string;
    confirmPasswordPlaceholder: string;
    changePassword: string;
    updateProfilePassword: string;
    alsoUpdateProfile: string;
    alsoUpdateProfileHint: string;
    profileInformation: string;
    avatarUpdateSuccess: string;
    avatarDeleteSuccess: string;
    profileUpdateSuccess: string;
    passwordChangeSuccess: string;
    avatarUploadError: string;
    avatarDeleteError: string;
    fileSizeError: string;
    fileTypeError: string;
    updateProfileNote: string;
    currentPasswordRequired: string;
    newPasswordRequired: string;
    passwordTooShort: string;
    passwordMissingUppercase: string;
    passwordMissingLowercase: string;
    passwordMissingNumber: string;
    passwordMissingSpecial: string;
    passwordsNotMatch: string;
    currentPasswordWrong: string;

    // Add these keys for SettingsPage compatibility
    firstNameRequired: string;
    lastNameRequired: string;
    displayNameRequired: string;
    profileAndPasswordUpdated: string;
    passwordChanged: string;
    uploadAvatar: string;
    deleteAvatar: string;
    deleteAvatarConfirm: string;
    delete: string;
    passwordsMustMatch: string;
    confirmPasswordRequired: string;
    updateError: string;
    passwordComplexity: string;
  };

  // Sidebar
  sidebar: {
    mainMenu: string;
    expandSidebar: string;
    collapseSidebar: string;
    thisMonth: string;
    totalIncome: string;
    totalExpenses: string;
    savings: string;
    new: string;
  };
}

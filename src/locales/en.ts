import type { TranslationKeys } from '../types';

export const en: TranslationKeys = {
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    add: 'Add',
    create: 'Create',
    update: 'Update',
    creating: 'Creating...',
    updating: 'Updating...',
    retry: 'Retry',
    createdAt: 'Created at',
    search: 'Search',
    searching: 'Searching...',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    submit: 'Submit',
    reset: 'Reset',
    close: 'Close',
    email: 'Email',
    password: 'Password',
    name: 'Name',
    firstName: 'First Name',
    lastName: 'Last Name',
    confirmPassword: 'Confirm Password',
    searchPlaceholder: 'Search...',
    profile: 'Profile',
    settings: 'Settings',
    helpSupport: 'Help & Support',
    signOut: 'Sign Out',
    showing: 'Showing',
    of: 'of',
    actions: 'Actions',
    view: 'View',
    clear: 'Clear',
    all: 'All',
    allCategories: 'All Categories',
    allWallets: 'All Wallets',
    anyDay: 'Any Day',
    advancedSearch: 'Advanced Search',
    days: {
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday',
    },
    remaining: 'remaining',
    daysOverdue: '{n} days overdue',
    amountRequired: 'Amount is required',
    invalidUSDFormat: 'Invalid USD format',
    invalidVNDFormat: 'Invalid VND format (no decimals allowed)',
    negativeNotAllowed: 'Negative values are not allowed',
  },
  validation: {
    required: 'This field is required',
    minLength: 'Name must be at least 2 characters',
    emailInvalid: 'Email is invalid',
    emailRequired: 'Email is required',
    passwordRequired: 'Password is required',
    passwordTooShort: 'Password must be at least 8 characters',
    passwordMissingUppercase:
      'Password must contain at least one uppercase letter',
    passwordMissingLowercase:
      'Password must contain at least one lowercase letter',
    passwordMissingNumber: 'Password must contain at least one number',
    passwordMissingSpecial:
      'Password must contain at least one special character',
    confirmPasswordRequired: 'Please confirm your password',
    passwordsNotMatch: 'Passwords do not match',
    firstNameRequired: 'First name is required',
    lastNameRequired: 'Last name is required',
    amountInvalid: 'Please enter a valid amount',
    dateInvalid: 'Please enter a valid date',
  },

  auth: {
    login: 'Sign In',
    register: 'Create Account',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    firstName: 'First Name',
    lastName: 'Last Name',
    forgotPassword: 'Forgot your password?',
    rememberMe: 'Remember me',
    loginTitle: 'Welcome Back',
    loginSubtitle: 'Sign in to your account to continue',
    registerTitle: 'Create Account',
    registerSubtitle: 'Join us to start managing your finances',
    emailPlaceholder: 'Enter your email',
    passwordPlaceholder: 'Enter your password',
    firstNamePlaceholder: 'First name',
    lastNamePlaceholder: 'Last name',
    emailAddressPlaceholder: 'Email address',
    confirmPasswordPlaceholder: 'Confirm password',
    loginButton: 'Sign In',
    registerButton: 'Create Account',
    loggingIn: 'Signing in...',
    registering: 'Creating account...',
    hasAccount: 'Already have an account?',
    noAccount: "Don't have an account?",
    signIn: 'Sign in',
    signUp: 'Sign up',
    loginSuccess: 'Welcome back! You have been logged in successfully.',
    loginFailed: 'Login failed. Please try again.',
    registerSuccess:
      'Registration successful! Please log in with your credentials.',
    registerFailed: 'Registration failed. Please try again.',
    logout: 'Logout',
    logoutSuccess: 'You have been logged out successfully',
    sessionExpired: 'Your session has expired. Please log in again.',
    sessionExpiredMessage: 'Your session has expired. Would you like to stay logged in or log out?',
    stayLoggedIn: 'Stay Logged In',
    chooseLanguageTitle: 'Choose Your Language',
    chooseLanguageExplanation: 'To help you get started, we will provide default categories and wallets based on your chosen language. You can always change your language later in settings.',
    chooseLanguageConfirm: 'Continue',
  },

  app: {
    title: 'Money Wise',
    description: 'Your personal finance management solution',
  },

  nav: {
    dashboard: 'Dashboard',
    transactions: 'Transactions',
    categories: 'Categories',
    accounts: 'Accounts',
    budgets: 'Budgets',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    wallets: 'Wallets',
    analytics: 'Analytics',
    reports: 'Reports',
    savingGoals: 'Saving Goals',
  },

  header: {
    dashboard: 'Dashboard',
    welcome: 'Welcome',
    logout: 'Logout',
    userStatus: 'Active',
  },

  dashboard: {
    title: 'Dashboard',
    subtitle: 'Your financial overview at a glance',
    welcome: 'Welcome back',
    financialOverview: 'Financial Overview',
    totalBalance: 'Total Balance',
    totalWallets: 'Total Wallets',
    monthlyIncome: 'Monthly Income',
    monthlyExpenses: 'Monthly Expenses',
    netIncome: 'Net Income',
    recentTransactions: 'Recent Transactions',
    walletOverview: 'Wallet Overview',
    quickActions: 'Quick Actions',
    spendingTrends: 'Spending Trends',
    budgetProgress: 'Budget Progress',
    savingsGoals: 'Savings Goals',
    viewAll: 'View All',
    noData: 'No data available',
    loading: 'Loading...',
    actions: {
      addTransaction: 'Add Transaction',
      addWallet: 'Add Wallet',
      setBudget: 'Set Budget',
      setGoal: 'Set Goal',
      viewTransactions: 'View Transactions',
      manageWallets: 'Manage Wallets',
      viewReports: 'View Reports',
      exportData: 'Export Data',
    },
    stats: {
      thisMonth: 'This Month',
      lastMonth: 'Last Month',
      change: 'change',
      income: 'Income',
      expenses: 'Expenses',
      balance: 'Balance',
      positiveWallets: 'Positive Wallets',
      negativeWallets: 'Negative Wallets',
    },
    savingsRate: 'Savings Rate',
    fromLastMonth: 'from last month',
    sameAsLastMonth: 'same as last month',
    today: 'Today',
    yesterday: 'Yesterday',
    transactions: {
      groceryStore: 'Grocery Store',
      salaryDeposit: 'Salary Deposit',
      coffeeShop: 'Coffee Shop',
    },
  },
  transactions: {
    title: 'Transactions',
    subtitle: 'Track and manage your income and expenses',
    addTransaction: 'Add Transaction',
    editTransaction: 'Edit Transaction',
    deleteTransaction: 'Delete Transaction',
    addFirstTransaction: 'Add Your First Transaction',
    recentTransactions: 'Recent Transactions',
    description: 'Description',
    amount: 'Amount',
    date: 'Date',
    category: 'Category',
    account: 'Account',
    type: 'Type',
    income: 'Income',
    expense: 'Expense',
    totalIncome: 'Total Income',
    totalExpenses: 'Total Expenses',
    netAmount: 'Net Amount',
    export: 'Export',
    dateRange: 'Date Range',
    allTypes: 'All Types',
    unknownCategory: 'Unknown Category',
    unknownWallet: 'Unknown Wallet',
    searchPlaceholder: 'Search transactions...',
    noTransactions: 'No transactions found',
    loadMore: 'Load More',
    remaining: 'remaining',
    advancedSearch: 'Advanced Search',
    keyword: 'Keyword',
    keywordPlaceholder: 'Search by description, category, etc.',
    wallet: 'Wallet',
    startDate: 'Start Date',
    endDate: 'End Date',
    minAmount: 'Min Amount',
    maxAmount: 'Max Amount',
    startTime: 'Start Time',
    endTime: 'End Time',
    dayOfWeek: 'Day of Week',
    deleteConfirm: 'Are you sure you want to delete this transaction?',
    deleteConfirmTitle: 'Delete Transaction',
    deleteConfirmMessage: 'Are you sure you want to delete this transaction?',
    form: {
      type: 'Transaction Type',
      amount: 'Amount',
      description: 'Description',
      category: 'Category',
      wallet: 'Wallet',
      date: 'Date',
      dateTime: 'Date & Time',
      descriptionPlaceholder: 'Enter transaction description',
      selectCategory: 'Select a category',
      selectWallet: 'Select a wallet',
      amountRequired: 'Amount must be greater than 0',
      descriptionRequired: 'Description is required',
      categoryRequired: 'Category is required',
      walletRequired: 'Wallet is required',
      dateRequired: 'Date is required',
    },
    notifications: {
      createSuccess: 'Transaction created successfully',
      createError: 'Failed to create transaction',
      updateSuccess: 'Transaction updated successfully',
      updateError: 'Failed to update transaction',
      deleteSuccess: 'Transaction deleted successfully',
      deleteError: 'Failed to delete transaction',
      searchError: 'Failed to search transactions',
    },
  },
  category: {
    title: 'Categories',
    add: 'Add Category',
    create: 'Create Category',
    edit: 'Edit Category',
    delete: 'Delete Category',
    name: 'Category Name',
    namePlaceholder: 'Enter category name',
    createDescription: 'Create a new category to organize your transactions',
    editDescription: 'Update your category information',
    previewDescription: 'This is how your category will appear',
    nameHint: 'Icon and color will be automatically assigned based on the name',
    icon: 'Icon',
    color: 'Color',
    type: 'Type',
    income: 'Income',
    expense: 'Expense',
    loading: 'Loading categories...',
    creating: 'Creating...',
    updating: 'Updating...',
    noCategories: 'No Categories Found',
    noCategoriesDesc:
      'Start by creating your first category to organize your transactions.',
    createFirst: 'Create First Category',
    deleteConfirm: 'Are you sure you want to delete this category?',
    deleteTitle: 'Delete Category',
    deleteMessage:
      'This action cannot be undone. All transactions associated with this category will no longer be categorized.',
  },

  categories: {
    title: 'Manage Categories',
    subtitle: 'Organize your transactions with custom categories',
    addNewCategory: 'Add New Category',
    createDescription: 'Create a new category to organize your transactions',
    categoryName: 'Category Name',
    categoryNamePlaceholder:
      'Enter category name (e.g., Food & Dining, Transportation)',
    examplesTitle: '💡 Click any category to auto-fill:',
    iconPreview: 'Icon preview',
    createButton: 'Create Category',
    creating: 'Creating...',
    yourCategories: 'Your Categories',
    categoryCount: 'category',
    categoriesCount: 'categories',
    refresh: 'Refresh',
    noCategoriesTitle: 'No categories yet',
    noCategoriesDescription:
      'Create your first category to start organizing your transactions!',
    createdOn: 'Created on',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    deleteConfirm: 'Are you sure you want to delete',
    errorLoad: 'Failed to load categories',
    retry: 'Retry',
    invalidCategoryId: 'Invalid category ID. Cannot delete category.',
    errorPrefix: 'Error:',
    notifications: {
      categoryCreated: 'Category created successfully!',
      categoryUpdated: 'Category updated successfully!',
      categoryDeleted: 'Category deleted successfully!',
      createError: 'Failed to create category',
      updateError: 'Failed to update category',
      deleteError: 'Failed to delete category',
    },
    confirmDelete: {
      title: 'Delete Category',
      message:
        'Are you sure you want to delete this category? This action cannot be undone.',
      confirm: 'Delete',
      cancel: 'Cancel',
    },
    suggestions: {
      foodDining: 'Food & Dining',
      transportation: 'Transportation',
      shopping: 'Shopping',
      entertainment: 'Entertainment',
      healthFitness: 'Health & Fitness',
      salary: 'Salary',
      coffee: 'Coffee',
      travel: 'Travel',
      education: 'Education',
      housing: 'Housing',
      utilities: 'Utilities',
      gifts: 'Gifts',
      investment: 'Investment',
      savings: 'Savings',
      bills: 'Bills',
      maintenance: 'Maintenance',
    },
  },
  language: {
    english: 'English',
    vietnamese: 'Vietnamese',
    switchTo: 'Switch to',
    selectLanguage: 'Select Language',
  },
  currency: {
    usd: 'US Dollar',
    vnd: 'Vietnamese Dong',
    selectCurrency: 'Select Currency',
    switchTo: 'Switch to',
  },
  analytics: {
    title: 'Financial Analytics',
    subtitle:
      'Visualize your financial data with interactive charts and insights',
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly',
    income: 'Income',
    expenses: 'Expenses',
    net: 'Net',
    overview: 'Overview',
    categoryBreakdown: 'Category Breakdown',
    incomeVsExpenses: 'Income vs Expenses',
    totalIncome: 'Total Income',
    totalExpenses: 'Total Expenses',
    netAmount: 'Net Amount',
    refresh: 'Refresh',
    refreshing: 'Refreshing...',
    loading: 'Loading...',
    noData: 'No data available',
    noDataDescription: 'Data will appear here once you have transactions',
    chartView: 'Chart View',
    pieChartType: 'Chart Type',
    customDateRange: 'Custom Date Range',
    selectDateRange: 'Select Date Range',
    startDate: 'Start Date',
    endDate: 'End Date',
    applyDateRange: 'Apply Date Range',
    dateRange: 'Date Range',
    preset: 'Preset',
    custom: 'Custom',
    byCategory: 'By Category',
    byWallet: 'By Wallet',
    breakdownSource: 'Breakdown Source',
    failedToLoad: 'Failed to Load Analytics',
    errorTitle: 'Failed to Load Analytics',
    dismiss: 'Dismiss',
    retry: 'Retry',
    categories: 'categories',
    categoriesCount: 'categories',
  },
  reports: {
    title: 'Reports',
    subtitle: 'Generate detailed financial reports',
    generateReport: 'Generate Report',
    generating: 'Generating Report...',
    downloadReport: 'Download Report',
    reportGenerated: 'Report Generated',
    reportFailed: 'Report Generation Failed',

    // Report types
    types: {
      categoryBreakdown: {
        title: 'Category Breakdown',
        description:
          'Detailed analysis of income and expenses by category with budget tracking',
      },
      cashFlow: {
        title: 'Cash Flow Summary',
        description:
          'Overview of total income and expenses for a specific period',
      },
      dailySummary: {
        title: 'Daily Summary',
        description: 'Complete daily financial summary with weekly context',
      },
      weeklySummary: {
        title: 'Weekly Summary',
        description: 'Weekly financial analysis with day-by-day breakdown',
      },
      monthlySummary: {
        title: 'Monthly Summary',
        description:
          'Monthly financial overview with month-by-month comparison',
      },
      yearlySummary: {
        title: 'Yearly Summary',
        description: 'Annual financial report with year-over-year analysis',
      },
    },

    // Form fields
    form: {
      reportType: 'Report Type',
      selectReportType: 'Select a report type',
      dateRange: 'Date Range',
      startDate: 'Start Date',
      endDate: 'End Date',
      currency: 'Currency',
      format: 'Format',
      language: 'Language',
      generate: 'Generate Report',
      cancel: 'Cancel',
      reset: 'Reset Form',
    },

    // Categories
    categories: {
      breakdown: 'Breakdown Reports',
      summary: 'Summary Reports',
      flow: 'Cash Flow Reports',
    },

    // Messages
    messages: {
      selectType: 'Please select a report type',
      selectStartDate: 'Please select a start date',
      selectEndDate: 'End date is required for this report type',
      invalidDateRange: 'End date must be after start date',
      generating: 'Generating your report...',
      downloadStarted: 'Report download started',
      generationFailed: 'Failed to generate report. Please try again.',
      downloadFailed: 'Failed to download report file',
    },

    // Progress
    progress: {
      preparing: 'Preparing report...',
      processing: 'Processing data...',
      generating: 'Generating PDF...',
      downloading: 'Starting download...',
    },
  },
  errors: {
    networkError: 'Network error. Please check your connection.',
    serverError: 'Server error. Please try again later.',
    unauthorized: 'You are not authorized to perform this action.',
    notFound: 'The requested resource was not found.',
    unexpected: 'An unexpected error occurred.',
    transactions: {
      createError: 'Failed to create transaction',
      updateError: 'Failed to update transaction',
      deleteError: 'Failed to delete transaction',
      searchError: 'Failed to search transactions',
    },
  },
  savingGoals: {
    title: 'Saving Goals',
    subtitle: 'Track your savings progress and achieve your financial goals',
    addNew: 'Add New Goal',
    editGoal: 'Edit Goal',
    deleteGoal: 'Delete Goal',
    goalDetails: 'Goal Details',
    progress: 'Progress',
    noGoals: 'No saving goals found',
    noGoalsDescription:
      'Create your first saving goal to start tracking your progress',

    // Form fields
    description: 'Description',
    targetAmount: 'Target Amount',
    startDate: 'Start Date',
    endDate: 'End Date',
    category: 'Category',
    wallet: 'Wallet',
    savedAmount: 'Saved Amount',

    // Status
    status: {
      notStarted: 'Not Started',
      achieved: 'Achieved',
      partiallyAchieved: 'Partially Achieved',
      missedTarget: 'Missed Target',
      achievedEarly: 'Achieved Early',
      ahead: 'Ahead of Schedule',
      onTrack: 'On Track',
      slightlyBehind: 'Slightly Behind',
      atRisk: 'At Risk',
      safe: 'On Track',
      warning: 'Behind Schedule',
      danger: 'Critical',
    },

    // Stats
    totalGoals: 'Total Goals',
    activeGoals: 'Active Goals',
    completedGoals: 'Completed Goals',
    totalTargetAmount: 'Total Target',
    totalSavedAmount: 'Total Saved',

    // Actions
    create: 'Create Goal',
    update: 'Update Goal',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View Details',

    // Progress
    progressPercentage: '% Progress',
    daysRemaining: 'days remaining',
    completed: 'Completed',

    // Confirmations
    deleteConfirmTitle: 'Delete Saving Goal',
    deleteConfirmMessage:
      'Are you sure you want to delete this saving goal? This action cannot be undone.',

    // Search
    search: {
      title: 'Search Saving Goals',
      keywords: 'Keywords',
      keywordsPlaceholder: 'Search by description...',
      startDate: 'Start Date',
      endDate: 'End Date',
      category: 'Category',
      wallet: 'Wallet',
      minTargetAmount: 'Min Target Amount',
      maxTargetAmount: 'Max Target Amount',
      allCategories: 'All Categories',
      allWallets: 'All Wallets',
      resultsFound: 'results found',
      noResults: 'No saving goals match your search criteria',
      clearSearch: 'Clear Search',
    },

    notifications: {
      createSuccess: 'Saving goal created successfully',
      updateSuccess: 'Saving goal updated successfully',
      deleteSuccess: 'Saving goal deleted successfully',
      createError: 'Failed to create saving goal',
      updateError: 'Failed to update saving goal',
      deleteError: 'Failed to delete saving goal',
      loadError: 'Failed to load saving goals',
    },

    // Validation
    validation: {
      descriptionRequired: 'Description is required',
      targetAmountRequired: 'Target amount is required',
      targetAmountPositive: 'Target amount must be positive',
      startDateRequired: 'Start date is required',
      endDateRequired: 'End date is required',
      endDateAfterStart: 'End date must be after start date',
      categoryRequired: 'Category is required',
      walletRequired: 'Wallet is required',
    },
    remaining: 'remaining',
    daysOverdue: '{n} days overdue',
  },
  budgets: {
    title: 'Budgets',
    subtitle: 'Track your spending limits and manage your financial budgets',
    addNew: 'Add New Budget',
    editBudget: 'Edit Budget',
    deleteBudget: 'Delete Budget',
    budgetDetails: 'Budget Details',
    progress: 'Progress',
    noBudgets: 'No budgets found',
    noBudgetsDescription:
      'Create your first budget to start tracking your spending limits',

    // Form fields
    description: 'Description',
    limitAmount: 'Limit Amount',
    startDate: 'Start Date',
    endDate: 'End Date',
    category: 'Category',
    wallet: 'Wallet',
    currentSpending: 'Current Spending',

    // Status
    status: {
      notStarted: 'Not Started',
      overBudget: 'Over Budget',
      nearlyMaxed: 'Nearly Maxed',
      underBudget: 'Under Budget',
      critical: 'Critical',
      warning: 'Warning',
      onTrack: 'On Track',
      minimalSpending: 'Minimal Spending',
    },

    // Stats
    totalBudgets: 'Total Budgets',
    activeBudgets: 'Active Budgets',
    completedBudgets: 'Completed Budgets',
    totalLimitAmount: 'Total Limit',
    totalCurrentSpending: 'Total Spent',

    // Actions
    create: 'Create Budget',
    update: 'Update Budget',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View Details',

    // Progress
    progressPercentage: '% Used',
    daysRemaining: 'days remaining',
    completed: 'Completed',
    remaining: 'remaining',
    daysOverdue: '{n} days overdue',

    // Confirmations
    deleteConfirmTitle: 'Delete Budget',
    deleteConfirmMessage:
      'Are you sure you want to delete this budget? This action cannot be undone.',

    // Search
    search: {
      title: 'Search Budgets',
      keywords: 'Keywords',
      keywordsPlaceholder: 'Search by description...',
      startDate: 'Start Date',
      endDate: 'End Date',
      category: 'Category',
      wallet: 'Wallet',
      minLimitAmount: 'Min Limit Amount',
      maxLimitAmount: 'Max Limit Amount',
      allCategories: 'All Categories',
      allWallets: 'All Wallets',
      resultsFound: 'results found',
      noResults: 'No budgets match your search criteria',
      clearSearch: 'Clear Search',
    },

    notifications: {
      createSuccess: 'Budget created successfully',
      updateSuccess: 'Budget updated successfully',
      deleteSuccess: 'Budget deleted successfully',
      createError: 'Failed to create budget',
      updateError: 'Failed to update budget',
      deleteError: 'Failed to delete budget',
      loadError: 'Failed to load budgets',
    },

    // Validation
    validation: {
      descriptionRequired: 'Description is required',
      limitAmountRequired: 'Limit amount is required',
      limitAmountPositive: 'Limit amount must be positive',
      startDateRequired: 'Start date is required',
      endDateRequired: 'End date is required',
      endDateAfterStart: 'End date must be after start date',
      categoryRequired: 'Category is required',
      walletRequired: 'Wallet is required',
    },
  },

  settings: {
    title: 'Settings',
    subtitle: 'Manage your account settings and preferences',
    profileSettings: 'Profile Settings',
    profileDescription: 'Manage your personal information and avatar',
    security: 'Security',
    securityDescription: 'Password and security settings',
    securitySettings: 'Security Settings',
    securitySubtitle: 'Change your password for better account protection',

    // Avatar section
    avatarHint: 'Click the camera icon to upload a new avatar',
    avatarFileHint: 'Supported formats: JPG, PNG, GIF. Maximum size: 10MB',

    // Profile form
    firstName: 'First Name',
    firstNamePlaceholder: 'Enter your first name',
    lastName: 'Last Name',
    lastNamePlaceholder: 'Enter your last name',
    emailAddress: 'Email Address',
    emailPlaceholder: 'Enter your email address',
    displayName: 'Display Name',
    displayNamePlaceholder: 'Enter your display name',

    // Actions
    editProfile: 'Edit Profile',
    saveChanges: 'Save Changes',
    updating: 'Updating...',
    cancel: 'Cancel',

    // Password form
    currentPassword: 'Current Password',
    currentPasswordPlaceholder: 'Enter current password',
    newPassword: 'New Password',
    newPasswordPlaceholder: 'Enter new password',
    confirmNewPassword: 'Confirm New Password',
    confirmPasswordPlaceholder: 'Re-enter new password',
    changePassword: 'Change Password',
    updateProfilePassword: 'Update Profile & Password',
    alsoUpdateProfile: 'Also update my profile information',
    alsoUpdateProfileHint:
      'Check this to update your name and email along with password change',
    profileInformation: 'Profile Information',

    // Notifications
    avatarUpdateSuccess: 'Avatar updated successfully!',
    avatarDeleteSuccess: 'Avatar deleted successfully!',
    profileUpdateSuccess: 'Profile and password updated successfully!',
    passwordChangeSuccess: 'Password changed successfully!',
    avatarUploadError: 'Failed to upload avatar. Please try again.',
    avatarDeleteError: 'Failed to delete avatar. Please try again.',
    fileSizeError: 'File size must be less than 5MB',
    fileTypeError: 'Please select a valid image file',
    updateProfileNote:
      'To update profile information, please use the Security section below and provide your current password.',

    // Password validation
    currentPasswordRequired: 'Current password is required',
    newPasswordRequired: 'New password is required',
    passwordTooShort: 'Password must be at least 8 characters',
    passwordMissingUppercase: 'Password must contain an uppercase letter',
    passwordMissingLowercase: 'Password must contain a lowercase letter',
    passwordMissingNumber: 'Password must contain a number',
    passwordMissingSpecial: 'Password must contain a special character',
    passwordsNotMatch: 'Passwords do not match',
    currentPasswordWrong: 'Your current password is wrong. Please enter again.',

    // Additional keys for SettingsPage
    firstNameRequired: 'First name is required',
    lastNameRequired: 'Last name is required',
    displayNameRequired: 'Display name is required',
    profileAndPasswordUpdated: 'Profile and password updated successfully!',
    passwordChanged: 'Password changed successfully!',
    uploadAvatar: 'Upload Avatar',
    deleteAvatar: 'Delete Avatar',
    deleteAvatarConfirm:
      'Are you sure you want to delete your avatar? This action cannot be undone.',
    delete: 'Delete',
    passwordsMustMatch: 'Passwords must match',
    confirmPasswordRequired: 'Please confirm your new password',
    updateError: 'Failed to update. Please try again.',
    passwordComplexity:
      'Password must be at least 6 characters, include 1 uppercase and 1 special character.',
  },

  // Sidebar
  sidebar: {
    mainMenu: 'Main Menu',
    expandSidebar: 'Expand sidebar',
    collapseSidebar: 'Collapse sidebar',
    thisMonth: 'This Month',
    totalIncome: 'Total Income',
    totalExpenses: 'Total Expenses',
    savings: 'Savings',
    new: 'New',
  },
  
  wallets: {
    title: 'Wallets',
    subtitle: 'Manage your accounts and track balances across all your wallets',
    addNew: 'Add Wallet',
    create: 'Create Wallet',
    edit: 'Edit Wallet',
    delete: 'Delete Wallet',
    
    // Summary stats
    totalBalance: 'Total Balance',
    positiveWallets: 'Positive Wallets',
    negativeWallets: 'Negative Wallets',
    walletsCount: 'wallets',
    
    // Empty state
    noWallets: 'No wallets found',
    noWalletsDescription: 'Create your first wallet to start tracking your finances',
    
    // Form fields
    name: 'Wallet Name',
    namePlaceholder: 'Enter wallet name',
    balance: 'Initial Balance',
    balancePlaceholder: 'Enter initial balance',
    currency: 'Currency',
    type: 'Wallet Type',
    description: 'Description',
    descriptionPlaceholder: 'Enter wallet description (optional)',
    
    // Wallet types
    types: {
      cash: 'Cash',
      bank: 'Bank Account',
      card: 'Credit/Debit Card',
      savings: 'Savings Account',
      investment: 'Investment Account',
      other: 'Other',
    },
    
    // Actions
    refresh: 'Refresh',
    tryAgain: 'Try Again',
    
    // Confirmations
    deleteConfirmTitle: 'Delete Wallet',
    deleteConfirmMessage: 'Are you sure you want to delete this wallet? This action cannot be undone.',
    
    // Notifications
    notifications: {
      createSuccess: 'Wallet created successfully',
      updateSuccess: 'Wallet updated successfully',
      deleteSuccess: 'Wallet deleted successfully',
      createError: 'Failed to create wallet',
      updateError: 'Failed to update wallet',
      deleteError: 'Failed to delete wallet',
      loadError: 'Failed to load wallets',
    },
    
    // Validation
    validation: {
      nameRequired: 'Wallet name is required',
      nameMinLength: 'Wallet name must be at least 2 characters',
      balanceRequired: 'Initial balance is required',
      balanceNumber: 'Balance must be a valid number',
      typeRequired: 'Wallet type is required',
    },
  },
};

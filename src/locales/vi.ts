import type { TranslationKeys } from '../types';

export const vi: TranslationKeys = {
  common: {
    loading: 'Đang tải...',
    error: 'Đã xảy ra lỗi',
    success: 'Thành công',
    cancel: 'Hủy',
    confirm: 'Xác nhận',
    yes: 'Có',
    no: 'Không',
    ok: 'OK',
    save: 'Lưu',
    delete: 'Xóa',
    edit: 'Chỉnh sửa',
    add: 'Thêm',
    create: 'Tạo',
    update: 'Cập nhật',
    creating: 'Đang tạo...',
    updating: 'Đang cập nhật...',
    retry: 'Thử lại',
    createdAt: 'Ngày tạo:',
    search: 'Tìm kiếm',
    searching: 'Đang tìm...',
    back: 'Quay lại',
    next: 'Tiếp theo',
    previous: 'Trước',
    submit: 'Gửi',
    reset: 'Đặt lại',
    close: 'Đóng',
    email: 'Email',
    password: 'Mật khẩu',
    name: 'Tên',
    firstName: 'Tên',
    lastName: 'Họ',
    confirmPassword: 'Xác nhận mật khẩu',
    searchPlaceholder: 'Tìm kiếm giao dịch, danh mục...',
    profile: 'Hồ sơ',
    settings: 'Cài đặt',
    helpSupport: 'Trợ giúp & Hỗ trợ',
    signOut: 'Đăng xuất',
    showing: 'Hiển thị',
    of: 'trong',
    actions: 'Hành động',
    view: 'Xem',
    clear: 'Xóa',
    all: 'Tất cả',
    allCategories: 'Tất cả danh mục',
    allWallets: 'Tất cả ví',
    anyDay: 'Bất kỳ ngày nào',
    advancedSearch: 'Tìm kiếm nâng cao',
    days: {
      monday: 'Thứ Hai',
      tuesday: 'Thứ Ba',
      wednesday: 'Thứ Tư',
      thursday: 'Thứ Năm',
      friday: 'Thứ Sáu',
      saturday: 'Thứ Bảy',
      sunday: 'Chủ Nhật',
    },
    remaining: 'còn lại',
    daysOverdue: '{n} ngày quá hạn',
    amountRequired: 'Vui lòng nhập số tiền',
    invalidUSDFormat: 'Định dạng USD không hợp lệ',
    invalidVNDFormat: 'Định dạng VND không hợp lệ (không cho phép số thập phân)',
    negativeNotAllowed: 'Không cho phép giá trị âm',
  },
  validation: {
    required: 'Trường này là bắt buộc',
    minLength: 'Tên phải có ít nhất 2 ký tự',
    emailInvalid: 'Email không hợp lệ',
    emailRequired: 'Email là bắt buộc',
    passwordRequired: 'Mật khẩu là bắt buộc',
    passwordTooShort: 'Mật khẩu phải có ít nhất 8 ký tự',
    passwordMissingUppercase: 'Mật khẩu phải chứa ít nhất một chữ hoa',
    passwordMissingLowercase: 'Mật khẩu phải chứa ít nhất một chữ thường',
    passwordMissingNumber: 'Mật khẩu phải chứa ít nhất một số',
    passwordMissingSpecial: 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt',
    confirmPasswordRequired: 'Vui lòng xác nhận mật khẩu',
    passwordsNotMatch: 'Mật khẩu không khớp',
    firstNameRequired: 'Họ là bắt buộc',
    lastNameRequired: 'Tên là bắt buộc',
    amountInvalid: 'Vui lòng nhập số tiền hợp lệ',
    dateInvalid: 'Vui lòng nhập ngày hợp lệ',
  },

  auth: {
    login: 'Đăng nhập',
    register: 'Tạo tài khoản',
    email: 'Email',
    password: 'Mật khẩu',
    confirmPassword: 'Xác nhận mật khẩu',
    firstName: 'Tên',
    lastName: 'Họ',
    forgotPassword: 'Quên mật khẩu?',
    rememberMe: 'Ghi nhớ đăng nhập',
    loginTitle: 'Chào mừng trở lại',
    loginSubtitle: 'Đăng nhập vào tài khoản của bạn để tiếp tục',
    registerTitle: 'Tạo tài khoản',
    registerSubtitle: 'Tham gia với chúng tôi để bắt đầu quản lý tài chính',
    emailPlaceholder: 'Nhập email của bạn',
    passwordPlaceholder: 'Nhập mật khẩu của bạn',
    firstNamePlaceholder: 'Nhập tên của bạn',
    lastNamePlaceholder: 'Nhập họ của bạn',
    emailAddressPlaceholder: 'Địa chỉ email',
    confirmPasswordPlaceholder: 'Xác nhận mật khẩu',
    loginButton: 'Đăng nhập',
    registerButton: 'Tạo tài khoản',
    loggingIn: 'Đang đăng nhập...',
    registering: 'Đang tạo tài khoản...',
    hasAccount: 'Đã có tài khoản?',
    noAccount: 'Chưa có tài khoản?',
    signIn: 'Đăng nhập',
    signUp: 'Đăng ký',
    loginSuccess: 'Chào mừng trở lại! Bạn đã đăng nhập thành công.',
    loginFailed: 'Đăng nhập thất bại. Vui lòng thử lại.',
    registerSuccess:
      'Đăng ký thành công! Vui lòng đăng nhập bằng thông tin tài khoản của bạn.',
    registerFailed: 'Đăng ký thất bại. Vui lòng thử lại.',
    logout: 'Đăng xuất',
    logoutSuccess: 'Bạn đã đăng xuất thành công',
    sessionExpired: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
    sessionExpiredMessage: 'Phiên đăng nhập của bạn đã hết hạn. Bạn muốn duy trì đăng nhập hay đăng xuất?',
    stayLoggedIn: 'Duy trì đăng nhập',
    // Language selection after registration
    chooseLanguageTitle: 'Chọn Ngôn Ngữ Của Bạn',
    chooseLanguageExplanation: 'Để giúp bạn bắt đầu, ứng dụng sẽ cung cấp các danh mục và ví mẫu dựa trên ngôn ngữ bạn chọn. Bạn có thể thay đổi ngôn ngữ bất cứ lúc nào trong phần cài đặt.',
    chooseLanguageConfirm: 'Tiếp tục',
  },

  app: {
    title: 'Money Wise',
    description: 'Giải pháp quản lý tài chính cá nhân của bạn',
  },

  nav: {
    dashboard: 'Bảng điều khiển',
    transactions: 'Giao dịch',
    categories: 'Danh mục',
    accounts: 'Tài khoản',
    budgets: 'Ngân sách',
    profile: 'Hồ sơ',
    settings: 'Cài đặt',
    logout: 'Đăng xuất',
    wallets: 'Ví',
    analytics: 'Phân tích',
    reports: 'Báo cáo',
    savingGoals: 'Mục tiêu tiết kiệm',
  },

  header: {
    dashboard: 'Bảng điều khiển',
    welcome: 'Chào mừng',
    logout: 'Đăng xuất',
    userStatus: 'Đang hoạt động',
  },

  dashboard: {
    title: 'Bảng điều khiển',
    subtitle: 'Tổng quan tài chính của bạn trong nháy mắt',
    welcome: 'Chào mừng trở lại',
    financialOverview: 'Tổng quan tài chính',
    totalBalance: 'Tổng số dư',
    totalWallets: 'Tổng số ví',
    monthlyIncome: 'Thu nhập tháng',
    monthlyExpenses: 'Chi tiêu tháng',
    netIncome: 'Thu nhập ròng',
    recentTransactions: 'Giao dịch gần đây',
    walletOverview: 'Tổng quan ví',
    quickActions: 'Thao tác nhanh',
    spendingTrends: 'Xu hướng chi tiêu',
    budgetProgress: 'Tiến độ ngân sách',
    savingsGoals: 'Mục tiêu tiết kiệm',
    viewAll: 'Xem tất cả',
    noData: 'Không có dữ liệu',
    loading: 'Đang tải...',
    actions: {
      addTransaction: 'Thêm giao dịch',
      addWallet: 'Thêm ví',
      setBudget: 'Đặt ngân sách',
      setGoal: 'Đặt mục tiêu',
      viewTransactions: 'Xem giao dịch',
      manageWallets: 'Quản lý ví',
      viewReports: 'Xem báo cáo',
      exportData: 'Xuất dữ liệu',
    },
    stats: {
      thisMonth: 'Tháng này',
      lastMonth: 'Tháng trước',
      change: 'thay đổi',
      income: 'Thu nhập',
      expenses: 'Chi tiêu',
      balance: 'Số dư',
      positiveWallets: 'Ví dương',
      negativeWallets: 'Ví âm',
    },
    savingsRate: 'Tỷ lệ tiết kiệm',
    fromLastMonth: 'so với tháng trước',
    sameAsLastMonth: 'giống tháng trước',
    today: 'Hôm nay',
    yesterday: 'Hôm qua',
    transactions: {
      groceryStore: 'Cửa hàng tạp hóa',
      salaryDeposit: 'Lương',
      coffeeShop: 'Quán cà phê',
    },
  },
  transactions: {
    title: 'Giao dịch',
    subtitle: 'Theo dõi và quản lý thu nhập và chi tiêu của bạn',
    addTransaction: 'Thêm giao dịch',
    editTransaction: 'Chỉnh sửa giao dịch',
    deleteTransaction: 'Xóa giao dịch',
    addFirstTransaction: 'Thêm giao dịch đầu tiên',
    recentTransactions: 'Giao dịch gần đây',
    description: 'Mô tả',
    amount: 'Số tiền',
    date: 'Ngày',
    category: 'Danh mục',
    account: 'Tài khoản',
    type: 'Loại',
    income: 'Thu nhập',
    expense: 'Chi tiêu',
    totalIncome: 'Tổng thu nhập',
    totalExpenses: 'Tổng chi tiêu',
    netAmount: 'Số tiền ròng',
    export: 'Xuất dữ liệu',
    dateRange: 'Khoảng thời gian',
    allTypes: 'Tất cả loại',
    unknownCategory: 'Danh mục không xác định',
    unknownWallet: 'Ví không xác định',
    searchPlaceholder: 'Tìm kiếm giao dịch...',
    noTransactions: 'Không tìm thấy giao dịch',
    loadMore: 'Tải thêm',
    remaining: 'còn lại',
    advancedSearch: 'Tìm kiếm nâng cao',
    keyword: 'Từ khóa',
    keywordPlaceholder: 'Tìm theo mô tả, danh mục, v.v.',
    wallet: 'Ví',
    startDate: 'Ngày bắt đầu',
    endDate: 'Ngày kết thúc',
    minAmount: 'Số tiền tối thiểu',
    maxAmount: 'Số tiền tối đa',
    startTime: 'Giờ bắt đầu',
    endTime: 'Giờ kết thúc',
    dayOfWeek: 'Ngày trong tuần',
    deleteConfirm: 'Bạn có chắc chắn muốn xóa giao dịch này?',
    deleteConfirmTitle: 'Xóa giao dịch',
    deleteConfirmMessage: 'Bạn có chắc chắn muốn xóa giao dịch này?',
    form: {
      type: 'Loại giao dịch',
      amount: 'Số tiền',
      description: 'Mô tả',
      category: 'Danh mục',
      wallet: 'Ví',
      date: 'Ngày',
      dateTime: 'Ngày & Giờ',
      descriptionPlaceholder: 'Nhập mô tả giao dịch',
      selectCategory: 'Chọn danh mục',
      selectWallet: 'Chọn ví',
      amountRequired: 'Số tiền phải lớn hơn 0',
      descriptionRequired: 'Mô tả là bắt buộc',
      categoryRequired: 'Danh mục là bắt buộc',
      walletRequired: 'Ví là bắt buộc',
      dateRequired: 'Ngày là bắt buộc',
    },
    notifications: {
      createSuccess: 'Tạo giao dịch thành công',
      createError: 'Không thể tạo giao dịch',
      updateSuccess: 'Cập nhật giao dịch thành công',
      updateError: 'Không thể cập nhật giao dịch',
      deleteSuccess: 'Xóa giao dịch thành công',
      deleteError: 'Không thể xóa giao dịch',
      searchError: 'Không thể tìm kiếm giao dịch',
    },
  },
  category: {
    title: 'Danh mục',
    add: 'Thêm danh mục',
    create: 'Tạo danh mục',
    edit: 'Chỉnh sửa danh mục',
    delete: 'Xóa danh mục',
    name: 'Tên danh mục',
    namePlaceholder: 'Nhập tên danh mục',
    createDescription: 'Tạo danh mục mới để phân loại giao dịch của bạn',
    editDescription: 'Cập nhật thông tin danh mục',
    previewDescription: 'Đây là cách danh mục sẽ hiển thị',
    nameHint: 'Biểu tượng và màu sắc sẽ được tự động gán dựa trên tên',
    icon: 'Biểu tượng',
    color: 'Màu sắc',
    type: 'Loại',
    income: 'Thu nhập',
    expense: 'Chi tiêu',
    loading: 'Đang tải danh mục...',
    creating: 'Đang tạo...',
    updating: 'Đang cập nhật...',
    noCategories: 'Không tìm thấy danh mục',
    noCategoriesDesc:
      'Bắt đầu bằng cách tạo danh mục đầu tiên để phân loại giao dịch của bạn.',
    createFirst: 'Tạo danh mục đầu tiên',
    deleteConfirm: 'Bạn có chắc chắn muốn xóa danh mục này?',
    deleteTitle: 'Xóa danh mục',
    deleteMessage:
      'Hành động này không thể hoàn tác. Tất cả giao dịch liên quan đến danh mục này sẽ không còn được phân loại.',
  },

  categories: {
    title: 'Quản lý danh mục',
    subtitle: 'Tổ chức giao dịch của bạn với các danh mục tùy chỉnh',
    addNewCategory: 'Thêm danh mục mới',
    createDescription: 'Tạo danh mục mới để tổ chức giao dịch của bạn',
    categoryName: 'Tên danh mục',
    categoryNamePlaceholder: 'Nhập tên danh mục (ví dụ: Ăn uống, Di chuyển)',
    examplesTitle: '💡 Nhấp vào danh mục để tự động điền:',
    iconPreview: 'Xem trước biểu tượng',
    createButton: 'Tạo danh mục',
    creating: 'Đang tạo...',
    yourCategories: 'Danh mục của bạn',
    categoryCount: 'danh mục',
    categoriesCount: 'danh mục',
    refresh: 'Làm mới',
    noCategoriesTitle: 'Chưa có danh mục nào',
    noCategoriesDescription:
      'Tạo danh mục đầu tiên để bắt đầu tổ chức giao dịch của bạn!',
    createdOn: 'Được tạo vào',
    edit: 'Chỉnh sửa',
    delete: 'Xóa',
    save: 'Lưu',
    cancel: 'Hủy',
    deleteConfirm: 'Bạn có chắc chắn muốn xóa',
    errorLoad: 'Không thể tải danh mục',
    retry: 'Thử lại',
    invalidCategoryId: 'ID danh mục không hợp lệ. Không thể xóa danh mục.',
    errorPrefix: 'Lỗi:',
    notifications: {
      categoryCreated: 'Tạo danh mục thành công!',
      categoryUpdated: 'Cập nhật danh mục thành công!',
      categoryDeleted: 'Xóa danh mục thành công!',
      createError: 'Không thể tạo danh mục',
      updateError: 'Không thể cập nhật danh mục',
      deleteError: 'Không thể xóa danh mục',
    },
    confirmDelete: {
      title: 'Xóa Danh Mục',
      message:
        'Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn tác.',
      confirm: 'Xóa',
      cancel: 'Hủy',
    },
    suggestions: {
      foodDining: 'Ăn uống',
      transportation: 'Di chuyển',
      shopping: 'Mua sắm',
      entertainment: 'Giải trí',
      healthFitness: 'Sức khỏe & Thể dục',
      salary: 'Lương',
      coffee: 'Cà phê',
      travel: 'Du lịch',
      education: 'Giáo dục',
      housing: 'Nhà ở',
      utilities: 'Tiện ích',
      gifts: 'Quà tặng',
      investment: 'Đầu tư',
      savings: 'Tiết kiệm',
      bills: 'Hóa đơn',
      maintenance: 'Bảo trì',
    },
  },
  language: {
    english: 'Tiếng Anh',
    vietnamese: 'Tiếng Việt',
    switchTo: 'Chuyển sang',
    selectLanguage: 'Chọn Ngôn Ngữ',
  },
  currency: {
    usd: 'Đô la Mỹ',
    vnd: 'Việt Nam Đồng',
    selectCurrency: 'Chọn Tiền Tệ',
    switchTo: 'Chuyển sang',
  },
  analytics: {
    title: 'Phân Tích Tài Chính',
    subtitle: 'Hình dung dữ liệu tài chính với biểu đồ và thống kê tương tác',
    daily: 'Hàng Ngày',
    weekly: 'Hàng Tuần',
    monthly: 'Hàng Tháng',
    yearly: 'Hàng Năm',
    income: 'Thu Nhập',
    expenses: 'Chi Phí',
    net: 'Ròng',
    overview: 'Tổng Quan',
    categoryBreakdown: 'Phân Tích Theo Danh Mục',
    incomeVsExpenses: 'Thu Nhập vs Chi Phí',
    totalIncome: 'Tổng Thu Nhập',
    totalExpenses: 'Tổng Chi Phí',
    netAmount: 'Số Tiền Ròng',
    refresh: 'Làm Mới',
    refreshing: 'Đang làm mới...',
    loading: 'Đang tải...',
    noData: 'Không có dữ liệu',
    noDataDescription: 'Dữ liệu sẽ hiển thị khi bạn có giao dịch',
    chartView: 'Kiểu Biểu Đồ',
    pieChartType: 'Loại Biểu Đồ',
    customDateRange: 'Khoảng Thời Gian Tùy Chỉnh',
    selectDateRange: 'Chọn Khoảng Thời Gian',
    startDate: 'Ngày Bắt Đầu',
    endDate: 'Ngày Kết Thúc',
    applyDateRange: 'Áp Dụng Khoảng Thời Gian',
    dateRange: 'Khoảng Thời Gian',
    preset: 'Có Sẵn',
    custom: 'Tùy Chỉnh',
    byCategory: 'Theo Danh Mục',
    byWallet: 'Theo Ví',
    breakdownSource: 'Nguồn Phân Tích',
    failedToLoad: 'Không Thể Tải Phân Tích',
    errorTitle: 'Không Thể Tải Phân Tích',
    dismiss: 'Bỏ Qua',
    retry: 'Thử Lại',
    categories: 'danh mục',
    categoriesCount: 'danh mục', // "5 danh mục"
  },
  reports: {
    title: 'Báo Cáo',
    subtitle: 'Tạo báo cáo tài chính chi tiết',
    generateReport: 'Tạo Báo Cáo',
    generating: 'Đang Tạo Báo Cáo...',
    downloadReport: 'Tải Báo Cáo',
    reportGenerated: 'Báo Cáo Đã Được Tạo',
    reportFailed: 'Tạo Báo Cáo Thất Bại',

    // Report types
    types: {
      categoryBreakdown: {
        title: 'Phân Tích Theo Danh Mục',
        description:
          'Phân tích chi tiết thu nhập và chi tiêu theo danh mục với theo dõi ngân sách',
      },
      cashFlow: {
        title: 'Tóm Tắt Dòng Tiền',
        description:
          'Tổng quan về tổng thu nhập và chi tiêu trong một khoảng thời gian cụ thể',
      },
      dailySummary: {
        title: 'Tóm Tắt Hàng Ngày',
        description:
          'Tóm tắt tài chính hàng ngày đầy đủ với bối cảnh hàng tuần',
      },
      weeklySummary: {
        title: 'Tóm Tắt Hàng Tuần',
        description: 'Phân tích tài chính hàng tuần với chi tiết từng ngày',
      },
      monthlySummary: {
        title: 'Tóm Tắt Hàng Tháng',
        description: 'Tổng quan tài chính hàng tháng với so sánh từng tháng',
      },
      yearlySummary: {
        title: 'Tóm Tắt Hàng Năm',
        description: 'Báo cáo tài chính hàng năm với phân tích từng năm',
      },
    },

    // Form fields
    form: {
      reportType: 'Loại Báo Cáo',
      selectReportType: 'Chọn loại báo cáo',
      dateRange: 'Khoảng Thời Gian',
      startDate: 'Ngày Bắt Đầu',
      endDate: 'Ngày Kết Thúc',
      currency: 'Tiền Tệ',
      format: 'Định Dạng',
      language: 'Ngôn Ngữ',
      generate: 'Tạo Báo Cáo',
      cancel: 'Hủy',
      reset: 'Đặt Lại Form',
    },

    // Categories
    categories: {
      breakdown: 'Báo Cáo Phân Tích',
      summary: 'Báo Cáo Tóm Tắt',
      flow: 'Báo Cáo Dòng Tiền',
    },

    // Messages
    messages: {
      selectType: 'Vui lòng chọn loại báo cáo',
      selectStartDate: 'Vui lòng chọn ngày bắt đầu',
      selectEndDate: 'Ngày kết thúc là bắt buộc cho loại báo cáo này',
      invalidDateRange: 'Ngày kết thúc phải sau ngày bắt đầu',
      generating: 'Đang tạo báo cáo của bạn...',
      downloadStarted: 'Bắt đầu tải báo cáo',
      generationFailed: 'Không thể tạo báo cáo. Vui lòng thử lại.',
      downloadFailed: 'Không thể tải file báo cáo',
    },

    // Progress
    progress: {
      preparing: 'Đang chuẩn bị báo cáo...',
      processing: 'Đang xử lý dữ liệu...',
      generating: 'Đang tạo PDF...',
      downloading: 'Bắt đầu tải xuống...',
    },
  },
  errors: {
    networkError: 'Lỗi mạng. Vui lòng kiểm tra kết nối.',
    serverError: 'Lỗi máy chủ. Vui lòng thử lại sau.',
    unauthorized: 'Bạn không có quyền thực hiện hành động này.',
    notFound: 'Không tìm thấy tài nguyên được yêu cầu.',
    unexpected: 'Đã xảy ra lỗi không mong muốn.',
    transactions: {
      createError: 'Không thể tạo giao dịch',
      updateError: 'Không thể cập nhật giao dịch',
      deleteError: 'Không thể xóa giao dịch',
      searchError: 'Không thể tìm kiếm giao dịch',
    },
  },
  savingGoals: {
    title: 'Mục Tiêu Tiết Kiệm',
    subtitle:
      'Theo dõi tiến độ tiết kiệm và đạt được mục tiêu tài chính của bạn',
    addNew: 'Thêm Mục Tiêu Mới',
    editGoal: 'Chỉnh Sửa Mục Tiêu',
    deleteGoal: 'Xóa Mục Tiêu',
    goalDetails: 'Chi Tiết Mục Tiêu',
    progress: 'Tiến Độ',
    noGoals: 'Không có mục tiêu tiết kiệm nào',
    noGoalsDescription:
      'Tạo mục tiêu tiết kiệm đầu tiên để bắt đầu theo dõi tiến độ',

    // Form fields
    description: 'Mô Tả',
    targetAmount: 'Số Tiền Mục Tiêu',
    startDate: 'Ngày Bắt Đầu',
    endDate: 'Ngày Kết Thúc',
    category: 'Danh Mục',
    wallet: 'Ví',
    savedAmount: 'Số Tiền Đã Tiết Kiệm',

    // Status
    status: {
      notStarted: 'Chưa Bắt Đầu',
      achieved: 'Đã Đạt Được',
      partiallyAchieved: 'Đạt Một Phần',
      missedTarget: 'Không Đạt Mục Tiêu',
      achievedEarly: 'Đạt Mục Tiêu Sớm',
      ahead: 'Vượt Tiến Độ',
      onTrack: 'Đúng Tiến Độ',
      slightlyBehind: 'Hơi Chậm Tiến Độ',
      atRisk: 'Có Nguy Cơ',
      safe: 'Đúng Tiến Độ',
      warning: 'Chậm Tiến Độ',
      danger: 'Nguy Hiểm',
    },

    // Stats
    totalGoals: 'Tổng Mục Tiêu',
    activeGoals: 'Mục Tiêu Đang Hoạt Động',
    completedGoals: 'Mục Tiêu Đã Hoàn Thành',
    totalTargetAmount: 'Tổng Mục Tiêu',
    totalSavedAmount: 'Tổng Đã Tiết Kiệm',

    // Actions
    create: 'Tạo Mục Tiêu',
    update: 'Cập Nhật Mục Tiêu',
    delete: 'Xóa',
    edit: 'Chỉnh Sửa',
    view: 'Xem Chi Tiết',

    // Progress
    progressPercentage: '% Tiến Độ',
    daysRemaining: 'ngày còn lại',
    completed: 'Hoàn Thành',

    // Confirmations
    deleteConfirmTitle: 'Xóa Mục Tiêu Tiết Kiệm',
    deleteConfirmMessage:
      'Bạn có chắc chắn muốn xóa mục tiêu tiết kiệm này? Hành động này không thể hoàn tác.',

    // Search
    search: {
      title: 'Tìm Kiếm Mục Tiêu Tiết Kiệm',
      keywords: 'Từ Khóa',
      keywordsPlaceholder: 'Tìm theo mô tả...',
      startDate: 'Ngày Bắt Đầu',
      endDate: 'Ngày Kết Thúc',
      category: 'Danh Mục',
      wallet: 'Ví',
      minTargetAmount: 'Số Tiền Mục Tiêu Tối Thiểu',
      maxTargetAmount: 'Số Tiền Mục Tiêu Tối Đa',
      allCategories: 'Tất Cả Danh Mục',
      allWallets: 'Tất Cả Ví',
      resultsFound: 'kết quả được tìm thấy',
      noResults: 'Không tìm thấy mục tiêu tiết kiệm nào phù hợp',
      clearSearch: 'Xóa Tìm Kiếm',
    },

    notifications: {
      createSuccess: 'Tạo mục tiêu tiết kiệm thành công',
      updateSuccess: 'Cập nhật mục tiêu tiết kiệm thành công',
      deleteSuccess: 'Xóa mục tiêu tiết kiệm thành công',
      createError: 'Không thể tạo mục tiêu tiết kiệm',
      updateError: 'Không thể cập nhật mục tiêu tiết kiệm',
      deleteError: 'Không thể xóa mục tiêu tiết kiệm',
      loadError: 'Không thể tải mục tiêu tiết kiệm',
    },

    // Validation
    validation: {
      descriptionRequired: 'Mô tả là bắt buộc',
      targetAmountRequired: 'Số tiền mục tiêu là bắt buộc',
      targetAmountPositive: 'Số tiền mục tiêu phải lớn hơn 0',
      startDateRequired: 'Ngày bắt đầu là bắt buộc',
      endDateRequired: 'Ngày kết thúc là bắt buộc',
      endDateAfterStart: 'Ngày kết thúc phải sau ngày bắt đầu',
      categoryRequired: 'Danh mục là bắt buộc',
      walletRequired: 'Ví là bắt buộc',
    },
    remaining: 'còn lại',
    daysOverdue: '{n} ngày quá hạn',
  },
  budgets: {
    title: 'Ngân Sách',
    subtitle:
      'Theo dõi giới hạn chi tiêu và quản lý ngân sách tài chính của bạn',
    addNew: 'Thêm Ngân Sách Mới',
    editBudget: 'Chỉnh Sửa Ngân Sách',
    deleteBudget: 'Xóa Ngân Sách',
    budgetDetails: 'Chi Tiết Ngân Sách',
    progress: 'Tiến Độ',
    noBudgets: 'Không có ngân sách nào',
    noBudgetsDescription:
      'Tạo ngân sách đầu tiên để bắt đầu theo dõi giới hạn chi tiêu',

    // Form fields
    description: 'Mô Tả',
    limitAmount: 'Số Tiền Giới Hạn',
    startDate: 'Ngày Bắt Đầu',
    endDate: 'Ngày Kết Thúc',
    category: 'Danh Mục',
    wallet: 'Ví',
    currentSpending: 'Chi Tiêu Hiện Tại',

    // Status
    status: {
      notStarted: 'Chưa Bắt Đầu',
      overBudget: 'Vượt Ngân Sách',
      nearlyMaxed: 'Gần Hết Hạn',
      underBudget: 'Dưới Ngân Sách',
      critical: 'Nguy Hiểm',
      warning: 'Cảnh Báo',
      onTrack: 'Đúng Tiến Độ',
      minimalSpending: 'Chi Tiêu Tối Thiểu',
    },

    // Stats
    totalBudgets: 'Tổng Ngân Sách',
    activeBudgets: 'Ngân Sách Đang Hoạt Động',
    completedBudgets: 'Ngân Sách Đã Hoàn Thành',
    totalLimitAmount: 'Tổng Giới Hạn',
    totalCurrentSpending: 'Tổng Đã Chi',

    // Actions
    create: 'Tạo Ngân Sách',
    update: 'Cập Nhật Ngân Sách',
    delete: 'Xóa',
    edit: 'Chỉnh Sửa',
    view: 'Xem Chi Tiết',

    // Progress
    progressPercentage: '% Đã Sử Dụng',
    daysRemaining: 'ngày còn lại',
    completed: 'Hoàn Thành',

    // Confirmations
    deleteConfirmTitle: 'Xóa Ngân Sách',
    deleteConfirmMessage:
      'Bạn có chắc chắn muốn xóa ngân sách này? Hành động này không thể hoàn tác.',

    // Search
    search: {
      title: 'Tìm Kiếm Ngân Sách',
      keywords: 'Từ Khóa',
      keywordsPlaceholder: 'Tìm theo mô tả...',
      startDate: 'Ngày Bắt Đầu',
      endDate: 'Ngày Kết Thúc',
      category: 'Danh Mục',
      wallet: 'Ví',
      minLimitAmount: 'Số Tiền Giới Hạn Tối Thiểu',
      maxLimitAmount: 'Số Tiền Giới Hạn Tối Đa',
      allCategories: 'Tất Cả Danh Mục',
      allWallets: 'Tất Cả Ví',
      resultsFound: 'kết quả được tìm thấy',
      noResults: 'Không tìm thấy ngân sách nào phù hợp',
      clearSearch: 'Xóa Tìm Kiếm',
    },

    notifications: {
      createSuccess: 'Tạo ngân sách thành công',
      updateSuccess: 'Cập nhật ngân sách thành công',
      deleteSuccess: 'Xóa ngân sách thành công',
      createError: 'Không thể tạo ngân sách',
      updateError: 'Không thể cập nhật ngân sách',
      deleteError: 'Không thể xóa ngân sách',
      loadError: 'Không thể tải ngân sách',
    },

    // Validation
    validation: {
      descriptionRequired: 'Mô tả là bắt buộc',
      limitAmountRequired: 'Số tiền giới hạn là bắt buộc',
      limitAmountPositive: 'Số tiền giới hạn phải lớn hơn 0',
      startDateRequired: 'Ngày bắt đầu là bắt buộc',
      endDateRequired: 'Ngày kết thúc là bắt buộc',
      endDateAfterStart: 'Ngày kết thúc phải sau ngày bắt đầu',
      categoryRequired: 'Danh mục là bắt buộc',
      walletRequired: 'Ví là bắt buộc',
    },
    remaining: 'còn lại',
    daysOverdue: '{n} ngày quá hạn',
  },

  settings: {
    title: 'Cài đặt',
    subtitle: 'Quản lý cài đặt tài khoản và tùy chọn của bạn',
    profileSettings: 'Cài đặt hồ sơ',
    profileDescription: 'Quản lý thông tin cá nhân và ảnh đại diện của bạn',
    security: 'Bảo mật',
    securityDescription: 'Cài đặt mật khẩu và bảo mật',
    securitySettings: 'Cài đặt bảo mật',
    securitySubtitle: 'Thay đổi mật khẩu để bảo mật tài khoản tốt hơn',

    // Avatar section
    avatarHint: 'Nhấp vào biểu tượng camera để tải lên ảnh đại diện mới',
    avatarFileHint: 'Định dạng hỗ trợ: JPG, PNG, GIF. Dung lượng tối đa: 10MB',

    // Profile form
    firstName: 'Tên',
    firstNamePlaceholder: 'Nhập tên của bạn',
    lastName: 'Họ',
    lastNamePlaceholder: 'Nhập họ của bạn',
    emailAddress: 'Địa chỉ email',
    emailPlaceholder: 'Nhập địa chỉ email của bạn',
    displayName: 'Tên hiển thị',
    displayNamePlaceholder: 'Nhập tên hiển thị của bạn',

    // Actions
    editProfile: 'Chỉnh sửa hồ sơ',
    saveChanges: 'Lưu thay đổi',
    updating: 'Đang cập nhật...',
    cancel: 'Hủy',

    // Password form
    currentPassword: 'Mật khẩu hiện tại',
    currentPasswordPlaceholder: 'Nhập mật khẩu hiện tại',
    newPassword: 'Mật khẩu mới',
    newPasswordPlaceholder: 'Nhập mật khẩu mới',
    confirmNewPassword: 'Xác nhận mật khẩu mới',
    confirmPasswordPlaceholder: 'Nhập lại mật khẩu mới',
    changePassword: 'Đổi mật khẩu',
    updateProfilePassword: 'Cập nhật hồ sơ & mật khẩu',
    alsoUpdateProfile: 'Cập nhật thông tin hồ sơ của tôi',
    alsoUpdateProfileHint:
      'Chọn mục này để cập nhật tên và email cùng với việc thay đổi mật khẩu',
    profileInformation: 'Thông tin hồ sơ',

    // Notifications
    avatarUpdateSuccess: 'Cập nhật ảnh đại diện thành công!',
    avatarDeleteSuccess: 'Xóa ảnh đại diện thành công!',
    profileUpdateSuccess: 'Cập nhật hồ sơ và mật khẩu thành công!',
    passwordChangeSuccess: 'Đổi mật khẩu thành công!',
    avatarUploadError: 'Không thể tải lên ảnh đại diện. Vui lòng thử lại.',
    avatarDeleteError: 'Không thể xóa ảnh đại diện. Vui lòng thử lại.',
    fileSizeError: 'Kích thước file phải nhỏ hơn 5MB',
    fileTypeError: 'Vui lòng chọn file hình ảnh hợp lệ',
    updateProfileNote:
      'Để cập nhật thông tin hồ sơ, vui lòng sử dụng phần Bảo mật bên dưới và cung cấp mật khẩu hiện tại.',

    // Password validation
    currentPasswordRequired: 'Mật khẩu hiện tại là bắt buộc',
    newPasswordRequired: 'Mật khẩu mới là bắt buộc',
    passwordTooShort: 'Mật khẩu phải có ít nhất 8 ký tự',
    passwordMissingUppercase: 'Mật khẩu phải chứa một chữ hoa',
    passwordMissingLowercase: 'Mật khẩu phải chứa một chữ thường',
    passwordMissingNumber: 'Mật khẩu phải chứa một số',
    passwordMissingSpecial: 'Mật khẩu phải chứa một ký tự đặc biệt',
    passwordsNotMatch: 'Mật khẩu không khớp',
    currentPasswordWrong:
      'Mật khẩu hiện tại của bạn không đúng. Vui lòng nhập lại.',

    // Additional keys for SettingsPage
    firstNameRequired: 'Tên là bắt buộc',
    lastNameRequired: 'Họ là bắt buộc',
    displayNameRequired: 'Tên hiển thị là bắt buộc',
    profileAndPasswordUpdated: 'Cập nhật hồ sơ và mật khẩu thành công!',
    passwordChanged: 'Đổi mật khẩu thành công!',
    uploadAvatar: 'Tải lên ảnh đại diện',
    deleteAvatar: 'Xóa ảnh đại diện',
    deleteAvatarConfirm:
      'Bạn có chắc chắn muốn xóa ảnh đại diện? Hành động này không thể hoàn tác.',
    delete: 'Xóa',
    passwordsMustMatch: 'Mật khẩu không khớp',
    confirmPasswordRequired: 'Vui lòng xác nhận mật khẩu mới',
    updateError: 'Cập nhật thất bại. Vui lòng thử lại.',
    passwordComplexity:
      'Mật khẩu phải có ít nhất 6 ký tự, bao gồm 1 chữ hoa và 1 ký tự đặc biệt.',
  },

  // Sidebar
  sidebar: {
    mainMenu: 'Menu Chính',
    expandSidebar: 'Mở rộng thanh bên',
    collapseSidebar: 'Thu gọn thanh bên',
    thisMonth: 'Tháng Này',
    totalIncome: 'Tổng Thu Nhập',
    totalExpenses: 'Tổng Chi Phí',
    savings: 'Tiết Kiệm',
    new: 'Mới',
  },

  wallets: {
    title: 'Ví',
    subtitle: 'Quản lý các tài khoản và theo dõi số dư trong tất cả ví của bạn',
    addNew: 'Thêm Ví',
    create: 'Tạo Ví',
    edit: 'Chỉnh Sửa Ví',
    delete: 'Xóa Ví',
    
    // Summary stats
    totalBalance: 'Tổng Số Dư',
    positiveWallets: 'Ví Dương',
    negativeWallets: 'Ví Âm',
    walletsCount: 'ví',
    
    // Empty state
    noWallets: 'Không tìm thấy ví nào',
    noWalletsDescription: 'Tạo ví đầu tiên để bắt đầu theo dõi tài chính của bạn',
    
    // Form fields
    name: 'Tên Ví',
    namePlaceholder: 'Nhập tên ví',
    balance: 'Số Dư Ban Đầu',
    balancePlaceholder: 'Nhập số dư ban đầu',
    currency: 'Loại Tiền',
    type: 'Loại Ví',
    description: 'Mô Tả',
    descriptionPlaceholder: 'Nhập mô tả ví (tùy chọn)',
    
    // Wallet types
    types: {
      cash: 'Tiền Mặt',
      bank: 'Tài Khoản Ngân Hàng',
      card: 'Thẻ Tín Dụng/Ghi Nợ',
      savings: 'Tài Khoản Tiết Kiệm',
      investment: 'Tài Khoản Đầu Tư',
      other: 'Khác',
    },
    
    // Actions
    refresh: 'Làm Mới',
    tryAgain: 'Thử Lại',
    
    // Confirmations
    deleteConfirmTitle: 'Xóa Ví',
    deleteConfirmMessage: 'Bạn có chắc chắn muốn xóa ví này? Hành động này không thể hoàn tác.',
    
    // Notifications
    notifications: {
      createSuccess: 'Tạo ví thành công',
      updateSuccess: 'Cập nhật ví thành công',
      deleteSuccess: 'Xóa ví thành công',
      createError: 'Không thể tạo ví',
      updateError: 'Không thể cập nhật ví',
      deleteError: 'Không thể xóa ví',
      loadError: 'Không thể tải danh sách ví',
    },
    
    // Validation
    validation: {
      nameRequired: 'Tên ví là bắt buộc',
      nameMinLength: 'Tên ví phải có ít nhất 2 ký tự',
      balanceRequired: 'Số dư ban đầu là bắt buộc',
      balanceNumber: 'Số dư phải là một số hợp lệ',
      typeRequired: 'Loại ví là bắt buộc',
    },
  },
};

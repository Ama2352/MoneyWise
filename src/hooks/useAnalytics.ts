/**
 * Analytics Hook - Data fetching and state management
 */

import { useState, useCallback } from 'react';
import { analyticsApi } from '../api/analyticsApi';
import { useToast } from './useToast';
import type {
  CategoryBreakdownDTO,
  WalletBreakdownDTO,
  CashFlowSummaryDTO,
  DailySummaryDTO,
  WeeklySummaryDTO,
  MonthlySummaryDTO,
  YearlySummaryDTO,
  DateRangeParams,
  MonthParams,
  YearParams,
  PieChartData,
  BarChartData
} from '../types/analytics';

interface UseAnalyticsReturn {
  // Data
  categoryBreakdown: CategoryBreakdownDTO[];
  walletBreakdown: WalletBreakdownDTO[];
  cashFlow: CashFlowSummaryDTO | null;
  dailySummary: DailySummaryDTO | null;
  weeklySummary: WeeklySummaryDTO | null;
  monthlySummary: MonthlySummaryDTO | null;
  yearlySummary: YearlySummaryDTO | null;

  // Loading states
  loading: {
    categoryBreakdown: boolean;
    walletBreakdown: boolean;
    cashFlow: boolean;
    dailySummary: boolean;
    weeklySummary: boolean;
    monthlySummary: boolean;
    yearlySummary: boolean;
  };

  // Error states
  error: string | null;

  // Actions
  fetchCategoryBreakdown: (params: DateRangeParams) => Promise<void>;
  fetchWalletBreakdown: (params: DateRangeParams) => Promise<void>;
  fetchCashFlow: (params?: Partial<DateRangeParams>) => Promise<void>;
  fetchDailySummary: (date: string) => Promise<void>;
  fetchWeeklySummary: (startDate: string) => Promise<void>;
  fetchMonthlySummary: (params: MonthParams) => Promise<void>;
  fetchYearlySummary: (params: YearParams) => Promise<void>;
  fetchAllData: (period: 'week' | 'month' | 'year') => Promise<void>;

  // Chart data helpers
  getCategoryPieChartData: (type?: 'income' | 'expense') => PieChartData[];
  getWalletPieChartData: (type?: 'income' | 'expense') => PieChartData[];
  getCashFlowBarChartData: () => BarChartData[];
  getDailyBarChartData: () => BarChartData[];
  getWeeklyBarChartData: () => BarChartData[];
  getMonthlyBarChartData: () => BarChartData[];
  getYearlyBarChartData: () => BarChartData[];

  // Utils
  clearError: () => void;
}

export const useAnalytics = (): UseAnalyticsReturn => {
  // State
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdownDTO[]>([]);
  const [walletBreakdown, setWalletBreakdown] = useState<WalletBreakdownDTO[]>([]);
  const [cashFlow, setCashFlow] = useState<CashFlowSummaryDTO | null>(null);
  const [dailySummary, setDailySummary] = useState<DailySummaryDTO | null>(null);
  const [weeklySummary, setWeeklySummary] = useState<WeeklySummaryDTO | null>(null);
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummaryDTO | null>(null);
  const [yearlySummary, setYearlySummary] = useState<YearlySummaryDTO | null>(null);

  const [loading, setLoading] = useState({
    categoryBreakdown: false,
    walletBreakdown: false,
    cashFlow: false,
    dailySummary: false,
    weeklySummary: false,
    monthlySummary: false,
    yearlySummary: false,
  });

  const [error, setError] = useState<string | null>(null);

  // Hooks
  const { showToast } = useToast();

  // Category colors for charts
  const categoryColors = [
    '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444',
    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
  ];

  // Fetch functions
  const fetchCategoryBreakdown = useCallback(async (params: DateRangeParams) => {
    setLoading(prev => ({ ...prev, categoryBreakdown: true }));
    setError(null);
    try {
      const data = await analyticsApi.getCategoryBreakdown(params);
      setCategoryBreakdown(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch category breakdown';
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(prev => ({ ...prev, categoryBreakdown: false }));
    }
  }, [showToast]);

  const fetchCashFlow = useCallback(async (params?: Partial<DateRangeParams>) => {
    setLoading(prev => ({ ...prev, cashFlow: true }));
    setError(null);
    try {
      const data = await analyticsApi.getCashFlowSummary(params);
      setCashFlow(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch cash flow';
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(prev => ({ ...prev, cashFlow: false }));
    }
  }, [showToast]);

  const fetchDailySummary = useCallback(async (date: string) => {
    setLoading(prev => ({ ...prev, dailySummary: true }));
    setError(null);
    try {
      const data = await analyticsApi.getDailySummary(date);
      setDailySummary(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch daily summary';
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(prev => ({ ...prev, dailySummary: false }));
    }
  }, [showToast]);

  const fetchWeeklySummary = useCallback(async (startDate: string) => {
    setLoading(prev => ({ ...prev, weeklySummary: true }));
    setError(null);
    try {
      const data = await analyticsApi.getWeeklySummary(startDate);
      setWeeklySummary(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch weekly summary';
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(prev => ({ ...prev, weeklySummary: false }));
    }
  }, [showToast]);

  const fetchMonthlySummary = useCallback(async (params: MonthParams) => {
    setLoading(prev => ({ ...prev, monthlySummary: true }));
    setError(null);
    try {
      const data = await analyticsApi.getMonthlySummary(params);
      setMonthlySummary(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch monthly summary';
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(prev => ({ ...prev, monthlySummary: false }));
    }
  }, [showToast]);

  const fetchYearlySummary = useCallback(async (params: YearParams) => {
    setLoading(prev => ({ ...prev, yearlySummary: true }));
    setError(null);
    try {
      const data = await analyticsApi.getYearlySummary(params);
      setYearlySummary(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch yearly summary';
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(prev => ({ ...prev, yearlySummary: false }));
    }
  }, [showToast]);

  const fetchWalletBreakdown = useCallback(async (params: DateRangeParams) => {
    setLoading(prev => ({ ...prev, walletBreakdown: true }));
    setError(null);
    try {
      const data = await analyticsApi.getWalletBreakdown(params);
      setWalletBreakdown(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch wallet breakdown';
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(prev => ({ ...prev, walletBreakdown: false }));
    }
  }, [showToast]);

  const fetchAllData = useCallback(async (period: 'week' | 'month' | 'year') => {
    const dateRange = analyticsApi.getDateRangeForPeriod(period);
    
    // Fetch parallel data
    await Promise.all([
      fetchCategoryBreakdown(dateRange),
      fetchCashFlow(dateRange)
    ]);

    // Fetch period-specific data
    switch (period) {
      case 'week':
        await fetchWeeklySummary(analyticsApi.getCurrentWeekStart());
        await fetchDailySummary(analyticsApi.formatDateForApi(new Date()));
        break;
      case 'month':
        await fetchMonthlySummary(analyticsApi.getCurrentMonthParams());
        break;
      case 'year':
        await fetchYearlySummary(analyticsApi.getCurrentYearParams());
        break;
    }
  }, [fetchCategoryBreakdown, fetchCashFlow, fetchDailySummary, fetchWeeklySummary, fetchMonthlySummary, fetchYearlySummary]);

  // Chart data helpers
  const getCategoryPieChartData = useCallback((type: 'income' | 'expense' = 'expense'): PieChartData[] => {
    try {
      if (!categoryBreakdown || !Array.isArray(categoryBreakdown) || categoryBreakdown.length === 0) {
        return [];
      }

      return categoryBreakdown
        .map((item, index) => {
          try {
            const value = type === 'income' ? item.totalIncome : item.totalExpense;
            const percentage = type === 'income' ? item.incomePercentage : item.expensePercentage;
            
            return {
              name: item.category || 'Unknown Category',
              value: typeof value === 'number' ? value : 0,
              color: categoryColors[index % categoryColors.length],
              percentage: typeof percentage === 'number' ? percentage : 0
            };
          } catch (error) {
            console.error('Error processing category breakdown item:', error);
            return {
              name: 'Unknown Category',
              value: 0,
              color: categoryColors[index % categoryColors.length],
              percentage: 0
            };
          }
        })
        .filter(item => item.value > 0); // Only show categories with values
    } catch (error) {
      console.error('Error in getCategoryPieChartData:', error);
      return [];
    }
  }, [categoryBreakdown]);

  const getCashFlowBarChartData = useCallback((): BarChartData[] => {
    try {
      if (!cashFlow) return [];

      return [{
        name: 'Cash Flow',
        income: typeof cashFlow.totalIncome === 'number' ? cashFlow.totalIncome : 0,
        expense: typeof cashFlow.totalExpenses === 'number' ? cashFlow.totalExpenses : 0,
        net: (typeof cashFlow.totalIncome === 'number' ? cashFlow.totalIncome : 0) - 
             (typeof cashFlow.totalExpenses === 'number' ? cashFlow.totalExpenses : 0)
      }];
    } catch (error) {
      console.error('Error in getCashFlowBarChartData:', error);
      return [];
    }
  }, [cashFlow]);

  const getDailyBarChartData = useCallback((): BarChartData[] => {
    try {
      if (!dailySummary?.dailyDetails || !Array.isArray(dailySummary.dailyDetails) || dailySummary.dailyDetails.length === 0) {
        return [];
      }

      return dailySummary.dailyDetails.map(item => ({
        name: item.dayOfWeek || 'Unknown',
        income: typeof item.income === 'number' ? item.income : 0,
        expense: typeof item.expense === 'number' ? item.expense : 0,
        net: (typeof item.income === 'number' ? item.income : 0) - (typeof item.expense === 'number' ? item.expense : 0)
      }));
    } catch (error) {
      console.error('Error in getDailyBarChartData:', error);
      return [];
    }
  }, [dailySummary]);

  const getWeeklyBarChartData = useCallback((): BarChartData[] => {
    try {
      if (!weeklySummary?.weeklyDetails || !Array.isArray(weeklySummary.weeklyDetails) || weeklySummary.weeklyDetails.length === 0) {
        return [];
      }

      return weeklySummary.weeklyDetails.map(item => ({
        name: `Week ${item.weekNumber || 'Unknown'}`,
        income: typeof item.income === 'number' ? item.income : 0,
        expense: typeof item.expense === 'number' ? item.expense : 0,
        net: (typeof item.income === 'number' ? item.income : 0) - (typeof item.expense === 'number' ? item.expense : 0)
      }));
    } catch (error) {
      console.error('Error in getWeeklyBarChartData:', error);
      return [];
    }
  }, [weeklySummary]);

  const getMonthlyBarChartData = useCallback((): BarChartData[] => {
    try {
      if (!monthlySummary?.monthlyDetails || !Array.isArray(monthlySummary.monthlyDetails) || monthlySummary.monthlyDetails.length === 0) {
        return [];
      }

      return monthlySummary.monthlyDetails.map(item => ({
        name: item.monthName || 'Unknown',
        income: typeof item.income === 'number' ? item.income : 0,
        expense: typeof item.expense === 'number' ? item.expense : 0,
        net: (typeof item.income === 'number' ? item.income : 0) - (typeof item.expense === 'number' ? item.expense : 0)
      }));
    } catch (error) {
      console.error('Error in getMonthlyBarChartData:', error);
      return [];
    }
  }, [monthlySummary]);

  const getYearlyBarChartData = useCallback((): BarChartData[] => {
    try {
      if (!yearlySummary?.yearlyDetails || !Array.isArray(yearlySummary.yearlyDetails) || yearlySummary.yearlyDetails.length === 0) {
        return [];
      }

      return yearlySummary.yearlyDetails.map(item => ({
        name: (item.year || new Date().getFullYear()).toString(),
        income: typeof item.income === 'number' ? item.income : 0,
        expense: typeof item.expense === 'number' ? item.expense : 0,
        net: (typeof item.income === 'number' ? item.income : 0) - (typeof item.expense === 'number' ? item.expense : 0)
      }));
    } catch (error) {
      console.error('Error in getYearlyBarChartData:', error);
      return [];
    }
  }, [yearlySummary]);

  const getWalletPieChartData = useCallback((type: 'income' | 'expense' = 'expense'): PieChartData[] => {
    try {
      if (!walletBreakdown || !Array.isArray(walletBreakdown) || walletBreakdown.length === 0) {
        return [];
      }

      console.log('🔍 Wallet breakdown data for pie chart:', walletBreakdown);

      return walletBreakdown
        .map((item, index) => {
          try {
            const value = type === 'income' ? item.totalIncome : item.totalExpense;
            const percentage = type === 'income' ? item.incomePercentage : item.expensePercentage;
            
            console.log('🔍 Processing wallet item:', {
              walletName: item.walletName,
              value: value,
              type: type,
              rawItem: item
            });
            
            // Handle various wallet name cases
            let walletName = 'Unknown Wallet';
            if (item.walletName && typeof item.walletName === 'string' && item.walletName.trim() !== '') {
              walletName = item.walletName.trim();
            } else if ((item as any).name && typeof (item as any).name === 'string' && (item as any).name.trim() !== '') {
              // Fallback to 'name' field if 'walletName' doesn't exist
              walletName = (item as any).name.trim();
            }
            
            return {
              name: walletName,
              value: typeof value === 'number' ? value : 0,
              color: categoryColors[index % categoryColors.length],
              percentage: typeof percentage === 'number' ? percentage : 0
            };
          } catch (error) {
            console.error('Error processing wallet breakdown item:', error);
            return {
              name: 'Unknown Wallet',
              value: 0,
              color: categoryColors[index % categoryColors.length],
              percentage: 0
            };
          }
        })
        .filter(item => item.value > 0); // Only show wallets with values
    } catch (error) {
      console.error('Error in getWalletPieChartData:', error);
      return [];
    }
  }, [walletBreakdown]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Data
    categoryBreakdown,
    walletBreakdown,
    cashFlow,
    dailySummary,
    weeklySummary,
    monthlySummary,
    yearlySummary,

    // Loading states
    loading,

    // Error state
    error,

    // Actions
    fetchCategoryBreakdown,
    fetchWalletBreakdown,
    fetchCashFlow,
    fetchDailySummary,
    fetchWeeklySummary,
    fetchMonthlySummary,
    fetchYearlySummary,
    fetchAllData,

    // Chart data helpers
    getCategoryPieChartData,
    getWalletPieChartData,
    getCashFlowBarChartData,
    getDailyBarChartData,
    getWeeklyBarChartData,
    getMonthlyBarChartData,
    getYearlyBarChartData,

    // Utils
    clearError
  };
};

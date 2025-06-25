/**
 * Analytics Hook - Data fetching and state management
 */

import { useState, useCallback } from 'react';
import { analyticsApi } from '../api/analyticsApi';
import { useToast } from './useToast';
import type {
  CategoryBreakdownDTO,
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
  cashFlow: CashFlowSummaryDTO | null;
  dailySummary: DailySummaryDTO | null;
  weeklySummary: WeeklySummaryDTO | null;
  monthlySummary: MonthlySummaryDTO | null;
  yearlySummary: YearlySummaryDTO | null;

  // Loading states
  loading: {
    categoryBreakdown: boolean;
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
  fetchCashFlow: (params?: Partial<DateRangeParams>) => Promise<void>;
  fetchDailySummary: (date: string) => Promise<void>;
  fetchWeeklySummary: (startDate: string) => Promise<void>;
  fetchMonthlySummary: (params: MonthParams) => Promise<void>;
  fetchYearlySummary: (params: YearParams) => Promise<void>;
  fetchAllData: (period: 'week' | 'month' | 'year') => Promise<void>;

  // Chart data helpers
  getCategoryPieChartData: (type?: 'income' | 'expense') => PieChartData[];
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
  const [cashFlow, setCashFlow] = useState<CashFlowSummaryDTO | null>(null);
  const [dailySummary, setDailySummary] = useState<DailySummaryDTO | null>(null);
  const [weeklySummary, setWeeklySummary] = useState<WeeklySummaryDTO | null>(null);
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummaryDTO | null>(null);
  const [yearlySummary, setYearlySummary] = useState<YearlySummaryDTO | null>(null);

  const [loading, setLoading] = useState({
    categoryBreakdown: false,
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
    if (!categoryBreakdown.length) return [];

    return categoryBreakdown
      .map((item, index) => ({
        name: item.category,
        value: type === 'income' ? item.totalIncome : item.totalExpense,
        color: categoryColors[index % categoryColors.length],
        percentage: type === 'income' ? item.incomePercentage : item.expensePercentage
      }))
      .filter(item => item.value > 0); // Only show categories with values
  }, [categoryBreakdown]);

  const getCashFlowBarChartData = useCallback((): BarChartData[] => {
    if (!cashFlow) return [];

    return [{
      name: 'Cash Flow',
      income: cashFlow.totalIncome,
      expense: cashFlow.totalExpenses,
      net: cashFlow.totalIncome - cashFlow.totalExpenses
    }];
  }, [cashFlow]);

  const getDailyBarChartData = useCallback((): BarChartData[] => {
    if (!dailySummary?.dailyDetails.length) return [];

    return dailySummary.dailyDetails.map(item => ({
      name: item.dayOfWeek,
      income: item.income,
      expense: item.expense,
      net: item.income - item.expense
    }));
  }, [dailySummary]);

  const getWeeklyBarChartData = useCallback((): BarChartData[] => {
    if (!weeklySummary?.weeklyDetails.length) return [];

    return weeklySummary.weeklyDetails.map(item => ({
      name: `Week ${item.weekNumber}`,
      income: item.income,
      expense: item.expense,
      net: item.income - item.expense
    }));
  }, [weeklySummary]);

  const getMonthlyBarChartData = useCallback((): BarChartData[] => {
    if (!monthlySummary?.monthlyDetails.length) return [];

    return monthlySummary.monthlyDetails.map(item => ({
      name: item.monthName,
      income: item.income,
      expense: item.expense,
      net: item.income - item.expense
    }));
  }, [monthlySummary]);

  const getYearlyBarChartData = useCallback((): BarChartData[] => {
    if (!yearlySummary?.yearlyDetails.length) return [];

    return yearlySummary.yearlyDetails.map(item => ({
      name: item.year.toString(),
      income: item.income,
      expense: item.expense,
      net: item.income - item.expense
    }));
  }, [yearlySummary]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Data
    categoryBreakdown,
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
    fetchCashFlow,
    fetchDailySummary,
    fetchWeeklySummary,
    fetchMonthlySummary,
    fetchYearlySummary,
    fetchAllData,

    // Chart data helpers
    getCategoryPieChartData,
    getCashFlowBarChartData,
    getDailyBarChartData,
    getWeeklyBarChartData,
    getMonthlyBarChartData,
    getYearlyBarChartData,

    // Utils
    clearError
  };
};

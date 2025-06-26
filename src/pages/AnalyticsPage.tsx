/**
 * Analytics Page - Financial Dashboard with Charts
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar, 
  BarChart3, 
  TrendingUp, 
  Trophy,
  DollarSign,
  CreditCard,
  TrendingDown,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';
import { useLanguageContext } from '../contexts/LanguageContext';
import { useCurrencyContext } from '../contexts/CurrencyContext';
import { AnalyticsPieChart, AnalyticsBarChart } from '../components/charts';
import { CurrencyAmount, DateRangePicker, NetAmount } from '../components/ui';
import Button from '../components/ui/Button';
import './AnalyticsPage.css';

type ChartView = 'daily' | 'weekly' | 'monthly' | 'yearly';
type PieChartType = 'income' | 'expense';
type DateRangeMode = 'preset' | 'custom';

export const AnalyticsPage: React.FC = () => {
  // State
  const [selectedChart, setSelectedChart] = useState<ChartView>('monthly');
  const [pieChartType, setPieChartType] = useState<PieChartType>('expense');
  const [dateRangeMode, setDateRangeMode] = useState<DateRangeMode>('preset');
  const [customDateRange, setCustomDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  
  // Hooks
  const { translations, language } = useLanguageContext();
  const { currency } = useCurrencyContext();
  const {
    // Data
    cashFlow,
    
    // Loading
    loading,
    
    // Error
    error,
    clearError,
    
    // Actions
    fetchCategoryBreakdown,
    fetchCashFlow,
    fetchDailySummary,
    fetchWeeklySummary,
    fetchMonthlySummary,
    fetchYearlySummary,
    
    // Chart helpers
    getCategoryPieChartData,
    getDailyBarChartData,
    getWeeklyBarChartData,
    getMonthlyBarChartData,
    getYearlyBarChartData
  } = useAnalytics();

  // Load data based on selected chart
  const loadChartData = useCallback(async () => {
    try {
      if (dateRangeMode === 'custom' && customDateRange.startDate && customDateRange.endDate) {
        // Custom date range
        await Promise.all([
          fetchCategoryBreakdown({
            startDate: customDateRange.startDate,
            endDate: customDateRange.endDate
          }),
          fetchCashFlow({
            startDate: customDateRange.startDate,
            endDate: customDateRange.endDate
          })
        ]);
      } else {
        // Preset periods - current data
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        
        switch (selectedChart) {
          case 'daily':
            await fetchDailySummary(today);
            break;
          case 'weekly':
            const monday = new Date(now);
            monday.setDate(now.getDate() - now.getDay() + 1);
            await fetchWeeklySummary(monday.toISOString().split('T')[0]);
            break;
          case 'monthly':
            await fetchMonthlySummary({
              year: now.getFullYear(),
              month: now.getMonth() + 1
            });
            break;
          case 'yearly':
            await fetchYearlySummary({
              year: now.getFullYear()
            });
            break;
        }
        
        // Always fetch category breakdown and cash flow for current period
        const dateRange = getDateRangeForPeriod(selectedChart);
        await Promise.all([
          fetchCategoryBreakdown(dateRange),
          fetchCashFlow(dateRange)
        ]);
      }
    } catch (error) {
      console.error('Error loading chart data:', error);
      // The error is already handled by individual fetch functions
      // This is just an additional safety net
    }
  }, [selectedChart, dateRangeMode, customDateRange, fetchCategoryBreakdown, fetchCashFlow, fetchDailySummary, fetchWeeklySummary, fetchMonthlySummary, fetchYearlySummary]);

  // Helper to get date range for periods
  const getDateRangeForPeriod = (period: ChartView) => {
    const now = new Date();
    let startDate: Date;
    const endDate = new Date(now);

    switch (period) {
      case 'daily':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 6); // Last 7 days
        break;
      case 'weekly':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 28); // Last 4 weeks
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), 0, 1); // Start of year
        break;
      case 'yearly':
        startDate = new Date(now.getFullYear() - 4, 0, 1); // Last 5 years
        break;
      default:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 30);
    }

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  };

  // Load initial data and auto-reload when language or currency changes
  useEffect(() => {
    try {
      // Small delay to allow context values to stabilize when changing
      const timeoutId = setTimeout(() => {
        loadChartData().catch(error => {
          console.error('Failed to load chart data in useEffect:', error);
        });
      }, 100);
      
      return () => clearTimeout(timeoutId);
    } catch (error) {
      console.error('Error in useEffect for analytics:', error);
    }
  }, [loadChartData, language, currency]);

  // Chart view options
  const chartOptions = [
    { value: 'daily' as ChartView, label: translations.analytics?.daily || 'Daily', icon: Calendar },
    { value: 'weekly' as ChartView, label: translations.analytics?.weekly || 'Weekly', icon: BarChart3 },
    { value: 'monthly' as ChartView, label: translations.analytics?.monthly || 'Monthly', icon: TrendingUp },
    { value: 'yearly' as ChartView, label: translations.analytics?.yearly || 'Yearly', icon: Trophy }
  ];

  // Pie chart type options
  const pieChartOptions = [
    { value: 'expense' as PieChartType, label: translations.analytics?.expenses || 'Expenses', icon: CreditCard },
    { value: 'income' as PieChartType, label: translations.analytics?.income || 'Income', icon: DollarSign }
  ];

  // Get chart data based on selected view
  const getChartData = () => {
    try {
      let barData: any[] = [];
      
      switch (selectedChart) {
        case 'daily':
          barData = getDailyBarChartData();
          break;
        case 'weekly':
          barData = getWeeklyBarChartData();
          break;
        case 'monthly':
          barData = getMonthlyBarChartData();
          break;
        case 'yearly':
          barData = getYearlyBarChartData();
          break;
      }

      // Get pie chart data based on type
      const pieData = getCategoryPieChartData(pieChartType);

      return {
        pieData: Array.isArray(pieData) ? pieData : [],
        barData: Array.isArray(barData) ? barData : [],
        title: `${translations.analytics?.title || 'Analytics'} - ${chartOptions.find(c => c.value === selectedChart)?.label}`
      };
    } catch (error) {
      console.error('Error getting chart data:', error);
      return {
        pieData: [],
        barData: [],
        title: `${translations.analytics?.title || 'Analytics'} - ${chartOptions.find(c => c.value === selectedChart)?.label}`
      };
    }
  };

  const { pieData, barData, title } = getChartData();
  const isLoading = Object.values(loading).some(Boolean);

  // Chart translations
  const chartTranslations = {
    income: translations.analytics?.income || 'Income',
    expense: translations.analytics?.expenses || 'Expenses',
    net: translations.analytics?.net || 'Net',
    loading: translations.analytics?.loading || 'Loading...',
    noData: translations.analytics?.noData || 'No data available',
    categoriesCount: translations.analytics?.categoriesCount || 'categories'
  };

  // Error state
  if (error) {
    return (
      <div className="analytics-page">
        <div className="analytics-page__error">
          <div className="analytics-page__error-icon">
            <AlertTriangle size={48} />
          </div>
          <h2>{translations.analytics?.errorTitle || 'Failed to Load Analytics'}</h2>
          <p>{error}</p>
          <div className="analytics-page__error-actions">
            <Button onClick={clearError} variant="secondary">
              {translations.analytics?.dismiss || 'Dismiss'}
            </Button>
            <Button onClick={loadChartData}>
              {translations.analytics?.retry || 'Retry'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      {/* Header */}
      <div className="analytics-page__header">
        <div className="analytics-page__title-section">
          <h1 className="analytics-page__title">
            {translations.analytics?.title || 'Financial Analytics'}
          </h1>
          <p className="analytics-page__subtitle">
            {translations.analytics?.subtitle || 'Visualize your financial data with interactive charts and insights'}
          </p>
        </div>
        
        <div className="analytics-page__actions">
          <Button 
            onClick={loadChartData}
            disabled={isLoading}
            size="sm"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            {isLoading ? translations.analytics?.refreshing || 'Refreshing...' : translations.analytics?.refresh || 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="analytics-page__controls">
        {/* Chart View Selection */}
        <div className="analytics-page__control-group">
          <label className="analytics-page__control-label">
            {translations.analytics?.chartView || 'Chart View'}
          </label>
          <div className="analytics-page__button-group">
            {chartOptions.map(option => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.value}
                  className={`analytics-page__control-btn ${
                    selectedChart === option.value ? 'active' : ''
                  }`}
                  onClick={() => setSelectedChart(option.value)}
                  disabled={isLoading}
                >
                  <IconComponent className="analytics-page__control-icon" size={16} />
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pie Chart Type Selection */}
        <div className="analytics-page__control-group">
          <label className="analytics-page__control-label">
            {translations.analytics?.pieChartType || 'Pie Chart Type'}
          </label>
          <div className="analytics-page__button-group">
            {pieChartOptions.map(option => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.value}
                  className={`analytics-page__control-btn ${
                    pieChartType === option.value ? 'active' : ''
                  }`}
                  onClick={() => setPieChartType(option.value)}
                  disabled={isLoading}
                >
                  <IconComponent className="analytics-page__control-icon" size={16} />
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Date Range Mode */}
        <div className="analytics-page__control-group">
          <label className="analytics-page__control-label">
            {translations.analytics?.dateRange || 'Date Range'}
          </label>
          <div className="analytics-page__button-group">
            <button
              className={`analytics-page__control-btn ${
                dateRangeMode === 'preset' ? 'active' : ''
              }`}
              onClick={() => setDateRangeMode('preset')}
            >
              {translations.analytics?.preset || 'Preset'}
            </button>
            <button
              className={`analytics-page__control-btn ${
                dateRangeMode === 'custom' ? 'active' : ''
              }`}
              onClick={() => setDateRangeMode('custom')}
            >
              {translations.analytics?.custom || 'Custom'}
            </button>
          </div>
        </div>

        {/* Custom Date Range */}
        {dateRangeMode === 'custom' && (
          <div className="analytics-page__control-group">
            <DateRangePicker
              startDate={customDateRange.startDate}
              endDate={customDateRange.endDate}
              onDateChange={(start, end) => {
                setCustomDateRange({ startDate: start, endDate: end });
                if (start && end) {
                  loadChartData();
                }
              }}
              onClear={() => {
                setCustomDateRange({ startDate: '', endDate: '' });
              }}
              translations={{
                startDate: translations.analytics?.startDate || 'Start Date',
                endDate: translations.analytics?.endDate || 'End Date',
                apply: translations.analytics?.applyDateRange || 'Apply',
                clear: translations.analytics?.dismiss || 'Clear'
              }}
              className="analytics-page__date-range-picker"
            />
          </div>
        )}
      </div>

      {/* Charts */}
      <div className="analytics-page__charts">
        {/* Category Breakdown - Pie Chart */}
        <div className="analytics-page__chart-container analytics-page__chart-container--pie">
          <AnalyticsPieChart
            data={pieData}
            title={`${pieChartType === 'income' ? translations.analytics?.income || 'Income' : translations.analytics?.expenses || 'Expenses'} ${translations.analytics?.byCategory || 'by Category'}`}
            loading={loading.categoryBreakdown}
            height={500}
            translations={chartTranslations}
          />
        </div>

        {/* Time Series - Bar Chart */}
        <div className="analytics-page__chart-container analytics-page__chart-container--bar">
          <AnalyticsBarChart
            data={barData}
            title={title}
            loading={isLoading}
            height={400}
            showNet={true}
            translations={chartTranslations}
          />
        </div>
      </div>

      {/* Summary Stats */}
      {cashFlow && !isLoading && (
        <div className="analytics-page__summary">
          <div className="analytics-page__summary-card analytics-page__summary-card--income">
            <div className="analytics-page__summary-icon">
              <DollarSign size={24} />
            </div>
            <div className="analytics-page__summary-content">
              <h3>{translations.analytics?.totalIncome || 'Total Income'}</h3>
              <p className="analytics-page__summary-amount">
                <CurrencyAmount amountInVnd={cashFlow.totalIncome} />
              </p>
            </div>
          </div>

          <div className="analytics-page__summary-card analytics-page__summary-card--expense">
            <div className="analytics-page__summary-icon">
              <CreditCard size={24} />
            </div>
            <div className="analytics-page__summary-content">
              <h3>{translations.analytics?.totalExpenses || 'Total Expenses'}</h3>
              <p className="analytics-page__summary-amount">
                <CurrencyAmount amountInVnd={cashFlow.totalExpenses} />
              </p>
            </div>
          </div>

          <div className={`analytics-page__summary-card analytics-page__summary-card--net ${
            (cashFlow.totalIncome - cashFlow.totalExpenses) >= 0 ? 'positive' : 'negative'
          }`}>
            <div className="analytics-page__summary-icon">
              {(cashFlow.totalIncome - cashFlow.totalExpenses) >= 0 ? 
                <TrendingUp size={24} /> : 
                <TrendingDown size={24} />
              }
            </div>
            <div className="analytics-page__summary-content">
              <h3>{translations.analytics?.netAmount || 'Net Amount'}</h3>
              <p className="analytics-page__summary-amount">
                <NetAmount amountInVnd={cashFlow.totalIncome - cashFlow.totalExpenses} />
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

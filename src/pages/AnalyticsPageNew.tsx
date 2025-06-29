/**
 * Analytics Page - Financial Dashboard with Charts
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import { useCurrency } from '../hooks/useCurrency';
import { useLanguageContext } from '../contexts';
import { AnalyticsPieChart, AnalyticsBarChart } from '../components/charts';
import Button from '../components/ui/Button';
import './AnalyticsPage.css';

type ChartView = 'daily' | 'weekly' | 'monthly' | 'yearly';
type PieChartType = 'income' | 'expense';

export const AnalyticsPage: React.FC = () => {
  // State
  const [selectedChart, setSelectedChart] = useState<ChartView>('daily');
  const [pieChartType, setPieChartType] = useState<PieChartType>('expense');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  
  // Hooks
  const { translations } = useLanguageContext();
  const { formatCurrency } = useCurrency();
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

  // Helper to get date range for periods
  const getDateRangeForPeriod = useCallback((period: ChartView) => {
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
  }, []);

  // Load data based on selected chart
  const loadChartData = useCallback(async () => {
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
    
    // Always fetch category breakdown for pie chart
    const dateRange = getDateRangeForPeriod(selectedChart);
    await Promise.all([
      fetchCategoryBreakdown(dateRange),
      fetchCashFlow(dateRange)
    ]);
  }, [selectedChart, fetchDailySummary, fetchWeeklySummary, fetchMonthlySummary, fetchYearlySummary, fetchCategoryBreakdown, fetchCashFlow, getDateRangeForPeriod]);

  // Load custom date range data
  const loadCustomData = useCallback(async () => {
    await Promise.all([
      fetchCategoryBreakdown(customDateRange),
      fetchCashFlow(customDateRange)
    ]);
  }, [customDateRange, fetchCategoryBreakdown, fetchCashFlow]);

  // Load initial data
  useEffect(() => {
    loadChartData();
  }, [loadChartData]);

  // Chart view options
  const chartOptions = [
    { value: 'daily' as ChartView, label: translations.analytics.daily, icon: '📅' },
    { value: 'weekly' as ChartView, label: translations.analytics.weekly, icon: '📊' },
    { value: 'monthly' as ChartView, label: translations.analytics.monthly, icon: '📈' },
    { value: 'yearly' as ChartView, label: translations.analytics.yearly, icon: '🏆' }
  ];

  // Pie chart type options
  const pieChartOptions = [
    { value: 'expense' as PieChartType, label: translations.analytics.expenses, icon: '💸' },
    { value: 'income' as PieChartType, label: translations.analytics.income, icon: '💰' }
  ];

  // Get chart data based on selected view
  const getChartData = () => {
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

    // Get pie chart data
    const pieData = getCategoryPieChartData(pieChartType);

    return {
      pieData,
      barData,
      title: `${translations.analytics.title} - ${chartOptions.find(c => c.value === selectedChart)?.label}`
    };
  };

  const { pieData, barData, title } = getChartData();
  const isLoading = Object.values(loading).some(Boolean);

  // Error state
  if (error) {
    return (
      <div className="analytics-page">
        <div className="analytics-page__error">
          <div className="analytics-page__error-icon">⚠️</div>
          <h2>{translations.analytics.failedToLoad}</h2>
          <p>{error}</p>
          <div className="analytics-page__error-actions">
            <Button onClick={clearError} variant="secondary">
              {translations.analytics.dismiss}
            </Button>
            <Button onClick={loadChartData}>
              {translations.common.retry}
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
            📊 {translations.analytics.title}
          </h1>
          <p className="analytics-page__subtitle">
            {translations.analytics.subtitle}
          </p>
        </div>
        
        <div className="analytics-page__actions">
          <Button 
            onClick={loadChartData}
            disabled={isLoading}
            size="sm"
          >
            {isLoading ? `🔄 ${translations.analytics.refreshing}` : `🔄 ${translations.analytics.refresh}`}
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="analytics-page__controls">
        {/* Chart View Selection */}
        <div className="analytics-page__control-group">
          <label className="analytics-page__control-label">{translations.analytics.chartView}</label>
          <div className="analytics-page__button-group">
            {chartOptions.map(option => (
              <button
                key={option.value}
                className={`analytics-page__control-btn ${
                  selectedChart === option.value ? 'active' : ''
                }`}
                onClick={() => setSelectedChart(option.value)}
                disabled={isLoading}
              >
                <span className="analytics-page__control-icon">{option.icon}</span>
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pie Chart Type Selection */}
        <div className="analytics-page__control-group">
          <label className="analytics-page__control-label">{translations.analytics.pieChartType}</label>
          <div className="analytics-page__button-group">
            {pieChartOptions.map(option => (
              <button
                key={option.value}
                className={`analytics-page__control-btn ${
                  pieChartType === option.value ? 'active' : ''
                }`}
                onClick={() => setPieChartType(option.value)}
                disabled={isLoading}
              >
                <span className="analytics-page__control-icon">{option.icon}</span>
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Date Range */}
        <div className="analytics-page__control-group">
          <label className="analytics-page__control-label">{translations.analytics.customDateRange}</label>
          <div className="analytics-page__date-controls">
            <button
              className="analytics-page__control-btn"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              📅 {translations.analytics.selectDateRange}
            </button>
            {showDatePicker && (
              <div className="analytics-page__date-picker">
                <input
                  type="date"
                  value={customDateRange.startDate}
                  onChange={(e) => setCustomDateRange(prev => ({
                    ...prev,
                    startDate: e.target.value
                  }))}
                  className="analytics-page__date-input"
                />
                <span>to</span>
                <input
                  type="date"
                  value={customDateRange.endDate}
                  onChange={(e) => setCustomDateRange(prev => ({
                    ...prev,
                    endDate: e.target.value
                  }))}
                  className="analytics-page__date-input"
                />
                <Button onClick={loadCustomData} size="sm">
                  {translations.analytics.applyDateRange}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="analytics-page__charts">
        {/* Category Breakdown - Pie Chart */}
        <div className="analytics-page__chart-container analytics-page__chart-container--pie">
          <AnalyticsPieChart
            data={pieData}
            title={`${pieChartType === 'expense' ? translations.analytics.expenses : translations.analytics.income} ${translations.analytics.categoryBreakdown}`}
            loading={loading.categoryBreakdown}
            height={600}
          />
        </div>

        {/* Time-based Bar Chart */}
        <div className="analytics-page__chart-container analytics-page__chart-container--bar">
          <AnalyticsBarChart
            data={barData}
            title={title}
            loading={isLoading}
            height={400}
            showNet={true}
          />
        </div>
      </div>

      {/* Summary Stats */}
      {cashFlow && !isLoading && (
        <div className="analytics-page__summary">
          <div className="analytics-page__summary-card analytics-page__summary-card--income">
            <div className="analytics-page__summary-icon">💰</div>
            <div className="analytics-page__summary-content">
              <h3>{translations.analytics.totalIncome}</h3>
              <p className="analytics-page__summary-amount">
                {formatCurrency(cashFlow.totalIncome, 'vnd')}
              </p>
            </div>
          </div>

          <div className="analytics-page__summary-card analytics-page__summary-card--expense">
            <div className="analytics-page__summary-icon">💸</div>
            <div className="analytics-page__summary-content">
              <h3>{translations.analytics.totalExpenses}</h3>
              <p className="analytics-page__summary-amount">
                {formatCurrency(cashFlow.totalExpenses, 'vnd')}
              </p>
            </div>
          </div>

          <div className={`analytics-page__summary-card analytics-page__summary-card--net ${
            (cashFlow.totalIncome - cashFlow.totalExpenses) >= 0 ? 'positive' : 'negative'
          }`}>
            <div className="analytics-page__summary-icon">
              {(cashFlow.totalIncome - cashFlow.totalExpenses) >= 0 ? '📈' : '📉'}
            </div>
            <div className="analytics-page__summary-content">
              <h3>Net Amount</h3>
              <p className="analytics-page__summary-amount">
                {formatCurrency(cashFlow.totalIncome - cashFlow.totalExpenses, 'vnd')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

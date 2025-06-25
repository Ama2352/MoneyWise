/**
 * Analytics Types - Based on Backend DTOs
 */

// Base statistic interfaces
export interface CategoryBreakdownDTO {
  category: string;
  totalIncome: number;
  totalExpense: number;
  incomePercentage: number;
  expensePercentage: number;
  budgetLimit: number;
  budgetCurrentSpending: number;
  goalTarget: number;
  goalSaved: number;
}

export interface CashFlowSummaryDTO {
  totalIncome: number;
  totalExpenses: number;
}

// Daily analytics interfaces
export interface DailyDetailDTO {
  dayOfWeek: string;
  income: number;
  expense: number;
}

export interface DailySummaryDTO {
  dailyDetails: DailyDetailDTO[];
  totalIncome: number;
  totalExpenses: number;
}

// Weekly analytics interfaces
export interface WeeklyDetailDTO {
  weekNumber: number;
  income: number;
  expense: number;
}

export interface WeeklySummaryDTO {
  weeklyDetails: WeeklyDetailDTO[];
  totalIncome: number;
  totalExpenses: number;
}

// Monthly analytics interfaces
export interface MonthlyDetailDTO {
  monthName: string;
  income: number;
  expense: number;
}

export interface MonthlySummaryDTO {
  monthlyDetails: MonthlyDetailDTO[];
  totalIncome: number;
  totalExpenses: number;
}

// Yearly analytics interfaces
export interface YearlyDetailDTO {
  year: number;
  income: number;
  expense: number;
}

export interface YearlySummaryDTO {
  yearlyDetails: YearlyDetailDTO[];
  totalIncome: number;
  totalExpenses: number;
}

// Request parameters
export interface DateRangeParams {
  startDate: string; // ISO date string
  endDate: string;   // ISO date string
}

export interface MonthParams {
  year: number;
  month: number;
}

export interface YearParams {
  year: number;
}

// Chart data types for frontend
export interface PieChartData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

export interface BarChartData {
  name: string;
  income: number;
  expense: number;
  net: number;
}

// Analytics page state
export interface AnalyticsState {
  dateRange: DateRangeParams;
  selectedView: 'daily' | 'weekly' | 'monthly' | 'yearly';
  loading: boolean;
  error: string | null;
}

// Currency conversion context
export interface CurrencyAnalyticsData {
  originalCurrency: string;
  convertedCurrency: string;
  exchangeRate: number;
  lastUpdated: string;
}

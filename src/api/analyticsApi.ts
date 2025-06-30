/**
 * Analytics API - Statistics and Calendar endpoints
 */

import httpClient from './httpClient';
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
} from '../types/analytics';

class AnalyticsApi {
  // Statistics endpoints
  async getCategoryBreakdown(
    params: DateRangeParams
  ): Promise<CategoryBreakdownDTO[]> {
    try {
      const response = await httpClient.get<CategoryBreakdownDTO[]>(
        '/Statistics/category-breakdown',
        {
          params: {
            startDate: params.startDate,
            endDate: params.endDate,
          },
        }
      );
      return response.data || [];
    } catch (error) {
      console.error('❌ Category Breakdown Error:', error);
      throw new Error('Failed to fetch category breakdown');
    }
  }

  async getCashFlowSummary(
    params?: Partial<DateRangeParams>
  ): Promise<CashFlowSummaryDTO> {
    try {
      const response = await httpClient.get<CashFlowSummaryDTO>(
        '/Statistics/cash-flow',
        {
          params: {
            ...(params?.startDate && { startDate: params.startDate }),
            ...(params?.endDate && { endDate: params.endDate }),
          },
        }
      );
      return response.data || { totalIncome: 0, totalExpenses: 0 };
    } catch (error) {
      console.error('❌ Cash Flow Error:', error);
      throw new Error('Failed to fetch cash flow summary');
    }
  }

  async getWalletBreakdown(
    params: DateRangeParams
  ): Promise<WalletBreakdownDTO[]> {
    try {
      const response = await httpClient.get<WalletBreakdownDTO[]>(
        '/Statistics/wallet-breakdown',
        {
          params: {
            startDate: params.startDate,
            endDate: params.endDate,
          },
        }
      );
      return response.data || [];
    } catch (error) {
      console.error('❌ Wallet Breakdown Error:', error);
      throw new Error('Failed to fetch wallet breakdown');
    }
  }

  // Calendar endpoints
  async getDailySummary(date: string): Promise<DailySummaryDTO> {
    try {
      const response = await httpClient.get<DailySummaryDTO>(
        '/Calendar/daily',
        {
          params: { date },
        }
      );
      return (
        response.data || { dailyDetails: [], totalIncome: 0, totalExpenses: 0 }
      );
    } catch (error) {
      console.error('❌ Daily Summary Error:', error);
      throw new Error('Failed to fetch daily summary');
    }
  }

  async getWeeklySummary(startDate: string): Promise<WeeklySummaryDTO> {
    try {
      const response = await httpClient.get<WeeklySummaryDTO>(
        '/Calendar/weekly',
        {
          params: { startDate },
        }
      );
      return (
        response.data || { weeklyDetails: [], totalIncome: 0, totalExpenses: 0 }
      );
    } catch (error) {
      console.error('❌ Weekly Summary Error:', error);
      throw new Error('Failed to fetch weekly summary');
    }
  }

  async getMonthlySummary(params: MonthParams): Promise<MonthlySummaryDTO> {
    try {
      const response = await httpClient.get<MonthlySummaryDTO>(
        '/Calendar/monthly',
        {
          params: {
            year: params.year,
            month: params.month,
          },
        }
      );
      return (
        response.data || {
          monthlyDetails: [],
          totalIncome: 0,
          totalExpenses: 0,
        }
      );
    } catch (error) {
      console.error('❌ Monthly Summary Error:', error);
      throw new Error('Failed to fetch monthly summary');
    }
  }

  async getYearlySummary(params: YearParams): Promise<YearlySummaryDTO> {
    try {
      const response = await httpClient.get<YearlySummaryDTO>(
        '/Calendar/yearly',
        {
          params: { year: params.year },
        }
      );
      return (
        response.data || { yearlyDetails: [], totalIncome: 0, totalExpenses: 0 }
      );
    } catch (error) {
      console.error('❌ Yearly Summary Error:', error);
      throw new Error('Failed to fetch yearly summary');
    }
  }

  // Helper methods for date formatting
  formatDateForApi(date: Date): string {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  }

  getCurrentWeekStart(): string {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - now.getDay() + 1); // Get Monday
    return this.formatDateForApi(monday);
  }

  getCurrentMonthParams(): MonthParams {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth() + 1, // JavaScript months are 0-indexed
    };
  }

  getCurrentYearParams(): YearParams {
    return {
      year: new Date().getFullYear(),
    };
  }

  getDateRangeForPeriod(period: 'week' | 'month' | 'year'): DateRangeParams {
    const now = new Date();
    let startDate: Date;
    let endDate = new Date(now);

    switch (period) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 30);
    }

    return {
      startDate: this.formatDateForApi(startDate),
      endDate: this.formatDateForApi(endDate),
    };
  }
}

export const analyticsApi = new AnalyticsApi();

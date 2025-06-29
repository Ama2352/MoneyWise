/**
 * Reports Hook - Handle report generation and management
 */

import { useState, useCallback } from 'react';
import { reportsApi } from '../api/reportsApi';
import { useToast } from './useToast';
import type { 
  ReportRequest, 
  ReportType, 
  ReportGenerationStatus,
  ReportGenerationParams 
} from '../types/reports';

interface UseReportsReturn {
  // State
  generationStatus: ReportGenerationStatus;
  
  // Actions
  generateReport: (params: ReportGenerationParams) => Promise<void>;
  clearError: () => void;
  
  // Helpers
  getReportTypeConfig: () => ReportTypeConfig[];
}

interface ReportTypeConfig {
  key: ReportType;
  titleKey: string;
  descriptionKey: string;
  requiresEndDate: boolean;
  icon: string;
  category: 'breakdown' | 'summary' | 'flow';
}

export const useReports = (): UseReportsReturn => {
  const [generationStatus, setGenerationStatus] = useState<ReportGenerationStatus>({
    isGenerating: false,
    progress: 0,
    error: undefined,
  });

  const { showToast } = useToast();

  const generateReport = useCallback(async (params: ReportGenerationParams) => {
    setGenerationStatus({
      isGenerating: true,
      progress: 0,
      error: undefined,
    });

    try {
      // Update progress
      setGenerationStatus(prev => ({ ...prev, progress: 25 }));

      // Prepare request
      const reportRequest: ReportRequest = {
        startDate: params.startDate,
        endDate: params.endDate,
        type: params.type,
        format: params.format,
        currency: params.currency,
      };

      // Update progress
      setGenerationStatus(prev => ({ ...prev, progress: 50 }));

      // Generate report
      const blob = await reportsApi.generateReport(reportRequest, params.language);

      // Update progress
      setGenerationStatus(prev => ({ ...prev, progress: 75 }));

      // Generate filename
      const filename = reportsApi.generateFilename(
        params.type,
        params.language,
        params.currency,
        params.startDate,
        params.endDate
      );

      // Download file
      reportsApi.downloadReport(blob, filename);

      // Update progress
      setGenerationStatus(prev => ({ ...prev, progress: 100 }));

      showToast('Report generated and downloaded successfully!', 'success');

      // Reset status after brief delay
      setTimeout(() => {
        setGenerationStatus({
          isGenerating: false,
          progress: 0,
          error: undefined,
        });
      }, 1000);

    } catch (error: any) {
      console.error('Report generation failed:', error);
      
      setGenerationStatus({
        isGenerating: false,
        progress: 0,
        error: error.message || 'Failed to generate report',
      });

      showToast(error.message || 'Failed to generate report', 'error');
    }
  }, [showToast]);

  const clearError = useCallback(() => {
    setGenerationStatus(prev => ({
      ...prev,
      error: undefined,
    }));
  }, []);

  // Get report type configurations
  const getReportTypeConfig = useCallback((): ReportTypeConfig[] => {
    return [
      {
        key: 'category-breakdown',
        titleKey: 'reports.types.categoryBreakdown.title',
        descriptionKey: 'reports.types.categoryBreakdown.description',
        requiresEndDate: true,
        icon: 'PieChart',
        category: 'breakdown',
      },
      {
        key: 'cash-flow',
        titleKey: 'reports.types.cashFlow.title',
        descriptionKey: 'reports.types.cashFlow.description',
        requiresEndDate: true,
        icon: 'TrendingUp',
        category: 'flow',
      },
      {
        key: 'daily-summary',
        titleKey: 'reports.types.dailySummary.title',
        descriptionKey: 'reports.types.dailySummary.description',
        requiresEndDate: false,
        icon: 'Calendar',
        category: 'summary',
      },
      {
        key: 'weekly-summary',
        titleKey: 'reports.types.weeklySummary.title',
        descriptionKey: 'reports.types.weeklySummary.description',
        requiresEndDate: false,
        icon: 'CalendarDays',
        category: 'summary',
      },
      {
        key: 'monthly-summary',
        titleKey: 'reports.types.monthlySummary.title',
        descriptionKey: 'reports.types.monthlySummary.description',
        requiresEndDate: false,
        icon: 'CalendarRange',
        category: 'summary',
      },
      {
        key: 'yearly-summary',
        titleKey: 'reports.types.yearlySummary.title',
        descriptionKey: 'reports.types.yearlySummary.description',
        requiresEndDate: false,
        icon: 'Calendar',
        category: 'summary',
      },
    ];
  }, []);

  return {
    generationStatus,
    generateReport,
    clearError,
    getReportTypeConfig,
  };
};

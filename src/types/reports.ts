/**
 * Reports related type definitions
 */

export type ReportType = 
  | 'category-breakdown'
  | 'cash-flow'
  | 'daily-summary'
  | 'weekly-summary'
  | 'monthly-summary'
  | 'yearly-summary';

export type ReportFormat = 'pdf';

export interface ReportRequest {
  startDate: string; // YYYY-MM-DD format
  endDate?: string; // YYYY-MM-DD format (null for summary reports)
  type: ReportType;
  format: ReportFormat;
  currency?: 'VND' | 'USD'; // Optional, defaults to VND on backend
}

export interface ReportGenerationParams {
  startDate: string;
  endDate?: string;
  type: ReportType;
  format: ReportFormat;
  currency: 'VND' | 'USD';
  language: string;
}

// Report type metadata for UI
export interface ReportTypeInfo {
  key: ReportType;
  titleKey: string; // Translation key
  descriptionKey: string; // Translation key
  requiresEndDate: boolean;
  icon: string; // Lucide icon name
  category: 'breakdown' | 'summary' | 'flow';
}

// Report generation status
export interface ReportGenerationStatus {
  isGenerating: boolean;
  progress?: number;
  error?: string;
}

/**
 * Reports API - Generate and download reports
 */

import httpClient from './httpClient';
import type { ReportRequest } from '../types/reports';

const REPORTS_BASE_URL = '/Reports';

export const reportsApi = {
  /**
   * Generate and download a report
   */
  generateReport: async (
    reportRequest: ReportRequest,
    language: string = 'en'
  ): Promise<Blob> => {
    try {
      const response = await httpClient.post(
        `${REPORTS_BASE_URL}/generate`,
        reportRequest,
        {
          headers: {
            'Accept-Language': language,
            'Content-Type': 'application/json',
          },
          responseType: 'blob', // Important for PDF download
        }
      );

      if (response.status !== 200) {
        throw new Error(`Report generation failed with status: ${response.status}`);
      }

      return response.data;
    } catch (error: any) {
      console.error('Report generation failed:', error);
      
      if (error.response?.status === 400) {
        throw new Error('Invalid report parameters. Please check your input.');
      } else if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      } else if (error.response?.status === 500) {
        throw new Error('Server error occurred while generating report. Please try again later.');
      } else {
        throw new Error('Failed to generate report. Please check your connection and try again.');
      }
    }
  },

  /**
   * Download generated report blob as file
   */
  downloadReport: (blob: Blob, filename: string): void => {
    try {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download report:', error);
      throw new Error('Failed to download report file.');
    }
  },

  /**
   * Generate filename for report
   */
  generateFilename: (
    type: string,
    language: string,
    currency: string,
    startDate: string,
    endDate?: string
  ): string => {
    const timestamp = new Date().toISOString().split('T')[0];
    const dateRange = endDate ? `${startDate}_to_${endDate}` : startDate;
    return `report_${type}_${language}_${currency}_${dateRange}_${timestamp}.pdf`;
  }
};

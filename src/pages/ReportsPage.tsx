/**
 * Reports Page - Generate and download financial reports
 */

import React, { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  PieChart,
  TrendingUp,
  CalendarDays,
  CalendarRange,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useLanguageContext } from '../contexts/LanguageContext';
import { useCurrencyContext } from '../contexts/CurrencyContext';
import { useReports } from '../hooks/useReports';
import { DateRangePicker } from '../components/ui';
import type { ReportType, ReportGenerationParams } from '../types/reports';
import './ReportsPage.css';

// Icon mapping for report types
const reportIcons = {
  'category-breakdown': PieChart,
  'cash-flow': TrendingUp,
  'daily-summary': Calendar,
  'weekly-summary': CalendarDays,
  'monthly-summary': CalendarRange,
  'yearly-summary': Calendar,
} as const;

export const ReportsPage: React.FC = () => {
  // Context
  const { translations, language } = useLanguageContext();
  const { currency } = useCurrencyContext();
  
  // Hooks
  const { generationStatus, generateReport, clearError, getReportTypeConfig } = useReports();
  
  // State
  const [selectedType, setSelectedType] = useState<ReportType | ''>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  
  // Get report types
  const reportTypes = getReportTypeConfig();
  
  // Helper to get translation for report type
  const getReportTranslation = (key: ReportType, field: 'title' | 'description') => {
    const keyMap = {
      'category-breakdown': 'categoryBreakdown',
      'cash-flow': 'cashFlow',
      'daily-summary': 'dailySummary',
      'weekly-summary': 'weeklySummary',
      'monthly-summary': 'monthlySummary',
      'yearly-summary': 'yearlySummary',
    } as const;
    
    const mappedKey = keyMap[key];
    return translations.reports?.types?.[mappedKey]?.[field] || '';
  };
  
  // Get selected report config
  const selectedConfig = reportTypes.find(type => type.key === selectedType);
  
  // Validation
  const isFormValid = () => {
    if (!selectedType || !startDate) return false;
    if (selectedConfig?.requiresEndDate && !endDate) return false;
    if (endDate && startDate && endDate <= startDate) return false;
    return true;
  };
  
  // Handle form submission
  const handleGenerateReport = async () => {
    if (!isFormValid() || !selectedType) return;
    
    clearError();
    
    const params: ReportGenerationParams = {
      type: selectedType,
      startDate,
      endDate: selectedConfig?.requiresEndDate ? endDate : undefined,
      format: 'pdf',
      currency: currency.toUpperCase() as 'VND' | 'USD',
      language,
    };
    
    await generateReport(params);
  };
  
  // Reset form
  const handleReset = () => {
    setSelectedType('');
    setStartDate('');
    setEndDate('');
    clearError();
  };
  
  // Group report types by category
  const groupedReports = reportTypes.reduce((acc, report) => {
    if (!acc[report.category]) {
      acc[report.category] = [];
    }
    acc[report.category].push(report);
    return acc;
  }, {} as Record<string, typeof reportTypes>);

  return (
    <div className="reports-page">
      {/* Header */}
      <div className="reports-page__header">
        <h1 className="reports-page__title">
          <FileText className="reports-page__title-icon" size={32} />
          {translations.reports?.title || 'Reports'}
        </h1>
        <p className="reports-page__subtitle">
          {translations.reports?.subtitle || 'Generate detailed financial reports'}
        </p>
      </div>

      <div className="reports-page__content">
        {/* Report Type Selection - Always visible */}
        <div className="reports-page__section">
          <h2 className="reports-page__section-title">
            {translations.reports?.form.selectReportType || 'Select Report Type'}
          </h2>
          
          <div className="reports-page__select-container">
            <select 
              className="reports-page__select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as ReportType)}
            >
              <option value="">
                {translations.reports?.form.selectReportType || 'Choose a report type...'}
              </option>
              {Object.entries(groupedReports).map(([category, reports]) => (
                <optgroup 
                  key={category}
                  label={translations.reports?.categories?.[category as keyof typeof translations.reports.categories] || category}
                >
                  {reports.map((report) => (
                    <option key={report.key} value={report.key}>
                      {getReportTranslation(report.key, 'title')}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>

        {/* Main Content - Show when type is selected */}
        {selectedType && (
          <div className="reports-page__main-content">
            {/* Form Panel */}
            <div className="reports-page__form-panel">
              {/* Selected Report Display */}
              <div className="reports-page__section">
                <h2 className="reports-page__section-title">
                  {translations.reports?.form.reportType || 'Selected Report'}
                </h2>
                
                {(() => {
                  const report = reportTypes.find(r => r.key === selectedType);
                  const IconComponent = reportIcons[selectedType];
                  return (
                    <div className="reports-page__selected-report">
                      <div className="reports-page__selected-icon">
                        <IconComponent size={24} />
                      </div>
                      <div className="reports-page__selected-content">
                        <h4>{getReportTranslation(selectedType, 'title')}</h4>
                        <p>{getReportTranslation(selectedType, 'description')}</p>
                        {report?.requiresEndDate && (
                          <span className="reports-page__badge">
                            {translations.reports?.form.dateRange || 'Date Range Required'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Date Range */}
              <div className="reports-page__section">
                <h2 className="reports-page__section-title">
                  {translations.reports?.form.dateRange || 'Date Range'}
                </h2>
                
                <DateRangePicker
                  startDate={startDate}
                  endDate={selectedConfig?.requiresEndDate ? endDate : ''}
                  onDateChange={(start, end) => {
                    setStartDate(start || '');
                    if (selectedConfig?.requiresEndDate) {
                      setEndDate(end || '');
                    } else {
                      setEndDate(''); // Clear end date for summary reports
                    }
                  }}
                  onClear={() => {
                    setStartDate('');
                    setEndDate('');
                  }}
                  translations={{
                    startDate: translations.reports?.form.startDate || 'Start Date',
                    endDate: translations.reports?.form.endDate || 'End Date',
                    apply: translations.analytics?.applyDateRange || 'Apply',
                    clear: translations.analytics?.dismiss || 'Clear'
                  }}
                  hideEndDateField={!selectedConfig?.requiresEndDate}
                />
                
                {selectedConfig?.requiresEndDate && !endDate && startDate && (
                  <div className="reports-page__warning">
                    <AlertCircle size={16} />
                    <span>{translations.reports?.messages.selectEndDate || 'End date is required for this report type'}</span>
                  </div>
                )}
                
                {endDate && startDate && endDate <= startDate && (
                  <div className="reports-page__warning">
                    <AlertCircle size={16} />
                    <span>{translations.reports?.messages.invalidDateRange || 'End date must be after start date'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="reports-page__sidebar">
              {/* Settings */}
              <div className="reports-page__section">
                <h2 className="reports-page__section-title">
                  {translations.common?.settings || 'Settings'}
                </h2>
                
                <div className="reports-page__settings">
                  <div className="reports-page__setting">
                    <label className="reports-page__setting-label">
                      {translations.reports?.form.currency || 'Currency'}
                    </label>
                    <div className="reports-page__setting-value">
                      {currency.toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="reports-page__setting">
                    <label className="reports-page__setting-label">
                      {translations.reports?.form.language || 'Language'}
                    </label>
                    <div className="reports-page__setting-value">
                      {language === 'en' ? 'EN' : 'VI'}
                    </div>
                  </div>
                  
                  <div className="reports-page__setting">
                    <label className="reports-page__setting-label">
                      {translations.reports?.form.format || 'Format'}
                    </label>
                    <div className="reports-page__setting-value">
                      PDF
                    </div>
                  </div>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="reports-page__section">
                {/* Generation Status */}
                {generationStatus.isGenerating && (
                  <div className="reports-page__progress">
                    <div className="reports-page__progress-header">
                      <Loader2 className="animate-spin" size={18} />
                      <span>{translations.reports?.generating || 'Generating Report...'}</span>
                    </div>
                    
                    {generationStatus.progress !== undefined && (
                      <div className="reports-page__progress-bar">
                        <div 
                          className="reports-page__progress-fill"
                          style={{ width: `${generationStatus.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Error Display */}
                {generationStatus.error && (
                  <div className="reports-page__error">
                    <AlertCircle size={18} />
                    <span>{generationStatus.error}</span>
                    <button onClick={clearError} style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: '#dc2626', 
                      cursor: 'pointer',
                      padding: '0.25rem',
                      borderRadius: '2px'
                    }}>
                      ×
                    </button>
                  </div>
                )}

                {/* Action Buttons */}
                {!generationStatus.isGenerating && !generationStatus.error && (
                  <div className="reports-page__actions">
                    <button
                      onClick={handleReset}
                      disabled={generationStatus.isGenerating}
                      className="reports-page__reset-btn"
                    >
                      {translations.reports?.form.reset || 'Reset'}
                    </button>
                    
                    <button
                      onClick={handleGenerateReport}
                      disabled={!isFormValid() || generationStatus.isGenerating}
                      className="reports-page__generate-btn"
                    >
                      <Download size={18} />
                      {translations.reports?.form.generate || 'Generate Report'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

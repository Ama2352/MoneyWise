/**
 * Analytics Bar Chart Component
 */

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { useCurrencyContext } from '../../contexts/CurrencyContext';
import { useLanguageContext } from '../../contexts/LanguageContext';
import type { BarChartData } from '../../types/analytics';
import './AnalyticsBarChart.css';

interface AnalyticsBarChartProps {
  data: BarChartData[];
  title: string;
  loading?: boolean;
  height?: number;
  showNet?: boolean;
  translations?: {
    income?: string;
    expense?: string;
    net?: string;
    loading?: string;
    noData?: string;
  };
  dateRangeMode?: 'preset' | 'custom';
  customDateRange?: {
    startDate: string;
    endDate: string;
  };
  chartView?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

const CustomTooltip = ({ active, payload, label }: any) => {
  const { convertAndFormat } = useCurrencyContext();
  const [formattedValues, setFormattedValues] = React.useState<{[key: string]: string}>({});

  React.useEffect(() => {
    let isMounted = true;
    
    if (active && payload && payload.length) {
      const promises = payload.map(async (entry: any) => {
        try {
          const formatted = await convertAndFormat(entry.value);
          return { key: entry.dataKey, value: formatted };
        } catch (error) {
          console.error('Currency conversion failed in bar chart tooltip:', error);
          return { key: entry.dataKey, value: entry.value.toLocaleString() };
        }
      });
      
      Promise.all(promises)
        .then(results => {
          if (isMounted) {
            const formatted = results.reduce((acc, { key, value }) => {
              acc[key] = value;
              return acc;
            }, {} as {[key: string]: string});
            setFormattedValues(formatted);
          }
        })
        .catch(error => {
          console.error('Failed to format currency values:', error);
          if (isMounted) {
            setFormattedValues({});
          }
        });
    } else {
      setFormattedValues({});
    }

    return () => {
      isMounted = false;
    };
  }, [active, payload, convertAndFormat]);

  if (active && payload && payload.length) {
    return (
      <div className="analytics-bar-tooltip">
        <p className="analytics-bar-tooltip__label">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="analytics-bar-tooltip__item">
            <span 
              className="analytics-bar-tooltip__color"
              style={{ backgroundColor: entry.color }}
            />
            {entry.name}: <span className="analytics-bar-tooltip__value">
              {formattedValues[entry.dataKey] || entry.value.toLocaleString()}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const AnalyticsBarChart: React.FC<AnalyticsBarChartProps> = ({
  data,
  title,
  loading = false,
  height = 400,
  showNet = true,
  translations,
  dateRangeMode = 'preset',
  customDateRange,
  chartView = 'monthly'
}) => {
  // ALL HOOKS MUST BE CALLED AT THE TOP LEVEL, BEFORE ANY RETURNS
  const { language } = useLanguageContext();
  const { convertAndFormat } = useCurrencyContext();

  // Format month names using custom logic to ensure proper Vietnamese abbreviations
  const formatMonthName = React.useCallback((name: string): string => {
    try {
      if (!name) return 'N/A';
      
      // Try to parse the month name to a month number for proper i18n formatting
      const monthIndex = getMonthIndexFromName(name);
      if (monthIndex !== -1) {
        if (language === 'vi') {
          // Use custom Vietnamese abbreviations to ensure "Th1", "Th2", etc.
          return `Th${monthIndex + 1}`;
        } else {
          // For English, use browser's built-in formatting
          const date = new Date(2024, monthIndex, 1);
          return date.toLocaleDateString('en-US', { month: 'short' });
        }
      }
      
      // Fallback: return the original name if we can't parse it
      return name;
    } catch (error) {
      console.error('Error formatting month name:', error);
      return name || 'N/A';
    }
  }, [language]);

  // Helper function to get month index from month name
  const getMonthIndexFromName = React.useCallback((name: string): number => {
    const monthNames: { [key: string]: number } = {
      // English full names
      'january': 0, 'february': 1, 'march': 2, 'april': 3,
      'may': 4, 'june': 5, 'july': 6, 'august': 7,
      'september': 8, 'october': 9, 'november': 10, 'december': 11,
      // English short names
      'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3,
      'jun': 5, 'jul': 6, 'aug': 7, 'sep': 8,
      'oct': 9, 'nov': 10, 'dec': 11,
      // Vietnamese
      'tháng 1': 0, 'tháng 2': 1, 'tháng 3': 2, 'tháng 4': 3,
      'tháng 5': 4, 'tháng 6': 5, 'tháng 7': 6, 'tháng 8': 7,
      'tháng 9': 8, 'tháng 10': 9, 'tháng 11': 10, 'tháng 12': 11,
      // Vietnamese short
      'th1': 0, 'th2': 1, 'th3': 2, 'th4': 3,
      'th5': 4, 'th6': 5, 'th7': 6, 'th8': 7,
      'th9': 8, 'th10': 9, 'th11': 10, 'th12': 11
    };
    
    const lowerName = name.toLowerCase().trim();
    return monthNames[lowerName] !== undefined ? monthNames[lowerName] : -1;
  }, []);

  // Calculate summary stats with error handling - MUST BE AT TOP LEVEL
  const totalIncome = React.useMemo(() => {
    try {
      return data?.reduce((sum, item) => sum + (item?.income || 0), 0) || 0;
    } catch (error) {
      console.error('Error calculating total income:', error);
      return 0;
    }
  }, [data]);

  const totalExpense = React.useMemo(() => {
    try {
      return data?.reduce((sum, item) => sum + (item?.expense || 0), 0) || 0;
    } catch (error) {
      console.error('Error calculating total expense:', error);
      return 0;
    }
  }, [data]);

  const netAmount = totalIncome - totalExpense;

  const formattedData = React.useMemo(() => {
    try {
      if (!data || !Array.isArray(data)) {
        return [];
      }
      
      // If in custom date range mode and no time series data, create a summary bar
      if (dateRangeMode === 'custom' && data.length === 0 && customDateRange?.startDate && customDateRange?.endDate) {
        // Return placeholder data that will be handled by the parent to show summary instead
        // chartView is used to determine the context of the display
        return [{
          name: `${customDateRange.startDate} - ${customDateRange.endDate}`,
          income: 0,
          expense: 0,
          net: 0
        }];
      }
      
      return data.map(item => ({
        ...item,
        name: formatMonthName(item?.name || ''),
        // Store original name for reference (useful for different chart views)
        originalName: item?.name || '',
        chartType: chartView
      }));
    } catch (error) {
      console.error('Error formatting chart data:', error);
      return data || [];
    }
  }, [data, formatMonthName, dateRangeMode, customDateRange]);

  const [formattedSummary, setFormattedSummary] = React.useState({
    income: '',
    expense: '',
    net: ''
  });

  React.useEffect(() => {
    Promise.all([
      convertAndFormat(totalIncome),
      convertAndFormat(totalExpense),
      convertAndFormat(netAmount)
    ]).then(([income, expense, net]) => {
      setFormattedSummary({ income, expense, net });
    }).catch(error => {
      console.error('Error formatting currency in chart:', error);
      // Use fallback formatting
      setFormattedSummary({
        income: totalIncome.toLocaleString(),
        expense: totalExpense.toLocaleString(), 
        net: netAmount.toLocaleString()
      });
    });
  }, [totalIncome, totalExpense, netAmount, convertAndFormat]);

  // NOW WE CAN DO CONDITIONAL RENDERING
  try {
    if (loading) {
      return (
        <div className="analytics-bar-chart">
          <div className="analytics-bar-chart__header">
            <h3 className="analytics-bar-chart__title">{title}</h3>
          </div>
          <div className="analytics-bar-chart__loading">
            <div className="analytics-bar-chart__spinner">
              <div className="spinner"></div>
            </div>
            <p>{translations?.loading || 'Loading chart data...'}</p>
          </div>
        </div>
      );
    }

    if (!data || data.length === 0) {
      return (
        <div className="analytics-bar-chart">
          <div className="analytics-bar-chart__header">
            <h3 className="analytics-bar-chart__title">{title}</h3>
          </div>
          <div className="analytics-bar-chart__empty">
            <div className="analytics-bar-chart__empty-icon">
              <BarChart3 size={48} />
            </div>
            <p>{translations?.noData || 'No data available'}</p>
            <span>Data will appear here once you have transactions</span>
          </div>
        </div>
      );
    }

    return (
      <div className="analytics-bar-chart">
        <div className="analytics-bar-chart__header">
          <h3 className="analytics-bar-chart__title">{title}</h3>
          <div className="analytics-bar-chart__summary">
            <div className="analytics-bar-chart__stat analytics-bar-chart__stat--income">
              <span className="analytics-bar-chart__stat-label">{translations?.income || 'Income'}</span>
              <span className="analytics-bar-chart__stat-value">
                {formattedSummary.income || totalIncome.toLocaleString()}
              </span>
            </div>
            <div className="analytics-bar-chart__stat analytics-bar-chart__stat--expense">
              <span className="analytics-bar-chart__stat-label">{translations?.expense || 'Expense'}</span>
              <span className="analytics-bar-chart__stat-value">
                {formattedSummary.expense || totalExpense.toLocaleString()}
              </span>
            </div>
            <div className={`analytics-bar-chart__stat analytics-bar-chart__stat--net ${netAmount >= 0 ? 'positive' : 'negative'}`}>
              <span className="analytics-bar-chart__stat-label">{translations?.net || 'Net'}</span>
              <span className="analytics-bar-chart__stat-value">
                {formattedSummary.net || netAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        
        <div className="analytics-bar-chart__content" style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={formattedData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 30, // Reduced since no angle needed
              }}
              barCategoryGap="10%" // Reduced gap for bigger bars
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280"
                fontSize={12}
                fontWeight={500}
                interval={0} // Show all month labels
                textAnchor="middle" // Center align text
                height={40} // Reduced height since no angle
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                fontWeight={500}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{
                  paddingTop: '30px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
                iconType="rect"
                iconSize={12}
              />
              <Bar 
                dataKey="income" 
                name={translations?.income || "Thu Nhập"}
                fill="#10b981" 
                radius={[2, 2, 0, 0]}
                maxBarSize={80} // Increased bar width
              />
              <Bar 
                dataKey="expense" 
                name={translations?.expense || "Chi Phí"}
                fill="#ef4444" 
                radius={[2, 2, 0, 0]}
                maxBarSize={80}
              />
              {showNet && (
                <Bar 
                  dataKey="net" 
                  name={translations?.net || "Ròng"}
                  fill="#6366f1" 
                  radius={[2, 2, 0, 0]}
                  maxBarSize={80}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in AnalyticsBarChart:', error);
    return (
      <div className="analytics-bar-chart">
        <div className="analytics-bar-chart__header">
          <h3 className="analytics-bar-chart__title">{title}</h3>
        </div>
        <div className="analytics-bar-chart__error">
          <div className="analytics-bar-chart__error-icon">
            <BarChart3 size={48} />
          </div>
          <p>Error loading chart</p>
          <span>Please try refreshing the page</span>
        </div>
      </div>
    );
  }
};

export default AnalyticsBarChart;

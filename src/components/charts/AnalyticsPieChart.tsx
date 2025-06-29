/**
 * Analytics Pie Chart Component
 */

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { useCurrencyContext } from '../../contexts/CurrencyContext';
import type { PieChartData } from '../../types/analytics';
import './AnalyticsPieChart.css';

interface AnalyticsPieChartProps {
  data: PieChartData[];
  title: string;
  loading?: boolean;
  height?: number;
  translations?: {
    amount?: string;
    loading?: string;
    noData?: string;
    categoriesCount?: string;
  };
}

const CustomTooltip = ({ active, payload }: any) => {
  const { convertAndFormat } = useCurrencyContext();
  const [formattedAmount, setFormattedAmount] = React.useState<string>('');

  React.useEffect(() => {
    let isMounted = true;
    
    try {
      if (active && payload && payload.length) {
        const data = payload[0]?.payload;
        if (data && typeof data.value === 'number') {
          convertAndFormat(data.value)
            .then(formatted => {
              if (isMounted) {
                setFormattedAmount(formatted);
              }
            })
            .catch(error => {
              console.error('Currency conversion failed in tooltip:', error);
              if (isMounted) {
                setFormattedAmount(data.value.toLocaleString());
              }
            });
        } else {
          setFormattedAmount('');
        }
      } else {
        setFormattedAmount('');
      }
    } catch (error) {
      console.error('Error in CustomTooltip useEffect:', error);
      setFormattedAmount('');
    }

    return () => {
      isMounted = false;
    };
  }, [active, payload, convertAndFormat]);

  try {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      if (!data || typeof data.value !== 'number') {
        return null;
      }
      
      return (
        <div className="analytics-pie-tooltip">
          <p className="analytics-pie-tooltip__label">{data.name || 'Unknown'}</p>
          <p className="analytics-pie-tooltip__value">
            {formattedAmount || data.value.toLocaleString()}
          </p>
          <p className="analytics-pie-tooltip__percentage">
            {(data.percentage || 0).toFixed(1)}%
          </p>
        </div>
      );
    }
  } catch (error) {
    console.error('Error rendering CustomTooltip:', error);
  }
  
  return null;
};

const CustomLegend = ({ payload }: any) => {
  try {
    if (!payload || !Array.isArray(payload)) {
      return null;
    }

    return (
      <div className="analytics-pie-legend">
        {payload.map((entry: any, index: number) => {
          try {
            if (!entry || !entry.payload) {
              return null;
            }
            
            return (
              <div key={index} className="analytics-pie-legend__item">
                <div 
                  className="analytics-pie-legend__color"
                  style={{ backgroundColor: entry.color || '#ccc' }}
                />
                <span className="analytics-pie-legend__text">
                  {entry.value || 'Unknown'}
                </span>
                <span className="analytics-pie-legend__percentage">
                  ({(entry.payload.percentage || 0).toFixed(1)}%)
                </span>
              </div>
            );
          } catch (error) {
            console.error('Error rendering legend item:', error);
            return null;
          }
        })}
      </div>
    );
  } catch (error) {
    console.error('Error in CustomLegend:', error);
    return null;
  }
};

export const AnalyticsPieChart: React.FC<AnalyticsPieChartProps> = ({
  data,
  title,
  loading = false,
  height = 400,
  translations
}) => {
  try {
    if (loading) {
      return (
        <div className="analytics-pie-chart">
          <div className="analytics-pie-chart__header">
            <h3 className="analytics-pie-chart__title">{title}</h3>
          </div>
          <div className="analytics-pie-chart__loading">
            <div className="analytics-pie-chart__spinner">
              <div className="spinner"></div>
            </div>
            <p>{translations?.loading || 'Loading chart data...'}</p>
          </div>
        </div>
      );
    }

    if (!data || data.length === 0) {
      return (
        <div className="analytics-pie-chart">
          <div className="analytics-pie-chart__header">
            <h3 className="analytics-pie-chart__title">{title}</h3>
          </div>
          <div className="analytics-pie-chart__empty">
            <div className="analytics-pie-chart__empty-icon">
              <BarChart3 size={48} />
            </div>
            <p>{translations?.noData || 'No data available'}</p>
            <span>Data will appear here once you have transactions</span>
          </div>
        </div>
      );
    }

    // Validate data structure
    const validData = Array.isArray(data) ? data.filter(item => 
      item && 
      typeof item.value === 'number' && 
      typeof item.name === 'string' && 
      typeof item.color === 'string'
    ) : [];

    if (validData.length === 0) {
      return (
        <div className="analytics-pie-chart">
          <div className="analytics-pie-chart__header">
            <h3 className="analytics-pie-chart__title">{title}</h3>
          </div>
          <div className="analytics-pie-chart__empty">
            <div className="analytics-pie-chart__empty-icon">
              <BarChart3 size={48} />
            </div>
            <p>{translations?.noData || 'No data available'}</p>
            <span>Data will appear here once you have transactions</span>
          </div>
        </div>
      );
    }

    return (
      <div className="analytics-pie-chart">
        <div className="analytics-pie-chart__header">
          <h3 className="analytics-pie-chart__title">{title}</h3>
          <div className="analytics-pie-chart__summary">
            <span className="analytics-pie-chart__count">
              {validData.length} {translations?.categoriesCount || 'categories'}
            </span>
          </div>
        </div>
        
        <div className="analytics-pie-chart__content">
          <div className="analytics-pie-chart__chart-area" style={{ height: Math.max(300, height - 160) }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <Pie
                  data={validData}
                  cx="50%"
                  cy="50%"
                  outerRadius={Math.min(100, (height - 200) / 3)}
                  innerRadius={Math.min(40, (height - 200) / 6)}
                  paddingAngle={2}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {validData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="analytics-pie-chart__legend-area">
            <CustomLegend payload={validData.map((item) => ({
              value: item.name,
              color: item.color,
              payload: item
            }))} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in AnalyticsPieChart:', error);
    return (
      <div className="analytics-pie-chart">
        <div className="analytics-pie-chart__header">
          <h3 className="analytics-pie-chart__title">{title}</h3>
        </div>
        <div className="analytics-pie-chart__error">
          <div className="analytics-pie-chart__error-icon">
            <BarChart3 size={48} />
          </div>
          <p>Error loading chart</p>
          <span>Please try refreshing the page</span>
        </div>
      </div>
    );
  }
};

export default AnalyticsPieChart;

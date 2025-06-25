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
    
    if (active && payload && payload.length) {
      const data = payload[0].payload;
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

    return () => {
      isMounted = false;
    };
  }, [active, payload, convertAndFormat]);

  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="analytics-pie-tooltip">
        <p className="analytics-pie-tooltip__label">{data.name}</p>
        <p className="analytics-pie-tooltip__value">
          {formattedAmount || data.value.toLocaleString()}
        </p>
        <p className="analytics-pie-tooltip__percentage">
          {data.percentage.toFixed(1)}%
        </p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: any) => {
  return (
    <div className="analytics-pie-legend">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="analytics-pie-legend__item">
          <div 
            className="analytics-pie-legend__color"
            style={{ backgroundColor: entry.color }}
          />
          <span className="analytics-pie-legend__text">
            {entry.value}
          </span>
          <span className="analytics-pie-legend__percentage">
            ({entry.payload.percentage.toFixed(1)}%)
          </span>
        </div>
      ))}
    </div>
  );
};

export const AnalyticsPieChart: React.FC<AnalyticsPieChartProps> = ({
  data,
  title,
  loading = false,
  height = 400,
  translations
}) => {
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

  return (
    <div className="analytics-pie-chart">
      <div className="analytics-pie-chart__header">
        <h3 className="analytics-pie-chart__title">{title}</h3>
        <div className="analytics-pie-chart__summary">
          <span className="analytics-pie-chart__count">
            {data.length} {translations?.categoriesCount || 'categories'}
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
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={Math.min(100, (height - 200) / 3)}
                innerRadius={Math.min(40, (height - 200) / 6)}
                paddingAngle={2}
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {data.map((entry, index) => (
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
          <CustomLegend payload={data.map((item) => ({
            value: item.name,
            color: item.color,
            payload: item
          }))} />
        </div>
      </div>
    </div>
  );
};

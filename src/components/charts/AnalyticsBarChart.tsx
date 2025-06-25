/**
 * Analytics Bar Chart Component
 */

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { useCurrencyContext } from '../../contexts/CurrencyContext';
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
  translations
}) => {
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

  // Calculate summary stats
  const totalIncome = data.reduce((sum, item) => sum + item.income, 0);
  const totalExpense = data.reduce((sum, item) => sum + item.expense, 0);
  const netAmount = totalIncome - totalExpense;

  const { convertAndFormat } = useCurrencyContext();
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
    });
  }, [totalIncome, totalExpense, netAmount, convertAndFormat]);

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
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              stroke="#6b7280"
              fontSize={12}
              fontWeight={500}
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
                paddingTop: '20px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            />
            <Bar 
              dataKey="income" 
              name={translations?.income || "Income"}
              fill="#10b981" 
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="expense" 
              name={translations?.expense || "Expense"}
              fill="#ef4444" 
              radius={[2, 2, 0, 0]}
            />
            {showNet && (
              <Bar 
                dataKey="net" 
                name={translations?.net || "Net"}
                fill="#6366f1" 
                radius={[2, 2, 0, 0]}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

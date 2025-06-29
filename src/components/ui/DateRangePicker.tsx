/**
 * Date Range Picker Component - Reusable date range selector
 */

import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Calendar, X } from 'lucide-react';
import dayjs, { Dayjs } from 'dayjs';
import Button from './Button';
import './DateRangePicker.css';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onDateChange: (startDate: string, endDate: string) => void;
  onClear?: () => void;
  translations?: {
    startDate?: string;
    endDate?: string;
    apply?: string;
    clear?: string;
  };
  className?: string;
  hideEndDateField?: boolean; // New prop to hide end date field
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onDateChange,
  onClear,
  translations,
  className = '',
  hideEndDateField = false
}) => {
  const [localStartDate, setLocalStartDate] = useState<Dayjs | null>(
    startDate ? dayjs(startDate) : null
  );
  const [localEndDate, setLocalEndDate] = useState<Dayjs | null>(
    endDate ? dayjs(endDate) : null
  );

  // Auto-apply when dates change
  const handleStartDateChange = (date: Dayjs | null) => {
    setLocalStartDate(date);
    const start = date ? date.format('YYYY-MM-DD') : '';
    const end = hideEndDateField ? '' : (localEndDate ? localEndDate.format('YYYY-MM-DD') : '');
    onDateChange(start, end);
  };

  const handleEndDateChange = (date: Dayjs | null) => {
    if (hideEndDateField) return; // Don't allow end date changes if hidden
    setLocalEndDate(date);
    const start = localStartDate ? localStartDate.format('YYYY-MM-DD') : '';
    const end = date ? date.format('YYYY-MM-DD') : '';
    onDateChange(start, end);
  };

  const handleClear = () => {
    setLocalStartDate(null);
    setLocalEndDate(null);
    if (onClear) {
      onClear();
    } else {
      onDateChange('', '');
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className={`date-range-picker ${className}`}>
        <div className="date-range-picker__inputs">
          <div className="date-range-picker__field">
            <label className="date-range-picker__label">
              <Calendar size={16} />
              {translations?.startDate || 'Start Date'}
            </label>
            <DatePicker
              value={localStartDate}
              onChange={handleStartDateChange}
              maxDate={hideEndDateField ? undefined : (localEndDate || undefined)}
              slotProps={{
                textField: {
                  size: 'small',
                  variant: 'outlined',
                  fullWidth: true
                }
              }}
            />
          </div>
          
          {!hideEndDateField && (
            <div className="date-range-picker__field">
              <label className="date-range-picker__label">
                <Calendar size={16} />
                {translations?.endDate || 'End Date'}
              </label>
              <DatePicker
                value={localEndDate}
                onChange={handleEndDateChange}
                minDate={localStartDate || undefined}
                slotProps={{
                textField: {
                  size: 'small',
                  variant: 'outlined',
                  fullWidth: true
                }
              }}
            />
            </div>
          )}
        </div>

        <div className="date-range-picker__actions">
          <Button
            onClick={handleClear}
            variant="secondary"
            size="sm"
            disabled={!localStartDate && !localEndDate}
          >
            <X size={16} />
            {translations?.clear || 'Clear'}
          </Button>
        </div>
      </div>
    </LocalizationProvider>
  );
};

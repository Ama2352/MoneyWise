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
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onDateChange,
  onClear,
  translations,
  className = ''
}) => {
  const [localStartDate, setLocalStartDate] = useState<Dayjs | null>(
    startDate ? dayjs(startDate) : null
  );
  const [localEndDate, setLocalEndDate] = useState<Dayjs | null>(
    endDate ? dayjs(endDate) : null
  );

  const handleApply = () => {
    const start = localStartDate ? localStartDate.format('YYYY-MM-DD') : '';
    const end = localEndDate ? localEndDate.format('YYYY-MM-DD') : '';
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

  const hasChanges = 
    (localStartDate ? localStartDate.format('YYYY-MM-DD') : '') !== startDate ||
    (localEndDate ? localEndDate.format('YYYY-MM-DD') : '') !== endDate;

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
              onChange={(newValue) => setLocalStartDate(newValue)}
              maxDate={localEndDate || undefined}
              slotProps={{
                textField: {
                  size: 'small',
                  variant: 'outlined',
                  fullWidth: true
                }
              }}
            />
          </div>
          
          <div className="date-range-picker__field">
            <label className="date-range-picker__label">
              <Calendar size={16} />
              {translations?.endDate || 'End Date'}
            </label>
            <DatePicker
              value={localEndDate}
              onChange={(newValue) => setLocalEndDate(newValue)}
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
          
          <Button
            onClick={handleApply}
            size="sm"
            disabled={!hasChanges || (!localStartDate && !localEndDate)}
          >
            {translations?.apply || 'Apply'}
          </Button>
        </div>
      </div>
    </LocalizationProvider>
  );
};

/**
 * Custom Date Input Component with Language-aware Display
 */

import React, { useState, useRef, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { formatDateForInput, parseInputDateToISO, getDateInputPlaceholder, convertDateBetweenLanguages } from '../../utils/dateUtils';
import './DateInput.css';

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  language: 'en' | 'vi';
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
}

export const DateInput: React.FC<DateInputProps> = ({
  value,
  onChange,
  language,
  className = '',
  placeholder,
  disabled = false,
  error = false,
}) => {
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [isoValue, setIsoValue] = useState('');
  const previousLanguageRef = useRef<'en' | 'vi'>(language);

  // Update ISO value when value prop changes
  useEffect(() => {
    if (value) {
      const isoDate = parseInputDateToISO(value, language);
      if (isoDate && isoDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        setIsoValue(isoDate);
      }
    } else {
      setIsoValue('');
    }
  }, [value, language]);

  // Handle language switching - convert current value to new format
  useEffect(() => {
    if (previousLanguageRef.current !== language && value) {
      const convertedValue = convertDateBetweenLanguages(value, previousLanguageRef.current, language);
      if (convertedValue !== value) {
        onChange(convertedValue);
      }
      previousLanguageRef.current = language;
    } else {
      previousLanguageRef.current = language;
    }
  }, [language, value]); // Remove onChange from dependencies

  // Convert ISO date to display format
  const getDisplayValue = (isoDate: string): string => {
    if (!isoDate) return '';
    return formatDateForInput(isoDate, language);
  };

  // Handle date picker change
  const handleDatePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isoDate = e.target.value; // YYYY-MM-DD format from date input
    setIsoValue(isoDate);
    
    // Convert to display format and notify parent
    const displayValue = getDisplayValue(isoDate);
    onChange(displayValue);
  };

  // Handle text input change (manual typing)
  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const textValue = e.target.value;
    onChange(textValue);
    
    // Try to parse and update ISO value for date picker
    try {
      const isoDate = parseInputDateToISO(textValue, language);
      if (isoDate && isoDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        setIsoValue(isoDate);
      }
    } catch (error) {
      // Invalid date format, keep current ISO value
    }
  };

  // Open date picker when clicking calendar icon
  const handleCalendarClick = () => {
    if (!disabled && dateInputRef.current) {
      dateInputRef.current.focus();
      dateInputRef.current.showPicker();
    }
  };

  const displayValue = value || '';
  const effectivePlaceholder = placeholder || getDateInputPlaceholder(language);

  return (
    <div className={`date-input-wrapper ${error ? 'date-input-wrapper--error' : ''}`}>
      {/* Hidden date input for picker functionality */}
      <input
        ref={dateInputRef}
        type="date"
        value={isoValue}
        onChange={handleDatePickerChange}
        className="date-input-hidden"
        disabled={disabled}
        tabIndex={-1}
      />
      
      {/* Visible text input with language-specific format */}
      <div className="date-input-container">
        <input
          type="text"
          value={displayValue}
          onChange={handleTextInputChange}
          className={`date-input-text ${className}`}
          placeholder={effectivePlaceholder}
          disabled={disabled}
        />
        <button
          type="button"
          className="date-input-calendar-btn"
          onClick={handleCalendarClick}
          disabled={disabled}
          tabIndex={-1}
        >
          <Calendar size={16} />
        </button>
      </div>
    </div>
  );
};

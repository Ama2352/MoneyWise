import { useState, useCallback, useEffect, useRef } from 'react';
import { useLanguageContext } from '../contexts/LanguageContext';

interface UseAmountInputOptions {
  initialValue?: number;
  onAmountChange?: (rawValue: number) => void;
  onError?: (error: string | null) => void;
  allowNegative?: boolean;
}

interface UseAmountInputReturn {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  setValue: (input: string | number) => void;
  rawValue: number;
  placeholder: string;
}

const formatNumber = (
  value: number,
  currency: 'VND' | 'USD',
  allowNegative: boolean,
  inputValue: string
): string => {
  if (isNaN(value)) return inputValue || '';
  const absValue = Math.abs(value);
  if (currency === 'VND') {
    const formatted = Math.round(absValue)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return value < 0 && allowNegative ? `-${formatted}` : formatted;
  }
  // For USD, preserve raw input during typing (e.g., "123." stays "123.")
  const hasDecimal = inputValue.includes('.');
  if (hasDecimal) {
    // Return input as-is if it contains a decimal point
    const cleanInput = inputValue.replace(/,/g, '');
    const parts = cleanInput.split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts[1] !== undefined ? `${integerPart}.${parts[1]}` : integerPart;
  }
  // Format whole numbers or final value
  const formatted = absValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return value < 0 && allowNegative ? `-${formatted}` : formatted;
};

const parseNumber = (
  value: string,
  currency: 'VND' | 'USD',
  allowNegative: boolean
): { num: number; inputValue: string } => {
  // If the input is just "-", preserve it without parsing
  if (value === '-' && allowNegative) {
    return { num: 0, inputValue: '-' };
  }

  const cleanValue = value.replace(/[,.]/g, match =>
    match === '.' && currency === 'USD' ? '.' : ''
  );
  let num: number;
  let inputValue = value;

  if (currency === 'VND') {
    num = parseInt(cleanValue || '0', 10);
    inputValue = value.replace(/[^\d-]/g, '');
  } else {
    // Handle USD inputs like ".12" or "123.4567"
    const match = cleanValue.match(/^-?\d*\.?\d*/)?.[0];
    num = parseFloat(match || '0');
  }

  if (isNaN(num)) num = 0;
  if (!allowNegative && num < 0) {
    num = 0;
    inputValue = inputValue.replace('-', '');
  }
  return { num, inputValue };
};

const roundUSD = (value: number): number => {
  return Math.round(value * 100) / 100; // Round to 2 decimal places
};

export const useAmountInput = (
  currency: 'VND' | 'USD',
  options: UseAmountInputOptions = {}
): UseAmountInputReturn => {
  const {
    initialValue,
    onAmountChange,
    onError,
    allowNegative = false,
  } = options;
  const { translations } = useLanguageContext();
  const [value, setValue] = useState<string>(
    initialValue === undefined
      ? ''
      : formatNumber(
          initialValue,
          currency,
          allowNegative,
          Math.abs(initialValue % 1) > 0 ? initialValue.toString() : ''
        )
  );
  const [rawValue, setRawValue] = useState<number>(
    initialValue === undefined ? 0 : initialValue
  );
  const inputRef = useRef<HTMLInputElement | null>(null);

  const placeholder = currency === 'VND' ? 'e.g. 1.234.567' : 'e.g. 1,234.56';

  const validateInput = useCallback(
    (input: string): string | null => {
      if (!input) return translations.common.amountRequired;
      if (input === '-' && allowNegative) return null; // Allow "-" when negative is allowed
      const cleanInput = input.replace(currency === 'VND' ? /\./g : /,/g, '');
      if (currency === 'USD' && !/^-?\d*\.?\d*$/.test(cleanInput)) {
        return translations.common.invalidUSDFormat;
      }
      if (currency === 'VND' && !/^-?\d*$/.test(cleanInput)) {
        return translations.common.invalidVNDFormat;
      }
      if (!allowNegative && input.startsWith('-')) {
        return translations.common.negativeNotAllowed;
      }
      return null;
    },
    [currency, allowNegative, translations]
  );

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;
      const cursorPosition = event.target.selectionStart;
      const error = validateInput(inputValue);
      onError?.(error);

      if (!error) {
        const { num, inputValue: rawInput } = parseNumber(
          inputValue,
          currency,
          allowNegative
        );
        const formatted =
          inputValue === '-' && allowNegative
            ? '-'
            : formatNumber(num, currency, allowNegative, rawInput);
        setRawValue(num);
        setValue(formatted);
        onAmountChange?.(num);

        // Adjust cursor position
        if (inputRef.current && cursorPosition !== null) {
          let newCursor = cursorPosition;
          if (currency === 'USD' && inputValue.includes('.')) {
            // Ensure cursor stays after decimal point
            const formattedParts = formatted.split('.');
            const inputParts = inputValue.split('.');
            if (inputParts[1] !== undefined) {
              newCursor =
                formattedParts[0].length + 1 + (inputParts[1]?.length || 0);
            }
          } else if (formatted !== '-') {
            // Adjust for thousand separators
            const diff = formatted.length - inputValue.length;
            newCursor = cursorPosition + diff;
          }
          setTimeout(
            () => inputRef.current?.setSelectionRange(newCursor, newCursor),
            0
          );
        }
      } else {
        setValue(inputValue);
      }
    },
    [currency, allowNegative, onAmountChange, onError, validateInput]
  );

  const onBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      if (value === '-') {
        // Reset to empty or 0 if only "-" remains on blur
        setValue('');
        setRawValue(0);
        onAmountChange?.(0);
      } else if (currency === 'USD' && value.includes('.')) {
        const { num } = parseNumber(value, currency, allowNegative);
        const roundedNum = roundUSD(num);
        const formatted = formatNumber(
          roundedNum,
          currency,
          allowNegative,
          roundedNum % 1 !== 0 ? roundedNum.toString() : ''
        );
        setRawValue(roundedNum);
        setValue(formatted);
        onAmountChange?.(roundedNum);
      }
    },
    [currency, allowNegative, onAmountChange, value]
  );

  useEffect(() => {
    if (initialValue === undefined) {
      setValue('');
      setRawValue(0);
    } else {
      const formatted = formatNumber(
        initialValue,
        currency,
        allowNegative,
        Math.abs(initialValue % 1) > 0 ? initialValue.toString() : ''
      );
      setValue(formatted);
      setRawValue(initialValue);
    }
  }, [initialValue, currency, allowNegative]);

  return {
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      inputRef.current = e.target;
      onChange(e);
    },
    onBlur,
    setValue: (input: string | number) => {
      // Accepts string or number, always formats for display
      let str = typeof input === 'number' ? input.toString() : input;
      if (str === '-' && allowNegative) {
        setValue('-');
        setRawValue(0);
        onAmountChange?.(0);
        return;
      }
      const { num, inputValue } = parseNumber(str, currency, allowNegative);
      const formatted = formatNumber(num, currency, allowNegative, inputValue);
      setRawValue(num);
      setValue(formatted);
      onAmountChange?.(num);
    },
    rawValue,
    placeholder,
  };
};

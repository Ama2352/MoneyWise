import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Collapse,
  TextField,
  MenuItem,
  Button,
  Typography,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  Stack,
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Search,
  Clear,
  FilterList,
  MonetizationOn,
  SwapVert,
  Label,
  AccountBalanceWallet,
  CalendarToday,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import type { SearchTransactionRequest, Category, Wallet } from '../../types';
import { useLanguageContext, useCurrencyContext } from '../../contexts';
import { useAmountInput } from '../../hooks';

interface AdvancedSearchProps {
  onSearch: (filters: SearchTransactionRequest) => void;
  onClear: () => void;
  categories: Category[];
  wallets: Wallet[];
  isLoading?: boolean;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearch,
  onClear,
  categories,
  wallets,
  isLoading = false,
}) => {
  const { translations } = useLanguageContext();
  const { currency, convertFromDisplay } = useCurrencyContext();
  const [expanded, setExpanded] = useState(false);
  const [filters, setFilters] = useState<SearchTransactionRequest>({});
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null); // Use amount input hooks for currency-aware min/max amount handling
  const minAmountInput = useAmountInput({
    initialValue: 0,
    onAmountChange: () => {}, // No specific action needed for search filters
    onError: () => {}, // No error handling needed for search filters
  });

  const maxAmountInput = useAmountInput({
    initialValue: 0,
    onAmountChange: () => {}, // No specific action needed for search filters
    onError: () => {}, // No error handling needed for search filters
  });
  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  const handleFilterChange = (
    key: keyof SearchTransactionRequest,
    value: any
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
  };
  const handleSearch = async () => {
    // Convert display amounts back to VND for search
    let minAmountInVnd: number | undefined;
    let maxAmountInVnd: number | undefined;

    if (minAmountInput.rawAmount > 0) {
      minAmountInVnd = await convertFromDisplay(minAmountInput.rawAmount);
    }
    if (maxAmountInput.rawAmount > 0) {
      maxAmountInVnd = await convertFromDisplay(maxAmountInput.rawAmount);
    }

    const searchFilters: SearchTransactionRequest = {
      ...filters,
      startDate: startDate ? startDate.format('YYYY-MM-DD') : undefined,
      endDate: endDate ? endDate.format('YYYY-MM-DD') : undefined,
      amountRange:
        minAmountInVnd && maxAmountInVnd
          ? `${minAmountInVnd}-${maxAmountInVnd}`
          : undefined,
      timeRange:
        startTime && endTime
          ? `${startTime.format('HH:mm')}-${endTime.format('HH:mm')}`
          : undefined,
    };

    // Remove empty values
    const cleanFilters = Object.fromEntries(
      Object.entries(searchFilters).filter(
        ([_, value]) => value !== undefined && value !== ''
      )
    );

    onSearch(cleanFilters);
  };
  const handleClear = () => {
    setFilters({});
    setStartDate(null);
    setEndDate(null);
    minAmountInput.setAmount(0);
    maxAmountInput.setAmount(0);
    setStartTime(null);
    setEndTime(null);
    onClear();
  };
  const hasActiveFilters = () => {
    return (
      Object.keys(filters).length > 0 ||
      startDate ||
      endDate ||
      minAmountInput.rawAmount > 0 ||
      maxAmountInput.rawAmount > 0 ||
      startTime ||
      endTime
    );
  };
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.keywords) count++;
    if (filters.type) count++;
    if (filters.categoryName) count++;
    if (filters.walletName) count++;
    if (filters.dayOfWeek) count++;
    if (startDate || endDate) count++;
    if (minAmountInput.rawAmount > 0 || maxAmountInput.rawAmount > 0) count++;
    if (startTime || endTime) count++;
    return count;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ pb: 1 }}>
          {/* Header with expand/collapse */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: expanded ? 2 : 0,
              cursor: 'pointer',
            }}
            onClick={() => setExpanded(!expanded)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterList color="primary" />{' '}
              <Typography variant="h6" color="primary">
                {translations.transactions.advancedSearch}
              </Typography>
              {hasActiveFilters() && (
                <Chip
                  label={getActiveFiltersCount()}
                  size="small"
                  color="primary"
                  sx={{ ml: 1 }}
                />
              )}
            </Box>
            <IconButton size="small">
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>{' '}
          <Collapse in={expanded}>
            <Stack spacing={2.5} sx={{ mt: 2 }}>
              {/* Row 1: Keyword, Type, and Category */}
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                {' '}
                <TextField
                  fullWidth
                  size="small"
                  label={translations.transactions.keyword}
                  value={filters.keywords || ''}
                  onChange={e => handleFilterChange('keywords', e.target.value)}
                  placeholder={translations.transactions.keywordPlaceholder}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />{' '}
                <FormControl fullWidth size="small">
                  <InputLabel>{translations.transactions.type}</InputLabel>
                  <Select
                    value={filters.type || ''}
                    label={translations.transactions.type}
                    onChange={e => handleFilterChange('type', e.target.value)}
                    startAdornment={
                      <InputAdornment position="start">
                        <SwapVert />
                      </InputAdornment>
                    }
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 200,
                          width: 'auto',
                        },
                      },
                      anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                      },
                      transformOrigin: {
                        vertical: 'top',
                        horizontal: 'left',
                      },
                    }}
                  >
                    <MenuItem value="">
                      <em>{translations.common.all}</em>
                    </MenuItem>
                    <MenuItem value="income">
                      {translations.transactions.income}
                    </MenuItem>
                    <MenuItem value="expense">
                      {translations.transactions.expense}
                    </MenuItem>
                  </Select>
                </FormControl>{' '}
                <FormControl fullWidth size="small">
                  <InputLabel>{translations.transactions.category}</InputLabel>
                  <Select
                    value={filters.categoryName || ''}
                    label={translations.transactions.category}
                    onChange={e =>
                      handleFilterChange('categoryName', e.target.value)
                    }
                    startAdornment={
                      <InputAdornment position="start">
                        <Label />
                      </InputAdornment>
                    }
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 200,
                          width: 'auto',
                        },
                      },
                      anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                      },
                      transformOrigin: {
                        vertical: 'top',
                        horizontal: 'left',
                      },
                    }}
                  >
                    {' '}
                    <MenuItem value="">
                      <em>{translations.common.allCategories}</em>
                    </MenuItem>
                    {categories.map(category => (
                      <MenuItem key={category.categoryId} value={category.name}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>{' '}
              {/* Row 2: Start Date, End Date, and Wallet */}
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                {' '}
                <DatePicker
                  label={translations.transactions.startDate}
                  value={startDate}
                  onChange={setStartDate}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'small',
                    },
                    inputAdornment: {
                      position: 'start',
                    },
                    popper: {
                      placement: 'bottom-start',
                      modifiers: [
                        {
                          name: 'preventOverflow',
                          options: {
                            boundary: 'viewport',
                            padding: 8,
                          },
                        },
                        {
                          name: 'flip',
                          options: {
                            fallbackPlacements: [
                              'bottom-start',
                              'top-start',
                              'bottom-end',
                              'top-end',
                            ],
                          },
                        },
                      ],
                    },
                  }}
                />{' '}
                <DatePicker
                  label={translations.transactions.endDate}
                  value={endDate}
                  onChange={setEndDate}
                  minDate={startDate || undefined}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'small',
                    },
                    inputAdornment: {
                      position: 'start',
                    },
                    popper: {
                      placement: 'bottom-start',
                      modifiers: [
                        {
                          name: 'preventOverflow',
                          options: {
                            boundary: 'viewport',
                            padding: 8,
                          },
                        },
                        {
                          name: 'flip',
                          options: {
                            fallbackPlacements: [
                              'bottom-start',
                              'top-start',
                              'bottom-end',
                              'top-end',
                            ],
                          },
                        },
                      ],
                    },
                  }}
                />{' '}
                <FormControl fullWidth size="small">
                  <InputLabel>{translations.transactions.wallet}</InputLabel>
                  <Select
                    value={filters.walletName || ''}
                    label={translations.transactions.wallet}
                    onChange={e =>
                      handleFilterChange('walletName', e.target.value)
                    }
                    startAdornment={
                      <InputAdornment position="start">
                        <AccountBalanceWallet />
                      </InputAdornment>
                    }
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 200,
                          width: 'auto',
                        },
                      },
                      anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                      },
                      transformOrigin: {
                        vertical: 'top',
                        horizontal: 'left',
                      },
                    }}
                  >
                    {' '}
                    <MenuItem value="">
                      <em>{translations.common.allWallets}</em>
                    </MenuItem>
                    {wallets.map(wallet => (
                      <MenuItem key={wallet.walletId} value={wallet.walletName}>
                        {wallet.walletName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
              {/* Row 3: Min Amount, Max Amount, and Day of Week */}
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                {' '}
                <TextField
                  fullWidth
                  size="small"
                  label={`${translations.transactions.minAmount} (${currency.toUpperCase()})`}
                  type="text"
                  value={minAmountInput.displayAmount}
                  onChange={e =>
                    minAmountInput.handleInputChange(e.target.value)
                  }
                  onFocus={minAmountInput.handleFocus}
                  onBlur={minAmountInput.handleBlur}
                  placeholder={minAmountInput.placeholder}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MonetizationOn />
                      </InputAdornment>
                    ),
                  }}
                />{' '}
                <TextField
                  fullWidth
                  size="small"
                  label={`${translations.transactions.maxAmount} (${currency.toUpperCase()})`}
                  type="text"
                  value={maxAmountInput.displayAmount}
                  onChange={e =>
                    maxAmountInput.handleInputChange(e.target.value)
                  }
                  onFocus={maxAmountInput.handleFocus}
                  onBlur={maxAmountInput.handleBlur}
                  placeholder={maxAmountInput.placeholder}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MonetizationOn />
                      </InputAdornment>
                    ),
                  }}
                />{' '}
                <FormControl fullWidth size="small">
                  <InputLabel>{translations.transactions.dayOfWeek}</InputLabel>
                  <Select
                    value={filters.dayOfWeek || ''}
                    label={translations.transactions.dayOfWeek}
                    onChange={e =>
                      handleFilterChange('dayOfWeek', e.target.value)
                    }
                    startAdornment={
                      <InputAdornment position="start">
                        <CalendarToday />
                      </InputAdornment>
                    }
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 200,
                          width: 'auto',
                        },
                      },
                      anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                      },
                      transformOrigin: {
                        vertical: 'top',
                        horizontal: 'left',
                      },
                    }}
                  >
                    {' '}
                    <MenuItem value="">
                      <em>{translations.common.anyDay}</em>
                    </MenuItem>{' '}
                    {daysOfWeek.map(day => (
                      <MenuItem key={day} value={day}>
                        {
                          translations.common.days[
                            day.toLowerCase() as keyof typeof translations.common.days
                          ]
                        }
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>{' '}
              {/* Row 4: Start Time and End Time (2 columns) */}
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                {' '}
                <MobileTimePicker
                  label={translations.transactions.startTime}
                  value={startTime}
                  onChange={setStartTime}
                  ampm={false}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'small',
                    },
                  }}
                />
                <MobileTimePicker
                  label={translations.transactions.endTime}
                  value={endTime}
                  onChange={setEndTime}
                  minTime={startTime || undefined}
                  ampm={false}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'small',
                    },
                  }}
                />
                {/* Empty box to balance the row */}
                <Box
                  sx={{ display: { xs: 'none', md: 'block' }, width: '100%' }}
                />
              </Stack>
              {/* Action Buttons */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  justifyContent: 'flex-end',
                  pt: 1,
                }}
              >
                {' '}
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Clear />}
                  onClick={handleClear}
                  disabled={!hasActiveFilters() || isLoading}
                >
                  {translations.common.clear}
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<Search />}
                  onClick={handleSearch}
                  disabled={isLoading}
                >
                  {translations.common.search}
                </Button>
              </Box>
            </Stack>
          </Collapse>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};

export default AdvancedSearch;

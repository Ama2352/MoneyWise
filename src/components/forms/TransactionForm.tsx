import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Box,
  Stack,
  Typography,
  FormHelperText,
  InputAdornment,
} from '@mui/material';
import {
  Close,
  TrendingUp,
  TrendingDown,
  MonetizationOn,
  Description,
  Label,
  AccountBalanceWallet,
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/vi';
import { useCategories, useWallets } from '../../hooks/useFinanceData';
import { useAmountInput, useCurrencyFormatter } from '../../hooks';
import { useLanguageContext, useCurrencyContext } from '../../contexts';
import { CategoryIcon, Button, WalletBalance } from '../ui';
import type { CreateTransactionRequest, Transaction } from '../../types';
import './TransactionForm.css';

interface TransactionFormProps {
  onSubmit: (data: CreateTransactionRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Transaction | null;
}

export const TransactionForm: React.FC<TransactionFormProps> = React.memo(
  ({ onSubmit, onCancel, isLoading = false, initialData }) => {
    const { translations, language } = useLanguageContext();
    const { currency, convertFromDisplay, convertAndFormat } =
      useCurrencyContext();
    const { parseAmountFromDisplay } = useCurrencyFormatter();
    const { categories, isLoading: categoriesLoading } = useCategories();
    const { wallets, isLoading: walletsLoading } = useWallets();

    // Convert initial date to dayjs if available
    const initialDate = initialData?.transactionDate
      ? dayjs(initialData.transactionDate)
      : dayjs();

    const [formData, setFormData] = useState<
      Omit<CreateTransactionRequest, 'transactionDate'>
    >({
      categoryId: initialData?.categoryId || '',
      walletId: initialData?.walletId || '',
      type: initialData?.type || 'expense',
      amount: initialData?.amount || 0,
      description: initialData?.description || '',
    });
    const [transactionDate, setTransactionDate] = useState<Dayjs>(initialDate);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Use the amount input hook for currency handling
    const amountInput = useAmountInput(
      currency.toUpperCase() as 'VND' | 'USD',
      {
        initialValue: 0,
        onAmountChange: (_rawValue: number) => {
          // Clear amount error when user starts typing
          if (errors.amount) {
            setErrors(prev => ({ ...prev, amount: '' }));
          }
        },
        onError: (error: string | null) => {
          if (error) {
            setErrors(prev => ({ ...prev, amount: error }));
          } else {
            setErrors(prev => ({ ...prev, amount: '' }));
          }
        },
      }
    );

    // Initialize amount when editing - use a ref to track initialization
    const initializationRef = useRef<number | null>(null);

    useEffect(() => {
      // Only initialize if we have initial data and haven't initialized this amount yet
      if (
        initialData?.amount &&
        initializationRef.current !== initialData.amount
      ) {
        initializationRef.current = initialData.amount;

        // Convert VND amount to display currency as a number
        if (currency === 'vnd') {
          amountInput.setValue(initialData.amount);
        } else {
          convertAndFormat(initialData.amount).then(formatted => {
            const numericValue = parseAmountFromDisplay(formatted);
            amountInput.setValue(numericValue);
          });
        }
      }
    }, [
      initialData?.amount,
      currency,
      convertAndFormat,
      parseAmountFromDisplay,
      amountInput.setValue,
    ]);

    // Set dayjs locale dynamically
    useEffect(() => {
      if (language === 'vi') {
        dayjs.locale('vi');
      } else {
        dayjs.locale('en');
      }
    }, [language]);

    const validateForm = (): boolean => {
      const newErrors: Record<string, string> = {};
      if (!formData.description.trim()) {
        newErrors.description =
          translations.transactions.form.descriptionRequired;
      }
      if (!amountInput.rawValue || amountInput.rawValue <= 0) {
        newErrors.amount = translations.transactions.form.amountRequired;
      }
      if (!formData.categoryId) {
        newErrors.categoryId = translations.transactions.form.categoryRequired;
      }
      if (!formData.walletId) {
        newErrors.walletId = translations.transactions.form.walletRequired;
      }
      if (!transactionDate || !transactionDate.isValid()) {
        newErrors.transactionDate = translations.transactions.form.dateRequired;
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) return;

      setIsSubmitting(true);
      try {
        // Convert display amount back to VND for storage
        const amountInVnd = await convertFromDisplay(amountInput.rawValue);

        // Convert dayjs to backend format
        const submissionData: CreateTransactionRequest = {
          ...formData,
          amount: amountInVnd,
          transactionDate: transactionDate.format('YYYY-MM-DD HH:mm:ss'),
        };

        await onSubmit(submissionData);
        // Note: Success notification is handled by the parent component
      } catch (error) {
        console.error('Form submission error:', error);
        // Note: Error notification is handled by the parent component
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleInputChange = (
      field: keyof Omit<CreateTransactionRequest, 'transactionDate'>,
      value: any
    ) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    };
    const handleDateChange = (newDate: Dayjs | null) => {
      if (newDate) {
        setTransactionDate(newDate);
        // Clear date error when user selects a date
        if (errors.transactionDate) {
          setErrors(prev => ({ ...prev, transactionDate: '' }));
        }
      }
    };

    // No need to prevent scroll since MUI Dialog handles this
    return (
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale={language === 'vi' ? 'vi' : 'en'}
      >
        <Dialog
          open={true}
          onClose={onCancel}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 },
          }}
        >
          <DialogTitle
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pb: 1,
            }}
          >
            {' '}
            <Typography variant="h6">
              {initialData
                ? translations.transactions.editTransaction
                : translations.transactions.addTransaction}
            </Typography>
            <IconButton
              onClick={onCancel}
              disabled={isLoading || isSubmitting}
              size="small"
            >
              <Close />
            </IconButton>
          </DialogTitle>

          <form onSubmit={handleSubmit}>
            <DialogContent sx={{ pt: 2 }}>
              <Stack spacing={2.5}>
                {/* Transaction Type */}
                <Box>
                  {' '}
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {translations.transactions.form.type}
                  </Typography>
                  <ToggleButtonGroup
                    value={formData.type}
                    exclusive
                    onChange={(_, value) =>
                      value && handleInputChange('type', value)
                    }
                    fullWidth
                    size="small"
                    disabled={!!initialData || isLoading || isSubmitting}
                  >
                    <ToggleButton
                      value="income"
                      disabled={!!initialData || isLoading || isSubmitting}
                      sx={{
                        '&.Mui-selected': {
                          backgroundColor: 'success.light',
                          color: 'success.contrastText',
                          '&:hover': {
                            backgroundColor: 'success.main',
                          },
                        },
                      }}
                    >
                      <TrendingUp sx={{ mr: 1 }} />
                      {translations.transactions.income}
                    </ToggleButton>
                    <ToggleButton
                      value="expense"
                      disabled={!!initialData || isLoading || isSubmitting}
                      sx={{
                        '&.Mui-selected': {
                          backgroundColor: 'error.light',
                          color: 'error.contrastText',
                          '&:hover': {
                            backgroundColor: 'error.main',
                          },
                        },
                      }}
                    >
                      <TrendingDown sx={{ mr: 1 }} />
                      {translations.transactions.expense}
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>{' '}
                {/* Amount */}{' '}
                <TextField
                  label={`${translations.transactions.form.amount} (${currency.toUpperCase()})`}
                  type="text"
                  value={amountInput.value}
                  onChange={amountInput.onChange}
                  onBlur={amountInput.onBlur}
                  error={!!errors.amount}
                  helperText={errors.amount}
                  disabled={isLoading || isSubmitting}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MonetizationOn />
                      </InputAdornment>
                    ),
                  }}
                  placeholder={amountInput.placeholder}
                />
                {/* Description */}
                <TextField
                  label={translations.transactions.form.description}
                  value={formData.description}
                  onChange={e =>
                    handleInputChange('description', e.target.value)
                  }
                  error={!!errors.description}
                  helperText={errors.description}
                  disabled={isLoading || isSubmitting}
                  fullWidth
                  placeholder={
                    translations.transactions.form.descriptionPlaceholder
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Description />
                      </InputAdornment>
                    ),
                  }}
                />{' '}
                {/* Category */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {' '}
                  <FormControl fullWidth error={!!errors.categoryId}>
                    <InputLabel>
                      {translations.transactions.form.category}
                    </InputLabel>
                    <Select
                      value={formData.categoryId}
                      label={translations.transactions.form.category}
                      onChange={e =>
                        handleInputChange('categoryId', e.target.value)
                      }
                      disabled={isLoading || isSubmitting || categoriesLoading}
                      startAdornment={
                        <InputAdornment position="start">
                          <Label />
                        </InputAdornment>
                      }
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 300,
                          },
                        },
                      }}
                    >
                      <MenuItem value="">
                        <em>{translations.transactions.form.selectCategory}</em>
                      </MenuItem>{' '}
                      {categories?.map(category => (
                        <MenuItem
                          key={category.categoryId}
                          value={category.categoryId}
                          sx={{ py: 0.5, minHeight: 36 }}
                        >
                          <Typography variant="body2">
                            {category.name}
                          </Typography>
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.categoryId && (
                      <FormHelperText>{errors.categoryId}</FormHelperText>
                    )}
                  </FormControl>
                  {/* Selected Category Icon - positioned outside to the right */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      ml: 1,
                      flexShrink: 0,
                    }}
                  >
                    {formData.categoryId &&
                      categories?.find(
                        cat => cat.categoryId === formData.categoryId
                      ) && (
                        <CategoryIcon
                          categoryName={
                            categories.find(
                              cat => cat.categoryId === formData.categoryId
                            )?.name || ''
                          }
                          size={24}
                          withWrapper={true}
                          useColorScheme={true}
                        />
                      )}
                  </Box>
                </Box>
                {/* Wallet */}{' '}
                <FormControl fullWidth error={!!errors.walletId}>
                  <InputLabel>
                    {translations.transactions.form.wallet}
                  </InputLabel>
                  <Select
                    value={formData.walletId}
                    label={translations.transactions.form.wallet}
                    onChange={e =>
                      handleInputChange('walletId', e.target.value)
                    }
                    disabled={isLoading || isSubmitting || walletsLoading}
                    startAdornment={
                      <InputAdornment position="start">
                        <AccountBalanceWallet />
                      </InputAdornment>
                    }
                  >
                    {' '}
                    <MenuItem value="">
                      <em>{translations.transactions.form.selectWallet}</em>
                    </MenuItem>
                    {wallets?.map((wallet: any) => (
                      <MenuItem key={wallet.walletId} value={wallet.walletId}>
                        <Box>
                          <Typography variant="body2">
                            {wallet.walletName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            <WalletBalance balance={wallet.balance} />
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.walletId && (
                    <FormHelperText>{errors.walletId}</FormHelperText>
                  )}
                </FormControl>
                {/* Date and Time */}{' '}
                <DateTimePicker
                  label={translations.transactions.form.dateTime}
                  value={transactionDate}
                  onChange={handleDateChange}
                  disabled={isLoading || isSubmitting}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.transactionDate,
                      helperText: errors.transactionDate,
                    },
                  }}
                />
              </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
              {' '}
              <Button
                type="button"
                onClick={onCancel}
                variant="secondary"
                disabled={isLoading || isSubmitting}
              >
                {translations.common.cancel}
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={
                  isLoading ||
                  isSubmitting ||
                  categoriesLoading ||
                  walletsLoading
                }
              >
                {isSubmitting
                  ? translations.common.loading
                  : isLoading
                    ? translations.common.loading
                    : initialData
                      ? translations.common.update
                      : translations.common.create}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </LocalizationProvider>
    );
  }
);

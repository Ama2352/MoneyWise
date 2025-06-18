/**
 * Example component demonstrating the currency module usage
 * This can serve as a reference for developers
 */

import React, { useState } from 'react';
import {
  useCurrency,
  useCurrencyWithConversion,
  useExchangeRate,
} from '../../hooks';
import { Button } from '../ui';
import type { CurrencyCode } from '../../types';
import { formatAmountWithSign } from '../../utils/formatUtils';

export const CurrencyExample: React.FC = () => {
  const [amount, setAmount] = useState<number>(100);
  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>('usd');
  const [toCurrency, setToCurrency] = useState<CurrencyCode>('vnd');

  // Basic currency hook
  const {
    formatCurrency,
    getSupportedCurrencies,
    clearCache,
    getCacheStats,
    isLoading,
    error,
  } = useCurrency();

  // Auto-conversion hook
  const { conversion, refreshConversion } = useCurrencyWithConversion(
    amount,
    fromCurrency,
    toCurrency
  );

  // Live exchange rate hook (updates every 5 minutes)
  const { exchangeRate, refresh: refreshRate } = useExchangeRate(
    fromCurrency,
    toCurrency,
    5 * 60 * 1000
  );

  const supportedCurrencies = getSupportedCurrencies();
  const cacheStats = getCacheStats();

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="currency-example p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Currency Module Demo</h2>

      {/* Currency Input Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Currency Conversion</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              From Currency
            </label>
            <select
              value={fromCurrency}
              onChange={e => setFromCurrency(e.target.value as CurrencyCode)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {supportedCurrencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.name} ({currency.symbol})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              To Currency
            </label>
            <select
              value={toCurrency}
              onChange={e => setToCurrency(e.target.value as CurrencyCode)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {supportedCurrencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.name} ({currency.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-2 mb-4">
          <Button onClick={handleSwapCurrencies} variant="secondary">
            ⇄ Swap Currencies
          </Button>
          <Button onClick={refreshConversion} disabled={isLoading}>
            🔄 Refresh Conversion
          </Button>
        </div>

        {/* Conversion Result */}
        {conversion && (
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-semibold mb-2">Conversion Result</h4>
            <p className="text-lg">
              <span className="font-medium">
                {formatCurrency(conversion.amount, conversion.fromCurrency)}
              </span>
              {' = '}
              <span className="font-bold text-green-600">
                {formatCurrency(
                  conversion.convertedAmount,
                  conversion.toCurrency
                )}
              </span>
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Exchange Rate: 1 {conversion.fromCurrency.toUpperCase()} ={' '}
              {conversion.exchangeRate.toFixed(6)}{' '}
              {conversion.toCurrency.toUpperCase()}
            </p>
            <p className="text-xs text-gray-500">
              Last updated: {new Date(conversion.timestamp).toLocaleString()}
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            Error: {error}
          </div>
        )}
      </div>

      {/* Exchange Rate Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Live Exchange Rate</h3>

        {exchangeRate ? (
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-lg font-medium">
              1 {exchangeRate.from.toUpperCase()} ={' '}
              {exchangeRate.rate.toFixed(6)} {exchangeRate.to.toUpperCase()}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Last updated:{' '}
              {new Date(exchangeRate.lastUpdated).toLocaleString()}
            </p>{' '}
            <Button onClick={refreshRate} className="mt-2">
              Refresh Rate
            </Button>
          </div>
        ) : (
          <p className="text-gray-500">Loading exchange rate...</p>
        )}
      </div>

      {/* Formatting Examples */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Formatting Examples</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">USD Formatting</h4>
            <ul className="space-y-1 text-sm">
              <li>{formatCurrency(1234.56, 'usd')}</li>
              <li>{formatCurrency(0.99, 'usd')}</li>
              <li>{formatCurrency(1000000, 'usd')}</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">VND Formatting</h4>
            <ul className="space-y-1 text-sm">
              <li>{formatCurrency(25000, 'vnd')}</li>
              <li>{formatCurrency(1500000, 'vnd')}</li>
              <li>{formatCurrency(50000000, 'vnd')}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Amount with Sign Testing */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Amount with Sign Testing</h3>
        <p className="text-sm text-gray-600 mb-4">
          Testing the new formatAmountWithSign function that adds + for income
          and - for expense
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* USD Examples */}
          <div className="space-y-4">
            <h4 className="font-medium text-green-700">USD Examples</h4>

            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">
                Income (+ sign)
              </h5>
              <ul className="space-y-1 text-sm">
                <li className="text-green-600 font-mono">
                  {formatAmountWithSign(1234.56, 'USD', 'income')}
                </li>
                <li className="text-green-600 font-mono">
                  {formatAmountWithSign(500, 'USD', 'INCOME')}
                </li>
                <li className="text-green-600 font-mono">
                  {formatAmountWithSign(75.99, 'USD', 'Income')}
                </li>
              </ul>
            </div>

            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">
                Expense (- sign)
              </h5>
              <ul className="space-y-1 text-sm">
                <li className="text-red-600 font-mono">
                  {formatAmountWithSign(1234.56, 'USD', 'expense')}
                </li>
                <li className="text-red-600 font-mono">
                  {formatAmountWithSign(500, 'USD', 'EXPENSE')}
                </li>
                <li className="text-red-600 font-mono">
                  {formatAmountWithSign(75.99, 'USD', 'Expense')}
                </li>
              </ul>
            </div>
          </div>

          {/* VND Examples */}
          <div className="space-y-4">
            <h4 className="font-medium text-green-700">VND Examples</h4>

            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">
                Income (+ sign)
              </h5>
              <ul className="space-y-1 text-sm">
                <li className="text-green-600 font-mono">
                  {formatAmountWithSign(25000, 'VND', 'income')}
                </li>
                <li className="text-green-600 font-mono">
                  {formatAmountWithSign(1500000, 'VND', 'INCOME')}
                </li>
                <li className="text-green-600 font-mono">
                  {formatAmountWithSign(50000000, 'VND', 'Income')}
                </li>
              </ul>
            </div>

            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">
                Expense (- sign)
              </h5>
              <ul className="space-y-1 text-sm">
                <li className="text-red-600 font-mono">
                  {formatAmountWithSign(25000, 'VND', 'expense')}
                </li>
                <li className="text-red-600 font-mono">
                  {formatAmountWithSign(1500000, 'VND', 'EXPENSE')}
                </li>
                <li className="text-red-600 font-mono">
                  {formatAmountWithSign(50000000, 'VND', 'Expense')}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Special Cases */}
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h4 className="font-medium mb-3">Special Cases</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="font-medium text-gray-700 mb-2">
                Negative amounts (sign based on type)
              </h5>
              <ul className="space-y-1 font-mono">
                <li className="text-green-600">
                  {formatAmountWithSign(-100, 'USD', 'income')} (was -100)
                </li>
                <li className="text-red-600">
                  {formatAmountWithSign(-100, 'USD', 'expense')} (was -100)
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-gray-700 mb-2">
                Invalid types (defaults to expense)
              </h5>
              <ul className="space-y-1 font-mono">
                <li className="text-red-600">
                  {formatAmountWithSign(100, 'USD', 'invalid')} (invalid type)
                </li>
                <li className="text-red-600">
                  {formatAmountWithSign(100, 'USD', '')} (empty type)
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Interactive Test */}
        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <h4 className="font-medium mb-3">Interactive Test</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Test Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Currency</label>
              <select
                value={fromCurrency}
                onChange={e => setFromCurrency(e.target.value as CurrencyCode)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
              >
                <option value="usd">USD</option>
                <option value="vnd">VND</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                id="transactionType"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  const typeSelect = document.getElementById(
                    'transactionType'
                  ) as HTMLSelectElement;
                  const type = typeSelect.value;
                  const result = formatAmountWithSign(
                    amount,
                    fromCurrency,
                    type
                  );
                  alert(`Result: ${result}`);
                }}
                className="w-full px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Test Format
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <strong>Current Result:</strong>
            <span className="ml-2 font-mono text-lg">
              {formatAmountWithSign(amount, fromCurrency, 'income')} (income) |{' '}
              {formatAmountWithSign(amount, fromCurrency, 'expense')} (expense)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

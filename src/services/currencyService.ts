/**
 * Currency service for business logic
 * Handles currency conversion, caching, and formatting
 */

import { exchangeRateApi } from '../api/exchangeRateApi';
import { CURRENCY_INFO, EXCHANGE_API } from '../constants';
import type {
  CurrencyCode,
  CurrencyConversion,
  ConversionRequest,
  ExchangeRate,
} from '../types';

interface CacheEntry {
  rate: number;
  timestamp: number;
}

class CurrencyService {
  private cache = new Map<string, CacheEntry>();

  /**
   * Convert amount between currencies
   */
  async convertCurrency(
    request: ConversionRequest
  ): Promise<CurrencyConversion> {
    const { amount, from, to } = request;

    // Validate inputs
    this.validateCurrencyCode(from);
    this.validateCurrencyCode(to);
    this.validateAmount(amount);

    // Get exchange rate (with caching)
    const exchangeRate = await this.getExchangeRateWithCache(from, to);

    // Calculate converted amount
    const convertedAmount = this.calculateConversion(amount, exchangeRate);

    return {
      amount,
      fromCurrency: from,
      toCurrency: to,
      convertedAmount,
      exchangeRate,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get exchange rate with caching
   */
  async getExchangeRateWithCache(
    from: CurrencyCode,
    to: CurrencyCode
  ): Promise<number> {
    const cacheKey = `${from}-${to}`;
    const cachedEntry = this.cache.get(cacheKey);

    // Check if cache is valid
    if (cachedEntry && this.isCacheValid(cachedEntry.timestamp)) {
      return cachedEntry.rate;
    }

    // Fetch new rate
    const rate = await exchangeRateApi.getExchangeRate(from, to);

    // Cache the result
    this.cache.set(cacheKey, {
      rate,
      timestamp: Date.now(),
    });

    return rate;
  }

  /**
   * Get current exchange rate without conversion
   */
  async getExchangeRate(
    from: CurrencyCode,
    to: CurrencyCode
  ): Promise<ExchangeRate> {
    const rate = await this.getExchangeRateWithCache(from, to);

    return {
      from,
      to,
      rate,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Format currency amount with proper locale and symbol
   */
  formatCurrency(amount: number, currency: CurrencyCode): string {
    const currencyInfo = CURRENCY_INFO[currency];

    try {
      return new Intl.NumberFormat(currencyInfo.locale, {
        style: 'currency',
        currency: currency.toUpperCase(),
        minimumFractionDigits: currency === 'vnd' ? 0 : 2,
        maximumFractionDigits: currency === 'vnd' ? 0 : 2,
      }).format(amount);
    } catch (error) {
      // Fallback formatting if Intl fails
      const symbol = currencyInfo.symbol;
      const formattedAmount =
        currency === 'vnd'
          ? Math.round(amount).toLocaleString()
          : amount.toFixed(2);

      return currency === 'vnd'
        ? `${formattedAmount}${symbol}`
        : `${symbol}${formattedAmount}`;
    }
  }

  /**
   * Get currency information
   */
  getCurrencyInfo(currency: CurrencyCode) {
    return CURRENCY_INFO[currency];
  }

  /**
   * Get all supported currencies
   */
  getSupportedCurrencies() {
    return Object.values(CURRENCY_INFO);
  }

  /**
   * Clear exchange rate cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics (for debugging)
   */
  getCacheStats() {
    const entries = Array.from(this.cache.entries());
    return {
      totalEntries: entries.length,
      validEntries: entries.filter(([, entry]) =>
        this.isCacheValid(entry.timestamp)
      ).length,
      oldestEntry:
        entries.length > 0
          ? Math.min(...entries.map(([, entry]) => entry.timestamp))
          : null,
    };
  }

  // Private helper methods

  private validateCurrencyCode(currency: CurrencyCode): void {
    if (!CURRENCY_INFO[currency]) {
      throw new Error(`Unsupported currency: ${currency}`);
    }
  }

  private validateAmount(amount: number): void {
    if (!Number.isFinite(amount) || amount < 0) {
      throw new Error('Amount must be a positive finite number');
    }
  }

  private calculateConversion(amount: number, rate: number): number {
    const result = amount * rate;

    // Round to appropriate decimal places based on currency
    return Math.round((result + Number.EPSILON) * 100) / 100;
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < EXCHANGE_API.CACHE_DURATION;
  }
}

export const currencyService = new CurrencyService();

/**
 * Exchange rate API functions
 * Handles communication with the fawazahmed0/exchange-api
 */

import { EXCHANGE_API, CURRENCIES } from '../constants';
import type { CurrencyCode, CurrencyApiResponse } from '../types';

class ExchangeRateApi {
  private primaryBaseUrl = EXCHANGE_API.PRIMARY_BASE_URL;
  private fallbackBaseUrl = EXCHANGE_API.FALLBACK_BASE_URL;

  /**
   * Get exchange rates for a base currency with fallback mechanism
   */
  async getExchangeRates(
    baseCurrency: CurrencyCode
  ): Promise<CurrencyApiResponse> {
    const endpoint = `/currencies/${baseCurrency}.min.json`;

    try {
      // Try primary URL first
      const response = await this.fetchFromUrl(this.primaryBaseUrl + endpoint);
      return this.extractRatesFromResponse(response, baseCurrency);
    } catch (primaryError) {
      console.warn(
        'Primary exchange API failed, trying fallback:',
        primaryError
      );

      try {
        // Try fallback URL
        const response = await this.fetchFromUrl(
          this.fallbackBaseUrl + endpoint
        );
        return this.extractRatesFromResponse(response, baseCurrency);
      } catch (fallbackError) {
        console.error('Both exchange APIs failed:', fallbackError);
        throw new Error('Exchange rate service unavailable');
      }
    }
  }

  /**
   * Get specific exchange rate between two currencies
   */
  async getExchangeRate(from: CurrencyCode, to: CurrencyCode): Promise<number> {
    if (from === to) {
      return 1;
    }

    const rates = await this.getExchangeRates(from);
    const rate = rates[to];

    if (rate === undefined) {
      throw new Error(
        `Exchange rate not found for ${from.toUpperCase()} to ${to.toUpperCase()}`
      );
    }

    return rate;
  }

  /**
   * Fetch data from a URL with proper error handling
   */
  private async fetchFromUrl(url: string): Promise<any> {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      // Add timeout
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Extract rates from API response, handling different response formats
   */
  private extractRatesFromResponse(
    response: any,
    baseCurrency: CurrencyCode
  ): CurrencyApiResponse {
    // The API returns: { date: "2024-01-01", currency: { targetCurrency: rate } }
    if (response[baseCurrency]) {
      return response[baseCurrency];
    }

    // If direct currency property doesn't exist, try to find rates in the response
    const keys = Object.keys(response);
    for (const key of keys) {
      if (key !== 'date' && typeof response[key] === 'object') {
        return response[key];
      }
    }

    throw new Error('Invalid exchange rate response format');
  }

  /**
   * Check if a currency code is supported
   */
  isSupportedCurrency(currency: string): currency is CurrencyCode {
    return Object.values(CURRENCIES).includes(currency as CurrencyCode);
  }
}

export const exchangeRateApi = new ExchangeRateApi();

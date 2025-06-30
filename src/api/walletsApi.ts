/**
 * Wallets API - CRUD operations for wallets
 */

import httpClient from './httpClient';
import type {
  WalletDTO,
  CreateWalletRequest,
  UpdateWalletRequest,
} from '../types/wallet';

class WalletsApi {
  // Get all wallets for current user
  async getAllWallets(acceptLanguage?: string): Promise<WalletDTO[]> {
    try {
      const response = await httpClient.get<WalletDTO[]>('/Wallets', {
        headers: {
          'Accept-Language': acceptLanguage || 'en',
        },
      });
      console.log('💳 Wallets Response:', response.data);
      return response.data || [];
    } catch (error) {
      console.error('❌ Wallets Error:', error);
      throw new Error('Failed to fetch wallets');
    }
  }

  // Get wallet by ID
  async getWalletById(walletId: string): Promise<WalletDTO> {
    try {
      const response = await httpClient.get<WalletDTO>(`/Wallets/${walletId}`);
      console.log('💳 Wallet Details Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Wallet Details Error:', error);
      throw new Error('Failed to fetch wallet details');
    }
  }

  // Create new wallet
  async createWallet(data: CreateWalletRequest): Promise<WalletDTO> {
    try {
      const response = await httpClient.post<WalletDTO>('/Wallets', data);
      console.log('✅ Create Wallet Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Create Wallet Error:', error);
      throw new Error('Failed to create wallet');
    }
  }

  // Update wallet
  async updateWallet(data: UpdateWalletRequest): Promise<WalletDTO> {
    try {
      const response = await httpClient.put<WalletDTO>('/Wallets', data);
      console.log('✅ Update Wallet Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Update Wallet Error:', error);
      throw new Error('Failed to update wallet');
    }
  }

  // Delete wallet
  async deleteWallet(walletId: string): Promise<string> {
    try {
      const response = await httpClient.delete<string>(`/Wallets/${walletId}`);
      console.log('✅ Delete Wallet Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Delete Wallet Error:', error);
      throw new Error('Failed to delete wallet');
    }
  }
}

export const walletsApi = new WalletsApi();

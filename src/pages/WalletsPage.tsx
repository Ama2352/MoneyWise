/**
 * Wallets Page - Modern wallet management with CRUD operations
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  Plus,
  Wallet as WalletIcon,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { useWallets, useWalletMutations } from '../hooks/useFinanceData';
import { useLanguageContext } from '../contexts/LanguageContext';
import { WalletCard } from '../components/ui/WalletCard';
import { WalletForm } from '../components/forms/WalletForm';
import { ConfirmDialog, Loading } from '../components/ui';
import Button from '../components/ui/Button';
import { CurrencyAmount } from '../components/ui/CurrencyAmount';
import type { Wallet, CreateWalletRequest, UpdateWalletRequest } from '../types/finance';
import './WalletsPage.css';

const WalletsPage: React.FC = () => {
  const { translations } = useLanguageContext();

  // Data fetching
  const { wallets, isLoading, error, refresh } = useWallets();
  const { createWallet, updateWallet, deleteWallet } = useWalletMutations();

  // Local state
  const [showForm, setShowForm] = useState(false);
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    walletId?: string;
    walletName?: string;
  }>({ show: false });
  const [formLoading, setFormLoading] = useState(false);

  // Calculate totals
  const { totalBalance, positiveWallets, negativeWallets } = useMemo(() => {
    if (!wallets || wallets.length === 0) {
      return { totalBalance: 0, positiveWallets: 0, negativeWallets: 0 };
    }

    let total = 0;
    let positive = 0;
    let negative = 0;

    wallets.forEach(wallet => {
      total += wallet.balance;
      if (wallet.balance >= 0) {
        positive++;
      } else {
        negative++;
      }
    });

    return {
      totalBalance: total,
      positiveWallets: positive,
      negativeWallets: negative,
    };
  }, [wallets]);

  // Handlers
  const handleCreateWallet = useCallback(() => {
    setEditingWallet(null);
    setShowForm(true);
  }, []);

  const handleEditWallet = useCallback((wallet: Wallet) => {
    setEditingWallet(wallet);
    setShowForm(true);
  }, []);

  const handleDeleteWallet = useCallback((wallet: Wallet) => {
    setDeleteConfirm({
      show: true,
      walletId: wallet.walletId,
      walletName: wallet.walletName,
    });
  }, []);

  const handleFormSubmit = useCallback(
    async (data: CreateWalletRequest | UpdateWalletRequest) => {
      setFormLoading(true);
      
      try {
        const result = editingWallet
          ? await updateWallet(data as UpdateWalletRequest)
          : await createWallet(data as CreateWalletRequest);

        if (result.success) {
          setShowForm(false);
          setEditingWallet(null);
          await refresh(); // Refresh the wallet list
        }
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setFormLoading(false);
      }
    },
    [editingWallet, createWallet, updateWallet, refresh]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteConfirm.walletId) return;

    const result = await deleteWallet(deleteConfirm.walletId);
    
    if (result.success) {
      setDeleteConfirm({ show: false });
      await refresh(); // Refresh the wallet list
    }
  }, [deleteConfirm.walletId, deleteWallet, refresh]);

  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    setEditingWallet(null);
  }, []);

  const handleRefresh = useCallback(async () => {
    await refresh();
  }, [refresh]);

  // Loading state
  if (isLoading && (!wallets || wallets.length === 0)) {
    return (
      <div className="wallets-page">
        <div className="wallets-page-loading">
          <Loading />
          <p>Loading wallets...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && (!wallets || wallets.length === 0)) {
    return (
      <div className="wallets-page">
        <div className="wallets-page-error">
          <div className="wallets-page-error-icon">
            <AlertTriangle size={48} />
          </div>
          <h2>Failed to Load Wallets</h2>
          <p>{error}</p>
          <Button onClick={handleRefresh} variant="primary">
            <RefreshCw size={16} />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="wallets-page">
      {/* Header */}
      <div className="wallets-page-header">
        <div className="wallets-page-title-section">
          <h1 className="wallets-page-title">
            Wallets
          </h1>
          <p className="wallets-page-subtitle">
            Manage your accounts and track balances across all your wallets
          </p>
        </div>
        
        <div className="wallets-page-actions">
          <Button 
            onClick={handleRefresh}
            variant="secondary"
            size="sm"
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </Button>
          <Button onClick={handleCreateWallet} variant="primary">
            <Plus size={18} />
            {translations.common.add} Wallet
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="wallets-page-summary">
        <div className="wallets-summary-card wallets-summary-card--primary">
          <div className="wallets-summary-icon">
            <WalletIcon size={24} />
          </div>
          <div className="wallets-summary-content">
            <h3>Total Balance</h3>
            <p className="wallets-summary-amount">
              <CurrencyAmount amountInVnd={totalBalance} />
            </p>
            <span className="wallets-summary-meta">
              {wallets?.length || 0} {wallets?.length === 1 ? 'wallet' : 'wallets'}
            </span>
          </div>
        </div>

        <div className="wallets-summary-card wallets-summary-card--success">
          <div className="wallets-summary-icon">
            <TrendingUp size={24} />
          </div>
          <div className="wallets-summary-content">
            <h3>Positive Balances</h3>
            <p className="wallets-summary-count">{positiveWallets}</p>
            <span className="wallets-summary-meta">wallets with positive balance</span>
          </div>
        </div>

        <div className="wallets-summary-card wallets-summary-card--warning">
          <div className="wallets-summary-icon">
            <TrendingDown size={24} />
          </div>
          <div className="wallets-summary-content">
            <h3>Negative Balances</h3>
            <p className="wallets-summary-count">{negativeWallets}</p>
            <span className="wallets-summary-meta">wallets with negative balance</span>
          </div>
        </div>
      </div>

      {/* Wallets Grid */}
      <div className="wallets-page-content">
        {wallets && wallets.length > 0 ? (
          <div className="wallets-grid">
            {wallets.map(wallet => (
              <WalletCard
                key={wallet.walletId}
                wallet={wallet}
                onEdit={handleEditWallet}
                onDelete={handleDeleteWallet}
              />
            ))}
          </div>
        ) : (
          <div className="wallets-page-empty">
            <div className="wallets-page-empty-icon">
              <WalletIcon size={64} />
            </div>
            <h3>No Wallets Yet</h3>
            <p>Create your first wallet to start managing your finances</p>
            <Button onClick={handleCreateWallet} variant="primary">
              <Plus size={18} />
              Create Wallet
            </Button>
          </div>
        )}
      </div>

      {/* Wallet Form Modal */}
      <WalletForm
        wallet={editingWallet}
        isOpen={showForm}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        isLoading={formLoading}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.show}
        title="Delete Wallet"
        message={`Are you sure you want to delete "${deleteConfirm.walletName}"? This action cannot be undone.`}
        confirmText={translations.common.delete}
        cancelText={translations.common.cancel}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm({ show: false })}
      />
    </div>
  );
};

export default WalletsPage;

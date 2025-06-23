import React, { useState, useEffect } from 'react';
import {
  Plus,
  CreditCard,
  PiggyBank,
  Banknote,
  TrendingUp,
  MoreHorizontal,
  Edit2,
  Trash2,
  X,
  Save,
  Loader,
  AlertCircle,
} from 'lucide-react';
import { walletApi } from '../api/walletApi';
import { useToastContext } from '../contexts';
import type { Wallet, CreateWalletRequest, UpdateWalletRequest, WalletWithMetadata } from '../types/wallet';
import '../styles/pages.css';
import '../styles/wallets.css';
import '../styles/animations.css';
import '../styles/modals.css';
import '../styles/effects.css';

const WalletsPage: React.FC = () => {
  // State management
  const [wallets, setWallets] = useState<WalletWithMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);
  const [deletingWalletId, setDeletingWalletId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [walletToDelete, setWalletToDelete] = useState<Wallet | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<CreateWalletRequest>({
    walletName: '',
    balance: 0,
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showSuccess, showError } = useToastContext();

  // Wallet type configurations for better UI
  const walletTypes = [
    { id: 'personal', name: 'Personal', icon: Banknote, color: 'var(--primary-500)' },
    { id: 'savings', name: 'Savings', icon: PiggyBank, color: 'var(--success-500)' },
    { id: 'business', name: 'Business', icon: CreditCard, color: 'var(--warning-500)' },
  ];

  // Load wallets from backend
  const loadWallets = async () => {
    try {
      setIsLoading(true);
      const walletsData = await walletApi.getAll();
      
      // Enhance with UI metadata
      const enhancedWallets: WalletWithMetadata[] = walletsData.map((wallet, index) => ({
        ...wallet,
        type: ['personal', 'savings', 'business'][index % 3] as any,
        color: walletTypes[index % 3].color,
        lastActivity: `${Math.floor(Math.random() * 24)} hours ago`,
        isDefault: index === 0,
      }));
      
      setWallets(enhancedWallets);
    } catch (error) {
      showError('Failed to load wallets. Please try again.');
      console.error('Error loading wallets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create new wallet
  const handleCreateWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      const newWallet = await walletApi.create(formData);
      
      // Add to local state with metadata
      const enhancedWallet: WalletWithMetadata = {
        ...newWallet,
        type: 'personal',
        color: walletTypes[0].color,
        lastActivity: 'Just now',
        isDefault: wallets.length === 0,
      };
      
      setWallets(prev => [...prev, enhancedWallet]);
      setShowCreateModal(false);
      resetForm();
      showSuccess('Wallet created successfully!');
    } catch (error) {
      showError('Failed to create wallet. Please try again.');
      console.error('Error creating wallet:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update existing wallet
  const handleUpdateWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingWallet || !validateForm()) return;
    
    try {
      setIsSubmitting(true);
      const updateData: UpdateWalletRequest = {
        walletId: editingWallet.walletId,
        walletName: formData.walletName,
        balance: formData.balance,
      };
      
      const updatedWallet = await walletApi.update(updateData);
      
      setWallets(prev => prev.map(wallet => 
        wallet.walletId === editingWallet.walletId 
          ? { ...wallet, ...updatedWallet, lastActivity: 'Just now' }
          : wallet
      ));
      
      setEditingWallet(null);
      resetForm();
      showSuccess('Wallet updated successfully!');
    } catch (error) {
      showError('Failed to update wallet. Please try again.');
      console.error('Error updating wallet:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show delete confirmation
  const showDeleteConfirmation = (wallet: Wallet) => {
    setWalletToDelete(wallet);
    setShowDeleteConfirm(true);
  };

  // Delete wallet
  const handleDeleteWallet = async () => {
    if (!walletToDelete) return;
    
    try {
      setDeletingWalletId(walletToDelete.walletId);
      await walletApi.delete(walletToDelete.walletId);
      
      setWallets(prev => prev.filter(wallet => wallet.walletId !== walletToDelete.walletId));
      showSuccess('Wallet deleted successfully!');
      setShowDeleteConfirm(false);
      setWalletToDelete(null);
    } catch (error) {
      showError('Failed to delete wallet. Please try again.');
      console.error('Error deleting wallet:', error);
    } finally {
      setDeletingWalletId(null);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setWalletToDelete(null);
  };

  // Form validation
  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.walletName.trim()) {
      errors.walletName = 'Wallet name is required';
    } else if (formData.walletName.length < 3) {
      errors.walletName = 'Wallet name must be at least 3 characters';
    }
    
    if (isNaN(formData.balance)) {
      errors.balance = 'Please enter a valid amount';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form helpers
  const resetForm = () => {
    setFormData({ walletName: '', balance: 0 });
    setFormErrors({});
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (wallet: Wallet) => {
    setFormData({
      walletName: wallet.walletName,
      balance: wallet.balance,
    });
    setEditingWallet(wallet);
    setFormErrors({});
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setEditingWallet(null);
    resetForm();
  };

  // Calculate totals
  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
  const totalAssets = wallets.filter(w => w.balance > 0).reduce((sum, w) => sum + w.balance, 0);
  const totalLiabilities = Math.abs(wallets.filter(w => w.balance < 0).reduce((sum, w) => sum + w.balance, 0));

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatCurrencyInput = (amount: number): string => {
    return Math.abs(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Load wallets on component mount
  useEffect(() => {
    loadWallets();
  }, []);

  if (isLoading) {
    return (
      <div className="page-container">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '400px',
          flexDirection: 'column',
          gap: 'var(--space-4)'
        }}>
          <Loader size={40} className="animate-spin" style={{ color: 'var(--primary-500)' }} />
          <p style={{ color: 'var(--gray-600)' }}>Loading your wallets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container page-background">
      {/* Floating background elements */}
      <div className="floating-shapes">
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
      </div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">💳 Wallet Management</h1>
          <p className="page-subtitle">
            Manage your financial accounts and track balances in real-time
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn--primary hover-lift ripple" onClick={openCreateModal}>
            <Plus size={18} />
            Add New Wallet
          </button>
        </div>
      </div>

      <div className="page-content">
        {/* Wallets Grid */}
        <div className="wallets-grid">
          {wallets.map((wallet, index) => {
            const walletType = walletTypes.find(t => t.id === wallet.type) || walletTypes[0];
            const Icon = walletType.icon;
            const isDeleting = deletingWalletId === wallet.walletId;
            
            return (
              <div 
                key={wallet.walletId} 
                className="wallet-card stagger-item hover-lift click-feedback"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="wallet-header">
                  <div
                    className="wallet-icon"
                    style={{ backgroundColor: wallet.color || walletType.color }}
                  >
                    <Icon size={24} color="white" />
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button 
                      className="wallet-menu hover-scale ripple"
                      onClick={() => openEditModal(wallet)}
                      title="Edit wallet"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      className="wallet-menu hover-scale ripple"
                      onClick={() => showDeleteConfirmation(wallet)}
                      disabled={isDeleting}
                      title="Delete wallet"
                      style={{ color: isDeleting ? 'var(--gray-400)' : 'var(--error-500)' }}
                    >
                      {isDeleting ? <Loader size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    </button>
                  </div>
                </div>

                <div className="wallet-content">
                  <h3 className="wallet-name">
                    {wallet.walletName}
                    {wallet.isDefault && (
                      <span style={{ 
                        fontSize: '0.75rem', 
                        background: 'var(--primary-100)', 
                        color: 'var(--primary-700)',
                        padding: '2px 6px',
                        borderRadius: 'var(--radius-sm)',
                        marginLeft: 'var(--space-2)'
                      }}>
                        Default
                      </span>
                    )}
                  </h3>
                  <p className="wallet-bank">{walletType.name} Wallet</p>

                  <div
                    className={`wallet-balance ${wallet.balance < 0 ? 'wallet-balance--negative' : ''}`}
                  >
                    {formatCurrency(wallet.balance)}
                  </div>

                  <div className="wallet-meta">
                    <span className="wallet-type">{walletType.name}</span>
                    <span className="wallet-activity">
                      Last activity: {wallet.lastActivity}
                    </span>
                  </div>
                </div>

                <div className="wallet-actions">
                  <button className="wallet-action-btn hover-glow ripple">
                    <TrendingUp size={16} />
                    View Transactions
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {wallets.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: 'var(--space-16)',
            background: 'var(--white)',
            borderRadius: 'var(--radius-xl)',
            border: '2px dashed var(--gray-200)'
          }}>
            <CreditCard size={48} style={{ color: 'var(--gray-400)', marginBottom: 'var(--space-4)' }} />
            <h3 style={{ color: 'var(--gray-700)', marginBottom: 'var(--space-2)' }}>No wallets yet</h3>
            <p style={{ color: 'var(--gray-500)', marginBottom: 'var(--space-6)' }}>
              Create your first wallet to start managing your finances
            </p>
            <button className="btn btn--primary hover-lift animate-pulse ripple" onClick={openCreateModal}>
              <Plus size={18} />
              Create Your First Wallet
            </button>
          </div>
        )}

        {/* Summary Cards */}
        {wallets.length > 0 && (
          <div className="summary-cards">
            <div className="summary-card animate-fadeInUp hover-lift">
              <h3>Total Assets</h3>
              <div className="summary-value positive">{formatCurrency(totalAssets)}</div>
              <div className="summary-change">
                <TrendingUp size={16} />
                {wallets.filter(w => w.balance > 0).length} positive accounts
              </div>
            </div>

            <div className="summary-card animate-fadeInUp hover-lift" style={{ animationDelay: '0.1s' }}>
              <h3>Total Liabilities</h3>
              <div className="summary-value negative">{formatCurrency(totalLiabilities)}</div>
              <div className="summary-change">
                <AlertCircle size={16} />
                {wallets.filter(w => w.balance < 0).length} negative accounts
              </div>
            </div>

            <div className="summary-card animate-fadeInUp hover-lift" style={{ animationDelay: '0.2s' }}>
              <h3>Net Worth</h3>
              <div className={`summary-value ${totalBalance >= 0 ? 'positive' : 'negative'}`}>
                {formatCurrency(totalBalance)}
              </div>
              <div className="summary-change">
                <TrendingUp size={16} />
                {wallets.length} total wallets
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingWallet) && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-container animate-scaleIn" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="modal-header">
              <h2 className="modal-title">
                {editingWallet ? '✏️ Edit Wallet' : '➕ Create New Wallet'}
              </h2>
              <button className="modal-close hover-scale" onClick={closeModals}>
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={editingWallet ? handleUpdateWallet : handleCreateWallet}>
              <div className="form-group">
                <label className="form-label">
                  Wallet Name
                </label>
                <input
                  type="text"
                  value={formData.walletName}
                  onChange={e => setFormData(prev => ({ ...prev, walletName: e.target.value }))}
                  placeholder="Enter wallet name (e.g., Personal Wallet, Savings)"
                  className={`form-input ${formErrors.walletName ? 'error' : ''}`}
                />
                {formErrors.walletName && (
                  <div className="form-error">
                    {formErrors.walletName}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Initial Balance (USD)
                </label>
                <input
                  type="number"
                  step="1000"
                  value={formData.balance}
                  onChange={e => setFormData(prev => ({ ...prev, balance: parseFloat(e.target.value) || 0 }))}
                  placeholder="0"
                  className={`form-input ${formErrors.balance ? 'error' : ''}`}
                />
                {formErrors.balance && (
                  <div className="form-error">
                    {formErrors.balance}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="form-actions">
                <button
                  type="button"
                  onClick={closeModals}
                  className="btn-secondary hover-lift ripple"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary hover-lift ripple"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      {editingWallet ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      {editingWallet ? 'Update Wallet' : 'Create Wallet'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && walletToDelete && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="modal-container animate-scaleIn" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="modal-header">
              <h2 className="modal-title" style={{ color: 'var(--error-600)' }}>
                ⚠️ Delete Wallet
              </h2>
              <button className="modal-close hover-scale" onClick={cancelDelete}>
                <X size={20} />
              </button>
            </div>

            {/* Warning Content */}
            <div style={{ textAlign: 'center', padding: 'var(--space-4) 0' }}>
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(248, 113, 113, 0.05))',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-6)',
                  marginBottom: 'var(--space-4)',
                  border: '1px solid rgba(239, 68, 68, 0.2)'
                }}
              >
                <AlertCircle size={48} style={{ color: 'var(--error-500)', marginBottom: 'var(--space-3)' }} />
                <h3 style={{ color: 'var(--gray-900)', marginBottom: 'var(--space-2)' }}>
                  Are you sure you want to delete this wallet?
                </h3>
                <p style={{ color: 'var(--gray-600)', marginBottom: 'var(--space-4)' }}>
                  <strong>"{walletToDelete.walletName}"</strong> with balance{' '}
                  <strong style={{ color: walletToDelete.balance >= 0 ? 'var(--success-600)' : 'var(--error-600)' }}>
                    {formatCurrency(walletToDelete.balance)}
                  </strong>
                </p>
                <p style={{ color: 'var(--error-600)', fontSize: '0.875rem', fontWeight: 'var(--font-weight-medium)' }}>
                  This action cannot be undone!
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="form-actions">
              <button
                type="button"
                onClick={cancelDelete}
                className="btn-secondary hover-lift ripple"
                disabled={!!deletingWalletId}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteWallet}
                className="btn-primary hover-lift ripple"
                disabled={!!deletingWalletId}
                style={{
                  background: 'linear-gradient(135deg, var(--error-500), var(--error-600))',
                  borderColor: 'var(--error-500)'
                }}
              >
                {deletingWalletId === walletToDelete.walletId ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete Wallet
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && walletToDelete && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="modal-container animate-scaleIn" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="modal-header">
              <h2 className="modal-title" style={{ color: 'var(--error-600)' }}>
                ⚠️ Delete Wallet
              </h2>
              <button className="modal-close hover-scale" onClick={cancelDelete}>
                <X size={20} />
              </button>
            </div>

            {/* Warning Content */}
            <div style={{ textAlign: 'center', padding: 'var(--space-4) 0' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(248, 113, 113, 0.05))',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-4)',
                border: '3px solid rgba(239, 68, 68, 0.2)'
              }}>
                <AlertCircle size={40} style={{ color: 'var(--error-500)' }} />
              </div>
              
              <h3 style={{ 
                color: 'var(--gray-900)', 
                marginBottom: 'var(--space-2)',
                fontSize: '1.25rem',
                fontWeight: 'var(--font-weight-bold)'
              }}>
                Are you sure you want to delete this wallet?
              </h3>
              
              <div style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(248, 250, 252, 0.6))',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-4)',
                margin: 'var(--space-4) 0',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                  <CreditCard size={20} style={{ color: 'var(--primary-500)' }} />
                  <strong style={{ color: 'var(--gray-900)' }}>{walletToDelete.walletName}</strong>
                </div>
                <div style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                  Current Balance: <strong style={{ color: walletToDelete.balance >= 0 ? 'var(--success-600)' : 'var(--error-600)' }}>
                    {formatCurrency(walletToDelete.balance)}
                  </strong>
                </div>
              </div>

              <p style={{ 
                color: 'var(--gray-600)', 
                fontSize: '0.875rem',
                lineHeight: '1.5',
                marginBottom: 'var(--space-6)'
              }}>
                This action cannot be undone. All transaction history and data associated with this wallet will be permanently deleted.
              </p>
            </div>

            {/* Actions */}
            <div className="form-actions">
              <button
                type="button"
                onClick={cancelDelete}
                className="btn-secondary hover-lift ripple"
                disabled={!!deletingWalletId}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteWallet}
                className="btn-primary hover-lift ripple"
                disabled={!!deletingWalletId}
                style={{
                  background: 'linear-gradient(135deg, var(--error-500), var(--error-600))',
                  borderColor: 'var(--error-500)'
                }}
              >
                {deletingWalletId ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete Wallet
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletsPage;

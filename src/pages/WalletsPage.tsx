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
import { useTranslations } from '../hooks';
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
  const { translations: t, language } = useTranslations();
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
    { id: 'personal', name: t.wallets.cash, icon: Banknote, color: 'var(--primary-500)' },
    { id: 'savings', name: t.wallets.savings, icon: PiggyBank, color: 'var(--success-500)' },
    { id: 'business', name: t.wallets.checking, icon: CreditCard, color: 'var(--warning-500)' },
  ];

  // Hàm format thời gian hoạt động gần nhất
  function formatRelativeTime(hours: number) {
    if (language === 'vi') {
      if (hours === 0) return 'Vừa xong';
      if (hours < 24) return `${hours} giờ trước`;
      const days = Math.floor(hours / 24);
      return days === 1 ? '1 ngày trước' : `${days} ngày trước`;
    } else {
      if (hours === 0) return 'Just now';
      if (hours < 24) return `${hours} hours ago`;
      const days = Math.floor(hours / 24);
      return days === 1 ? '1 day ago' : `${days} days ago`;
    }
  }

  // Load wallets from backend
  const loadWallets = async () => {
    try {
      setIsLoading(true);
      const walletsData = await walletApi.getAll();
      
      // Enhance with UI metadata
      const enhancedWallets: WalletWithMetadata[] = walletsData.map((wallet, index) => {
        const hours = Math.floor(Math.random() * 24);
        return {
          ...wallet,
          type: ['personal', 'savings', 'business'][index % 3] as any,
          color: walletTypes[index % 3].color,
          lastActivity: formatRelativeTime(hours),
          isDefault: index === 0,
        };
      });
      
      setWallets(enhancedWallets);
    } catch (error) {
      showError(t.wallets.deleteError);
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
      showSuccess(t.wallets.createSuccess);
    } catch (error) {
      showError(t.wallets.createError);
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
      showSuccess(t.wallets.updateSuccess);
    } catch (error) {
      showError(t.wallets.updateError);
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
      showSuccess(t.wallets.deleteSuccess);
      setShowDeleteConfirm(false);
      setWalletToDelete(null);
    } catch (error) {
      showError(t.wallets.deleteError);
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
      errors.walletName = t.wallets.nameRequired;
    } else if (formData.walletName.length < 3) {
      errors.walletName = t.validation.minLength;
    }
    
    if (isNaN(formData.balance)) {
      errors.balance = t.validation.amountInvalid;
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
          <p style={{ color: 'var(--gray-600)' }}>{t.common.loading}</p>
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
          <h1 className="page-title">💳 {t.wallets.title}</h1>
          <p className="page-subtitle">
            {t.wallets.subtitle}
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn--primary hover-lift ripple" onClick={openCreateModal}>
            <Plus size={18} />
{t.wallets.addWallet}
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
                        {t.wallets.default}
                      </span>
                    )}
                  </h3>
                  <p className="wallet-bank">{`Ví ${walletType.name.toLowerCase()}`}</p>

                  <div
                    className={`wallet-balance ${wallet.balance < 0 ? 'wallet-balance--negative' : ''}`}
                  >
                    {formatCurrency(wallet.balance)}
                  </div>

                  <div className="wallet-meta">
                    <span className="wallet-type">{walletType.name}</span>
                    <span className="wallet-activity">
                      {t.wallets.lastActivity}: {wallet.lastActivity}
                    </span>
                  </div>
                </div>

                <div className="wallet-actions">
                  <button className="wallet-action-btn hover-glow ripple">
                    <TrendingUp size={16} />
                    {t.wallets.viewTransactions}
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
            <h3 style={{ color: 'var(--gray-700)', marginBottom: 'var(--space-2)' }}>{t.wallets.noWallets}</h3>
            <p style={{ color: 'var(--gray-500)', marginBottom: 'var(--space-6)' }}>
              {t.wallets.noWalletsDescription}
            </p>
            <button className="btn btn--primary hover-lift animate-pulse ripple" onClick={openCreateModal}>
              <Plus size={18} />
{t.wallets.createFirstWallet}
            </button>
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
{editingWallet ? `✏️ ${t.wallets.editWallet}` : `➕ ${t.wallets.createWallet}`}
              </h2>
              <button className="modal-close hover-scale" onClick={closeModals}>
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={editingWallet ? handleUpdateWallet : handleCreateWallet}>
              <div className="form-group">
                <label className="form-label">
                  {t.wallets.walletName}
                </label>
                <input
                  type="text"
                  value={formData.walletName}
                  onChange={e => setFormData(prev => ({ ...prev, walletName: e.target.value }))}
                  placeholder={t.wallets.walletNamePlaceholder}
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
                  {t.wallets.initialBalance}
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
{t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="btn-primary hover-lift ripple"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader size={16} className="animate-spin" />
{editingWallet ? t.wallets.updating : t.wallets.creating}
                    </>
                  ) : (
                    <>
                      <Save size={16} />
{editingWallet ? t.wallets.update : t.wallets.create}
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
                ⚠️ {t.wallets.deleteWallet}
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
                  {t.wallets.deleteConfirmMessage}
                </h3>
                <p style={{ color: 'var(--gray-600)', marginBottom: 'var(--space-4)' }}>
                  <strong>"{walletToDelete.walletName}"</strong> {t.wallets.currentBalance} <strong style={{ color: walletToDelete.balance >= 0 ? 'var(--success-600)' : 'var(--error-600)' }}>{formatCurrency(walletToDelete.balance)}</strong>
                </p>
                <p style={{ color: 'var(--error-600)', fontSize: '0.875rem', fontWeight: 'var(--font-weight-medium)' }}>
                  {t.wallets.deleteWarning}
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
                {t.common.cancel}
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
                    {t.wallets.deleting}
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    {t.wallets.deleteWalletBtn}
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

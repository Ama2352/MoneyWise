import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import './ConfirmDialog.css';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return (
          <AlertTriangle className="confirm-dialog__icon confirm-dialog__icon--danger" />
        );
      case 'warning':
        return (
          <AlertTriangle className="confirm-dialog__icon confirm-dialog__icon--warning" />
        );
      default:
        return (
          <AlertTriangle className="confirm-dialog__icon confirm-dialog__icon--info" />
        );
    }
  };

  return (
    <div className="confirm-dialog__overlay" onClick={handleBackdropClick}>
      <div className="confirm-dialog">
        <div className="confirm-dialog__header">
          <div className="confirm-dialog__title-section">
            {getIcon()}
            <h3 className="confirm-dialog__title">{title}</h3>
          </div>
          <button
            className="confirm-dialog__close"
            onClick={onCancel}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <div className="confirm-dialog__body">
          <p className="confirm-dialog__message">{message}</p>
        </div>

        <div className="confirm-dialog__footer">
          <button
            className="confirm-dialog__button confirm-dialog__button--cancel"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className={`confirm-dialog__button confirm-dialog__button--confirm confirm-dialog__button--${type}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  className = '',
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={`create-category-dialog ${className}`}
      onClick={e => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="dialog-content">
        <div className="dialog-header">
          <div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button className="dialog-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="dialog-body">{children}</div>
      </div>
    </div>
  );
};

import React from 'react';
import { CategoryForm } from './CategoryForm';
import { useTranslations } from '../../hooks';
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../../types';
import './CategoryModal.css';

interface CategoryModalProps {
  isOpen: boolean;
  category?: Category;
  onClose: () => void;
  onSubmit: (data: CreateCategoryRequest | UpdateCategoryRequest) => Promise<void>;
  loading?: boolean;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  category,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const { t } = useTranslations();

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async (data: CreateCategoryRequest | UpdateCategoryRequest) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <div className="category-modal" onClick={handleBackdropClick}>
      <div className="category-modal__content">
        <CategoryForm
          category={category}
          onSubmit={handleSubmit}
          onCancel={onClose}
          loading={loading}
        />
      </div>
    </div>
  );
};

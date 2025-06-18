import React, { useState } from 'react';
import { CategoryList, CategoryModal } from '../components/category';
import { useCategory, useTranslations } from '../hooks';
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../types';
import './CategoryPage.css';

export const CategoryPage: React.FC = () => {
  const { t } = useTranslations();
  const {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    refetch
  } = useCategory();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);
  const [modalLoading, setModalLoading] = useState(false);

  const handleAdd = () => {
    setEditingCategory(undefined);
    setModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  const handleDelete = async (categoryId: string) => {
    await deleteCategory(categoryId);
  };

  const handleModalSubmit = async (data: CreateCategoryRequest | UpdateCategoryRequest) => {
    setModalLoading(true);
    try {
      if ('categoryID' in data) {
        // Update existing category
        await updateCategory(data as UpdateCategoryRequest);
      } else {
        // Create new category
        await createCategory(data as CreateCategoryRequest);
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingCategory(undefined);
    setModalLoading(false);
  };

  if (error) {
    return (
      <div className="category-page">
        <div className="category-page__error">
          <h2>{t('common.error', 'Error')}</h2>
          <p>{error}</p>
          <button onClick={refetch} className="category-page__retry-btn">
            {t('common.retry', 'Try Again')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="category-page">
      <CategoryList
        categories={categories}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CategoryModal
        isOpen={modalOpen}
        category={editingCategory}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        loading={modalLoading}
      />
    </div>
  );
};

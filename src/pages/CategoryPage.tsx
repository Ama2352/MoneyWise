import React, { useState } from 'react';
import { CategoryList, CategoryModal } from '../components/category';
import { useCategory, useTranslations, useAuthentication } from '../hooks';
import Layout from '../components/layout/Layout';
import Header from '../components/layout/Header';
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../types';
import './CategoryPage.css';

export const CategoryPage: React.FC = () => {
  const { t } = useTranslations();
  const { userProfile, logout } = useAuthentication();
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

  const handleLogout = () => {
    logout(true);
  };
  if (error) {
    return (
      <Layout
        header={
          <Header
            title={t('category.title', 'Categories')}
            userName={userProfile?.firstName}
            onLogout={handleLogout}
          />
        }
      >
        <div className="category-page">
          <div className="category-page__error">
            <h2>{t('common.error', 'Error')}</h2>
            <p>{error}</p>
            <button onClick={refetch} className="category-page__retry-btn">
              {t('common.retry', 'Try Again')}
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      header={
        <Header
          title={t('category.title', 'Categories')}
          userName={userProfile?.firstName}
          onLogout={handleLogout}
        />
      }
    >
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
    </Layout>
  );
};

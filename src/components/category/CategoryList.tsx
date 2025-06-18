import React, { useState } from 'react';
import { Button, Card, Loading, ConfirmationModal } from '../ui';
import { useTranslations } from '../../hooks';
import { formatDate } from '../../utils';
import type { Category } from '../../types';
import './CategoryList.css';

interface CategoryListProps {
  categories: Category[];
  loading?: boolean;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
  onAdd: () => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  loading = false,
  onEdit,
  onDelete,
  onAdd,
}) => {
  const { t } = useTranslations();
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    category: Category | null;
    loading: boolean;
  }>({
    isOpen: false,
    category: null,
    loading: false,
  });

  if (loading) {
    return (      <div className="category-list__loading">
        <Loading />
        <p>{t('category.loading', 'Loading categories...')}</p>
      </div>
    );
  }

  const handleDeleteClick = (category: Category) => {
    setConfirmDelete({
      isOpen: true,
      category,
      loading: false,
    });
  };
  const handleDeleteConfirm = async () => {
    if (!confirmDelete.category) return;
    
    console.log('🎯 [CategoryList] Delete confirm clicked');
    console.log('📤 [CategoryList] Deleting category:', confirmDelete.category);
    
    setConfirmDelete(prev => ({ ...prev, loading: true }));
    
    try {
      await onDelete(confirmDelete.category.categoryId);
      console.log('✅ [CategoryList] Delete successful');
      setConfirmDelete({ isOpen: false, category: null, loading: false });
    } catch (error) {
      console.error('❌ [CategoryList] Delete error:', error);
      setConfirmDelete(prev => ({ ...prev, loading: false }));
    }
  };

  const handleDeleteCancel = () => {
    setConfirmDelete({ isOpen: false, category: null, loading: false });
  };

  return (
    <div className="category-list">
      <div className="category-list__header">
        <h2 className="category-list__title">
          {t('category.title', 'Categories')}
        </h2>
        <Button
          variant="primary"
          onClick={onAdd}
          className="category-list__add-btn"
        >
          {t('category.add', 'Add Category')}
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="category-list__empty">
          <div className="category-list__empty-content">
            <h3>{t('category.noCategories', 'No Categories Found')}</h3>
            <p>{t('category.noCategoriesDesc', 'Start by creating your first category to organize your transactions.')}</p>
            <Button
              variant="primary"
              onClick={onAdd}
            >
              {t('category.createFirst', 'Create First Category')}
            </Button>
          </div>
        </div>
      ) : (        <div className="category-list__grid">
          {categories.map((category) => {
            return (
              <Card key={category.categoryId} className="category-card">
                <div className="category-card__content">
                  <div className="category-card__main">
                    <h3 className="category-card__name">{category.name}</h3>
                    <div className="category-card__meta">
                      <span className="category-card__date">
                        {t('common.createdAt', 'Created:')} {formatDate(category.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="category-card__actions">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onEdit(category)}
                    >
                      {t('common.edit', 'Edit')}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteClick(category)}
                    >
                      {t('common.delete', 'Delete')}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <ConfirmationModal
        isOpen={confirmDelete.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title={t('category.deleteTitle', 'Delete Category')}
        message={t('category.deleteMessage', 'This action cannot be undone. All transactions associated with this category will no longer be categorized.')}
        confirmText={t('common.delete', 'Delete')}
        cancelText={t('common.cancel', 'Cancel')}
        type="danger"
        loading={confirmDelete.loading}
      />
    </div>
  );
};

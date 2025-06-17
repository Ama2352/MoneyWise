import React from 'react';
import { Button, Card, Loading } from '../ui';
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

  if (loading) {
    return (
      <div className="category-list__loading">
        <Loading message={t('category.loading', 'Loading categories...')} />
      </div>
    );
  }

  const handleDelete = (category: Category) => {
    if (window.confirm(t('category.deleteConfirm', 'Are you sure you want to delete this category?'))) {
      onDelete(category.categoryID);
    }
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
      ) : (
        <div className="category-list__grid">
          {categories.map((category) => (
            <Card key={category.categoryID} className="category-card">
              <div className="category-card__content">
                <div className="category-card__main">
                  <h3 className="category-card__name">{category.name}</h3>
                  <p className="category-card__date">
                    {t('common.createdAt', 'Created:')} {formatDate(category.createdAt)}
                  </p>
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
                    onClick={() => handleDelete(category)}
                  >
                    {t('common.delete', 'Delete')}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

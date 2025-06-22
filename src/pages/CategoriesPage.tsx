/**
 * Categories Management Page
 * Clean and simple category management interface
 */

import React, { useState } from 'react';
import { useCategories, useCategoryMutations, useCategoryIcon } from '../hooks';
import { useLanguageContext, useToastContext } from '../contexts';
import {
  Card,
  Button,
  Input,
  Loading,
  CategoryIcon,
  ConfirmDialog,
} from '../components/ui';
import { formatDateForLanguage } from '../utils/dateUtils';
import '../styles/pages.css';
import './CategoriesPage.css';

export const CategoriesPage: React.FC = () => {
  const { categories, isLoading, error, refresh } = useCategories();
  const { createCategory, updateCategory, deleteCategory } =
    useCategoryMutations();
  const { suggestions } = useCategoryIcon();
  const { translations, language } = useLanguageContext();
  const { showSuccess, showError } = useToastContext();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '' });
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    categoryId: string;
    categoryName: string;
  }>({
    isOpen: false,
    categoryId: '',
    categoryName: '',
  });
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsCreating(true);
    const result = await createCategory({ name: formData.name.trim() });
    if (result.success) {
      setFormData({ name: '' });
      setShowCreateDialog(false); // Close dialog on success
      showSuccess(translations.categories.notifications.categoryCreated);
      // SWR automatically refreshes the list
    } else {
      showError(
        `${translations.categories.notifications.createError}: ${result.error}`
      );
    }
    setIsCreating(false);
  };

  const handleUpdate = async (categoryId: string, name: string) => {
    if (!name.trim()) return;

    const result = await updateCategory({
      categoryId,
      name: name.trim(),
    });
    if (result.success) {
      setEditingId(null);
      showSuccess(translations.categories.notifications.categoryUpdated);
      // SWR automatically refreshes the data
    } else {
      showError(
        `${translations.categories.notifications.updateError}: ${result.error}`
      );
    }
  };

  const handleDelete = (categoryId: string, categoryName: string) => {
    setConfirmDialog({
      isOpen: true,
      categoryId,
      categoryName,
    });
  };

  const handleConfirmDelete = async () => {
    const { categoryId } = confirmDialog;

    // Validate categoryId before sending
    if (
      !categoryId ||
      categoryId === 'undefined' ||
      categoryId === 'null' ||
      categoryId === 'NaN'
    ) {
      showError(translations.categories.invalidCategoryId);
      setConfirmDialog({ isOpen: false, categoryId: '', categoryName: '' });
      return;
    }

    const result = await deleteCategory(categoryId);
    if (result.success) {
      showSuccess(translations.categories.notifications.categoryDeleted);
      // SWR automatically refreshes the list
    } else {
      showError(
        `${translations.categories.notifications.deleteError}: ${result.error}`
      );
    }

    setConfirmDialog({ isOpen: false, categoryId: '', categoryName: '' });
  };

  const handleCancelDelete = () => {
    setConfirmDialog({ isOpen: false, categoryId: '', categoryName: '' });
  };

  if (isLoading) return <Loading />;

  if (error) {
    return (
      <div className="categories-page">
        {' '}
        <Card>
          <div className="error-state">
            {' '}
            <h3>{translations.categories.errorLoad}</h3>
            <p>{error.message}</p>
            <Button onClick={refresh}>{translations.categories.retry}</Button>
          </div>
        </Card>
      </div>
    );
  }
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          {' '}
          <h1 className="page-title">{translations.categories.title}</h1>
          <p className="page-subtitle">{translations.categories.subtitle}</p>
        </div>
        <div className="page-actions">
          <button
            className="btn btn--primary"
            onClick={() => setShowCreateDialog(true)}
          >
            {translations.categories.addNewCategory}
          </button>
        </div>
      </div>{' '}
      {/* Create Category Dialog */}
      {showCreateDialog && (
        <div
          className="create-category-dialog"
          onClick={e => {
            if (e.target === e.currentTarget) {
              setShowCreateDialog(false);
              setFormData({ name: '' });
            }
          }}
        >
          <div className="dialog-content">
            <div className="dialog-header">
              <div>
                {' '}
                <h2>{translations.categories.addNewCategory}</h2>
                <p>{translations.categories.createDescription}</p>
              </div>
              <button
                className="dialog-close"
                onClick={() => {
                  setShowCreateDialog(false);
                  setFormData({ name: '' });
                }}
              >
                ✕
              </button>
            </div>

            <div className="dialog-body">
              <form onSubmit={handleCreate} className="dialog-form">
                {/* Icon Examples */}
                <div className="icon-examples">
                  <p className="examples-title">
                    {translations.categories.examplesTitle}
                  </p>{' '}
                  <div className="example-tags">
                    {suggestions.map(({ translationKey }) => {
                      // Parse the translation key path (e.g., 'categories.suggestions.foodDining')
                      const keyParts = translationKey.split('.');
                      let translatedName = translationKey; // fallback

                      // Navigate the nested translation object
                      if (
                        keyParts.length === 3 &&
                        keyParts[0] === 'categories' &&
                        keyParts[1] === 'suggestions'
                      ) {
                        const suggestionKey =
                          keyParts[2] as keyof typeof translations.categories.suggestions;
                        translatedName =
                          translations.categories.suggestions[suggestionKey] ||
                          translationKey;
                      }

                      return (
                        <span
                          key={translationKey}
                          className="example-tag"
                          onClick={() => setFormData({ name: translatedName })}
                        >
                          {translatedName}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div className="input-group">
                  <Input
                    type="text"
                    placeholder={
                      translations.categories.categoryNamePlaceholder
                    }
                    value={formData.name}
                    onChange={value => setFormData({ name: value })}
                    disabled={isCreating}
                    label={translations.categories.categoryName}
                  />
                </div>{' '}
                <div className="form-bottom">
                  {formData.name.trim() && (
                    <div className="icon-preview">
                      <CategoryIcon
                        categoryName={formData.name}
                        size={24}
                        className="preview-icon"
                        withWrapper={true}
                        useColorScheme={true}
                        wrapperClassName="preview-icon-wrapper"
                      />
                      <span className="preview-text">
                        {translations.categories.iconPreview}
                      </span>
                    </div>
                  )}
                  <div className="form-actions">
                    <Button
                      type="submit"
                      disabled={isCreating || !formData.name.trim()}
                      className="primary-btn"
                    >
                      {isCreating
                        ? translations.categories.creating
                        : translations.categories.createButton}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}{' '}
      {/* Categories List Section */}
      <div className="page-content">
        <div className="card">
          <div className="card-header">
            <div>
              {' '}
              <h2>{translations.categories.yourCategories}</h2>
              <p className="category-count">
                {categories?.length || 0}{' '}
                {categories?.length === 1
                  ? translations.categories.categoryCount
                  : translations.categories.categoriesCount}
              </p>
            </div>
            <button onClick={refresh} className="btn btn--secondary">
              {translations.categories.refresh}
            </button>
          </div>

          {categories && categories.length > 0 ? (
            <div className="categories-grid">
              {categories.map(category => (
                <CategoryCard
                  key={category.categoryId}
                  category={category}
                  isEditing={editingId === category.categoryId}
                  onEdit={() => setEditingId(category.categoryId)}
                  onCancelEdit={() => setEditingId(null)}
                  onUpdate={name => handleUpdate(category.categoryId, name)}
                  onDelete={() =>
                    handleDelete(category.categoryId, category.name)
                  }
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📁</div>{' '}
              <h3>{translations.categories.noCategoriesTitle}</h3>{' '}
              <p>{translations.categories.noCategoriesDescription}</p>
            </div>
          )}
        </div>
      </div>
      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={translations.categories.confirmDelete.title}
        message={`${translations.categories.confirmDelete.message} "${confirmDialog.categoryName}"`}
        confirmText={translations.categories.confirmDelete.confirm}
        cancelText={translations.categories.confirmDelete.cancel}
        type="danger"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

interface CategoryCardProps {
  category: { categoryId: string; name: string; createdAt: string };
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onUpdate: (name: string) => void;
  onDelete: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isEditing,
  onEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
}) => {
  const [editName, setEditName] = useState(category.name);
  const { translations, language } = useLanguageContext();

  const handleSave = () => {
    onUpdate(editName);
  };

  const handleCancel = () => {
    setEditName(category.name);
    onCancelEdit();
  };
  const formatDate = (dateString: string) => {
    return formatDateForLanguage(dateString, language);
  };

  return (
    <div className="category-card">
      <div className="category-content">
        {isEditing ? (
          <div className="edit-mode">
            {' '}
            <Input
              value={editName}
              onChange={value => setEditName(value)}
              placeholder={translations.categories.categoryName}
            />
            <div className="edit-actions">
              {' '}
              <Button
                onClick={handleSave}
                disabled={!editName.trim()}
                className="save-btn"
              >
                {' '}
                {translations.categories.save}
              </Button>
              <Button onClick={handleCancel} className="cancel-btn">
                {translations.categories.cancel}
              </Button>
            </div>
          </div>
        ) : (
          <div className="view-mode">
            {' '}
            <div className="category-header">
              <CategoryIcon
                categoryName={category.name}
                size={28}
                className="category-icon"
                withWrapper={true}
                useColorScheme={true}
              />
              <div className="category-info">
                <h3 className="category-name">{category.name}</h3>{' '}
                <p className="category-date">
                  {translations.categories.createdOn}{' '}
                  {formatDate(category.createdAt)}
                </p>
              </div>
            </div>{' '}
            <div className="category-actions">
              <Button onClick={onEdit} className="edit-btn">
                {' '}
                {translations.categories.edit}
              </Button>
              <Button onClick={onDelete} className="delete-btn">
                {translations.categories.delete}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Categories Management Page
 * Clean and simple category management interface
 */

import React, { useState } from 'react';
import {
  useCategories,
  useCategoryMutations,
  useCategoryIcon,
  useDateFormatter,
  useCrudOperations,
} from '../hooks';
import { useLanguageContext } from '../contexts';
import { PageLayout } from '../components/layout/PageLayout';
import { Modal } from '../components/ui/Modal';
import { Button, Input, CategoryIcon, ConfirmDialog } from '../components/ui';
import '../styles/pages.css';
import './CategoriesPage.css';

export const CategoriesPage: React.FC = () => {
  const { categories, isLoading, error, refresh } = useCategories();
  const { createCategory, updateCategory, deleteCategory } =
    useCategoryMutations();
  const { suggestions } = useCategoryIcon();
  const { translations } = useLanguageContext();

  // Use CRUD operations hook for consistent error handling
  const {
    handleCreate: crudCreate, // means: crudCreate = handleCreate from the hook
    handleUpdate: crudUpdate,
    handleDelete: crudDelete,
  } = useCrudOperations(
    {
      create: createCategory,
      update: updateCategory,
      delete: deleteCategory,
    },
    {
      createSuccess: translations.categories.notifications.categoryCreated,
      createError: translations.categories.notifications.createError,
      updateSuccess: translations.categories.notifications.categoryUpdated,
      updateError: translations.categories.notifications.updateError,
      deleteSuccess: translations.categories.notifications.categoryDeleted,
      deleteError: translations.categories.notifications.deleteError,
    },
    refresh
  );

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
    const result = await crudCreate({ name: formData.name.trim() });
    if (result.success) {
      setFormData({ name: '' });
      setShowCreateDialog(false);
    }
    setIsCreating(false);
  };

  const handleUpdate = async (categoryId: string, name: string) => {
    if (!name.trim()) return;
    const result = await crudUpdate({ categoryId, name: name.trim() });
    if (result.success) {
      setEditingId(null);
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
    if (
      !categoryId ||
      categoryId === 'undefined' ||
      categoryId === 'null' ||
      categoryId === 'NaN'
    ) {
      setConfirmDialog({ isOpen: false, categoryId: '', categoryName: '' });
      return;
    }

    await crudDelete(categoryId);
    setConfirmDialog({ isOpen: false, categoryId: '', categoryName: '' });
  };

  const handleCancelDelete = () => {
    setConfirmDialog({ isOpen: false, categoryId: '', categoryName: '' });
  };

  return (
    <PageLayout
      title={translations.categories.title}
      subtitle={translations.categories.subtitle}
      isLoading={isLoading}
      error={error}
      onRetry={refresh}
      action={
        <button
          className="btn btn--primary"
          onClick={() => setShowCreateDialog(true)}
        >
          {translations.categories.addNewCategory}
        </button>
      }
    >
      {/* Categories List Section */}
      <div className="card">
        <div className="card-header">
          <div>
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
            <div className="empty-icon">📁</div>
            <h3>{translations.categories.noCategoriesTitle}</h3>
            <p>{translations.categories.noCategoriesDescription}</p>
          </div>
        )}
      </div>

      {/* Create Category Dialog */}
      <Modal
        isOpen={showCreateDialog}
        onClose={() => {
          setShowCreateDialog(false);
          setFormData({ name: '' });
        }}
        title={translations.categories.addNewCategory}
        subtitle={translations.categories.createDescription}
      >
        <form onSubmit={handleCreate} className="dialog-form">
          {/* Icon Examples */}
          <div className="icon-examples">
            <p className="examples-title">
              {translations.categories.examplesTitle}
            </p>
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
              placeholder={translations.categories.categoryNamePlaceholder}
              value={formData.name}
              onChange={value => setFormData({ name: value })}
              disabled={isCreating}
              label={translations.categories.categoryName}
            />
          </div>

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
      </Modal>

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
    </PageLayout>
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
  const { translations } = useLanguageContext();
  const { formatDate } = useDateFormatter();

  const handleSave = () => {
    onUpdate(editName);
  };

  const handleCancel = () => {
    setEditName(category.name);
    onCancelEdit();
  };

  return (
    <div className="category-card">
      <div className="category-content">
        {isEditing ? (
          <div className="edit-mode">
            <Input
              value={editName}
              onChange={value => setEditName(value)}
              placeholder={translations.categories.categoryName}
            />
            <div className="edit-actions">
              <Button
                onClick={handleSave}
                disabled={!editName.trim()}
                className="save-btn"
              >
                {translations.categories.save}
              </Button>
              <Button onClick={handleCancel} className="cancel-btn">
                {translations.categories.cancel}
              </Button>
            </div>
          </div>
        ) : (
          <div className="view-mode">
            <div className="category-header">
              <CategoryIcon
                categoryName={category.name}
                size={28}
                className="category-icon"
                withWrapper={true}
                useColorScheme={true}
              />
              <div className="category-info">
                <h3 className="category-name">{category.name}</h3>
                <p className="category-date">
                  {translations.categories.createdOn}{' '}
                  {formatDate(category.createdAt)}
                </p>
              </div>
            </div>
            <div className="category-actions">
              <Button onClick={onEdit} className="edit-btn">
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

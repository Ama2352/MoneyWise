import React, { useState, useEffect } from 'react';
import { Button } from '../ui';
import { useTranslations } from '../../hooks';
import { getIconForCategory, getColorForCategory } from '../../utils';
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../../types';
import './CategoryForm.css';

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: CreateCategoryRequest | UpdateCategoryRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  onSubmit,
  onCancel,
  loading = false,
}) => {  const { t } = useTranslations();
  const [formData, setFormData] = useState({
    name: category?.name || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
      });
    }
  }, [category]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('validation.required', 'This field is required');
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t('validation.minLength', 'Name must be at least 2 characters');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🎯 [CategoryForm] Form submitted');
    console.log('📤 [CategoryForm] Form data:', formData);
    console.log('📤 [CategoryForm] Is editing:', !!category);
    
    if (!validateForm()) {
      console.log('❌ [CategoryForm] Validation failed');
      return;
    }

    try {
      if (category) {
        // Update existing category
        const updateData: UpdateCategoryRequest = {
          categoryId: category.categoryId,
          name: formData.name.trim(),
        };
        console.log('📤 [CategoryForm] Update data:', updateData);
        await onSubmit(updateData);
      } else {
        // Create new category
        const createData: CreateCategoryRequest = {
          name: formData.name.trim(),
        };
        console.log('📤 [CategoryForm] Create data:', createData);
        await onSubmit(createData);
      }
      console.log('✅ [CategoryForm] Submit successful');
    } catch (error) {
      console.error('❌ [CategoryForm] Form submission error:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };
  return (
    <div className="category-form-container">
      <form onSubmit={handleSubmit} className="category-form">
        <div className="category-form__header">
          <h2 className="category-form__title">
            {category ? t('category.edit', 'Edit Category') : t('category.create', 'Create Category')}
          </h2>
          <p className="category-form__subtitle">
            {category 
              ? t('category.editDescription', 'Update your category information')
              : t('category.createDescription', 'Create a new category to organize your transactions')
            }
          </p>
        </div>

        <div className="category-form__content">
          {/* Preview Section */}
          <div className="category-form__preview">
            <div className="category-preview">
              <div 
                className="category-preview__icon"
                style={{ 
                  backgroundColor: getColorForCategory(formData.name),
                  color: 'white'
                }}
              >
                {(() => {
                  const IconComponent = getIconForCategory(formData.name);
                  return <IconComponent size={32} />;
                })()}
              </div>
              <div className="category-preview__info">
                <h3 className="category-preview__name">
                  {formData.name || t('category.namePlaceholder', 'Enter category name')}
                </h3>
                <p className="category-preview__description">
                  {t('category.previewDescription', 'This is how your category will appear')}
                </p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="category-form__fields">
            <div className="category-form__field">
              <label htmlFor="category-name" className="category-form__label">
                {t('category.name', 'Category Name')}
                <span className="category-form__required">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  id="category-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={t('category.namePlaceholder', 'Enter category name')}
                  className={`category-form__input ${errors.name ? 'error' : ''}`}
                  required
                  disabled={loading}
                />
                {errors.name && (
                  <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {errors.name}
                  </div>
                )}
              </div>
              <div className="category-form__hint">
                {t('category.nameHint', 'Icon and color will be automatically assigned based on the name')}
              </div>
            </div>
          </div>
        </div>

        <div className="category-form__actions">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
            className="category-form__cancel-btn"
          >
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading || !formData.name.trim()}
            className="category-form__submit-btn"
          >
            {loading ? (
              <>
                <span className="loading-spinner">⏳</span>
                {category ? t('common.updating', 'Updating...') : t('common.creating', 'Creating...')}
              </>
            ) : (
              <>
                <span className="submit-icon">
                  {category ? '✏️' : '✨'}
                </span>
                {category ? t('common.update', 'Update') : t('common.create', 'Create')}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

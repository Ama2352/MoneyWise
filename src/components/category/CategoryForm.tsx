import React, { useState, useEffect } from 'react';
import { Button, Input } from '../ui';
import { useTranslations } from '../../hooks';
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
}) => {
  const { t } = useTranslations();
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
    
    if (!validateForm()) {
      return;
    }

    try {
      if (category) {
        // Update existing category
        const updateData: UpdateCategoryRequest = {
          categoryID: category.categoryID,
          name: formData.name.trim(),
        };
        await onSubmit(updateData);
      } else {
        // Create new category
        const createData: CreateCategoryRequest = {
          name: formData.name.trim(),
        };
        await onSubmit(createData);
      }
    } catch (error) {
      console.error('Form submission error:', error);
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
    <form onSubmit={handleSubmit} className="category-form">
      <div className="category-form__header">
        <h2 className="category-form__title">
          {category ? t('category.edit', 'Edit Category') : t('category.create', 'Create Category')}
        </h2>
      </div>

      <div className="category-form__content">
        <div className="category-form__field">
          <Input
            label={t('category.name', 'Category Name')}
            type="text"
            value={formData.name}
            onChange={(value) => handleInputChange('name', value)}
            error={errors.name}
            placeholder={t('category.namePlaceholder', 'Enter category name')}
            required
            disabled={loading}
          />
        </div>
      </div>

      <div className="category-form__actions">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          {t('common.cancel', 'Cancel')}
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={loading}
        >
          {category ? t('common.update', 'Update') : t('common.create', 'Create')}
        </Button>
      </div>
    </form>
  );
};

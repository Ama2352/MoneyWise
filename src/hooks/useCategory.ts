import { useState, useEffect } from 'react';
import { categoryApi } from '../api';
import { useToast } from './useToast';
import { useTranslations } from './useLanguage';
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../types';

export interface UseCategoryReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  createCategory: (category: CreateCategoryRequest) => Promise<Category | null>;
  updateCategory: (category: UpdateCategoryRequest) => Promise<Category | null>;
  deleteCategory: (categoryId: string) => Promise<boolean>;
  getCategoryById: (categoryId: string) => Promise<Category | null>;
  refetch: () => Promise<void>;
}

export const useCategory = (): UseCategoryReturn => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const { language } = useTranslations();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoryApi.getAll(language);
      setCategories(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (category: CreateCategoryRequest): Promise<Category | null> => {
    try {
      setLoading(true);
      setError(null);
      const newCategory = await categoryApi.create(category);
      setCategories((prev: Category[]) => [...prev, newCategory]);
      showToast('Category created successfully', 'success');
      return newCategory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create category';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (category: UpdateCategoryRequest): Promise<Category | null> => {
    try {
      setLoading(true);
      setError(null);
      const updatedCategory = await categoryApi.update(category);
      setCategories((prev: Category[]) => 
        prev.map((cat: Category) => 
          cat.categoryID === category.categoryID ? updatedCategory : cat
        )
      );
      showToast('Category updated successfully', 'success');
      return updatedCategory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update category';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (categoryId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await categoryApi.delete(categoryId);
      setCategories((prev: Category[]) => prev.filter((cat: Category) => cat.categoryID !== categoryId));
      showToast('Category deleted successfully', 'success');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete category';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getCategoryById = async (categoryId: string): Promise<Category | null> => {
    try {
      setLoading(true);
      setError(null);
      const category = await categoryApi.getById(categoryId);
      return category;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get category';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchCategories();
  };

  useEffect(() => {
    fetchCategories();
  }, [language]);

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    refetch,
  };
};

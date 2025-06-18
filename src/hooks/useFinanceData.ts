/**
 * SWR-based hooks for finance data
 * Following the development guide patterns
 */

import useSWR, { mutate } from 'swr';
import { categoryApi } from '../api/financeApi';
import { SWR_KEYS } from '../config/swr';
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../types/finance';

/**
 * Hook to fetch all categories using SWR
 * Auto-caches and shares data between components
 */
export const useCategories = () => {
  const { data, error, isLoading } = useSWR<Category[]>(
    SWR_KEYS.CATEGORIES.ALL,
    () => categoryApi.getAll()
  );

  return {
    categories: data,
    isLoading,
    error,
    // Function to manually refresh categories
    refresh: () => mutate(SWR_KEYS.CATEGORIES.ALL),
  };
};

/**
 * Hook to fetch a single category by ID using SWR
 */
export const useCategory = (categoryId: string | null) => {
  const { data, error, isLoading } = useSWR<Category>(
    categoryId ? SWR_KEYS.CATEGORIES.BY_ID(categoryId) : null,
    categoryId ? () => categoryApi.getById(categoryId) : null
  );

  return {
    category: data,
    isLoading,
    error,
    // Function to manually refresh this category
    refresh: () => categoryId && mutate(SWR_KEYS.CATEGORIES.BY_ID(categoryId)),
  };
};

/**
 * Hook for category CRUD operations
 * Automatically refreshes SWR cache after mutations
 */
export const useCategoryMutations = () => {
  const createCategory = async (data: CreateCategoryRequest) => {
    try {
      const newCategory = await categoryApi.create(data);

      // Refresh categories list in SWR cache
      mutate(SWR_KEYS.CATEGORIES.ALL);

      return { success: true, data: newCategory };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create category',
      };
    }
  };

  const updateCategory = async (data: UpdateCategoryRequest) => {
    try {
      const updatedCategory = await categoryApi.update(data);

      // Refresh both the categories list and the specific category
      mutate(SWR_KEYS.CATEGORIES.ALL);
      mutate(SWR_KEYS.CATEGORIES.BY_ID(data.categoryId));

      return { success: true, data: updatedCategory };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update category',
      };
    }
  };
  const deleteCategory = async (categoryId: string) => {
    try {
      await categoryApi.delete(categoryId);

      // Refresh categories list in SWR cache
      mutate(SWR_KEYS.CATEGORIES.ALL);

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete category',
      };
    }
  };

  return {
    createCategory,
    updateCategory,
    deleteCategory,
  };
};

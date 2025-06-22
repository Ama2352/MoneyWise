import { useCallback } from 'react';
import { useToastContext } from '../contexts';

interface CrudOperations<T> {
  create: (
    data: any
  ) => Promise<{ success: boolean; error?: string; data?: T }>;
  update: (
    data: any
  ) => Promise<{ success: boolean; error?: string; data?: T }>;
  delete: (id: string) => Promise<{ success: boolean; error?: string }>;
}

interface CrudMessages {
  createSuccess: string;
  createError: string;
  updateSuccess: string;
  updateError: string;
  deleteSuccess: string;
  deleteError: string;
}

export const useCrudOperations = <T>(
  operations: CrudOperations<T>,
  messages: CrudMessages,
  onSuccess?: () => void
) => {
  const { showSuccess, showError } = useToastContext();

  const handleCreate = useCallback(
    async (data: any) => {
      try {
        const result = await operations.create(data);
        if (result.success) {
          showSuccess(messages.createSuccess);
          onSuccess?.();
          return result;
        } else {
          showError(`${messages.createError}: ${result.error}`);
          return result;
        }
      } catch (error) {
        console.error('Create operation failed:', error);
        showError(messages.createError);
        return { success: false, error: 'Unknown error' };
      }
    },
    [
      operations.create,
      messages.createSuccess,
      messages.createError,
      showSuccess,
      showError,
      onSuccess,
    ]
  );

  const handleUpdate = useCallback(
    async (data: any) => {
      try {
        const result = await operations.update(data);
        if (result.success) {
          showSuccess(messages.updateSuccess);
          onSuccess?.();
          return result;
        } else {
          showError(`${messages.updateError}: ${result.error}`);
          return result;
        }
      } catch (error) {
        console.error('Update operation failed:', error);
        showError(messages.updateError);
        return { success: false, error: 'Unknown error' };
      }
    },
    [
      operations.update,
      messages.updateSuccess,
      messages.updateError,
      showSuccess,
      showError,
      onSuccess,
    ]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        const result = await operations.delete(id);
        if (result.success) {
          showSuccess(messages.deleteSuccess);
          onSuccess?.();
          return result;
        } else {
          showError(`${messages.deleteError}: ${result.error}`);
          return result;
        }
      } catch (error) {
        console.error('Delete operation failed:', error);
        showError(messages.deleteError);
        return { success: false, error: 'Unknown error' };
      }
    },
    [
      operations.delete,
      messages.deleteSuccess,
      messages.deleteError,
      showSuccess,
      showError,
      onSuccess,
    ]
  );

  return {
    handleCreate,
    handleUpdate,
    handleDelete,
  };
};

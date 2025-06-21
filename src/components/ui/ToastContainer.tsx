import React from 'react';
import { Toast } from './Toast';
import type { ToastMessage } from '../../hooks/useToast';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemoveToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemoveToast,
}) => {
  console.log('ToastContainer rendered with toasts:', toasts);

  return (
    <>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          isVisible={true}
          onClose={() => onRemoveToast(toast.id)}
        />
      ))}
    </>
  );
};

export default ToastContainer;

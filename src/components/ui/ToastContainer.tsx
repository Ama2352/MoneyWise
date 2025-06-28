import React, { memo } from 'react';
import { Toast } from './Toast';
import type { ToastMessage } from '../../hooks/useToast';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemoveToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = memo(
  ({ toasts, onRemoveToast }) => {
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
  }
);

ToastContainer.displayName = 'ToastContainer';

export { ToastContainer };
export default ToastContainer;

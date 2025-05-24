import React, { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
import { useToast } from '../hooks/useAppContext';
import { ToastMessage } from '../types';
import './Toast.scss';

const Toast: React.FC<{ toast: ToastMessage }> = ({ toast }) => {
  const { hideToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      hideToast(toast.id);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, hideToast]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'error':
        return <XCircle size={20} />;
      case 'info':
        return <Info size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  return (
    <div className={`toast toast--${toast.type}`}>
      <div className="toast__icon">
        {getIcon()}
      </div>
      <div className="toast__content">
        <div className="toast__title">{toast.title}</div>
        <div className="toast__message">{toast.message}</div>
      </div>
      <button
        className="toast__close"
        onClick={() => hideToast(toast.id)}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
};

const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

export default ToastContainer;
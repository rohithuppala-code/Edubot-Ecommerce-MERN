import React, { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

const ToastIcon = ({ type }) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'error':
      return <XCircle className="h-5 w-5 text-red-500" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    default:
      return <Info className="h-5 w-5 text-blue-500" />;
  }
};

const Toast = ({ toast, onRemove }) => {
  useEffect(() => {
    if (toast.duration > 0) {
      const timer = setTimeout(() => {
        onRemove(toast.id);
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, onRemove]);

  const bgColor = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  }[toast.type] || 'bg-gray-50 border-gray-200';

  return (
    <div className={`${bgColor} border rounded-lg p-4 shadow-lg transform transition-all duration-300 ease-in-out`}>
      <div className="flex items-start space-x-3">
        <ToastIcon type={toast.type} />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{toast.message}</p>
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export const ToastContainer = () => {
  const { state, removeToast } = useToast();

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {state.toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};
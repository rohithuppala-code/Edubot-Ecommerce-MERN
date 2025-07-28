import React, { createContext, useContext, useReducer } from 'react';

const initialState = {
  toasts: [],
};

const toastReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, { ...action.payload, id: Date.now() }],
      };
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.payload),
      };
    case 'CLEAR_ALL_TOASTS':
      return {
        ...state,
        toasts: [],
      };
    default:
      return state;
  }
};

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [state, dispatch] = useReducer(toastReducer, initialState);

  const addToast = (message, type = 'info', duration = 3000) => {
    const toast = { message, type, duration };
    dispatch({ type: 'ADD_TOAST', payload: toast });
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(toast.id);
      }, duration);
    }
  };

  const removeToast = (id) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  };

  const clearAllToasts = () => {
    dispatch({ type: 'CLEAR_ALL_TOASTS' });
  };

  return (
    <ToastContext.Provider value={{ state, addToast, removeToast, clearAllToasts }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
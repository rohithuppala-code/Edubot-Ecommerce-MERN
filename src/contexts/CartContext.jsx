import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';

const initialState = {
  items: [],
  isOpen: false,
  total: 0,
  itemCount: 0,
};

const calculateTotals = (items) => {
  const total = items.reduce((sum, item) => {
    if (!item.product || typeof item.product.price !== 'number') return sum;
    return sum + item.product.price * item.quantity;
  }, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { total, itemCount };
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART': {
      const { total, itemCount } = calculateTotals(action.payload);
      return { ...state, items: action.payload, total, itemCount };
    }
    case 'ADD_TO_CART': {
      const getId = (product) => product._id || product.id;
      const existingItem = state.items.find(item => getId(item.product) === getId(action.payload.product));
      let newItems;
      if (existingItem) {
        newItems = state.items.map(item =>
          getId(item.product) === getId(action.payload.product)
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        newItems = [...state.items, action.payload];
      }
      const { total, itemCount } = calculateTotals(newItems);
      return { ...state, items: newItems, total, itemCount };
    }
    case 'REMOVE_FROM_CART': {
      const getId = (product) => product._id || product.id;
      const newItems = state.items.filter(item => getId(item.product) !== action.payload);
      const { total, itemCount } = calculateTotals(newItems);
      return { ...state, items: newItems, total, itemCount };
    }
    case 'UPDATE_QUANTITY': {
      const getId = (product) => product._id || product.id;
      const newItems = state.items.map(item =>
        getId(item.product) === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);
      const { total, itemCount } = calculateTotals(newItems);
      return { ...state, items: newItems, total, itemCount };
    }
    case 'CLEAR_CART':
      return { ...state, items: [], total: 0, itemCount: 0 };
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    case 'OPEN_CART':
      return { ...state, isOpen: true };
    case 'CLOSE_CART':
      return { ...state, isOpen: false };
    default:
      return state;
  }
};

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { state: userState } = useUser();
  const isAuthenticated = userState.isAuthenticated;

  // Load cart from backend or localStorage on mount or login
  useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated) {
        const token = localStorage.getItem('token');
        try {
          const res = await axios.get('/api/users/cart', {
            headers: { Authorization: `Bearer ${token}` },
          });
          // Backend returns cart items with populated productId (full product object)
          const items = res.data.map(item => ({
            product: item.productId, // This is already the full product object from populate()
            quantity: item.quantity,
          })).filter(item => item.product && item.product._id); // Filter out any items with missing products
          dispatch({ type: 'SET_CART', payload: items });
        } catch (error) {
          console.error('Error loading cart:', error);
          dispatch({ type: 'SET_CART', payload: [] });
        }
      } else {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          try {
            const cartItems = JSON.parse(savedCart);
            dispatch({ type: 'SET_CART', payload: cartItems });
          } catch (error) {
            console.error('Error parsing saved cart:', error);
            localStorage.removeItem('cart');
          }
        }
      }
    };
    loadCart();
    // eslint-disable-next-line
  }, [isAuthenticated]);

  // Save cart to localStorage for guests
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('cart', JSON.stringify(state.items));
    }
  }, [state.items, isAuthenticated]);

  // Backend sync helpers
  const syncAddOrUpdate = async (product, quantity) => {
    const token = localStorage.getItem('token');
    await axios.post('/api/users/cart', {
      productId: product._id || product.id,
      quantity,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };
  const syncRemove = async (productId) => {
    const token = localStorage.getItem('token');
    await axios.delete(`/api/users/cart/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };
  const syncClear = async () => {
    const token = localStorage.getItem('token');
    await axios.delete('/api/users/cart', {
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  // Cart actions
  const addToCart = (product, quantity = 1) => {
    const getId = (p) => p._id || p.id;
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
    if (isAuthenticated) syncAddOrUpdate(product, (state.items.find(i => getId(i.product) === getId(product))?.quantity || 0) + quantity);
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    if (isAuthenticated) syncRemove(productId);
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
    if (isAuthenticated) {
      const getId = (p) => p._id || p.id;
      const product = state.items.find(i => getId(i.product) === productId)?.product;
      if (product) syncAddOrUpdate(product, quantity);
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    if (isAuthenticated) syncClear();
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' });
  };

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' });
  };

  return (
    <CartContext.Provider value={{
      state,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleCart,
      openCart,
      closeCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
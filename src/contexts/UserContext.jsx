import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const initialState = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
};

const userReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        user: action.payload, 
        isLoading: false, 
        isAuthenticated: true 
      };
    case 'LOGIN_FAILURE':
      return { ...state, isLoading: false, isAuthenticated: false };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false };
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: !!action.payload 
      };
    default:
      return state;
  }
};

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // On first app load, always clear any existing user/token
  useEffect(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  }, []);

  // On mount, verify user in localStorage with backend
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      const verifyUser = async () => {
        try {
          const res = await axios.get('/api/users/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const user = res.data;
          localStorage.setItem('user', JSON.stringify(user));
          dispatch({ type: 'SET_USER', payload: user });
        } catch {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          dispatch({ type: 'LOGOUT' });
        }
      };
      verifyUser();
    }
  }, []);

  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const res = await axios.post('/api/users/login', { email, password });
      const data = res.data;
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: data.user });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      const message = error.response?.data?.message || error.message || 'Login failed';
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  // Optionally, fetch user profile using token
  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await axios.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = res.data;
      localStorage.setItem('user', JSON.stringify(user));
      dispatch({ type: 'SET_USER', payload: user });
    } catch {
      logout();
    }
  };

  return (
    <UserContext.Provider value={{ state, login, logout, fetchProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
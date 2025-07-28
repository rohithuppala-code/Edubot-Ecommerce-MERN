import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { CartProvider } from './contexts/CartContext';
import { ToastProvider } from './contexts/ToastContext';
import { ToastContainer } from './components/ToastContainer';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Cart } from './pages/Cart';
import { ProductDetail } from './pages/ProductDetail';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminProducts } from './pages/AdminProducts';
import { AdminOrders } from './pages/AdminOrders';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Profile } from './pages/Profile';
import { Checkout } from './pages/Checkout';
import AdminCategories from './pages/AdminCategories';

function App() {
  return (
    <Router>
      <UserProvider>
        <CartProvider>
          <ToastProvider>
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="product/:id" element={<ProductDetail />} />
                  <Route path="profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="checkout" element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  } />
                  <Route path="admin" element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="admin/products" element={
                    <ProtectedRoute adminOnly>
                      <AdminProducts />
                    </ProtectedRoute>
                  } />
                  <Route path="admin/orders" element={
                    <ProtectedRoute adminOnly>
                      <AdminOrders />
                    </ProtectedRoute>
                  } />
                  <Route path="admin/categories" element={
                    <ProtectedRoute adminOnly>
                      <AdminCategories />
                    </ProtectedRoute>
                  } />
                </Route>
              </Routes>
              <ToastContainer />
            </div>
          </ToastProvider>
        </CartProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Users, Package, ShoppingCart, TrendingUp, Edit, Crown, User, AlertTriangle } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  // Low stock threshold (products with stock <= this number will be flagged)
  const LOW_STOCK_THRESHOLD = 5;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [usersRes, productsRes, ordersRes] = await Promise.all([
        axios.get('/api/users/all', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/products'),
        axios.get('/api/orders/all', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const usersData = usersRes.data;
      const productsData = productsRes.data;
      const ordersData = ordersRes.data;

      setUsers(usersData);
      setProducts(productsData);
      setStats({
        totalUsers: usersData.length,
        totalProducts: productsData.length,
        totalOrders: ordersData.length,
        totalRevenue: ordersData.reduce((sum, order) => sum + order.totalAmount, 0)
      });
      setLoading(false);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to fetch dashboard data', 'error');
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/users/${userId}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      addToast(`User role updated to ${newRole}`, 'success');
      fetchDashboardData(); // Refresh data
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update user role', 'error');
    }
  };

  // Get products with low stock (using individual thresholds)
  const lowStockProducts = products.filter(product => 
    product.stock <= (product.lowStockThreshold || 5)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-500 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your EDUBOT-ECOM platform</p>
        </div>

        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="text-lg font-semibold text-red-800">
                  Low Stock Alert ({lowStockProducts.length} products)
                </h3>
                <p className="text-sm text-red-700">
                  The following products have stock levels at or below their individual thresholds:
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {lowStockProducts.map((product) => (
                <div key={product._id} className="bg-white rounded-lg p-3 border border-red-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{product.title}</p>
                      <p className="text-sm text-gray-600">
                        Stock: {product.stock} (Threshold: {product.lowStockThreshold || 5})
                      </p>
                    </div>
                    <Link
                      to={`/admin/products`}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Restock →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                {lowStockProducts.length > 0 && (
                  <p className="text-xs text-red-600 mt-1">
                    {lowStockProducts.length} low stock
                  </p>
                )}
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          <Link to="/admin/products" className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <Package className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Manage Products</h3>
                <p className="text-sm text-gray-600">Add, edit, or remove products</p>
              </div>
            </div>
          </Link>

          <Link to="/admin/orders" className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <ShoppingCart className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Manage Orders</h3>
                <p className="text-sm text-gray-600">View and update order status</p>
              </div>
            </div>
          </Link>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center space-x-3">
              <Users className="h-6 w-6 text-purple-600" />
              <div>
                <h3 className="font-semibold text-gray-900">User Management</h3>
                <p className="text-sm text-gray-600">Manage user roles and permissions</p>
              </div>
            </div>
          </div>

          <Link to="/admin/categories" className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <Edit className="h-6 w-6 text-yellow-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Manage Categories</h3>
                <p className="text-sm text-gray-600">Add, edit, or remove categories</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
            <p className="text-sm text-gray-600 mt-1">Manage user roles and permissions</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                            {user.role === 'admin' ? (
                              <Crown className="h-5 w-5 text-purple-600" />
                            ) : (
                              <User className="h-5 w-5 text-gray-600" />
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">Joined {new Date(user.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {user.role === 'user' ? (
                        <button
                          onClick={() => updateUserRole(user._id, 'admin')}
                          className="text-purple-600 hover:text-purple-900 flex items-center space-x-1"
                        >
                          <Crown className="h-4 w-4" />
                          <span>Make Admin</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => updateUserRole(user._id, 'user')}
                          className="text-gray-600 hover:text-gray-900 flex items-center space-x-1"
                        >
                          <User className="h-4 w-4" />
                          <span>Make User</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
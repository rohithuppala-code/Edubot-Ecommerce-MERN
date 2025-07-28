import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit3, Save, X, RefreshCw } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useToast } from '../contexts/ToastContext';
import axios from 'axios';

export const Profile = () => {
  const { state } = useUser();
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [orderStats, setOrderStats] = useState({ totalOrders: 0, totalSpent: 0 });
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [formData, setFormData] = useState({
    name: state.user?.name || '',
    email: state.user?.email || '',
    phone: state.user?.phone || '',
    address: state.user?.address || '',
  });

  // Fetch user's order statistics
  const fetchOrderStats = async () => {
    try {
      setIsLoadingStats(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get('http://localhost:5000/api/orders/my', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const orders = response.data;
      const totalOrders = orders.length;
      const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);

      setOrderStats({ totalOrders, totalSpent });
    } catch (error) {
      console.error('Error fetching order stats:', error);
      addToast('Failed to load order statistics', 'error');
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchOrderStats();
  }, []);

  const handleRefreshStats = () => {
    fetchOrderStats();
    addToast('Order statistics refreshed!', 'success');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    setIsEditing(false);
    addToast('Profile updated successfully!', 'success');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: state.user?.name || '',
      email: state.user?.email || '',
      phone: state.user?.phone || '',
      address: state.user?.address || '',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-12">
            <div className="flex items-center space-x-6">
              <div>
                <h1 className="text-3xl font-bold text-white">{state.user?.name}</h1>
                <p className="text-purple-100 text-lg capitalize">{state.user?.role}</p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition-colors duration-200"
              >
                <Edit3 className="h-5 w-5" />
                <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline h-4 w-4 mr-2" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <p className="text-gray-900 text-lg">{formData.name || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="inline h-4 w-4 mr-2" />
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <p className="text-gray-900 text-lg">{formData.email || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="inline h-4 w-4 mr-2" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <p className="text-gray-900 text-lg">{formData.phone || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline h-4 w-4 mr-2" />
                    Address
                  </label>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter your address"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <p className="text-gray-900 text-lg">{formData.address || 'Not provided'}</p>
                  )}
                </div>
              </div>

              {/* Account Statistics */}
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Account Statistics</h3>
                    <button
                      onClick={handleRefreshStats}
                      disabled={isLoadingStats}
                      className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 transition-colors duration-200 disabled:opacity-50"
                    >
                      <RefreshCw className={`h-4 w-4 ${isLoadingStats ? 'animate-spin' : ''}`} />
                      <span className="text-sm">Refresh</span>
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Orders</span>
                      <span className="font-semibold text-gray-900">{orderStats.totalOrders}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Spent</span>
                      <span className="font-semibold text-gray-900">${orderStats.totalSpent.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Save/Cancel Buttons */}
            {isEditing && (
              <div className="flex items-center justify-end space-x-4 mt-8 pt-8 border-t border-gray-200">
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
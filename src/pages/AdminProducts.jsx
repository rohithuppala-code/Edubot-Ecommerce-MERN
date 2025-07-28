import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
// import { products } from '../data/mockData';
import { useToast } from '../contexts/ToastContext';
import { useUser } from '../contexts/UserContext';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const { addToast } = useToast();
  const { state: userState } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ title: '', price: '', category: '', description: '', imageUrl: '', stock: '', lowStockThreshold: '' });

  const fetchProducts = () => {
    setLoading(true);
    axios.get('/api/products')
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message || 'Failed to fetch products');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const token = localStorage.getItem('token');

  const handleAddProduct = async () => {
    try {
      await axios.post('/api/products', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      addToast('Product added!', 'success');
      setShowAddModal(false);
      setForm({ title: '', price: '', category: '', description: '', imageUrl: '', stock: '', lowStockThreshold: '' });
      fetchProducts();
    } catch (err) {
      addToast(err.response?.data?.message || err.message || 'Failed to add product', 'error');
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setForm({
      title: product.title,
      price: product.price,
      category: product.category,
      description: product.description,
      imageUrl: product.imageUrl,
      stock: product.stock,
      lowStockThreshold: product.lowStockThreshold,
    });
    setShowEditModal(true);
  };

  const handleUpdateProduct = async () => {
    try {
      await axios.put(`/api/products/${editProduct._id || editProduct.id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      addToast('Product updated!', 'success');
      setShowEditModal(false);
      setEditProduct(null);
      setForm({ title: '', price: '', category: '', description: '', imageUrl: '', stock: '', lowStockThreshold: '' });
      fetchProducts();
    } catch (err) {
      addToast(err.response?.data?.message || err.message || 'Failed to update product', 'error');
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      addToast('Product deleted!', 'success');
      fetchProducts();
    } catch (err) {
      addToast(err.response?.data?.message || err.message || 'Failed to delete product', 'error');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Management</h1>
            <p className="text-gray-600">Manage your product catalog</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Product</span>
          </button>
        </div>

        {/* Add Product Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add Product</h2>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input className="w-full mb-3 p-2 border rounded" placeholder="Enter product name" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input className="w-full mb-3 p-2 border rounded" placeholder="0.00" type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input className="w-full mb-3 p-2 border rounded" placeholder="e.g., Electronics" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input className="w-full mb-3 p-2 border rounded" placeholder="https://example.com/image.jpg" value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} />
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea className="w-full mb-3 p-2 border rounded" placeholder="Product description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
              <input className="w-full mb-3 p-2 border rounded" placeholder="10" type="number" min="0" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: parseInt(e.target.value) || '' }))} />
              <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Alert Threshold</label>
              <input className="w-full mb-4 p-2 border rounded" placeholder="5" type="number" min="0" value={form.lowStockThreshold} onChange={e => setForm(f => ({ ...f, lowStockThreshold: parseInt(e.target.value) || '' }))} />
              <div className="flex justify-end space-x-2">
                <button onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                <button onClick={handleAddProduct} className="px-4 py-2 bg-purple-600 text-white rounded">Add</button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Edit Product</h2>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input className="w-full mb-3 p-2 border rounded" placeholder="Enter product name" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input className="w-full mb-3 p-2 border rounded" placeholder="0.00" type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input className="w-full mb-3 p-2 border rounded" placeholder="e.g., Electronics" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input className="w-full mb-3 p-2 border rounded" placeholder="https://example.com/image.jpg" value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} />
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea className="w-full mb-3 p-2 border rounded" placeholder="Product description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
              <input className="w-full mb-3 p-2 border rounded" placeholder="10" type="number" min="0" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: parseInt(e.target.value) || '' }))} />
              <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Alert Threshold</label>
              <input className="w-full mb-4 p-2 border rounded" placeholder="5" type="number" min="0" value={form.lowStockThreshold} onChange={e => setForm(f => ({ ...f, lowStockThreshold: parseInt(e.target.value) || '' }))} />
              <div className="flex justify-end space-x-2">
                <button onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                <button onClick={handleUpdateProduct} className="px-4 py-2 bg-blue-600 text-white rounded">Update</button>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Loading products...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500 text-lg">{error}</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Product</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Category</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Price</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Stock</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Rating</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product._id || product.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-4">
                          <img
                            src={product.imageUrl}
                            alt={product.title}
                            className="h-12 w-12 object-cover rounded-lg"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900">{product.title}</h3>
                            <p className="text-sm text-gray-600">{product.description?.substring(0, 50)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{product.category}</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">${product.price}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.stock > (product.lowStockThreshold || 5) ? 'bg-green-100 text-green-800' : 
                            product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {product.stock} units
                          </span>
                          {product.stock <= (product.lowStockThreshold || 5) && product.stock > 0 && (
                            <span className="text-xs text-yellow-600">Low Stock</span>
                          )}
                          {product.stock === 0 && (
                            <span className="text-xs text-red-600">Out of Stock</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">-</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id || product.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};
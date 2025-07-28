import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', icon: '' });
  const [editingId, setEditingId] = useState(null);
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/categories');
      setCategories(res.data);
    } catch (err) {
      addToast('Failed to fetch categories', 'error');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      if (editingId) {
        await axios.put(`/api/categories/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        addToast('Category updated', 'success');
      } else {
        await axios.post('/api/categories', form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        addToast('Category created', 'success');
      }
      setForm({ name: '', icon: '' });
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      addToast(err.response?.data?.error || 'Error saving category', 'error');
    }
  };

  const handleEdit = (cat) => {
    setForm({ name: cat.name, icon: cat.icon });
    setEditingId(cat._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      addToast('Category deleted', 'success');
      fetchCategories();
    } catch (err) {
      addToast('Failed to delete category', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Manage Categories</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Category Name</label>
            <input name="name" value={form.name} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Icon/Emoji</label>
            <input name="icon" value={form.icon} onChange={handleChange} required className="w-full border rounded px-3 py-2" maxLength={2} />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {editingId ? 'Update Category' : 'Add Category'}
          </button>
          {editingId && (
            <button type="button" className="ml-2 text-gray-600" onClick={() => { setEditingId(null); setForm({ name: '', icon: '' }); }}>
              Cancel
            </button>
          )}
        </form>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">All Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {categories.map(cat => (
              <div key={cat._id} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex flex-col items-center">
                <div className="text-4xl mb-3">{cat.icon}</div>
                <div className="font-semibold text-lg mb-2 text-center">{cat.name}</div>
                <div className="flex space-x-4 mt-4">
                  <button onClick={() => handleEdit(cat)} className="text-blue-600 font-medium hover:underline">Edit</button>
                  <button onClick={() => handleDelete(cat._id)} className="text-red-600 font-medium hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCategories; 
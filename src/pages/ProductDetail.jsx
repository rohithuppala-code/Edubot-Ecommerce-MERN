import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Heart, Minus, Plus, Shield, Truck, RotateCcw } from 'lucide-react';
// import { products } from '../data/mockData';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';

export const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const { addToCart } = useCart();
  const { addToast } = useToast();

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message || 'Product not found');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <p className="text-gray-500 text-lg">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">{error || "The product you're looking for doesn't exist."}</p>
          <Link
            to="/"
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 inline-flex items-center space-x-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Products</span>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product.stock > 0) {
      addToCart(product, quantity);
      addToast(`${quantity} ${product.title} added to cart!`, 'success');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            to="/"
            className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200 inline-flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Products</span>
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image and Tags as a single card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col items-center h-full">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-96 lg:h-[500px] object-cover"
            />
            <div className="flex-1 flex flex-col justify-center w-full">
              {/* Product Tags centered vertically in the card */}
              <div className="w-full px-8 pb-8 flex flex-col items-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 tracking-wide uppercase letter-spacing-wider">Product Tags</h3>
                <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full mb-4"></div>
                <div className="flex flex-wrap gap-3 justify-center">
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-white text-sm font-bold px-4 py-2 rounded-full shadow-md tracking-wide">Bestseller</span>
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-white text-sm font-bold px-4 py-2 rounded-full shadow-md tracking-wide">Trending</span>
                  <span className="bg-gradient-to-r from-green-400 to-lime-400 text-white text-sm font-bold px-4 py-2 rounded-full shadow-md tracking-wide">Best Value</span>
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-sm font-bold px-4 py-2 rounded-full shadow-md tracking-wide">Customer Favourite</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-600 text-sm font-medium rounded-full">
                {product.category}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>

            <div className="flex items-center mb-6">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating || 0)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600 ml-2">
                {product.rating || 0} ({product.reviews || 0} reviews)
              </span>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold text-purple-600">${product.price}</span>
              {product.stock === 0 && (
                <span className="ml-4 text-red-600 font-semibold">Out of Stock</span>
              )}
            </div>

            <p className="text-gray-700 mb-8 text-lg leading-relaxed">
              {product.description}
            </p>

            {/* Features */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
              <div className="grid grid-cols-2 gap-3">
                {product.features?.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span className="text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  >
                    <Minus className="h-4 w-4 text-gray-600" />
                  </button>
                  <span className="px-4 py-2 bg-gray-100 rounded-lg text-lg font-medium min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full sm:flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  product.stock > 0
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200">
              <div className="text-center">
                <Truck className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <span className="text-sm text-gray-600">Free Shipping</span>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <span className="text-sm text-gray-600">Secure Payment</span>
              </div>
              <div className="text-center">
                <RotateCcw className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <span className="text-sm text-gray-600">30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {['description', 'reviews', 'shipping'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 text-sm font-medium capitalize transition-colors duration-200 border-b-2 ${
                    activeTab === tab
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'description' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h3>
                <p className="text-gray-600">Reviews will be displayed here in a real application.</p>
              </div>
            )}
            {activeTab === 'shipping' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h3>
                <p className="text-gray-700">Free shipping on orders over $50. Standard delivery takes 3-5 business days.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
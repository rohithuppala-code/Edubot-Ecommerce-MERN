import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ProductCard } from '../components/ProductCard';
import { ChevronRight, Filter, Grid, List, Sparkles, TrendingUp, Zap, ShoppingBag } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

// Skeleton loader component
const ProductSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-sm animate-pulse overflow-hidden">
    <div className="h-64 bg-gray-200"></div>
    <div className="p-6">
      <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-200 rounded w-16"></div>
        <div className="h-10 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  </div>
);

export const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [visibleCount, setVisibleCount] = useState(4); // For infinite scroll (start with 4)
  const [isFetchingMore, setIsFetchingMore] = useState(false); // For loading spinner
  const [infiniteScrollEnabled, setInfiniteScrollEnabled] = useState(false); // For enabling infinite scroll
  const { addToast } = useToast();

  // Move these up so they're available to useEffect hooks
  const filteredProducts = products.filter(product => 
    selectedCategory === 'all' || product.category === selectedCategory
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return a.title.localeCompare(b.title);
    }
  });

  useEffect(() => {
    setLoading(true);
    axios.get('/api/products')
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    axios.get('/api/categories')
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  // Infinite scroll effect
  useEffect(() => {
    if (!infiniteScrollEnabled) return;
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 &&
        visibleCount < sortedProducts.length &&
        !isFetchingMore &&
        !loading
      ) {
        setIsFetchingMore(true);
        setTimeout(() => {
          setVisibleCount((prev) => Math.min(prev + 4, sortedProducts.length)); // Load 4 more
          setIsFetchingMore(false);
        }, 500); // Simulate loading delay
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleCount, sortedProducts.length, isFetchingMore, loading, infiniteScrollEnabled]);

  useEffect(() => {
    // Reset visibleCount and infinite scroll when filters change
    setVisibleCount(4);
    setInfiniteScrollEnabled(false);
  }, [selectedCategory, sortBy, products]);

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-purple-200">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Discover Amazing Products</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Welcome to
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent block animate-pulse">
              EDUBOT-ECOM
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Experience the future of online shopping with our curated collection of premium products
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button 
              onClick={() => document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' })}
              className="group bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
            >
              <span>Start Shopping</span>
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            <button
              onClick={() => document.getElementById('newsletter-section').scrollIntoView({ behavior: 'smooth' })}
              className="group bg-white text-purple-700 border-2 border-purple-400 px-8 py-4 rounded-full font-semibold hover:bg-purple-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
            >
              <span>Get Updates?</span>
              <Sparkles className="h-5 w-5 text-purple-500 group-hover:animate-spin" />
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{products.length}+</div>
              <div className="text-sm text-gray-600">Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-sm text-gray-600">Support</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">100%</div>
              <div className="text-sm text-gray-600">Secure</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Categories Section */}
      <section id="categories-section" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-7xl mx-auto z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Explore our carefully curated categories to find exactly what you're looking for</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`group p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white/80 backdrop-blur-md ${
                selectedCategory === 'all'
                  ? 'border-purple-600 shadow-lg ring-2 ring-purple-300'
                  : 'border-gray-200 hover:border-purple-400'
              }`}
            >
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 mb-3 group-hover:scale-110 transition-transform duration-200">
                  <span className="text-3xl">🛍️</span>
                </div>
                <span className="font-semibold text-base text-gray-800">All Products</span>
              </div>
            </button>
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => setSelectedCategory(category.name)}
                className={`group p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white/80 backdrop-blur-md ${
                  selectedCategory === category.name
                    ? 'border-purple-600 shadow-lg ring-2 ring-purple-300'
                    : 'border-gray-200 hover:border-purple-400'
                }`}
              >
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 mb-3 group-hover:scale-110 transition-transform duration-200">
                    <span className="text-3xl">{category.icon}</span>
                  </div>
                  <span className="font-semibold text-base text-gray-800">{category.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products-section" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-7xl mx-auto z-10">
          {/* Enhanced Filters and Sort */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <div className="flex items-center space-x-3 bg-white rounded-xl p-2 shadow-sm border border-gray-200">
                <Filter className="h-5 w-5 text-gray-600" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border-none bg-transparent focus:outline-none focus:ring-0 text-gray-700 font-medium"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Sort by Rating</option>
                </select>
              </div>
              {/* View All Products Button beside sort */}
              <button
                onClick={() => {
                  if (!infiniteScrollEnabled) {
                    setInfiniteScrollEnabled(true);
                  } else {
                    setInfiniteScrollEnabled(false);
                    setVisibleCount(4);
                  }
                }}
                className={`ml-4 px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400
                  ${infiniteScrollEnabled
                    ? 'bg-gray-200 text-gray-700'
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'}`}
              >
                {infiniteScrollEnabled ? 'View Less' : 'View All Products'}
              </button>
            </div>
          </div>

          {/* Products Grid with Skeleton Loading */}
          {loading ? (
            <div className={`grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`}>
              {[...Array(8)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
                <Zap className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-800 mb-2">Oops! Something went wrong</h3>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          ) : (
            <>
            <div className={`grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`}>
              {sortedProducts.slice(0, visibleCount).map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
            {/* Infinite scroll loading spinner */}
            {infiniteScrollEnabled && isFetchingMore && (
              <div className="flex justify-center mt-8">
                <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            </>
          )}

          {!loading && !error && sortedProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 max-w-md mx-auto">
                <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-600">Try selecting a different category or search term.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Enhanced Newsletter Section */}
      <section id="newsletter-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/30">
            <Sparkles className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">Stay Updated</span>
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-4">Never Miss a Deal</h2>
          <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto">Subscribe to our newsletter for exclusive offers, new product alerts, and insider tips</p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 max-w-md mx-auto">
            <input
              type="email"
              value={newsletterEmail}
              onChange={e => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-6 py-4 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            />
            <button
              onClick={() => {
                if (newsletterEmail.trim()) {
                  addToast('From now on, you will receive all updates.', 'success');
                  setNewsletterEmail('');
                }
              }}
              className="w-full sm:w-auto bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center justify-center space-x-2 group"
            >
              <span>Subscribe</span>
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
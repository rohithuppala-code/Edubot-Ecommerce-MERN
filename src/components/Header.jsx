import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, LogOut, Settings, ShoppingBag, ChevronDown } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import axios from 'axios';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const { state: userState, logout } = useUser();
  const { state: cartState, toggleCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch products and categories from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get('/api/products'),
          axios.get('/api/categories')
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.log('API not available, search will be limited');
      }
    };
    fetchData();
  }, []);

  // Search functionality using API data
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 2 && (products.length > 0 || categories.length > 0)) {
      const results = [];
      
      // Search in products
      products.forEach(product => {
        if (product.title?.toLowerCase().includes(query.toLowerCase()) ||
            product.name?.toLowerCase().includes(query.toLowerCase()) ||
            product.category?.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            id: product._id || product.id,
            name: product.title || product.name,
            category: product.category,
            price: product.price,
            type: 'product'
          });
        }
      });
      
      // Search in categories
      categories.forEach(category => {
        if (category.name?.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            id: category._id || category.id,
            name: category.name,
            type: 'category'
          });
        }
      });
      
      setSearchResults(results.slice(0, 5));
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  // Handle search result click
  const handleSearchResultClick = (result) => {
    setSearchQuery(result.name);
    setShowSearchResults(false);
    
    if (result.type === 'product') {
      navigate(`/product/${result.id}`);
    } else if (result.type === 'category') {
      navigate('/');
      setTimeout(() => {
        const categorySection = document.getElementById('categories-section');
        if (categorySection) {
          categorySection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  // Scroll to categories section
  const scrollToCategories = () => {
    if (location.pathname === '/') {
      const categorySection = document.getElementById('categories-section');
      if (categorySection) {
        categorySection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/');
      setTimeout(() => {
        const categorySection = document.getElementById('categories-section');
        if (categorySection) {
          categorySection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleLogout = () => {
    logout();
    addToast('Successfully logged out!', 'success');
    setIsProfileOpen(false);
    navigate('/');
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowSearchResults(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <ShoppingBag className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              EDUBOT-ECOM
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search products and categories..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {searchResults.map((result) => (
                    <div
                      key={`${result.type}-${result.id}`}
                      className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleSearchResultClick(result)}
                    >
                      <div>
                        <div className="font-medium text-gray-900">{result.name}</div>
                        <div className="text-sm text-gray-500">
                          {result.type === 'product' ? result.category : 'Category'}
                        </div>
                      </div>
                      {result.type === 'product' && (
                        <div className="text-purple-600 font-semibold">${result.price}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {/* Categories Button */}
            <button
              onClick={scrollToCategories}
              className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium"
            >
              <ChevronDown className="h-4 w-4" />
              <span>Categories</span>
            </button>

            {userState.isAuthenticated ? (
              <>
                {userState.user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors duration-200"
                  >
                    <span className="font-medium">{userState.user.name}</span>
                  </button>
                  
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                      <hr className="my-2 border-gray-200" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200 w-full text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium"
              >
                <User className="h-5 w-5" />
                <span>Login</span>
              </Link>
            )}

            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="relative p-2 text-gray-700 hover:text-purple-600 transition-colors duration-200"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartState.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {cartState.itemCount}
                </span>
              )}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-purple-600 transition-colors duration-200"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search products and categories..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {searchResults.map((result) => (
                      <div
                        key={`mobile-${result.type}-${result.id}`}
                        className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          handleSearchResultClick(result);
                          setIsMenuOpen(false);
                        }}
                      >
                        <div>
                          <div className="font-medium text-gray-900">{result.name}</div>
                          <div className="text-sm text-gray-500">
                            {result.type === 'product' ? result.category : 'Category'}
                          </div>
                        </div>
                        {result.type === 'product' && (
                          <div className="text-purple-600 font-semibold">${result.price}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Categories Button */}
              <button
                onClick={() => {
                  scrollToCategories();
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-2 px-2 py-2 text-gray-700 hover:text-purple-600 transition-colors duration-200 w-full text-left"
              >
                <ChevronDown className="h-5 w-5" />
                <span>Categories</span>
              </button>

              {userState.isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-3 px-2">
                    <span className="font-medium text-gray-700">{userState.user.name}</span>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 px-2 py-2 text-gray-700 hover:text-purple-600 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>
                  {userState.user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="flex items-center space-x-2 px-2 py-2 text-gray-700 hover:text-purple-600 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="h-5 w-5" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 px-2 py-2 text-gray-700 hover:text-purple-600 transition-colors duration-200"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-2 px-2 py-2 text-gray-700 hover:text-purple-600 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>Login</span>
                </Link>
              )}

              <button
                onClick={() => {
                  toggleCart();
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-2 px-2 py-2 text-gray-700 hover:text-purple-600 transition-colors duration-200"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Cart ({cartState.itemCount})</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
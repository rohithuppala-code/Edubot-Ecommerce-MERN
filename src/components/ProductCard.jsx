import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToast } = useToast();

  // Handle both mock data and API data structures
  const productImage = product.imageUrl || product.image;
  const productTitle = product.title || product.name;
  const productStock = product.stock !== undefined ? product.stock : (product.inStock ? 1 : 0);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (productStock > 0) {
      addToCart(product);
      addToast('Product added to cart!', 'success');
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col">
      <Link to={`/product/${product._id || product.id}`}> 
        <div className="relative w-full aspect-[4/3] overflow-hidden rounded-t-2xl bg-white flex items-center justify-center">
          <img
            src={productImage}
            alt={productTitle}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
          <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200">
            <Heart className="h-5 w-5 text-gray-600 hover:text-red-500 transition-colors duration-200" />
          </button>
          {productStock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-6 flex flex-col justify-between flex-1">
        <div className="mb-2">
          <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>
        <Link to={`/product/${product._id || product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-purple-600 transition-colors duration-200">
            {productTitle}
          </h3>
        </Link>
        <div className="flex items-center mb-3">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating || 0)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">
            ({product.reviews || 0} reviews)
          </span>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-2xl font-bold text-gray-900">
            ${product.price}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={productStock === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              productStock > 0
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 hover:shadow-lg'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};
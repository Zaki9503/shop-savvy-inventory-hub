import React, { useEffect } from 'react';
import { useFirestoreProductsContext } from '../lib/contexts/FirestoreProductsContext';

/**
 * Component to display products from Firestore
 */
export const FirestoreProductList: React.FC = () => {
  // Get the products and functions from context
  const { products, loading, error, fetchProducts } = useFirestoreProductsContext();

  // Fetch products when component mounts
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle refresh button click
  const handleRefresh = () => {
    fetchProducts();
  };

  // If loading, show loading state
  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Products</h2>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading products...</span>
        </div>
      </div>
    );
  }

  // If error, show error state
  if (error) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Products</h2>
        <div className="p-4 bg-red-100 text-red-700 rounded">
          <p className="font-bold">Error loading products:</p>
          <p>{error}</p>
          <button 
            onClick={handleRefresh}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // If no products, show empty state
  if (products.length === 0) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Products</h2>
          <button 
            onClick={handleRefresh}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Refresh
          </button>
        </div>
        <div className="p-8 text-center text-gray-500">
          <p>No products found. Add some products to get started!</p>
        </div>
      </div>
    );
  }

  // Render products
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Products</h2>
        <button 
          onClick={handleRefresh}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Refresh
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Price</th>
              <th className="py-2 px-4 text-left">Quantity</th>
              <th className="py-2 px-4 text-left">Total Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="py-2 px-4">{product.name}</td>
                <td className="py-2 px-4">${product.price.toFixed(2)}</td>
                <td className="py-2 px-4">{product.quantity}</td>
                <td className="py-2 px-4">${(product.price * product.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td className="py-2 px-4 font-bold" colSpan={3}>Total Inventory Value</td>
              <td className="py-2 px-4 font-bold">
                ${products
                  .reduce((total, product) => total + product.price * product.quantity, 0)
                  .toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}; 
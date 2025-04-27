import React, { useState } from 'react';
import { useFirestoreProductsContext } from '../lib/contexts/FirestoreProductsContext';

/**
 * Product form component that uses Firestore
 */
export const FirestoreProductForm: React.FC = () => {
  // Form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [quantity, setQuantity] = useState<number | ''>('');
  
  // Get the context functions
  const { addProduct, loading, error, resetError } = useFirestoreProductsContext();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!name || price === '' || quantity === '') {
      alert('Please fill in all fields');
      return;
    }
    
    // Create product object
    const product = {
      name,
      price: Number(price),
      quantity: Number(quantity)
    };
    
    // Add the product to Firestore
    const result = await addProduct(product);
    
    // Check if successful
    if (result) {
      // Reset form
      setName('');
      setPrice('');
      setQuantity('');
      
      // Show success message
      alert('Product added successfully!');
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Add New Product</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="name">
            Product Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter product name"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="price">
            Price
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter price"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="quantity">
            Quantity
          </label>
          <input
            id="quantity"
            type="number"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : '')}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter quantity"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Product'}
        </button>
        
        {error && (
          <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
            <button 
              onClick={resetError}
              className="mt-2 text-sm text-red-500 hover:text-red-700"
            >
              Dismiss
            </button>
          </div>
        )}
      </form>
    </div>
  );
}; 
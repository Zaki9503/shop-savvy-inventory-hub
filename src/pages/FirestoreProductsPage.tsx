import React from 'react';
import { FirestoreProductForm } from '../components/FirestoreProductForm';
import { FirestoreProductList } from '../components/FirestoreProductList';

/**
 * Page component showcasing Firestore products functionality
 */
export const FirestoreProductsPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Firestore Products Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Product Form */}
        <div className="md:col-span-1">
          <FirestoreProductForm />
        </div>
        
        {/* Product List */}
        <div className="md:col-span-2">
          <FirestoreProductList />
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h2 className="text-lg font-bold mb-2">About This Page</h2>
        <p className="mb-2">
          This page demonstrates Firebase Firestore integration for product management:
        </p>
        <ul className="list-disc pl-5 mb-2">
          <li>Add new products using the form on the left</li>
          <li>View all products from Firestore in the table on the right</li>
          <li>Products persist across page refreshes and app restarts</li>
          <li>Refresh the product list at any time with the refresh button</li>
        </ul>
        <p>
          All product data is saved to Firebase Firestore in real-time, providing a cloud-based 
          database that ensures your data is always available and backed up.
        </p>
      </div>
    </div>
  );
}; 
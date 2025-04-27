# Firebase Integration Guide for Shop Savvy Inventory Hub

This guide explains how to set up and use the Firebase integration for your Shop Savvy Inventory Hub application.

## Overview

The Shop Savvy Inventory Hub app now uses Firebase for persistent data storage, providing:

- Real-time database with Firestore
- User authentication via Firebase Auth
- Secure file storage with Firebase Storage

## Setup Instructions

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup steps
3. Give your project a name (e.g., "shop-savvy-inventory")
4. Choose whether to enable Google Analytics (recommended)
5. Create the project

### 2. Register Your Web App

1. On the Firebase project dashboard, click the web icon (</>) to add a web app
2. Give your app a nickname (e.g., "shop-savvy-web")
3. Click "Register app"
4. Copy the Firebase configuration object that appears

### 3. Set Up Environment Variables

1. Create a `.env` file in the root of your project
2. Add your Firebase configuration as environment variables:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

3. Alternatively, you can directly update the values in `src/lib/firebase/config.ts`

### 4. Set Up Firestore Database

1. In the Firebase Console, go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location closest to your users
5. Click "Enable"

### 5. Configure Firebase Authentication

1. In the Firebase Console, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Enable the "Email/Password" sign-in method

## How to Use the Products Service

### Setting Up

First, wrap your app with the ProductsProvider in your App.tsx or main.tsx:

```jsx
import { ProductsProvider } from './lib/contexts/ProductsContext';

function App() {
  return (
    <ProductsProvider>
      {/* Your app components */}
    </ProductsProvider>
  );
}
```

### Using Product Functions in Components

Import the useProductsContext hook in your components:

```jsx
import { useProductsContext } from '../lib/contexts/ProductsContext';

function ProductList() {
  const { 
    products, 
    loading, 
    error, 
    fetchAllProducts, 
    deleteProduct 
  } = useProductsContext();

  // Handle loading state
  if (loading) return <div>Loading products...</div>;
  
  // Handle error state
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Products</h1>
      {products.map(product => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>${product.price}</p>
          <button onClick={() => deleteProduct(product.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

### Adding a New Product

```jsx
import { useState } from 'react';
import { useProductsContext } from '../lib/contexts/ProductsContext';

function AddProductForm() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const { addProduct, loading, error } = useProductsContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newProduct = {
      name,
      price,
      sku: `SKU-${Date.now()}`,
      category: 'Default',
      cost: price * 0.7,
      description: '',
      image: '',
      isActive: true,
      expiryDate: new Date().toISOString(),
      stock: 0
    };
    
    const result = await addProduct(newProduct);
    if (result) {
      // Reset form
      setName('');
      setPrice(0);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        placeholder="Product Name" 
        required 
      />
      <input 
        type="number" 
        value={price} 
        onChange={(e) => setPrice(Number(e.target.value))} 
        placeholder="Price" 
        required 
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Product'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
```

### Updating a Product

```jsx
import { useState, useEffect } from 'react';
import { useProductsContext } from '../lib/contexts/ProductsContext';

function EditProductForm({ productId }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const { fetchProduct, updateProduct, loading, error } = useProductsContext();

  useEffect(() => {
    const loadProduct = async () => {
      const product = await fetchProduct(productId);
      if (product) {
        setName(product.name);
        setPrice(product.price);
      }
    };
    
    loadProduct();
  }, [productId, fetchProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const updatedProduct = {
      name,
      price
    };
    
    await updateProduct(productId, updatedProduct);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        placeholder="Product Name" 
        required 
      />
      <input 
        type="number" 
        value={price} 
        onChange={(e) => setPrice(Number(e.target.value))} 
        placeholder="Price" 
        required 
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Updating...' : 'Update Product'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
```

## Advanced Usage

### Searching Products

```jsx
const { searchProducts } = useProductsContext();

const handleSearch = async (term) => {
  const results = await searchProducts(term);
  // Do something with results
};
```

### Filtering by Category

```jsx
const { getProductsByCategory } = useProductsContext();

const handleCategoryFilter = async (category) => {
  const results = await getProductsByCategory(category);
  // Do something with results
};
```

## Security Rules

For production, update your Firestore security rules to ensure data security:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'super_admin' || 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
  }
}
```

## Troubleshooting

- **Authentication Issues**: Check Firebase Console Authentication section for any errors or failed sign-ins
- **Data Not Persisting**: Verify Firestore rules allow write access for your users
- **Slow Performance**: Consider adding indexes for frequently queried fields 
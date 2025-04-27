import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp, 
  DocumentReference 
} from 'firebase/firestore';
import { db } from '../config';
import { Product } from '../../types';

// Collection reference
const productsCollection = collection(db, 'products');

// Interface for product operations result
interface ProductResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Fetch all products from Firestore
 */
export const fetchProducts = async (): Promise<ProductResult<Product[]>> => {
  try {
    const q = query(productsCollection, orderBy('name'));
    const querySnapshot = await getDocs(q);
    const products: Product[] = [];

    querySnapshot.forEach((doc) => {
      const productData = doc.data();
      products.push({
        id: doc.id,
        name: productData.name,
        sku: productData.sku,
        category: productData.category,
        price: productData.price,
        cost: productData.cost,
        description: productData.description,
        image: productData.image,
        isActive: productData.isActive,
        expiryDate: productData.expiryDate,
        stock: productData.stock,
        updatedAt: productData.updatedAt?.toDate?.() || new Date(),
        createdAt: productData.createdAt?.toDate?.() || new Date()
      });
    });
    
    return { success: true, data: products };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch products' 
    };
  }
};

/**
 * Fetch a single product by ID
 */
export const fetchProductById = async (id: string): Promise<ProductResult<Product | null>> => {
  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const productData = docSnap.data();
      const product: Product = {
        id: docSnap.id,
        name: productData.name,
        sku: productData.sku,
        category: productData.category,
        price: productData.price,
        cost: productData.cost,
        description: productData.description,
        image: productData.image,
        isActive: productData.isActive,
        expiryDate: productData.expiryDate,
        stock: productData.stock,
        updatedAt: productData.updatedAt?.toDate?.() || new Date(),
        createdAt: productData.createdAt?.toDate?.() || new Date()
      };
      return { success: true, data: product };
    } else {
      return { success: false, error: 'Product not found' };
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch product' 
    };
  }
};

/**
 * Add a new product to Firestore
 */
export const addProduct = async (product: Omit<Product, 'id'>): Promise<ProductResult<Product>> => {
  try {
    // Add timestamps
    const productWithTimestamps = {
      ...product,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(productsCollection, productWithTimestamps);
    
    // Return the newly created product with ID
    return { 
      success: true, 
      data: { 
        id: docRef.id, 
        ...product,
        createdAt: new Date(),
        updatedAt: new Date()
      } 
    };
  } catch (error) {
    console.error('Error adding product:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to add product' 
    };
  }
};

/**
 * Update an existing product in Firestore
 */
export const updateProduct = async (id: string, updates: Partial<Product>): Promise<ProductResult<Product>> => {
  try {
    const docRef = doc(db, 'products', id);
    
    // Add timestamp for update
    const updatesWithTimestamp = {
      ...updates,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(docRef, updatesWithTimestamp);
    
    // Fetch the updated product to return
    const updatedProductResult = await fetchProductById(id);
    
    if (updatedProductResult.success && updatedProductResult.data) {
      return { success: true, data: updatedProductResult.data };
    } else {
      return { success: false, error: 'Failed to retrieve updated product' };
    }
  } catch (error) {
    console.error('Error updating product:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update product' 
    };
  }
};

/**
 * Delete a product from Firestore
 */
export const deleteProduct = async (id: string): Promise<ProductResult<boolean>> => {
  try {
    const docRef = doc(db, 'products', id);
    await deleteDoc(docRef);
    return { success: true, data: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete product' 
    };
  }
};

/**
 * Search products by name or SKU
 */
export const searchProducts = async (searchTerm: string): Promise<ProductResult<Product[]>> => {
  try {
    // In Firestore, searching by substring is limited
    // For a real app, you might want to use Firestore's array-contains or Algolia
    // Here we'll fetch all products and filter client-side for simplicity
    const result = await fetchProducts();
    
    if (!result.success || !result.data) {
      return result;
    }
    
    const filteredProducts = result.data.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return { success: true, data: filteredProducts };
  } catch (error) {
    console.error('Error searching products:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to search products' 
    };
  }
};

/**
 * Get products by category
 */
export const getProductsByCategory = async (category: string): Promise<ProductResult<Product[]>> => {
  try {
    const q = query(
      productsCollection, 
      where('category', '==', category),
      orderBy('name')
    );
    
    const querySnapshot = await getDocs(q);
    const products: Product[] = [];

    querySnapshot.forEach((doc) => {
      const productData = doc.data();
      products.push({
        id: doc.id,
        name: productData.name,
        sku: productData.sku,
        category: productData.category,
        price: productData.price,
        cost: productData.cost,
        description: productData.description,
        image: productData.image,
        isActive: productData.isActive,
        expiryDate: productData.expiryDate,
        stock: productData.stock,
        updatedAt: productData.updatedAt?.toDate?.() || new Date(),
        createdAt: productData.createdAt?.toDate?.() || new Date()
      });
    });
    
    return { success: true, data: products };
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch products by category' 
    };
  }
}; 
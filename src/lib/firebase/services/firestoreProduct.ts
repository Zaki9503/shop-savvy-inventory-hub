import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config';

// Define the Product interface
interface Product {
  id?: string;
  name: string;
  price: number;
  quantity: number;
  createdAt?: any;
  updatedAt?: any;
}

// Collection reference
const productsCollection = collection(db, 'products');

/**
 * Add a new product to Firestore
 * @param product - The product to add
 * @returns Promise with the added product including its ID
 */
export const addProductToFirestore = async (product: Omit<Product, 'id'>): Promise<Product> => {
  try {
    // Add timestamps
    const productWithTimestamps = {
      ...product,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    // Add to Firestore
    const docRef = await addDoc(productsCollection, productWithTimestamps);
    
    console.log('Product added with ID:', docRef.id);
    
    // Return the product with its new ID
    return {
      id: docRef.id,
      ...product,
    };
  } catch (error) {
    console.error('Error adding product to Firestore:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to add product to Firestore');
  }
};

/**
 * Fetch all products from Firestore
 * @returns Promise with an array of products
 */
export const fetchProductsFromFirestore = async (): Promise<Product[]> => {
  try {
    // Create a query ordered by name
    const q = query(productsCollection, orderBy('name'));
    
    // Execute the query
    const querySnapshot = await getDocs(q);
    
    // Convert the query results to an array of products
    const products: Product[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      products.push({
        id: doc.id,
        name: data.name,
        price: data.price,
        quantity: data.quantity,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      });
    });
    
    console.log('Fetched', products.length, 'products from Firestore');
    return products;
  } catch (error) {
    console.error('Error fetching products from Firestore:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch products from Firestore');
  }
};

/**
 * Add multiple products to Firestore in batch
 * @param products - Array of products to add
 * @returns Promise with array of added products including their IDs
 */
export const addMultipleProductsToFirestore = async (products: Omit<Product, 'id'>[]): Promise<Product[]> => {
  try {
    const addedProducts: Product[] = [];
    
    // Add each product
    for (const product of products) {
      const addedProduct = await addProductToFirestore(product);
      addedProducts.push(addedProduct);
    }
    
    console.log('Added', addedProducts.length, 'products to Firestore');
    return addedProducts;
  } catch (error) {
    console.error('Error adding multiple products to Firestore:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to add multiple products to Firestore');
  }
}; 
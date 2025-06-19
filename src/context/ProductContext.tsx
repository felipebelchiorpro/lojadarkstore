
"use client";

import type { Product } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { mockProducts as initialSeedProducts } from '@/data/mockData'; // Used as seed

interface ProductContextType {
  products: Product[];
  getProducts: () => Product[];
  getProductById: (id: string) => Product | undefined;
  addProduct: (product: Omit<Product, 'id' | 'salesCount' | 'rating' | 'reviews'>) => Product; // salesCount, rating, reviews handled internally if needed
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  loading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const PRODUCT_STORAGE_KEY = 'darkstore-products';

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem(PRODUCT_STORAGE_KEY);
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      } else {
        // Seed with mockData if no products are in localStorage
        const seededProducts = initialSeedProducts.map(p => ({
          ...p,
          salesCount: p.salesCount || 0, // Ensure defaults
          rating: p.rating || 0,
          reviews: p.reviews || [],
        }));
        setProducts(seededProducts);
        persistProducts(seededProducts);
      }
    } catch (error) {
      console.error("Failed to parse products from localStorage", error);
      const seededProductsOnError = initialSeedProducts.map(p => ({
        ...p,
        salesCount: p.salesCount || 0,
        rating: p.rating || 0,
        reviews: p.reviews || [],
      }));
      setProducts(seededProductsOnError); // Fallback to seed on error
      persistProducts(seededProductsOnError);
    }
    setLoading(false);
  }, []);

  const persistProducts = useCallback((updatedProducts: Product[]) => {
    try {
      localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(updatedProducts));
    } catch (error) {
      console.error("Failed to save products to localStorage", error);
    }
  }, []);

  const getProducts = useCallback(() => {
    return [...products];
  }, [products]);

  const getProductById = useCallback((id: string) => {
    return products.find(p => p.id === id);
  }, [products]);

  const addProduct = (productData: Omit<Product, 'id' | 'salesCount' | 'rating' | 'reviews'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, // More unique ID
      salesCount: 0,
      rating: 0,
      reviews: [],
      isNewRelease: productData.isNewRelease || false,
      originalPrice: productData.originalPrice || undefined,
    };
    const newProducts = [newProduct, ...products];
    setProducts(newProducts);
    persistProducts(newProducts);
    return newProduct;
  };

  const updateProduct = (updatedProduct: Product) => {
    const newProducts = products.map(p => (p.id === updatedProduct.id ? updatedProduct : p));
    setProducts(newProducts);
    persistProducts(newProducts);
  };

  const deleteProduct = (productId: string) => {
    const newProducts = products.filter(p => p.id !== productId);
    setProducts(newProducts);
    persistProducts(newProducts);
  };


  return (
    <ProductContext.Provider value={{ products, getProducts, getProductById, addProduct, updateProduct, deleteProduct, loading }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
};

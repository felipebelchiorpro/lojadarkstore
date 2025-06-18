"use client";

import type { CartItem, Product } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'darkstore-cart';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
      localStorage.removeItem(CART_STORAGE_KEY); // Clear corrupted cart data
    }
  }, []);

  const persistCart = useCallback((items: CartItem[]) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save cart to localStorage", error);
    }
  }, []);

  const addToCart = (product: Product, quantityToAdd: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      let newItems;
      if (existingItem) {
        newItems = prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: Math.min(item.quantity + quantityToAdd, product.stock) } : item
        );
      } else {
        newItems = [...prevItems, { ...product, quantity: Math.min(quantityToAdd, product.stock) }];
      }
      persistCart(newItems);
      return newItems;
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => {
      const newItems = prevItems.filter(item => item.id !== productId);
      persistCart(newItems);
      return newItems;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCartItems(prevItems => {
      const productInCart = prevItems.find(item => item.id === productId);
      if (!productInCart) return prevItems;

      const newQuantity = Math.max(0, Math.min(quantity, productInCart.stock));
      if (newQuantity === 0) {
        const newItems = prevItems.filter(item => item.id !== productId);
        persistCart(newItems);
        return newItems;
      }
      const newItems = prevItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
      persistCart(newItems);
      return newItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    persistCart([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartItemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

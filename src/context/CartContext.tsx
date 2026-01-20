"use client";

import type { CartItem, Product } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { syncCartAction } from '@/actions/cart';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product & { couponCode?: string }, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'darkstore-cart';
const CART_ID_KEY = 'darkstore-cart-id';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string>('');

  useEffect(() => {
    // 1. Load Cart
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
      localStorage.removeItem(CART_STORAGE_KEY);
    }

    // 2. Initialize Cart ID
    let id = localStorage.getItem(CART_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(CART_ID_KEY, id);
    }
    setCartId(id);
  }, []);

  // Sync with Server (Debounced)
  useEffect(() => {
    if (!cartId || cartItems.length === 0) return;

    const timeoutId = setTimeout(() => {
      const total = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

      console.log(`Syncing cart ${cartId} to server...`);
      syncCartAction(cartId, cartItems, total)
        .then(res => {
          if (!res.success) console.error("Cart Sync Failed:", res.message);
          else console.log("Cart Sync Success");
        })
        .catch(err => console.error("Cart Sync Exception:", err));
    }, 2000); // 2 seconds debounce

    return () => clearTimeout(timeoutId);
  }, [cartItems, cartId]);

  const persistCart = useCallback((items: CartItem[]) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save cart to localStorage", error);
    }
  }, []);

  const addToCart = (product: Product & { couponCode?: string }, quantityToAdd: number = 1) => {
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

'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { MenuItem, CartItem } from '@/lib/mock-data';

interface CartContextType {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;
  addItem: (item: MenuItem, restaurantId: string, restaurantName: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState<string | null>(null);

  const addItem = useCallback((item: MenuItem, restId: string, restName: string) => {
    // If adding from a different restaurant, clear cart
    if (restaurantId && restaurantId !== restId) {
      setItems([]);
    }
    setRestaurantId(restId);
    setRestaurantName(restName);
    
    setItems(prev => {
      const existing = prev.find(ci => ci.menu_item.id === item.id);
      if (existing) {
        return prev.map(ci =>
          ci.menu_item.id === item.id
            ? { ...ci, quantity: ci.quantity + 1 }
            : ci
        );
      }
      return [...prev, { id: `cart-${Date.now()}`, menu_item: item, quantity: 1, item_notes: '' }];
    });
  }, [restaurantId]);

  const removeItem = useCallback((itemId: string) => {
    setItems(prev => {
      const next = prev.filter(ci => ci.menu_item.id !== itemId);
      if (next.length === 0) {
        setRestaurantId(null);
        setRestaurantName(null);
      }
      return next;
    });
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems(prev =>
      prev.map(ci =>
        ci.menu_item.id === itemId ? { ...ci, quantity } : ci
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    setRestaurantId(null);
    setRestaurantName(null);
  }, []);

  const itemCount = items.reduce((sum, ci) => sum + ci.quantity, 0);
  const subtotal = items.reduce((sum, ci) => sum + ci.menu_item.price * ci.quantity, 0);

  return (
    <CartContext.Provider value={{ items, restaurantId, restaurantName, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}

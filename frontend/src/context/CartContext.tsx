'use client';

import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { CartItem } from '@/types/cart';
import toast from 'react-hot-toast';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string } // sku
  | { type: 'UPDATE_QTY'; payload: { sku: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_DRAWER'; payload?: boolean }
  | { type: 'LOAD'; payload: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'LOAD':
      return { ...state, items: action.payload };

    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.sku === action.payload.sku);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.sku === action.payload.sku ? { ...i, quantity: i.quantity + action.payload.quantity } : i
          ),
        };
      }
      return { ...state, items: [...state.items, action.payload] };
    }

    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.sku !== action.payload) };

    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map((i) =>
          i.sku === action.payload.sku ? { ...i, quantity: Math.max(1, action.payload.quantity) } : i
        ),
      };

    case 'CLEAR_CART':
      return { ...state, items: [] };

    case 'TOGGLE_DRAWER':
      return { ...state, isOpen: action.payload !== undefined ? action.payload : !state.isOpen };

    default:
      return state;
  }
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  subtotal: number;
  addItem: (item: CartItem) => void;
  removeItem: (sku: string) => void;
  updateQuantity: (sku: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  // Persist to localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mms_cart');
    if (saved) dispatch({ type: 'LOAD', payload: JSON.parse(saved) });
  }, []);

  useEffect(() => {
    localStorage.setItem('mms_cart', JSON.stringify(state.items));
  }, [state.items]);

  const addItem = useCallback((item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
    dispatch({ type: 'TOGGLE_DRAWER', payload: true });
    toast.success(`${item.name} added to cart`);
  }, []);

  const removeItem = useCallback((sku: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: sku });
  }, []);

  const updateQuantity = useCallback((sku: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QTY', payload: { sku, quantity } });
  }, []);

  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), []);
  const openCart = useCallback(() => dispatch({ type: 'TOGGLE_DRAWER', payload: true }), []);
  const closeCart = useCallback(() => dispatch({ type: 'TOGGLE_DRAWER', payload: false }), []);

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items: state.items, isOpen: state.isOpen, itemCount, subtotal, addItem, removeItem, updateQuantity, clearCart, openCart, closeCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

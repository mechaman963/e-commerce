"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from "react";
import { Axios } from "@/axios";
import Cookies from "universal-cookie";

// Types
export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
  product: {
    id: number;
    title: string;
    description: string;
    price: number;
    sale: number;
    category_id: number;
    images: Array<{ id: number; image: string }>;
    category: { id: number; title: string };
  };
}

export interface CartSummary {
  subtotal: number;
  total_items: number;
  items_count: number;
}

interface CartState {
  items: CartItem[];
  summary: CartSummary;
  loading: boolean;
  error: string | null;
}

type CartAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_CART"; payload: { items: CartItem[]; summary: CartSummary } }
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "UPDATE_ITEM"; payload: { id: number; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "CLEAR_CART" };

const initialState: CartState = {
  items: [],
  summary: { subtotal: 0, total_items: 0, items_count: 0 },
  loading: false,
  error: null,
};

// Reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_CART":
      return { ...state, items: action.payload.items, summary: action.payload.summary, loading: false, error: null };
    case "ADD_ITEM":
      return { ...state, items: [...state.items, action.payload], loading: false, error: null };
    case "UPDATE_ITEM":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
        ),
        loading: false,
      };
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.id !== action.payload), loading: false };
    case "CLEAR_CART":
      return { ...state, items: [], summary: { subtotal: 0, total_items: 0, items_count: 0 }, loading: false };
    default:
      return state;
  }
}

interface CartContextType {
  state: CartState;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateCartItem: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartCount: () => Promise<number>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const cookies = useMemo(() => new Cookies(), []);

  const isAuthenticated = useCallback(() => !!cookies.get("Bearer"), [cookies]);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated()) {
      dispatch({ type: "CLEAR_CART" });
      return;
    }
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const res = await Axios.get("/cart");
      if (res.data.success) {
        dispatch({ type: "SET_CART", payload: { items: res.data.data.items, summary: res.data.data.summary } });
      }
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch cart" });
    }
  }, [isAuthenticated]);

  const addToCart = async (productId: number, quantity = 1) => {
    if (!isAuthenticated()) return dispatch({ type: "SET_ERROR", payload: "Please login" });

    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const res = await Axios.post("/cart", { product_id: productId, quantity });
      if (res.data.success) {
        await fetchCart(); // refresh summary
      }
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Failed to add to cart" });
    }
  };

  const updateCartItem = async (itemId: number, quantity: number) => {
    if (!isAuthenticated()) return;
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const res = await Axios.put(`/cart/${itemId}`, { quantity });
      if (res.data.success) {
        dispatch({ type: "UPDATE_ITEM", payload: { id: itemId, quantity } });
        await fetchCart();
      }
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Failed to update item" });
    }
  };

  const removeFromCart = async (itemId: number) => {
    if (!isAuthenticated()) return;
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const res = await Axios.delete(`/cart/${itemId}`);
      if (res.data.success) {
        dispatch({ type: "REMOVE_ITEM", payload: itemId });
        await fetchCart();
      }
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Failed to remove item" });
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated()) return;
    try {
      const res = await Axios.delete("/cart");
      if (res.data.success) dispatch({ type: "CLEAR_CART" });
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Failed to clear cart" });
    }
  };

  const getCartCount = async (): Promise<number> => {
    if (!isAuthenticated()) return 0;
    try {
      const res = await Axios.get("/cart/count");
      return res.data.success ? res.data.data.count : 0;
    } catch {
      return 0;
    }
  };

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return <CartContext.Provider value={{ state, fetchCart, addToCart, updateCartItem, removeFromCart, clearCart, getCartCount }}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
};

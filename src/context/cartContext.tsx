"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { Axios, clearCacheEntry } from "@/axios"; // adjust path if needed

// --- Types ---
interface Product {
  id: number;
  title: string;
  price: number;
  images?: { id: number; image: string }[];
}

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product: Product;
}

export interface CartSummary {
  total: number;
  subtotal: number;
  item_count: number;
}

interface CartState {
  items: CartItem[];
  summary: CartSummary | null;
  loading: boolean;
}

type Action =
  | { type: "SET_CART"; payload: { items: CartItem[]; summary: CartSummary } }
  | { type: "SET_LOADING"; payload: boolean };

// --- Initial State ---
const initialState: CartState = {
  items: [],
  summary: null,
  loading: false,
};

// --- Reducer ---
function cartReducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "SET_CART":
      return {
        ...state,
        items: action.payload.items,
        summary: action.payload.summary,
        loading: false,
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

// --- Context ---
const CartContext = createContext<{
  state: CartState;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateCartItem: (id: number, quantity: number) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  clearCart: () => Promise<void>;
} | null>(null);

// --- Provider ---
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const fetchCart = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const res = await Axios.get("/cart");
      dispatch({ type: "SET_CART", payload: res.data });
    } catch (err) {
      console.error("Failed to fetch cart", err);
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const addToCart = async (productId: number, quantity: number) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const res = await Axios.post("/cart", { product_id: productId, quantity });
      clearCacheEntry("/cart");
      clearCacheEntry("/cart/count");
      dispatch({ type: "SET_CART", payload: res.data });
    } catch (err) {
      console.error("Failed to add to cart", err);
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const updateCartItem = async (id: number, quantity: number) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const res = await Axios.put(`/cart/${id}`, { quantity });
      clearCacheEntry("/cart");
      clearCacheEntry("/cart/count");
      dispatch({ type: "SET_CART", payload: res.data });
    } catch (err) {
      console.error("Failed to update cart item", err);
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const removeFromCart = async (id: number) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const res = await Axios.delete(`/cart/${id}`);
      clearCacheEntry("/cart");
      clearCacheEntry("/cart/count");
      dispatch({ type: "SET_CART", payload: res.data });
    } catch (err) {
      console.error("Failed to remove from cart", err);
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const clearCart = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const res = await Axios.delete("/cart");
      clearCacheEntry("/cart");
      clearCacheEntry("/cart/count");
      dispatch({ type: "SET_CART", payload: res.data });
    } catch (err) {
      console.error("Failed to clear cart", err);
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        state,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};

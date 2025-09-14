"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { Axios, clearCacheEntry } from "@/axios";

// Cart item type (adjust to match backend payload)
export interface CartItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  total: number;
  [key: string]: unknown; // allow extra fields without breaking
}

export interface CartSummary {
  subtotal: number;
  tax: number;
  total: number;
  [key: string]: unknown;
}

interface CartState {
  items: CartItem[];
  summary: CartSummary | null;
  loading: boolean;
}

type Action =
  | { type: "SET_CART"; payload: { items: CartItem[]; summary: CartSummary } }
  | { type: "SET_LOADING"; payload: boolean };

const initialState: CartState = {
  items: [],
  summary: null,
  loading: false,
};

function cartReducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "SET_CART":
      return { ...state, items: action.payload.items, summary: action.payload.summary, loading: false };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

interface CartContextValue {
  state: CartState;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateCartItem: (id: number, quantity: number) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
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
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

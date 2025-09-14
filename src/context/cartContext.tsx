"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { Axios, clearCacheEntry } from "@/api/axios"; // adjust path if needed

interface CartState {
  items: any[];
  summary: any;
  loading: boolean;
}

type Action =
  | { type: "SET_CART"; payload: { items: any[]; summary: any } }
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

const CartContext = createContext<any>(null);

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

export const useCart = () => useContext(CartContext);

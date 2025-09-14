"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import * as api from "@/api/cart"; // adjust path if different

const CartContext = createContext(null);

const initialState = {
  items: [],
  summary: { subtotal: 0, total_items: 0, items_count: 0 },
  loading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "LOADING":
      return { ...state, loading: true };
    case "SET_CART":
      return {
        ...state,
        loading: false,
        items: action.payload.items,
        summary: action.payload.summary,
        error: null,
      };
    case "ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // 🔹 Fetch full cart from backend
  const fetchCart = async () => {
    dispatch({ type: "LOADING" });
    try {
      const res = await api.getCart();
      dispatch({ type: "SET_CART", payload: res });
    } catch (err) {
      dispatch({ type: "ERROR", payload: err });
    }
  };

  // 🔹 Add item -> replace with updated cart from backend
  const addToCart = async (productId, quantity) => {
    dispatch({ type: "LOADING" });
    try {
      const res = await api.addToCart(productId, quantity);
      dispatch({ type: "SET_CART", payload: res }); // full updated cart
    } catch (err) {
      dispatch({ type: "ERROR", payload: err });
    }
  };

  const updateCartItem = async (id, quantity) => {
    dispatch({ type: "LOADING" });
    try {
      const res = await api.updateCartItem(id, quantity);
      dispatch({ type: "SET_CART", payload: res });
    } catch (err) {
      dispatch({ type: "ERROR", payload: err });
    }
  };

  const removeFromCart = async (id) => {
    dispatch({ type: "LOADING" });
    try {
      const res = await api.removeFromCart(id);
      dispatch({ type: "SET_CART", payload: res });
    } catch (err) {
      dispatch({ type: "ERROR", payload: err });
    }
  };

  const clearCart = async () => {
    dispatch({ type: "LOADING" });
    try {
      const res = await api.clearCart();
      dispatch({ type: "SET_CART", payload: res });
    } catch (err) {
      dispatch({ type: "ERROR", payload: err });
    }
  };

  // 🔹 Load cart on first render
  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{ state, fetchCart, addToCart, updateCartItem, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

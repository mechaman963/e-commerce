"use client";

import React, { createContext, useContext, useReducer } from "react";
import { Axios } from "@/axios";

// Cart types
interface Product {
  id: number;
  title: string;
  images?: { image: string }[];
  price: number;
}

interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

interface CartSummary {
  total: number;
  itemCount: number;
}

interface CartState {
  items: CartItem[];
  summary: CartSummary | null;
  loading: boolean;
}

type Action =
  | { type: "SET_CART"; payload: { items: CartItem[]; summary: CartSummary | null } }
  | { type: "SET_LOADING"; payload: boolean };

const initialState: CartState = {
  items: [],
  summary: null,
  loading: false,
};

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "SET_CART":
      return {
        ...state,
        items: action.payload.items || [],
        summary: action.payload.summary || null,
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

const CartContext = createContext<any>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Fetch cart
  const fetchCart = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const res = await Axios.get("/cart");
      dispatch({
        type: "SET_CART",
        payload: {
          items: res.data.items || [],
          summary: res.data.summary || null,
        },
      });
    } catch (err) {
      console.error("Fetch cart error:", err);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Add item
  const addToCart = async (productId: number, quantity: number) => {
    await Axios.post("/cart", { product_id: productId, quantity });
    await fetchCart();
  };

  // Update item
  const updateCartItem = async (id: number, quantity: number) => {
    await Axios.put(`/cart/${id}`, { quantity });
    await fetchCart();
  };

  // Remove item
  const removeFromCart = async (id: number) => {
    await Axios.delete(`/cart/${id}`);
    await fetchCart();
  };

  // Clear cart
  const clearCart = async () => {
    await Axios.delete("/cart/clear");
    await fetchCart();
  };

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

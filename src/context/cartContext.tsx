"use client";

import React, { createContext, useContext, useReducer, Dispatch } from "react";
import { Axios } from "@/lib/axios";

// Cart types
interface Product {
  id: number;
  title: string;
  images?: { image: string }[];
  price: number;
}

export interface CartItem {
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

interface CartContextType {
  state: CartState;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateCartItem: (id: number, quantity: number) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

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

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

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

  const addToCart = async (productId: number, quantity: number) => {
    await Axios.post("/cart", { product_id: productId, quantity });
    await fetchCart();
  };

  const updateCartItem = async (id: number, quantity: number) => {
    await Axios.put(`/cart/${id}`, { quantity });
    await fetchCart();
  };

  const removeFromCart = async (id: number) => {
    await Axios.delete(`/cart/${id}`);
    await fetchCart();
  };

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

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

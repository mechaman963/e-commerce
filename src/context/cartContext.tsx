"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from "react";
import { Axios } from "@/axios";
import Cookies from "universal-cookie";

// Error handling types
interface ApiErrorResponseData {
  message?: string;
  errors?: Record<string, string[]>;
  [key: string]: unknown;
}

interface ApiErrorResponse {
  data?: ApiErrorResponseData;
  status?: number;
  statusText?: string;
  headers?: Record<string, string>;
  config?: unknown;
}

interface ApiError extends Error {
  response?: ApiErrorResponse;
  request?: unknown;
  config?: unknown;
  code?: string;
  isAxiosError?: boolean;
}

function isApiError(error: unknown): error is ApiError {
  return error instanceof Error && 'response' in error;
}

function getErrorMessage(error: unknown, defaultMessage: string): string {
  if (!isApiError(error)) {
    return defaultMessage;
  }
  
  // Check for validation errors
  if (error.response?.status === 422 && error.response.data?.errors) {
    const errorMessages = Object.values(error.response.data.errors)
      .flat()
      .filter(Boolean);
    return errorMessages.length > 0 
      ? errorMessages.join('\n') 
      : defaultMessage;
  }
  
  // Return the error message or fallback to default
  return error.response?.data?.message || defaultMessage;
}

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
    images: Array<{
      id: number;
      image: string;
    }>;
    category: {
      id: number;
      title: string;
    };
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
  summary: {
    subtotal: 0,
    total_items: 0,
    items_count: 0,
  },
  loading: false,
  error: null,
};

// Cart reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_CART":
      return {
        ...state,
        items: action.payload.items,
        summary: action.payload.summary,
        loading: false,
        error: null,
      };
    case "ADD_ITEM":
      return {
        ...state,
        items: [...state.items, action.payload],
        loading: false,
        error: null,
      };
    case "UPDATE_ITEM":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        loading: false,
        error: null,
      };
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
        loading: false,
        error: null,
      };
    case "CLEAR_CART":
      return {
        ...state,
        items: [],
        summary: {
          subtotal: 0,
          total_items: 0,
          items_count: 0,
        },
        loading: false,
        error: null,
      };
    default:
      return state;
  }
}

// Context
interface CartContextType {
  state: CartState;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateCartItem: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartCount: () => Promise<number>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart Provider
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const cookies = useMemo(() => new Cookies(), []);

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    const token = cookies.get("Bearer");
    return !!token;
  }, [cookies]);

  // Fetch cart items
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated()) {
      // Don't show error for unauthenticated users, just clear the cart
      dispatch({ type: "CLEAR_CART" });
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await Axios.get("/cart");
      if (response.data.success) {
        dispatch({
          type: "SET_CART",
          payload: {
            items: response.data.data.items,
            summary: response.data.data.summary,
          },
        });
      } else {
        dispatch({ type: "SET_ERROR", payload: response.data.message });
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error, "Failed to fetch cart");
      dispatch({
        type: "SET_ERROR",
        payload: errorMessage,
      });
    }
  }, [isAuthenticated]);

  // Add item to cart
  const addToCart = async (productId: number, quantity: number = 1) => {
    if (!isAuthenticated()) {
      dispatch({ type: "SET_ERROR", payload: "Please login to add items to cart" });
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await Axios.post("/cart", {
        product_id: productId,
        quantity,
      });

      if (response.data.success) {
        // Refresh cart to get updated data
        await fetchCart();
      } else {
        dispatch({ type: "SET_ERROR", payload: response.data.message });
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error, "Failed to add item to cart");
      dispatch({
        type: "SET_ERROR",
        payload: errorMessage,
      });
    }
  };

  // Update cart item quantity
  const updateCartItem = async (itemId: number, quantity: number) => {
    if (!isAuthenticated()) {
      dispatch({ type: "SET_ERROR", payload: "User not authenticated" });
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await Axios.put(`/cart/${itemId}`, { quantity });

      if (response.data.success) {
        dispatch({
          type: "UPDATE_ITEM",
          payload: { id: itemId, quantity },
        });
        // Refresh cart to get updated summary
        await fetchCart();
      } else {
        dispatch({ type: "SET_ERROR", payload: response.data.message });
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error, "Failed to update cart item");
      dispatch({
        type: "SET_ERROR",
        payload: errorMessage,
      });
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId: number) => {
    if (!isAuthenticated()) {
      dispatch({ type: "SET_ERROR", payload: "User not authenticated" });
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await Axios.delete(`/cart/${itemId}`);

      if (response.data.success) {
        dispatch({ type: "REMOVE_ITEM", payload: itemId });
        // Refresh cart to get updated summary
        await fetchCart();
      } else {
        dispatch({ type: "SET_ERROR", payload: response.data.message });
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error, "Failed to remove item from cart");
      dispatch({
        type: "SET_ERROR",
        payload: errorMessage,
      });
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    if (!isAuthenticated()) {
      dispatch({ type: "SET_ERROR", payload: "User not authenticated" });
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await Axios.delete("/cart");

      if (response.data.success) {
        dispatch({ type: "CLEAR_CART" });
      } else {
        dispatch({ type: "SET_ERROR", payload: response.data.message });
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error, "Failed to clear cart");
      dispatch({
        type: "SET_ERROR",
        payload: errorMessage,
      });
    }
  };

  // Get cart count
  const getCartCount = async (): Promise<number> => {
    if (!isAuthenticated()) {
      return 0;
    }

    try {
      const response = await Axios.get("/cart/count");
      if (response.data.success) {
        return response.data.data.count;
      }
      return 0;
    } catch {
      return 0;
    }
  };

  // Load cart on mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const value: CartContextType = {
    state,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

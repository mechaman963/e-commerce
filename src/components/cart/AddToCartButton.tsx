"use client";

import React, { useState } from "react";
import { ShoppingCart, Plus, Minus, Loader2 } from "lucide-react";
import { useCart } from "@/context/cartContext";

interface AddToCartButtonProps {
  productId: number;
  className?: string;
  showQuantitySelector?: boolean;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  productId,
  className = "",
  showQuantitySelector = true,
  variant = "default",
  size = "md",
}) => {
  const { addToCart, state } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart(productId, quantity);
      // Reset quantity after successful add
      setQuantity(1);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const incrementQuantity = () => {
    if (quantity < 99) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const getButtonClasses = () => {
    const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const sizeClasses = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg"
    };

    const variantClasses = {
      default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
      outline: "border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500",
      ghost: "text-blue-600 hover:bg-blue-50 focus:ring-blue-500"
    };

    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
  };

  const getQuantityButtonClasses = () => {
    return "p-1 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  };

  return (
    <div className="flex items-center space-x-3">
      {showQuantitySelector && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Qty:</span>
          <div className="flex items-center space-x-1">
            <button
              onClick={decrementQuantity}
              disabled={quantity <= 1 || isAdding}
              className={getQuantityButtonClasses()}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-semibold">{quantity}</span>
            <button
              onClick={incrementQuantity}
              disabled={quantity >= 99 || isAdding}
              className={getQuantityButtonClasses()}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={handleAddToCart}
        disabled={isAdding || state.loading}
        className={getButtonClasses()}
      >
        {isAdding ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Adding...
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </>
        )}
      </button>
    </div>
  );
};

export default AddToCartButton;

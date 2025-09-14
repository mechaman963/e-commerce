"use client";

import React, { useState } from "react";
import { ShoppingCart, Plus, Minus, Loader2 } from "lucide-react";
import { useCart } from "@/context/cartContext";

interface Props {
  productId: number;
  className?: string;
  showQuantitySelector?: boolean;
  variant?: "default" | "outline"; // you can expand variants later
  size?: "sm" | "md" | "lg";
}

const AddToCartButton: React.FC<Props> = ({
  productId,
  className = "",
  showQuantitySelector = true,
  variant = "default",
  size = "md",
}) => {
  const { addToCart, state } = useCart();
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    await addToCart(productId, qty);
    setQty(1); // reset
    setLoading(false);
  };

  // simple size mapping
  const sizeClasses = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showQuantitySelector && (
        <div className="flex items-center">
          <button
            disabled={qty <= 1 || loading}
            onClick={() => setQty(qty - 1)}
            className="p-1 border rounded"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-2">{qty}</span>
          <button
            disabled={qty >= 99 || loading}
            onClick={() => setQty(qty + 1)}
            className="p-1 border rounded"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}
      <button
        disabled={loading || state.loading}
        onClick={handleAdd}
        className={`rounded flex items-center justify-center ${sizeClasses[size]} ${variantClasses[variant]}`}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ShoppingCart className="w-4 h-4 mr-1" />
        )}
        {loading ? "Adding..." : "Add to Cart"}
      </button>
    </div>
  );
};

export default AddToCartButton;

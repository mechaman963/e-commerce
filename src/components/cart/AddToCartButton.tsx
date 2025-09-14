"use client";

import React, { useState } from "react";
import { useCart } from "@/context/cartContext";

interface AddToCartButtonProps {
  productId: number;
  quantity: number; // ✅ parent passes this
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  productId,
  quantity,
}) => {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      await addToCart(productId, quantity); // ✅ use parent-provided quantity
    } catch (error) {
      console.error("Error adding item to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? "Adding..." : "Add to Cart"}
    </button>
  );
};

export default AddToCartButton;

"use client";

import React, { useState } from "react";
import { ShoppingCart, Plus, Minus, Loader2 } from "lucide-react";
import { useCart } from "@/context/cartContext";

interface Props {
  productId: number;
}

const AddToCartButton: React.FC<Props> = ({ productId }) => {
  const { addToCart, state } = useCart();
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    await addToCart(productId, qty);
    setQty(1); // reset
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        <button disabled={qty <= 1 || loading} onClick={() => setQty(qty - 1)} className="p-1 border rounded">
          <Minus className="w-4 h-4" />
        </button>
        <span className="px-2">{qty}</span>
        <button disabled={qty >= 99 || loading} onClick={() => setQty(qty + 1)} className="p-1 border rounded">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <button disabled={loading || state.loading} onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4 mr-1 inline" />}
        {loading ? "Adding..." : "Add to Cart"}
      </button>
    </div>
  );
};

export default AddToCartButton;

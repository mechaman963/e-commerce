"use client";

import React, { useState } from "react";
import { ShoppingCart, Loader2, Plus, Minus } from "lucide-react";
import { useCart } from "@/context/cartContext";

const AddToCartButton: React.FC<{ productId: number }> = ({ productId }) => {
  const { addToCart, state } = useCart();
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    await addToCart(productId, qty);
    setQty(1);
    setLoading(false);
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center border rounded-md">
        <button onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty === 1} className="px-2"><Minus className="w-4 h-4" /></button>
        <span className="px-3">{qty}</span>
        <button onClick={() => setQty(q => Math.min(99, q + 1))} className="px-2"><Plus className="w-4 h-4" /></button>
      </div>
      <button onClick={handleAdd} disabled={loading || state.loading} className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ShoppingCart className="w-4 h-4 mr-2" />}
        Add to Cart
      </button>
    </div>
  );
};

export default AddToCartButton;

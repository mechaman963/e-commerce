"use client";

import React, { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/cartContext";
import CartModal from "./CartModal";

const CartIcon = () => {
  const { state, getCartCount } = useCart();
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const updateCount = async () => setCount(await getCartCount());
    updateCount();
  }, [state.items, getCartCount]);

  return (
    <div className="relative">
      <button onClick={() => setOpen(true)} className="relative p-2 rounded hover:bg-gray-100">
        <ShoppingCart className="w-6 h-6" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>
      <CartModal isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default CartIcon;

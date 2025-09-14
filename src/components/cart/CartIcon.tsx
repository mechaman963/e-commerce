"use client";

import React, { useEffect, useState, useRef } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/cartContext";
import CartModal from "./CartModal";

const CartIcon: React.FC = () => {
  const { getCartCount, state } = useCart();
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadCount = async () => setCount(await getCartCount());
    loadCount();
  }, [state.items, getCartCount]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="p-2 hover:bg-gray-100 rounded-lg relative">
        <ShoppingCart className="w-6 h-6" />
        {count > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">{count}</span>}
      </button>
      <CartModal isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default CartIcon;

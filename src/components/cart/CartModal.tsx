"use client";

import React from "react";
import { X, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/cartContext";
import Image from "next/image";
import Link from "next/link";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { state, removeFromCart } = useCart();
  const { items: cartItems, summary, loading } = state;

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-2 z-50">
      <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
      <div className="w-80 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="text-lg font-semibold">Cart ({cartItems.length})</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-md"><X className="w-5 h-5" /></button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading && <p className="p-4 text-center">Loading...</p>}
            {!loading && cartItems.length === 0 && (
              <div className="p-6 text-center">
                <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Your cart is empty</p>
              </div>
            )}
            {!loading && cartItems.map(item => (
              <div key={item.id} className="flex gap-3 p-4 border-b">
                <Image src={item.product.images?.[0]?.image || "/api/placeholder/300/300"} alt={item.product.title} width={50} height={50} className="rounded" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.product.title}</p>
                  <p className="text-xs text-gray-500">${item.price} × {item.quantity}</p>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>

          {cartItems.length > 0 && (
            <div className="p-4 border-t bg-gray-50">
              <div className="flex justify-between text-sm mb-3">
                <span>Subtotal</span>
                <span className="font-semibold">${summary.subtotal.toFixed(2)}</span>
              </div>
              <Link href="/cart" onClick={onClose} className="block text-center bg-blue-600 text-white py-2 rounded-md">View Cart</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;

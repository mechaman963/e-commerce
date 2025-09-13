"use client";

import React from "react";
import { X, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/cartContext";
import Image from "next/image";
import Link from "next/link";

const CartModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { state, removeFromCart } = useCart();
  const { items, summary, loading } = state;

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-2 z-50 w-80 bg-white rounded-lg shadow border">
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <h2 className="font-semibold">Cart ({items.length})</h2>
        <button onClick={onClose}><X /></button>
      </div>

      {items.length === 0 && !loading ? (
        <div className="p-6 text-center text-gray-500">
          <ShoppingBag className="w-10 h-10 mx-auto mb-2" />
          Cart is empty
        </div>
      ) : (
        <div className="p-4 max-h-64 overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-2 border-b py-2">
              <Image src={item.product.images?.[0]?.image || "/api/placeholder/50/50"} alt={item.product.title} width={40} height={40} />
              <div className="flex-1">
                <p className="text-sm">{item.product.title}</p>
                <p className="text-xs text-gray-500">${item.price} × {item.quantity}</p>
              </div>
              <button onClick={() => removeFromCart(item.id)}><Trash2 className="w-4 h-4 text-red-500" /></button>
            </div>
          ))}
        </div>
      )}

      {items.length > 0 && (
        <div className="px-4 py-3 border-t bg-gray-50">
          <p className="text-sm font-medium flex justify-between">
            <span>Subtotal:</span> <span>${summary.subtotal.toFixed(2)}</span>
          </p>
          <Link href="/cart" onClick={onClose} className="mt-2 block bg-blue-600 text-white text-center py-2 rounded">View Cart</Link>
        </div>
      )}
    </div>
  );
};

export default CartModal;

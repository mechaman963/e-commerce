"use client";

import React from "react";
import { useCart } from "@/context/cartContext";
import Image from "next/image";
import { Trash2, Plus, Minus } from "lucide-react";
import Link from "next/link";

const CartPage: React.FC = () => {
  const { state, updateCartItem, removeFromCart, clearCart } = useCart();
  const { items, summary, loading } = state;

  if (loading) {
    return <div className="p-8 text-center">Loading cart...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg font-medium">Your cart is empty</p>
        <Link href="/" className="text-blue-600 hover:underline mt-2 block">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Shopping Cart</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="md:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.id} className="flex items-center border rounded-lg p-4 gap-4">
              <Image
                src={item.product.images?.[0]?.image || "/api/placeholder/200/200"}
                alt={item.product.title}
                width={80}
                height={80}
                className="rounded"
              />
              <div className="flex-1">
                <h2 className="text-sm font-medium">{item.product.title}</h2>
                <p className="text-gray-500 text-sm">${item.product.price.toFixed(2)}</p>

                {/* Quantity controls */}
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => updateCartItem(item.id, Math.max(1, item.quantity - 1))}
                    className="p-1 border rounded hover:bg-gray-100"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3">{item.quantity}</span>
                  <button
                    onClick={() => updateCartItem(item.id, item.quantity + 1)}
                    className="p-1 border rounded hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="border rounded-lg p-6 h-fit">
          <h2 className="text-lg font-semibold mb-4">Summary</h2>
          <div className="flex justify-between mb-2 text-sm">
            <span>Items</span>
            {summary && <span>{summary.item_count}</span>}
          </div>
          <div className="flex justify-between mb-4 text-sm">
            <span>Subtotal</span>
            {summary && <span>${summary?.subtotal.toFixed(2)}</span>}
          </div>

          <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
            Checkout
          </button>

          <button
            onClick={clearCart}
            className="w-full mt-3 text-red-600 text-sm hover:underline"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

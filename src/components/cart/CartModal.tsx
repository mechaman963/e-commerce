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
  const { items: cartItems, summary, loading, error } = state;

  const handleRemoveItem = async (itemId: number) => {
    await removeFromCart(itemId);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-2 z-50">
      {/* Dropdown Arrow */}
      <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
      
      {/* Dropdown Content */}
      <div className="w-80 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-hidden">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Shopping Cart ({cartItems.length})
            </h2>
            <button
              onClick={onClose}
              className="rounded-md p-2 hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-80 overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            )}

            {error && (
              <div className="p-4 text-center">
                <div className="text-red-600 text-sm mb-2">{error}</div>
                <button
                  onClick={() => window.location.reload()}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Try Again
                </button>
              </div>
            )}

            {!loading && !error && cartItems.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 px-4">
                <ShoppingBag className="h-12 w-12 text-gray-300 mb-3" />
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  Your cart is empty
                </h3>
                <p className="text-gray-500 text-xs text-center mb-4">
                  Add some products to get started
                </p>
                <button
                  onClick={onClose}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}

            {!loading && !error && cartItems.length > 0 && (
              <div className="p-4 space-y-3">
                {cartItems.slice(0, 3).map((item) => {
                  const productImage = item.product.images?.[0]?.image || "/api/placeholder/300/300";
                  const itemTotal = item.price * item.quantity;

                  return (
                    <div key={item.id} className="flex gap-3 pb-3 border-b border-gray-100 last:border-b-0">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <Image
                          src={productImage}
                          alt={item.product.title}
                          width={50}
                          height={50}
                          className="rounded object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-medium text-gray-900 line-clamp-2 mb-1">
                          {item.product.title}
                        </h4>

                        {/* Price and Quantity */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-semibold text-gray-900">
                              ${itemTotal.toFixed(2)}
                            </span>
                            <span className="text-xs text-gray-500">
                              (${item.price} × {item.quantity})
                            </span>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={loading}
                            className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {cartItems.length > 3 && (
                  <div className="text-center py-2">
                    <span className="text-xs text-gray-500">
                      +{cartItems.length - 3} more items
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {!loading && !error && cartItems.length > 0 && (
            <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
              {/* Summary */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-900">
                  Subtotal ({summary.total_items} items)
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  ${summary.subtotal.toFixed(2)}
                </span>
              </div>

              {/* Action Button */}
              <Link
                href="/cart"
                onClick={onClose}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded text-sm hover:bg-blue-700 transition-colors font-medium text-center block"
              >
                View Cart & Checkout
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;

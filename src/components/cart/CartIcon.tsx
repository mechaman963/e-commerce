"use client";

import React, { useEffect, useState, useRef } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/cartContext";
import CartModal from "./CartModal";

interface CartIconProps {
  className?: string;
  showCount?: boolean;
}

const CartIcon: React.FC<CartIconProps> = ({ 
  className = "", 
  showCount = true 
}) => {
  const { state, getCartCount } = useCart();
  const [cartCount, setCartCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCartCount = async () => {
      const count = await getCartCount();
      setCartCount(count);
    };

    fetchCartCount();
  }, [state.items, getCartCount]); // Update when cart items change

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  const handleCartClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleCartClick}
        className={`relative inline-flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors ${className}`}
      >
        <ShoppingCart className="w-6 h-6" />
        {showCount && cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {cartCount > 99 ? "99+" : cartCount}
          </span>
        )}
      </button>
      
      <CartModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </div>
  );
};

export default CartIcon;

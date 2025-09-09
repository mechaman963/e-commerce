"use client";

import { Heart } from "lucide-react";
import { useFavorites, TProduct } from "@/context/favoritesContext";

interface FavoriteButtonProps {
  product: TProduct;
  className?: string;
  size?: number;
  showText?: boolean;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  product, 
  className = "", 
  size = 20,
  showText = false 
}) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const isProductFavorite = isFavorite(product.id);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if button is inside a link
    e.stopPropagation();
    
    if (isProductFavorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      className={`flex items-center gap-2 transition-colors ${
        isProductFavorite 
          ? "text-red-500 hover:text-red-600" 
          : "text-gray-400 hover:text-red-500"
      } ${className}`}
      title={isProductFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart 
        size={size} 
        fill={isProductFavorite ? "currentColor" : "none"}
        className="transition-all duration-200"
      />
      {showText && (
        <span className="text-sm font-medium">
          {isProductFavorite ? "Remove from Favorites" : "Add to Favorites"}
        </span>
      )}
    </button>
  );
};

export default FavoriteButton;

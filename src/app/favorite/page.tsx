"use client";

import { useFavorites } from "@/context/favoritesContext";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const FavoritePage = () => {
  const { favorites, removeFromFavorites, clearFavorites } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <div className="text-center space-y-6">
          <Heart size={80} className="mx-auto text-gray-300" />
          <h1 className="text-3xl font-bold text-gray-900">Your Favorites</h1>
          <p className="text-gray-600 text-lg max-w-md">
            You haven&apos;t added any products to your favorites yet. Start browsing and add products you love!
          </p>
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <ShoppingCart className="mr-2" size={20} />
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen p-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Heart className="text-red-500" size={32} />
            My Favorites
          </h1>
          <p className="text-gray-600 mt-2">
            {favorites.length} {favorites.length === 1 ? 'product' : 'products'} in your favorites
          </p>
        </div>
        
        {favorites.length > 0 && (
          <button
            onClick={clearFavorites}
            className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 size={16} />
            Clear All
          </button>
        )}
      </div>

      {/* Favorites Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favorites.map((product) => (
          <div
            key={product.id}
            className="group bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 hover:border-blue-300 overflow-hidden"
          >
            {/* Image Container */}
            <div className="relative w-full h-48 overflow-hidden">
              <Link href={`/products/${product.id}`}>
                <Image
                  src={product.image || "/product-fallback.png"}
                  fill
                  alt={product.title}
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              
              {/* Remove from favorites button */}
              <button
                onClick={() => removeFromFavorites(product.id)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors group"
                title="Remove from favorites"
              >
                <Heart 
                  className="text-red-500 group-hover:text-red-600" 
                  size={16} 
                  fill="currentColor"
                />
              </button>

              {/* Status Badge */}
              <div
                className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-semibold ${
                  product.status === "published"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {product.status === "published" ? "Available" : "Out of stock"}
              </div>

              {/* Rating Badge */}
              {product.rate && (
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded-full text-xs flex items-center">
                  ⭐ {product.rate}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              {/* Category */}
              {product.category && (
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                  {product.category}
                </span>
              )}

              {/* Title */}
              <Link href={`/products/${product.id}`}>
                <h2 className="font-semibold text-gray-900 text-lg line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer">
                  {product.title}
                </h2>
              </Link>

              {/* About */}
              {product.about && (
                <h3 className="text-gray-600 text-sm line-clamp-2">
                  {product.about}
                </h3>
              )}

              {/* Price Section */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    {product.discount !== 0 ? (
                      <>
                        <span className="text-xl font-bold text-gray-900">
                          ${(product.price - product.discount).toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          ${product.price.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-xl font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {product.discount !== 0 && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-semibold">
                      -${product.discount.toFixed(2)}
                    </span>
                  )}
                </div>

                {product.discount !== 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      You save ${product.discount.toFixed(2)}
                    </span>
                    <span className="text-xs text-green-600 font-semibold">
                      {((product.discount / product.price) * 100).toFixed(0)}% off
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 space-y-2">
                <Link
                  href={`/products/${product.id}`}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center block font-medium"
                >
                  View Details
                </Link>
                <button
                  onClick={() => removeFromFavorites(product.id)}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Heart size={16} />
                  Remove from Favorites
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritePage;

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Axios } from "@/axios";

interface SaleProduct {
  id: string;
  title: string;
  image: string;
  about: string;
  desc: string;
  category: {
    id: string;
    title: string;
  };
  price: number;
  discount: number;
  rate: number;
  status: string;
}

export default function SalesPage() {
  const [products, setProducts] = useState<SaleProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchSalesProducts();
  }, []);

  const fetchSalesProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await Axios.get("/latest-sale");

      if (!res.data || !Array.isArray(res.data)) {
        throw new Error("Invalid response format - expected array");
      }

      // Map the response data to match the product structure
      interface ApiProduct {
        id: number | string;
        title?: string;
        name?: string;
        images?: Array<{ image: string }>;
        image?: string;
        image_url?: string;
        About?: string;
        about?: string;
        description?: string;
        desc?: string;
        category?: {
          id: string | number;
          title: string;
        };
        price?: number | string;
        discount?: number | string;
        rating?: number;
        rate?: number;
        status?: string;
      }

      const productsData: SaleProduct[] = res.data.map((product: ApiProduct) => {
        // Ensure required fields have default values
        const id = product.id?.toString() || '';
        const title = product.title || product.name || 'Untitled Product';
        const image = 
          product.images?.[0]?.image ||
          product.image ||
          product.image_url ||
          '';
        
        return {
          id,
          title,
          image,
          about: product.About || product.about || "",
          desc: product.description || product.desc || "",
          category: {
            id: product.category?.id?.toString() || "",
            title: product.category?.title || ""
          },
          price: Number(product.price) || 0,
          discount: Number(product.discount) || 0,
          rate: Number(product.rating) || Number(product.rate) || 0,
          status: product.status || "published",
        };
      });

      console.log("Processed sale products:", productsData);
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching sale products:", error);

      if (error && typeof error === 'object') {
        const axiosError = error as {
          response?: { status: number; statusText: string };
          request?: unknown;
          message?: string;
        };

        if (axiosError.response) {
          setError(
            `Server error: ${axiosError.response.status} - ${axiosError.response.statusText}`
          );
        } else if (axiosError.request) {
          setError("No response from server. Check your network connection.");
        } else if (axiosError.message) {
          setError(`Request error: ${axiosError.message}`);
        } else {
          setError("An unknown error occurred");
        }
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sale products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="bg-red-100 text-red-800 p-6 rounded-lg">
            <svg
              className="w-12 h-12 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="font-semibold mb-2 text-lg">
              Error Loading Sale Products
            </h3>
            <p className="text-sm mb-4">{error}</p>
            <button
              onClick={fetchSalesProducts}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 2xl:px-64 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              🔥 Latest Sales
            </h1>
            <p className="text-gray-600 text-lg">
              Don&apos;t miss out on these amazing deals!
            </p>
          </div>
        </div>
      </header>

      {/* Sales Banner */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-6">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 2xl:px-64 text-center">
          <h2 className="text-2xl font-bold mb-2">Limited Time Offers</h2>
          <p className="text-red-100">Hurry! These deals won&apos;t last long</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 2xl:px-64 py-8">
        {/* Results Count */}
        <div className="mb-8 text-center">
          <p className="text-gray-600 text-lg">
            {products.length} product{products.length !== 1 ? "s" : ""} on sale
          </p>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16">
            <svg
              className="mx-auto h-16 w-16 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No sale products available
            </h3>
            <p className="text-gray-500">Check back later for amazing deals!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <SaleProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SaleProductCard({ product }: { product: SaleProduct }) {
  const finalPrice = product.price - product.discount;
  const discountPercentage =
    product.discount > 0
      ? Math.round((product.discount / product.price) * 100)
      : 0;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:border-red-300 border border-gray-200 overflow-hidden relative"
    >
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
          -{discountPercentage}%
        </div>
      )}

      {/* Hot Sale Badge */}
      <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold z-10">
        🔥 SALE
      </div>

      {/* Image Container */}
      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src={product.image}
          fill
          alt={product.title}
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
          }}
        />

        {/* Status Badge */}
        <div
          className={`absolute bottom-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${
            product.status === "published"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {product.status === "published" ? "Available" : "Out of stock"}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category */}
        {product.category?.title && (
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
            {product.category.title}
          </span>
        )}

        {/* Title */}
        <h2 className="font-semibold text-gray-900 text-lg line-clamp-1 group-hover:text-red-600 transition-colors">
          {product.title}
        </h2>

        {/* About */}
        {product.about && (
          <h3 className="text-gray-600 text-sm line-clamp-2">
            {product.about}
          </h3>
        )}

        {/* Rating */}
        {product.rate > 0 && (
          <div className="flex items-center">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rate)
                      ? "fill-current"
                      : "text-gray-300"
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">({product.rate})</span>
          </div>
        )}

        {/* Price Section */}
        <div className="flex items-baseline justify-between pt-2">
          <div className="flex items-baseline gap-2">
            {product.discount > 0 ? (
              <>
                <span className="text-xl font-bold text-red-600">
                  ${finalPrice.toFixed(2)}
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

          {product.discount > 0 && (
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded font-semibold">
              Save ${product.discount.toFixed(2)}
            </span>
          )}
        </div>

        {/* You Save */}
        {product.discount > 0 && (
          <div className="bg-red-50 p-2 rounded text-center">
            <p className="text-red-700 text-sm font-medium">
              You save ${product.discount.toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}

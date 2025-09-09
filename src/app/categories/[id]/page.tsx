"use client";

import { useState, useEffect, useCallback, JSX } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Axios } from "@/axios";

interface Product {
  id: string;
  title: string;
  image: string;
  about: string;
  desc: string;
  price: number;
  discount: number;
  rate: number;
  status: string;
}

interface Category {
  id: string;
  title: string;
  image: string;
  description: string;
  products: Product[];
}

const CategoryPage = (): JSX.Element => {
  const params = useParams();
  console.log(params);
  const categoryId = params.id as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchCategory = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await Axios.get(`/category/${categoryId}`);
      console.log("Category API response:", res.data);

      if (!res.data) {
        throw new Error("Invalid response format");
      }

      // Define proper interface for the API response
      interface ApiProduct {
        id: string | number;
        title?: string;
        name?: string;
        images?: Array<{ image: string }>;
        image?: string;
        About?: string;
        about?: string;
        description?: string;
        desc?: string;
        price: number | string;
        discount: number | string;
        rating?: number | string;
        status?: string;
      }

      // Format the category data
      const categoryData: Category = {
        id: res.data.id.toString(),
        title: res.data.title || res.data.name || 'Unnamed Category',
        image: res.data.image || res.data.image_url || "",
        description: res.data.description || res.data.desc || "",
        products: Array.isArray(res.data.products)
          ? res.data.products.map((product: ApiProduct) => ({
              id: product.id.toString(),
              title: product.title || product.name || 'Unnamed Product',
              image: Array.isArray(product.images) && product.images.length > 0 
                ? product.images[0].image 
                : product.image || "",
              about: product.about || product.About || "",
              desc: product.description || product.desc || "",
              price: Number(product.price) || 0,
              discount: Number(product.discount) || 0,
              rate: Number(product.rating) || 0,
              status: product.status || "published",
            }))
          : [],
      };

      console.log("Processed category:", categoryData);
      setCategory(categoryData);
    } catch (err) {
      console.error("Error fetching category:", err);
      const error = err as { 
        response?: { status: number; statusText: string }; 
        request?: unknown; 
        message: string 
      };

      if (error.response) {
        setError(
          `Server error: ${error.response.status} - ${error.response.statusText}`
        );
      } else if (error.request) {
        setError("No response from server. Check your network connection.");
      } else {
        setError(`Request error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading category...</p>
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
              Error Loading Category
            </h3>
            <p className="text-sm mb-4">{error}</p>
            <button
              onClick={fetchCategory}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto text-gray-400">
            <svg
              className="w-full h-full"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            Category not found
          </h3>
          <p className="mt-1 text-gray-500">
            The category you&#39;re looking for doesn&#39;t exist.
          </p>
          <div className="mt-6">
            <Link
              href="/categories"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Go back to categories
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-700">
                  Home
                </Link>
              </li>
              <li>
                <span className="text-gray-300">/</span>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-gray-500 hover:text-gray-700"
                >
                  Categories
                </Link>
              </li>
              <li>
                <span className="text-gray-300">/</span>
              </li>
              <li>
                <span className="text-gray-700 font-medium">
                  {category.title}
                </span>
              </li>
            </ol>
          </nav>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Category Image */}
            <div className="relative w-full md:w-1/3 lg:w-1/4 h-48 rounded-lg overflow-hidden bg-gray-100">
              {category.image ? (
                <Image
                  src={category.image}
                  fill
                  alt={category.title}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Category Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {category.title}
              </h1>
              {category.description && (
                <p className="text-gray-600 text-lg">{category.description}</p>
              )}
              <p className="text-gray-500 mt-4">
                {category.products.length} product
                {category.products.length !== 1 ? "s" : ""} available
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {category.products.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="mt-2 text-gray-600">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {category.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

function ProductCard({ product }: { product: Product }) {
  const finalPrice = product.price - product.discount;
  const discountPercentage =
    product.discount > 0
      ? Math.round((product.discount / product.price) * 100)
      : 0;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:border-blue-300 border border-gray-200 overflow-hidden"
    >
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
          -{discountPercentage}%
        </div>
      )}

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
          className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${
            product.status === "published"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {product.status === "published" ? "Available" : "Out of stock"}
        </div>

        {/* Rating Badge */}
        {product.rate > 0 && (
          <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded-full text-xs flex items-center">
            ⭐ {product.rate}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h2 className="font-semibold text-gray-900 text-lg line-clamp-1 group-hover:text-blue-600 transition-colors">
          {product.title}
        </h2>

        {/* About */}
        {product.about && (
          <h3 className="text-gray-600 text-sm line-clamp-2">
            {product.about}
          </h3>
        )}

        {/* Price Section */}
        <div className="flex items-baseline justify-between pt-2">
          <div className="flex items-baseline gap-2">
            {product.discount > 0 ? (
              <>
                <span className="text-xl font-bold text-gray-900">
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

export default CategoryPage;

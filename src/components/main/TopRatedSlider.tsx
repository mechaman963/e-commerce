"use client";

import { useState, useEffect, useRef, memo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Axios } from "@/axios";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import FavoriteButton from "@/components/ui/FavoriteButton";
import { TProduct } from "@/context/favoritesContext";

// types/product.ts
export interface Product {
  id: string;
  title: string;
  image: string;
  price: number;
  discount: number;
  rate: number;
  status: string;
  category?: {
    id: string;
    title: string;
  };
  about?: string;
  description?: string;
}

// Interface for API response data
interface ApiProductResponse {
  id: number | string;
  title?: string;
  name?: string;
  images?: Array<{ image: string }>;
  image?: string;
  price: number | string;
  discount?: number | string;
  rating?: number | string;
  status?: string;
  category?: {
    id: string;
    title: string;
  };
}

export const topRatedProducts: Product[] = [
  {
    id: "1",
    title: "Wireless Noise-Cancelling Headphones",
    image: "/api/placeholder/400/400?text=Headphones",
    price: 299.99,
    discount: 50.0,
    rate: 4.8,
    status: "published",
    category: {
      id: "1",
      title: "Electronics",
    },
    about: "Premium sound quality with active noise cancellation",
    description:
      "Experience crystal-clear audio with our premium wireless headphones. Featuring active noise cancellation, 30-hour battery life, and comfortable over-ear design for all-day listening.",
  },
  {
    id: "2",
    title: "Organic Cotton T-Shirt",
    image: "/api/placeholder/400/400?text=T-Shirt",
    price: 29.99,
    discount: 5.0,
    rate: 4.7,
    status: "published",
    category: {
      id: "2",
      title: "Clothing",
    },
    about: "100% organic cotton comfortable t-shirt",
    description:
      "Made from 100% certified organic cotton, this t-shirt is soft, breathable, and perfect for everyday wear. Available in multiple colors and sizes.",
  },
  {
    id: "3",
    title: "Stainless Steel Water Bottle",
    image: "/api/placeholder/400/400?text=Water+Bottle",
    price: 24.99,
    discount: 0,
    rate: 4.9,
    status: "published",
    category: {
      id: "3",
      title: "Accessories",
    },
    about: "Eco-friendly insulated water bottle",
    description:
      "Keep your drinks hot for 12 hours or cold for 24 hours with our double-walled insulated stainless steel water bottle. Leak-proof and eco-friendly.",
  },
  {
    id: "4",
    title: "Yoga Mat Premium",
    image: "/api/placeholder/400/400?text=Yoga+Mat",
    price: 49.99,
    discount: 10.0,
    rate: 4.6,
    status: "published",
    category: {
      id: "4",
      title: "Fitness",
    },
    about: "Non-slip yoga mat with carrying strap",
    description:
      "This premium yoga mat provides excellent cushioning and non-slip surface for all your yoga practices. Includes a convenient carrying strap.",
  },
  {
    id: "5",
    title: "Bluetooth Portable Speaker",
    image: "/api/placeholder/400/400?text=Speaker",
    price: 89.99,
    discount: 15.0,
    rate: 4.5,
    status: "published",
    category: {
      id: "1",
      title: "Electronics",
    },
    about: "Waterproof portable speaker with rich sound",
    description:
      "Take your music anywhere with this waterproof Bluetooth speaker. Features 360° sound, 12-hour battery life, and durable construction.",
  },
];

const TopRatedSlider = memo(() => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [slidesToShow, setSlidesToShow] = useState<number>(4);
  const sliderRef = useRef<HTMLDivElement>(null);

  const updateSlidesToShow = useCallback(() => {
    const width = window.innerWidth;
    if (width < 640) setSlidesToShow(1);
    else if (width < 768) setSlidesToShow(2);
    else if (width < 1024) setSlidesToShow(3);
    else if (width < 1280) setSlidesToShow(4);
    else setSlidesToShow(5);

    // Reset index to prevent out of bounds when resizing
    setCurrentIndex(0);
  }, []);

  const fetchTopRatedProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Try to fetch from API
      const res = await Axios.get("/top-rated");

      if (!res.data || !Array.isArray(res.data)) {
        throw new Error("Invalid response format");
      }

      const productsData = res.data.map((product: ApiProductResponse) => ({
        id: product.id.toString(),
        title: product.title || product.name || "Untitled Product",
        image: product.images?.[0]?.image || product.image || "",
        price: Number(product.price) || 0,
        discount: Number(product.discount) || 0,
        rate: Number(product.rating) || 0,
        status: product.status || "published",
        category: product.category || { id: "", title: "" },
      }));

      setProducts(productsData);
    } catch (error: unknown) {
      console.error("Error fetching top-rated products:", error);

      // Use fallback data if API fails
      setProducts(topRatedProducts);

      // Type guard to check if error is an axios error or has expected properties
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response: { status: number } };
        setError(`Server error: ${axiosError.response.status}`);
      } else if (error && typeof error === "object" && "request" in error) {
        setError("No response from server");
      } else if (error instanceof Error) {
        setError(`Request error: ${error.message}`);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTopRatedProducts();
    updateSlidesToShow();
    window.addEventListener("resize", updateSlidesToShow);

    return () => {
      window.removeEventListener("resize", updateSlidesToShow);
    };
  }, [fetchTopRatedProducts, updateSlidesToShow]);

  const nextSlide = () => {
    const maxIndex = Math.max(0, products.length - slidesToShow);
    setCurrentIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    const maxIndex = Math.max(0, products.length - slidesToShow);
    setCurrentIndex((prevIndex) => (prevIndex <= 0 ? maxIndex : prevIndex - 1));
  };

  // Calculate the slide width based on number of slides to show
  const slideWidth = 100 / Math.min(slidesToShow, products.length);

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
          <div className="flex justify-center gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-64 bg-white rounded-lg shadow-sm p-4 animate-pulse"
              >
                <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <div className="relative">
          {/* Navigation Arrows */}
          {products.length > slidesToShow && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                aria-label="Previous products"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                aria-label="Next products"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>
            </>
          )}

          {/* Products Container */}
          <div className="relative w-full overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * slideWidth}%)`,
              }}
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 px-3"
                  style={{
                    width: `${slideWidth}%`,
                    minWidth: `${slideWidth}%`,
                  }}
                >
                  <div className="w-full h-full">
                    <ProductCard product={product} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {products.length > 0 && (
          <div className="text-center mt-10">
            <Link
              href="/products?sort=rating"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              View all top rated products
              <ChevronRight className="ml-1 w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
});

const ProductCard = memo(({ product }: { product: Product }) => {
  const finalPrice = product.price - product.discount;
  const discountPercentage =
    product.discount > 0
      ? Math.round((product.discount / product.price) * 100)
      : 0;

  // Convert Product to TProduct for FavoriteButton
  const favoriteProduct: TProduct = {
    id: Number(product.id),
    title: product.title,
    image: product.image,
    about: product.about || "",
    desc: product.description || "",
    category: product.category?.title || "",
    price: product.price,
    discount: product.discount,
    rate: product.rate.toString(),
    status: product.status,
  };

  return (
    <div className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:border-blue-300 border border-gray-200 overflow-hidden">
      {/* Image Container */}
      <div className="relative w-full h-48 overflow-hidden">
        <Link href={`/products/${product.id}`}>
          <Image
            src={product.image}
            fill
            alt={product.title}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
        </Link>

        {/* Favorite Button */}
        <div className="absolute top-2 right-2 z-10">
          <FavoriteButton
            product={favoriteProduct}
            className="p-2 bg-white rounded-full shadow-md hover:shadow-lg"
            size={16}
          />
        </div>

        {/* Rating Badge */}
        <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded-full text-xs flex items-center">
          <Star className="w-3 h-3 fill-current text-yellow-400 mr-1" />
          {product.rate.toFixed(1)}
        </div>

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute bottom-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
            -{discountPercentage}%
          </div>
        )}

        {/* Status Badge */}
        <div
          className={`absolute bottom-2 left-2 px-2 py-1 rounded-full text-xs font-semibold ${
            product.status === "published"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {product.status === "published" ? "Available" : "Out of stock"}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        {product.category?.title && (
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium mb-2">
            {product.category.title}
          </span>
        )}

        {/* Title */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 text-lg line-clamp-1 hover:text-blue-600 transition-colors mb-2 cursor-pointer">
            {product.title}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-baseline justify-between">
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

          {/* Star Rating */}
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 ml-1">
              {product.rate.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = "ProductCard";
TopRatedSlider.displayName = "TopRatedSlider";
export default TopRatedSlider;

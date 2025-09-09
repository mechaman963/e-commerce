"use client";

import { Axios } from "@/axios";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { JSX, useEffect, useState, memo, useMemo } from "react";

type TCats = {
  id: number;
  title: string;
};

type TDeal = {
  id: number;
  title: string;
  image: string;
  about: string;
  desc: string;
  category: string;
  price: number;
  discount: number;
  rate: string;
  status: string;
};

type TProductResponse = {
  id: number;
  title: string;
  images: Array<{ image: string }>;
  About: string;
  description: string;
  category: string;
  price: string | number;
  discount: string | number;
  rating: string;
  status: string;
};

const Deals = memo((): JSX.Element => {
  const [deals, setDeals] = useState<TDeal[]>();
  const [loading, setLoading] = useState(true);

  const fetchData = useMemo(() => {
    return async () => {
      try {
        setLoading(true);
        // Parallel API calls for better performance
        const [catsRes, productsRes] = await Promise.all([
          Axios.get(`/categories`),
          Axios.get(`/latest-sale`)
        ]);
        
        const categories = catsRes.data.map((element: TCats) => ({
          id: element.id,
          title: element.title,
        }));

        setDeals(
          productsRes.data.map((element: TProductResponse) => {
            const category = categories.find(
              (cat: TCats) => cat.id.toString() === element.category?.toString()
            );

            return {
              id: element.id,
              title: element.title,
              image: element.images[0]?.image || "",
              about: element.About,
              desc: element.description,
              category: category?.title || "Uncategorized",
              price: Number(element.price) || 0,
              discount: Number(element.discount) || 0,
              rate: element.rating,
              status: element.status,
            };
          })
        );
      } catch (e) {
        console.error("Error fetching deals:", e);
      } finally {
        setLoading(false);
      }
    };
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="w-screen px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 2xl:px-64 flex flex-col py-8">
        <div className="w-full flex items-center justify-end pe-4 gap-2 mb-6">
          <span className="text-gray-600">See All</span>
          <ArrowRight className="w-4 h-4" />
        </div>
        <div className="w-full flex flex-wrap gap-6 grow">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-max w-full sm:w-1/3 lg:w-1/4 grow border border-gray-200 rounded-lg bg-white animate-pulse"
            >
              <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 2xl:px-64 flex flex-col py-8">
      <Link
        href={`/sales`}
        className="w-full flex items-center justify-end pe-4 gap-2 mb-6 group hover:text-red-600 transition-colors"
      >
        <span className="font-semibold">View All Sales</span>
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Link>

      <div className="w-full flex flex-wrap gap-6 grow">
        {deals &&
          deals
            .slice(0, 3)
            .map((deal: TDeal) => <DealCard key={deal.id} deal={deal} />)}
      </div>
    </div>
  );
});

const DealCard = memo(({ deal }: { deal: TDeal }) => {
  const finalPrice = deal.price - deal.discount;
  const discountPercentage =
    deal.discount > 0 ? Math.round((deal.discount / deal.price) * 100) : 0;

  return (
    <Link
      href={`/products/${deal.id}`}
      className="group h-max w-full sm:w-1/3 lg:w-1/4 grow border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:border-red-300 overflow-hidden bg-white relative"
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
          src={deal.image}
          fill
          alt={deal.title}
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
          }}
        />

        {/* Status Badge */}
        <div
          className={`absolute bottom-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${
            deal.status === "published"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {deal.status === "published" ? "Available" : "Out of stock"}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category */}
        {deal.category && (
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
            {deal.category}
          </span>
        )}

        {/* Title */}
        <h2 className="font-semibold text-gray-900 text-lg line-clamp-1 group-hover:text-red-600 transition-colors">
          {deal.title}
        </h2>

        {/* About */}
        {deal.about && (
          <h3 className="text-gray-600 text-sm line-clamp-2">{deal.about}</h3>
        )}

        {/* Rating */}
        {deal.rate && (
          <div className="flex items-center">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(Number(deal.rate))
                      ? "fill-current"
                      : "text-gray-300"
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">({deal.rate})</span>
          </div>
        )}

        {/* Price Section */}
        <div className="flex items-baseline justify-between pt-2">
          <div className="flex items-baseline gap-2">
            {deal.discount > 0 ? (
              <>
                <span className="text-xl font-bold text-red-600">
                  ${finalPrice.toFixed(2)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ${deal.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-gray-900">
                ${deal.price.toFixed(2)}
              </span>
            )}
          </div>

          {deal.discount > 0 && (
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded font-semibold">
              Save ${deal.discount.toFixed(2)}
            </span>
          )}
        </div>

        {/* You Save */}
        {deal.discount > 0 && (
          <div className="bg-red-50 p-2 rounded text-center">
            <p className="text-red-700 text-sm font-medium">
              You save ${deal.discount.toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
});

DealCard.displayName = 'DealCard';

export default Deals;
Deals.displayName = 'Deals';

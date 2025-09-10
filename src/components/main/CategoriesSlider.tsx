"use client";

import { Axios } from "@/axios";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, memo, useCallback } from "react";

type TCat = {
  id: number;
  title: string;
  image: string;
};

const CategoriesSlider = memo(() => {
  const [categories, setCategories] = useState<TCat[]>([]);
  const [loading, setLoading] = useState(true);

  const getCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await Axios.get(`/categories`);
      interface ApiCategory {
        id: number;
        title: string;
        image: string;
        // Add other fields from the API response if needed
      }

      setCategories(
        res.data.slice(0, 8).map((category: ApiCategory) => ({
          id: category.id,
          title: category.title,
          image: category.image,
        }))
      );
    } catch (e) {
      console.error("Error fetching categories:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  if (loading) {
    return (
      <>
        <div className="w-full flex items-center justify-end pe-4 gap-2 mb-4">
          <span className="text-gray-400">See All</span>
          <ArrowRight className="text-gray-400" />
        </div>
        <div className="w-screen h-[65dvh] overflow-hidden">
          <div className="w-max h-full flex gap-4 px-4 py-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-full w-[calc(100vw-2rem)] sm:w-[calc(50vw-1.5rem)] lg:w-[calc((100vw/3)-1.348rem)] xl:w-[calc((100vw/4)-1.25rem)] border border-gray-200 rounded-xl bg-white animate-pulse"
              >
                <div className="w-full h-4/5 bg-gray-200 rounded-t-xl"></div>
                <div className="w-full h-1/5 px-4 py-3 flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Link
        href={"/categories"}
        className="w-full flex items-center justify-end pe-4 gap-2"
      >
        See All <ArrowRight />
      </Link>
      <div
        className={`w-screen h-[65dvh] overflow-x-scroll scroll-smooth relative scrollbar-remove`}
      >
        <div className="w-max h-full flex gap-4 px-4 py-8 ">
          {categories.map((cat: TCat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.id}`}
              className="group h-full w-[calc(100vw-2rem)] sm:w-[calc(50vw-1.5rem)] lg:w-[calc((100vw/3)-1.348rem)] xl:w-[calc((100vw/4)-1.25rem)] border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-400 hover:border-blue-400 overflow-hidden bg-white relative"
            >
              {/* Image Container */}
              <div className="w-full h-4/5 relative overflow-hidden">
                <Image
                  src={decodeURIComponent(cat.image)}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  fill
                  alt={cat.title}
                  className="object-cover group-hover:scale-110 transition-transform duration-600"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                />

                {/* Gradient overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content */}
              <div className="w-full h-1/5 px-4 py-3 flex items-center justify-between bg-white group-hover:bg-blue-50 transition-colors duration-300 border-t border-gray-100">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-lg truncate group-hover:text-blue-800 transition-colors duration-300">
                    {cat.title}
                  </p>
                  <p className="text-sm text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Shop now →
                  </p>
                </div>

                {/* Hover arrow */}
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 translate-x-[-8px] group-hover:translate-x-0 transition-all duration-300">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Hover shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
});

CategoriesSlider.displayName = 'CategoriesSlider';
export default CategoriesSlider;

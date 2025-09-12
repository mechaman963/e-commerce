"use client";

import Image from "next/image";
import Link from "next/link";
import { JSX, useEffect, useState, memo, useCallback } from "react";

type TSlider = {
  id: number;
  title: string;
  desc: string;
  image: string;
};

const Slider = memo((): JSX.Element => {
  const sliderData: TSlider[] = [
    {
      id: 1,
      title: "Summer Sale Collections",
      desc: "Sale up to 50% off",
      image: "/slide1.jpg",
    },
    {
      id: 2,
      title: "Winter Sale Collections",
      desc: "Sale up to 50% off",
      image: "/slide2.jpg",
    },
    {
      id: 3,
      title: "Spring Sale Collections",
      desc: "Sale up to 50% off",
      image: "/slide3.jpg",
    },
  ];
  const [activeSlider, setActiveSlider] = useState<number>(0);

  const updateSlider = useCallback(() => {
    setActiveSlider((prev) => (prev === sliderData.length - 1 ? 0 : prev + 1));
  }, [sliderData.length]);

  useEffect(() => {
    const interval = setInterval(updateSlider, 3000);
    return () => clearInterval(interval);
  }, [updateSlider]);

  return (
    <div
      className={`w-screen h-[calc(100dvh-156px)] md:h-[calc(100dvh-80px)] bg-slate-100 flex flex-col md:flex-row-reverse`}
    >
      <div className="w-full md:w-1/2 h-1/2 md:h-full relative">
        <Image
          src={sliderData[activeSlider].image}
          alt={sliderData[activeSlider].title}
          fill
          style={{ objectFit: "cover" }}
          priority={true}
          sizes="(max-width: 768px) 100vw, 50vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
      </div>
      <div className="w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center flex-col gap-4 text-center">
        <h1 className="font-semibold text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl px-8 sm:px-16">
          {sliderData[activeSlider].title}
        </h1>
        <p className="sm:text-lg lg:text-2xl xl:text-3xl px-12">
          {sliderData[activeSlider].desc}
        </p>
        <Link
          href={"/products"}
          className="w-max px-4 py-3 text-xl bg-primary text-white rounded-md"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
});

Slider.displayName = "Slider";
export default Slider;

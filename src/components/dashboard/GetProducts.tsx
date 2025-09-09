"use client";

import { Axios } from "@/axios";
import Table from "@/components/dashboard/Table";
import { TCategory, TProduct } from "@/lib/data";
import { dateHandler } from "@/lib/utils";
import { useEffect, useState } from "react";

const GetProducts = () => {
  const [productsData, setProductsData] = useState<string[][] | undefined>();
  const [useEffectFixer, setUseEffectFixer] = useState<number>(0);
  const [categoriesData, setCategoriesData] = useState<Record<string, string>>(
    {}
  );
  const itemsPerPage = 7;

  useEffect(() => {
    const getCategories = async () => {
      try {
        await Axios.get(`/categories`).then((res) => {
          const categoriesMap: Record<string, string> = {};
          res.data.forEach((category: TCategory) => {
            categoriesMap[category.id.toString()] = category.title;
          });
          setCategoriesData(categoriesMap);
          console.log(categoriesData);
        });
      } catch (e) {
        console.log(e);
      }
    };

    const getProducts = async () => {
      try {
        await Axios.get(`/products`).then((res) => {
          const finalData = res.data.map((o: TProduct) => {
            let imageUrl = "No image";
            if (o.images && Array.isArray(o.images) && o.images.length > 0) {
              if (typeof o.images[0] === "string") {
                imageUrl = o.images[0];
              } else if (
                o.images[0] &&
                typeof o.images[0] === "object" &&
                o.images[0].image
              ) {
                imageUrl = o.images[0].image;
              }
            }
            return [
              o.id.toString(),
              o.title,
              imageUrl,
              o.price.toString(),
              categoriesData[o.category] || o.category, // Use category title if available, fallback to ID
            ];
          });
          setProductsData(finalData);
        });
      } catch (e) {
        console.log(e);
      }
    };

    // First get categories, then get products
    getCategories().then(() => {
      getProducts();
    });
  }, [useEffectFixer]);

  // Re-fetch products when categories change
  useEffect(() => {
    if (Object.keys(categoriesData).length > 0) {
      const getProducts = async () => {
        try {
          await Axios.get(`/products`).then((res) => {
            const finalData = res.data.map((o: TProduct) => {
              let imageUrl = "No image";
              if (o.images && Array.isArray(o.images) && o.images.length > 0) {
                // If images is an array of strings
                if (typeof o.images[0] === "string") {
                  imageUrl = o.images[0];
                }
                // If images is an array of objects with image property
                else if (
                  o.images[0] &&
                  typeof o.images[0] === "object" &&
                  o.images[0].image
                ) {
                  imageUrl = o.images[0].image;
                }
              }
              return [
                o.id.toString(),
                o.title,
                imageUrl,
                o.price.toString(),
                dateHandler(o.created_at.toString()),
                dateHandler(o.updated_at.toString()),
                categoriesData[o.category] || o.category, // Use category title if available, fallback to ID
              ];
            });
            setProductsData(finalData);
          });
        } catch (e) {
          console.log(e);
        }
      };
      getProducts();
    }
  }, [categoriesData]);

  return (
    <Table
      setFixer={setUseEffectFixer}
      parent="products"
      data={productsData}
      itemsPerPage={itemsPerPage}
    />
  );
};
export default GetProducts;

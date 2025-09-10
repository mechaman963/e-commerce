"use client";

import { Axios } from "@/axios";
import Table from "@/components/dashboard/Table";
import { TCategory, TProduct } from "@/lib/data";
import { dateHandler } from "@/lib/utils";
import { useEffect, useState } from "react";

const GetProducts = () => {
  const [productsData, setProductsData] = useState<string[][] | undefined>();
  const [categoriesData, setCategoriesData] = useState<Record<string, string>>({});
  const itemsPerPage = 7;

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await Axios.get(`/categories`);
        const categoriesMap: Record<string, string> = {};
        res.data.forEach((category: TCategory) => {
          categoriesMap[category.id.toString()] = category.title;
        });
        setCategoriesData(categoriesMap);
      } catch (e) {
        console.error('Error fetching categories:', e);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await Axios.get(`/products`);
        const finalData = res.data.map((product: TProduct) => {
          let imageUrl = "No image";
          if (product.images && Array.isArray(product.images) && product.images.length > 0) {
            if (typeof product.images[0] === "string") {
              imageUrl = product.images[0];
            } else if (
              product.images[0] &&
              typeof product.images[0] === "object" &&
              'image' in product.images[0]
            ) {
              imageUrl = product.images[0].image;
            }
          }
          
          return [
            product.id.toString(),
            product.title,
            imageUrl,
            product.price.toString(),
            dateHandler(product.created_at.toString()),
            dateHandler(product.updated_at.toString()),
            categoriesData[product.category] || product.category,
          ];
        });
        
        setProductsData(finalData);
      } catch (e) {
        console.error('Error fetching products:', e);
      }
    };

    if (Object.keys(categoriesData).length > 0) {
      fetchProducts();
    }
  }, [categoriesData]);

  // This is a no-op function to satisfy the Table component's prop requirements
  const noop = () => {};

  return (
    <Table
      parent="products"
      data={productsData}
      itemsPerPage={itemsPerPage}
      setFixer={noop}
    />
  );
};

export default GetProducts;

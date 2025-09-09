"use client";

import { Axios } from "@/axios";
import Table from "@/components/dashboard/Table";
import { TCategory } from "@/lib/data";
import { useCallback, useEffect, useState } from "react";

const GetCategories = () => {
  const [categoriesData, setCategoriesData] = useState<
    string[][] | undefined
  >();
  const itemsPerPage = 9;

  const fetchCategories = useCallback(async () => {
    try {
      const res = await Axios.get(`/categories`);
      const finalData = res.data.map((category: TCategory) => [
        category.id.toString(),
        category.title,
        category.image.toString(),
      ]);
      setCategoriesData(finalData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // No-op function to satisfy Table component's prop requirements
  const noop = () => {};

  return (
    <Table
      setFixer={noop}
      parent="categories"
      data={categoriesData}
      itemsPerPage={itemsPerPage}
    />
  );
};
export default GetCategories;

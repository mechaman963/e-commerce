"use client";

import { Axios } from "@/axios";
import Table from "@/components/dashboard/Table";
import { TCategory } from "@/lib/data";
import { useEffect, useState } from "react";

const GetCategories = () => {
  const [categoriesData, setCategoriesData] = useState<
    string[][] | undefined
  >();
  const [useEffectFixer, setUseEffectFixer] = useState<number>(0);
  const itemsPerPage = 9;

  useEffect(() => {
    const getCategories = async () => {
      try {
        await Axios.get(`/categories`).then((res) => {
          const finalData = res.data.map((o: TCategory) => {
            return [o.id.toString(), o.title, o.image.toString()];
          });
          setCategoriesData(finalData);
        });
      } catch (e) {
        console.log(e);
      }
    };
    getCategories();
  }, [useEffectFixer]);

  return (
    <Table
      setFixer={setUseEffectFixer}
      parent="categories"
      data={categoriesData}
      itemsPerPage={itemsPerPage}
    />
  );
};
export default GetCategories;

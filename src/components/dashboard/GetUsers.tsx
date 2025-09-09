"use client";

import { Axios } from "@/axios";
import Table from "@/components/dashboard/Table";
import { TUser } from "@/lib/data";
import { useEffect, useState } from "react";

const GetUsers = () => {
  const [usersData, setUsersData] = useState<string[][] | undefined>();

  const [useEffectFixer, setUseEffectFixer] = useState<number>(0);

  const itemsPerPage = 9;

  useEffect(() => {
    const getUsers = async () => {
      try {
        await Axios.get(`/users`).then((res) => {
          const finalData = res.data.map((o: TUser) => {
            let x = Object.values(o);
            x = x.toSpliced(3, 1);
            x = x.toSpliced(4, 4);
            if (x[3] === "1995") x[3] = "Admin";
            if (x[3] === "2001") x[3] = "User";
            if (x[3] === "3276") x[3] = "Manager";
            if (x[3] === "1999") x[3] = "Manager";
            return x;
          });
          setUsersData(finalData);
        });
      } catch (e) {
        console.log(e);
      }
    };
    getUsers();
  }, [useEffectFixer]);

  return (
    <Table
      setFixer={setUseEffectFixer}
      parent="users"
      data={usersData}
      itemsPerPage={itemsPerPage}
    />
  );
};
export default GetUsers;

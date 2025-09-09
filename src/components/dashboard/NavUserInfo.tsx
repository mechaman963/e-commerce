"use client";

import { Axios } from "@/axios";
import { JSX, useEffect, useState } from "react";
import Cookies from "universal-cookie";

interface IUser {
  name: string;
  email: string;
  role: string;
}

const NavUserInfo = (): JSX.Element => {
  const cookies = new Cookies();
  const id = cookies.get("currentUserId");

  const [currentUser, setCurrentUser] = useState<IUser>({
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    const getCurrentUserInfo = async () => {
      try {
        const res = await Axios.get(`/user/${id}`);
        setCurrentUser(res.data);
      } catch (e) {
        console.log(e);
      }
    };
    getCurrentUserInfo();
  }, [id]);

  return (
    <div className="text-end relative">
      <div className="flex items-center justify-between">
        <span className="text-sm">
          {currentUser.role === "1995"
            ? "Admin"
            : currentUser.role === "3276"
            ? "Manager"
            : "User"}
        </span>
        <h2 className="font-semibold">{currentUser.name}</h2>
      </div>
      <h3 className="text-gray-400">{currentUser.email}</h3>
    </div>
  );
};
export default NavUserInfo;

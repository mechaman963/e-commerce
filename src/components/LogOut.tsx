"use client";

import { Axios } from "@/axios";
import { useRouter } from "next/navigation";
import Cookies from "universal-cookie";

const LogOut = ({ parent }: { parent?: string }) => {
  const router = useRouter();
  const cookies = new Cookies();

  const handleLogOut = async () => {
    try {
      await Axios.get(`/logout`).then(() => {
        cookies.remove("Bearer");
        cookies.remove("currentUserId");
        cookies.remove("role");
        router.push("/login");
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <button
      className={`${
        parent === "menu" ? "w-full" : "w-max"
      } cursor-pointer px-4 py-2 rounded-lg bg-primary text-lg text-card font-medium`}
      onClick={handleLogOut}
    >
      Log out
    </button>
  );
};
export default LogOut;

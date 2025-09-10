"use client";

import { SidebarContext } from "@/context/sidebarContext";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Link from "next/link";
import { useContext } from "react";
import LogOut from "../LogOut";
import NavUserInfo from "./NavUserInfo";

const Navbar = () => {
  const { open, setOpen } = useContext(SidebarContext) || {
    open: true,
    setOpen: () => {},
  };

  return (
    <nav className="bg-white w-full flex items-center justify-between h-20 shadow-[6px_0px_10px_0_rgba(0,0,0,0.2)] z-50 fixed top-0 left-0 px-5">
      <div
        className={`flex items-center gap-4  duration-200 ${
          open ? "w-max" : "w-1/3 lg:w-1/4 xl:w-1/5 2xl:w-1/6 justify-between"
        }`}
      >
        <Link href={"/"} className="text-2xl leading-20">
          Logo
        </Link>
        {open ? (
          <PanelLeftOpen
            className={`hidden sm:block cursor-pointer duration-200 mt-1`}
            onClick={() => setOpen((prev: boolean) => !prev)}
          />
        ) : (
          <PanelLeftClose
            className={`hidden sm:block cursor-pointer duration-200 mt-1`}
            onClick={() => setOpen((prev: boolean) => !prev)}
          />
        )}
      </div>
      <div className="flex items-center gap-4">
        <NavUserInfo />
        <LogOut parent="navbar" />
      </div>
    </nav>
  );
};
export default Navbar;

"use client";

import Logo from "../ui/Logo";
import Profile from "./Profile";
import { usePathname } from "next/navigation";
import NavbarLinks from "./NavbarLinks";
import CartIcon from "../cart/CartIcon";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <div
      className={`${
        (pathname.includes("dashboard") ||
          pathname.includes("login") ||
          pathname.includes("sign-up")) &&
        "hidden"
      } px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 2xl:px-64 shadow-md z-50`}
    >
      <div className="w-full h-20 flex items-center justify-between">
        <Logo />
        <NavbarLinks visibility="hidden md:flex" pathname={pathname} />

        <div className="flex items-center gap-2">
          <CartIcon />
          <Profile />
        </div>
      </div>
      <div className=" w-full block md:hidden">
        <NavbarLinks visibility="flex md:hidden" pathname={pathname} />
      </div>
    </div>
  );
};
export default Navbar;

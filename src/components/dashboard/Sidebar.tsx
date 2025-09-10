"use client";
import {
  LayoutDashboard,
  Package,
  PackagePlus,
  User2,
  UserPlus2,
  Tags,
  Tag,
  Home,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { SidebarContext } from "@/context/sidebarContext";
import Cookies from "universal-cookie";
import { Axios } from "@/axios";

type TLinks = {
  id: number;
  title: string;
  link: string;
  icon: React.ReactNode;
  access: string[];
};

const links: TLinks[] = [
  {
    id: 1,
    title: "dashboard",
    link: "/dashboard",
    icon: <LayoutDashboard />,
    access: ["1995", "3276"],
  },
  {
    id: 2,
    title: "users",
    link: "/dashboard/users",
    icon: <User2 />,
    access: ["1995", "3276"],
  },
  {
    id: 3,
    title: "new user",
    link: "/dashboard/users/new-user",
    icon: <UserPlus2 />,
    access: ["1995"],
  },
  {
    id: 4,
    title: "categories",
    link: "/dashboard/categories",
    icon: <Tags />,
    access: ["1995", "3276"],
  },
  {
    id: 5,
    title: "new category",
    link: "/dashboard/categories/new-category",
    icon: <Tag />,
    access: ["1995", "3276"],
  },
  {
    id: 6,
    title: "products",
    link: "/dashboard/products",
    icon: <Package />,
    access: ["1995", "3276"],
  },
  {
    id: 7,
    title: "new product",
    link: "/dashboard/products/new-product",
    icon: <PackagePlus />,
    access: ["1995", "3276"],
  },
];

const Sidebar = () => {
  const pathname = usePathname();

  const { open } = useContext(SidebarContext) || { open: true };

  const [resolvedRole, setResolvedRole] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const cookies = new Cookies();
    const roleFromCookie = cookies.get("role");
    const currentUserId = cookies.get("currentUserId");

    if (roleFromCookie) {
      setResolvedRole(String(roleFromCookie));
      return;
    }

    if (currentUserId) {
      const fetchRole = async () => {
        try {
          const res = await Axios.get(`/user/${currentUserId}`);
          if (res?.data?.role) setResolvedRole(String(res.data.role));
        } catch {
          // ignore
        }
      };
      fetchRole();
    }
  }, []);

  return (
    <div
      className={`flex flex-col ${
        !open
          ? " w-16 sm:w-1/3 lg:w-1/4 xl:w-1/5 2xl:w-1/6  p-2 sm:p-5"
          : "w-16 px-1 py-5"
      } h-[calc(100dvh-5rem)] fixed top-20 left-0 shadow-[0px_6px_10px_0_rgba(0,0,0,0.2)] transition-all duration-200 overflow-y-scroll overflow-x-hidden`}
    >
      <h1 className="flex items-center justify-center sm:-items-start gap-3 text-center uppercase font-bold text-lg tracking-wide">
        <LayoutDashboard className="" />
        <span className={`${!open ? "hidden sm:block" : "hidden"} uppercase`}>
          {"dashboard"}
        </span>
      </h1>

      <div className="flex flex-col gap-1 h-full justify-center items-center w-full">
        {links.map(
          (link: TLinks) =>
            Boolean(resolvedRole) &&
            link.access.includes(resolvedRole as string) && (
              <Link
                href={link.link}
                key={link.id}
                className="flex items-center gap-2 justify-center sm:justify-start text-lg w-full hover:bg-accent px-4 py-2 rounded-md duration-200"
                style={{
                  background:
                    pathname == link.link ? "oklch(0.968 0.007 247.896)" : "",
                  color:
                    pathname == link.link ? "oklch(0.488 0.243 264.376)" : "",
                }}
              >
                {link.icon}
                <span className={`${!open ? "hidden sm:block" : "hidden"}`}>
                  {link.title}
                </span>
              </Link>
            )
        )}
      </div>
      <Link
        href={"/"}
        className={`w-full flex items-center justify-center gap-4 text-xl group:`}
      >
        <Home />
        <span className={`hidden sm:${!open ? "block" : "hidden"} text-2xl`}>
          Home
        </span>
      </Link>
    </div>
  );
};
export default Sidebar;

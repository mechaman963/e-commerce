"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import React, { useContext } from "react";
import { SidebarContext } from "../../context/sidebarContext";
import Navbar from "@/components/dashboard/Navbar";

const DASHBOARDlayout = ({ children }: { children: React.ReactNode }) => {
  const { open } = useContext(SidebarContext) || { open: true };

  return (
    <div className={`w-screen`}>
      <Navbar />
      <div className="flex w-full min-h-[calc(100dvh-5rem)] z-40">
        <aside>
          <Sidebar />
        </aside>
        <div
          className={`w-full pt-20 duration-200 ${
            !open
              ? "pl-16 sm:pl-[calc((1/3)*100%)] lg:pl-[calc((1/4)*100%)] xl:pl-[calc((1/5)*100%)] 2xl:pl-[calc((1/6)*100%)]"
              : "pl-16"
          }`}
        >
          <div className="w-full h-full p-4">{children}</div>
        </div>
      </div>
    </div>
  );
};
export default DASHBOARDlayout;

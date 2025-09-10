"use client";

import React, { createContext, useEffect, useState } from "react";

interface SidebarContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SidebarContext = createContext<SidebarContextType | null>(null);

const SidebarContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState<boolean>(true);

  // Hydrate from localStorage on client mount
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("sidebarOpen");
      if (stored !== null) {
        setOpen(JSON.parse(stored));
      }
    } catch {
      // Ignore read errors
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem("sidebarOpen", JSON.stringify(open));
    } catch {
      // Ignore persistence errors
    }
  }, [open]);

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

export default SidebarContextProvider;

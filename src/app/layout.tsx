import type { Metadata } from "next";
import "./globals.css";
import SidebarContextProvider from "../context/sidebarContext";
import { FavoritesProvider } from "../context/favoritesContext";
import { CartProvider } from "../context/cartContext";
import Navbar from "@/components/main/Navbar";
import Footer from "@/components/main/Footer";

// Use system fonts in development to avoid Google Fonts timeout
const fontClass = process.env.NODE_ENV === 'development' 
  ? 'font-sans' 
  : 'font-titillium';

export const metadata: Metadata = {
  title: "Mecha-man E-commerce",
  description: "The best place to get your stuff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SidebarContextProvider>
        <FavoritesProvider>
          <CartProvider>
            <body
              className={`${fontClass} antialiased bg-background text-primary`}
            >
              <Navbar />
              {children}
              <Footer />
            </body>
          </CartProvider>
        </FavoritesProvider>
      </SidebarContextProvider>
    </html>
  );
}

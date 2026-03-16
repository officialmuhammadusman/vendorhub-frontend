"use client";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { usePathname }    from "next/navigation";
import { useState, useEffect } from "react";
import { Providers }      from "./providers";
import { Navbar }         from "@/components/layout/Navbar";
import { Footer }         from "@/components/layout/Footer";
import { CartDrawer }     from "@/components/cart/CartDrawer";
import { LandingNavbar }  from "@/components/landing/LandingNavbar";
import { LandingFooter }  from "@/components/landing/LandingFooter";
import { ToastContainer } from "react-toastify";

const inter = Inter({
  subsets:  ["latin"],
  variable: "--font-geist-sans",
  display:  "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets:  ["latin"],
  variable: "--font-geist-mono",
  display:  "swap",
});

function Shell({ children }: { children: React.ReactNode }) {
  const pathname        = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const isLanding = mounted && pathname === "/";

  return (
    <>
      {isLanding && <LandingNavbar />}
      {!isLanding && <><Navbar /><CartDrawer /></>}

      <main className="min-h-screen">{children}</main>

      {isLanding && <LandingFooter />}
      {!isLanding && <Footer />}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-gray-50 text-gray-900`}>
        <Providers>
          <Shell>{children}</Shell>
        </Providers>
      </body>
    </html>
  );
}
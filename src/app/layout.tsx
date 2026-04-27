// src/app/layout.tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// 1. IMPORT YOUR NEW PROVIDER HERE
import { Providers } from "@/components/Providers"; 

// This pulls the font cleanly and optimizes it at build time
const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "CampusKlub | Premium Food Delivery",
  description: "Order your favorite local campus meals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* We apply the font globally to the body tag */}
      <body className={`${jakarta.variable} font-sans antialiased bg-[#FDFCF8]`}>
        
        {/* 2. WRAP YOUR CHILDREN IN THE PROVIDER! */}
        <Providers>
          {children}
        </Providers>
        
      </body>
    </html>
  );
}
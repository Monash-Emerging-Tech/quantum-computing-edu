/**
 * Interactive quantum computing education web interface
 * MNET 2025
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  //metadataBase: new URL(""),
  
  title: "Interactive Quantum Circuits",
  description: "Interactive quantum computing education tool",
  other: {author: "MNET"},
  
  //openGraph: {
  //  title: "",
  //  type: "website",
  //  url: "",
  //  images: [],
  //  description: "",
  //}
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

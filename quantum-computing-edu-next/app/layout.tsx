/**
 * Interactive quantum computing education web interface
 * MNET 2025
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import SideIndexMenu from '@/components/side_index';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Global site metadata. The title template allows per-page titles (set via
 * generateMetadata in each route) to appear as "Page Title | Interactive
 * Quantum Circuits" in the browser tab. The default is used on pages that do
 * not define their own title.
 */
export const metadata: Metadata = {
  //metadataBase: new URL(""),
  
  title: {
    default: "QCET",
    template: "%s | QCET",
  },
  description: "Quantum Circuit Education Tool (QCET) is an interactive web interface built for teaching quantum computing and quantum circuits by the MNET Quantum Projects team.",
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
      <head>
        <link rel="icon" type="image/svg+xml" href={`${process.env.NEXT_PUBLIC_BASEPATH}/favicon.svg`} />
        <link rel="shortcut icon" type="image/svg+xml" href={`${process.env.NEXT_PUBLIC_BASEPATH}/favicon.svg`} />
        <meta name="theme-color" content="#000000" />
        <meta name="color-scheme" content="light dark" />
        <meta name="darkreader-lock" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SideIndexMenu />
        {children}
      </body>
    </html>
  );
}

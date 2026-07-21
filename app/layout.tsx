import type { Metadata } from "next";
import { Syncopate, Inter } from "next/font/google";
import "./globals.css";

const syncopate = Syncopate({
  variable: "--font-syncopate",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Glassiv Deco",
  description: "Technologia zdobienia szklanych opakowań",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={`${syncopate.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

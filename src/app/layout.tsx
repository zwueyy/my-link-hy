import type { Metadata } from "next";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { SITE_CONFIG } from "@/constants";
import "./globals.css";

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} - 나만의 스마트 링크 서랍`,
  description: SITE_CONFIG.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans bg-[#f2f4f6]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import {
  Aref_Ruqaa,
  Geist_Mono,
  Noto_Naskh_Arabic,
  Noto_Sans_Arabic,
} from "next/font/google";
import "./globals.css";

const arabicSans = Noto_Sans_Arabic({
  variable: "--font-arabic-sans",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
});

const arabicDisplay = Noto_Naskh_Arabic({
  variable: "--font-arabic-display",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
});

const nameDisplay = Aref_Ruqaa({
  variable: "--font-name-display",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wedding Invitation",
  description: "A customizable wedding invitation experience.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ar"
      className={`${arabicSans.variable} ${arabicDisplay.variable} ${nameDisplay.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

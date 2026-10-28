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
  title: {
    default: "Brikvent | Flow Your Inventory",
    template: "%s | Brikvent",
  },
  description:
    "Brikvent is the all-in-one commerce platform: e-commerce storefront, point of sale, Meta (Facebook & Instagram) commerce and a unified inbox, all running on one shared inventory.",
  keywords: [
    "inventory management",
    "POS",
    "point of sale",
    "e-commerce",
    "unified inbox",
    "Meta commerce",
    "Facebook shop",
    "Instagram shop",
    "WhatsApp",
  ],
  applicationName: "Brikvent",
  openGraph: {
    title: "Brikvent | Flow Your Inventory",
    description:
      "E-commerce, POS, Meta commerce and a unified inbox, all on one inventory.",
    siteName: "Brikvent",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

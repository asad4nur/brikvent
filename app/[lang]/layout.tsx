import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono, Hind_Siliguri } from "next/font/google";
import { getDictionary, hasLocale, locales } from "@/lib/i18n";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Geist has no Bengali glyphs; Bangla text falls through to this font.
const hindSiliguri = Hind_Siliguri({
  variable: "--font-bangla",
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
});

// Cache Components needs every root param value up front.
export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = getDictionary(lang);
  return {
    title: { default: meta.title, template: "%s | Brikvent" },
    description: meta.description,
    keywords: [
      "inventory management",
      "POS",
      "point of sale",
      "e-commerce",
      "unified inbox",
      "Facebook shop",
      "WhatsApp",
      "Bangladesh",
    ],
    applicationName: "Brikvent",
    // hreflang links so search engines pair the English and Bangla pages.
    alternates: {
      canonical: `/${lang}`,
      languages: { en: "/en", bn: "/bn", "x-default": "/en" },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      siteName: "Brikvent",
      type: "website",
      locale: lang === "bn" ? "bn_BD" : "en_US",
    },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html
      lang={lang}
      className={`${geistSans.variable} ${geistMono.variable} ${hindSiliguri.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

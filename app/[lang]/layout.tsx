import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono, Hind_Siliguri } from "next/font/google";
import { getDictionary, hasLocale, locales } from "@/lib/i18n";
import { pageMetadata, siteUrl } from "@/lib/seo";
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
    // Defaults for the home page; other pages override these with their own
    // pageMetadata().
    ...pageMetadata({ lang, path: "", title: meta.title, description: meta.description }),
    // Makes canonical, hreflang and og:image absolute, which link previews
    // (Facebook, WhatsApp, X) need to fetch the image.
    metadataBase: new URL(siteUrl),
    title: { default: meta.title, template: "%s | Brikvent" },
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
    // Optional HTML-tag verification for Google Search Console and Bing
    // Webmaster Tools: set the codes as Vercel environment variables.
    // (Verifying the domain with a DNS TXT record needs neither.)
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
      other: process.env.BING_SITE_VERIFICATION
        ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
        : undefined,
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

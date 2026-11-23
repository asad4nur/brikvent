import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, locales } from "@/lib/i18n";
import { getSiteDictionary } from "@/lib/site-dictionary";
import ThankYouContent from "@/components/thank-you-content";

// Where a new free-trial signup lands. Its own address, so ad platforms can count a visit to
// /en/thank-you or /bn/thank-you as the conversion.

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/thank-you">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = await getSiteDictionary(lang);
  return {
    title: t.signup.success.title,
    description: t.signup.success.subtitle,
    // Not a page to find in search
    robots: { index: false, follow: false },
    alternates: { canonical: `/${lang}/thank-you`, languages: { en: "/en/thank-you", bn: "/bn/thank-you" } },
  };
}

export default async function ThankYouPage({ params }: PageProps<"/[lang]/thank-you">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getSiteDictionary(lang);

  return (
    <main className="bg-neutral-50 px-4 py-16 sm:px-6 sm:py-20">
      <ThankYouContent t={t.signup.success} lang={lang} />
    </main>
  );
}

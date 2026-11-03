import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale, locales } from "@/lib/i18n";
import SignupPage from "../signup/page";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/free-trial">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang);

  return {
    title: t.signup.title,
    description: t.signup.subtitle,
    alternates: {
      canonical: `/${lang}/free-trial`,
      languages: { en: "/en/free-trial", bn: "/bn/free-trial" },
    },
  };
}

export default SignupPage;

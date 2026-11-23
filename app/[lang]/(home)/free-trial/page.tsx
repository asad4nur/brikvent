import type { Metadata } from "next";
import { notFound } from "next/navigation";
<<<<<<< HEAD
import { hasLocale, locales } from "@/lib/i18n";
import { getSiteDictionary } from "@/lib/site-dictionary";
=======
import { getDictionary, hasLocale, locales } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
>>>>>>> 4b5da3fe67fb33131325bc41c0d1b80f43ac6ad6
import SignupPage from "../signup/page";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/free-trial">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = await getSiteDictionary(lang);

  // Same page as /signup, so search engines are pointed at /signup instead
  // of indexing two copies.
  return {
    title: t.signup.title,
    ...pageMetadata({
      lang,
      path: "/free-trial",
      canonicalPath: "/signup",
      title: t.signup.title,
      description: t.signup.subtitle,
    }),
  };
}

export default SignupPage;

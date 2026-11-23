import type { MetadataRoute } from "next";
import { legalSlugs } from "@/dictionaries/legal";
import { company } from "@/lib/company";
import { locales } from "@/lib/i18n";
import { languageAlternates, siteUrl } from "@/lib/seo";

// /sitemap.xml: every indexable page in both languages, each entry listing
// its English, Bangla and x-default versions. /free-trial is left out: it
// shows the signup page and points its canonical at /signup.
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number; lastModified?: string }[] = [
    { path: "", priority: 1 },
    { path: "/signup", priority: 0.8 },
    ...legalSlugs.map((slug) => ({
      path: `/${slug}`,
      priority: slug === "about" ? 0.5 : 0.3,
      lastModified: company.policiesUpdated,
    })),
  ];

  const absolute = (languages: Record<string, string>) =>
    Object.fromEntries(Object.entries(languages).map(([k, v]) => [k, `${siteUrl}${v}`]));

  return pages.flatMap(({ path, priority, lastModified }) =>
    locales.map((lang) => ({
      url: `${siteUrl}/${lang}${path}`,
      ...(lastModified && { lastModified }),
      priority,
      alternates: { languages: absolute(languageAlternates(path)) },
    })),
  );
}

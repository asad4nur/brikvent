import { company } from "@/lib/company";
import type { Dictionary, Locale } from "@/lib/i18n";
import type { Plan } from "@/lib/pricing";
import { jsonLd, siteUrl } from "@/lib/seo";

// schema.org data for the home page, so search engines and AI answers can
// read who Brikvent is, what it sells and for how much, and the FAQ.
// Check changes with https://search.google.com/test/rich-results
export default function HomeSchema({ lang, t, plans }: { lang: Locale; t: Dictionary; plans: Plan[] }) {
  const org = `${siteUrl}/#organization`;
  const prices = plans.map((p) => p.monthly);

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": org,
        name: company.brand,
        url: siteUrl,
        logo: `${siteUrl}/icons/icon-512.png`,
        email: company.email,
        telephone: company.phoneHref.replace("tel:", ""),
        address: {
          "@type": "PostalAddress",
          streetAddress: "House 35, 3rd Floor, Road 4, Nikunjo 2",
          addressLocality: "Khilkhet, Dhaka",
          addressCountry: "BD",
        },
        areaServed: { "@type": "Country", name: "Bangladesh" },
        parentOrganization: {
          "@type": "Organization",
          name: company.parent,
          url: company.parentUrl,
          sameAs: company.socials.map((s) => s.href),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: company.brand,
        url: siteUrl,
        inLanguage: ["en", "bn"],
        publisher: { "@id": org },
      },
      {
        "@type": "SoftwareApplication",
        name: company.brand,
        url: `${siteUrl}/${lang}`,
        description: t.meta.description,
        inLanguage: lang,
        applicationCategory: "BusinessApplication",
        applicationSubCategory: "POS, e-commerce and inventory management",
        operatingSystem: "Web",
        publisher: { "@id": org },
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "BDT",
          lowPrice: Math.min(...prices),
          highPrice: Math.max(...prices),
          offerCount: plans.length,
          url: `${siteUrl}/${lang}#pricing`,
        },
      },
      {
        "@type": "FAQPage",
        inLanguage: lang,
        mainEntity: t.faq.items.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />;
}

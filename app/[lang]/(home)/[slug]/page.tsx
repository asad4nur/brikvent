import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getLegalDoc, isLegalSlug, legalSlugs } from "@/dictionaries/legal";
import { company } from "@/lib/company";
import { fill, getDictionary, hasLocale, locales, type Locale } from "@/lib/i18n";

// About and policy pages: /en/about, /bn/refund-policy, ...
export async function generateStaticParams() {
  return locales.flatMap((lang) => legalSlugs.map((slug) => ({ lang, slug })));
}

async function resolve(params: PageProps<"/[lang]/[slug]">["params"]) {
  const { lang, slug } = await params;
  if (!hasLocale(lang) || !isLegalSlug(slug)) notFound();
  return { lang, slug, doc: getLegalDoc(lang, slug) };
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[slug]">): Promise<Metadata> {
  const { lang, slug, doc } = await resolve(params);
  return {
    title: doc.title,
    description: doc.description,
    alternates: {
      canonical: `/${lang}/${slug}`,
      languages: { en: `/en/${slug}`, bn: `/bn/${slug}` },
    },
  };
}

const withCompany = (text: string, lang: Locale) =>
  fill(text, {
    parent: company.parent,
    email: company.email,
    phone: company.phone,
    address: company.address[lang],
    license: company.tradeLicense,
  });

// URL data is read inside Suspense so navigations get an instant shell; the
// listed slugs are still prerendered in full by generateStaticParams.
export default function LegalPage({ params }: PageProps<"/[lang]/[slug]">) {
  return (
    <Suspense fallback={<main className="min-h-[60vh] bg-white" />}>
      <LegalContent params={params} />
    </Suspense>
  );
}

async function LegalContent({ params }: { params: PageProps<"/[lang]/[slug]">["params"] }) {
  const { lang, doc } = await resolve(params);
  const t = getDictionary(lang);
  const updated = new Intl.DateTimeFormat(t.formats.number, { dateStyle: "long" }).format(
    new Date(`${company.policiesUpdated}T00:00:00Z`),
  );

  return (
    <main className="bg-white">
      <div className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-3xl px-4 pb-12 pt-12 sm:px-6 lg:pb-16 lg:pt-16">
          <Link
            href={`/${lang}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-950"
          >
            <ArrowLeft size={15} strokeWidth={2.25} aria-hidden />
            {t.legalPage.back}
          </Link>
          <h1 className="mt-6 text-4xl font-semibold tracking-[-0.02em] text-neutral-950 sm:text-5xl">
            {doc.title}
          </h1>
          <p className="mt-4 text-sm text-neutral-500">
            {t.legalPage.updated}: {updated}
          </p>
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
        <p className="text-lg leading-relaxed text-neutral-700">{withCompany(doc.intro, lang)}</p>

        {doc.sections.map((section) => (
          <section key={section.heading} className="mt-10">
            <h2 className="text-xl font-semibold tracking-tight text-neutral-950 sm:text-2xl">
              {section.heading}
            </h2>
            {section.paragraphs?.map((p) => (
              <p key={p} className="mt-3 text-[15px] leading-relaxed text-neutral-700 sm:text-base">
                {withCompany(p, lang)}
              </p>
            ))}
            {section.list && (
              <ul className="mt-4 space-y-2.5">
                {section.list.map((item) => (
                  <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-neutral-700 sm:text-base">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                    {withCompany(item, lang)}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </article>
    </main>
  );
}

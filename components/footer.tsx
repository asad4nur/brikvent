import Link from "next/link";
import { FileBadge, Mail, MapPin, Phone } from "lucide-react";
import type { Dictionary } from "@/dictionaries/en";
import { company } from "@/lib/company";
import type { Locale } from "@/lib/i18n";
import Logo from "./logo";

// Anchors for the product links, matched to nav.productsList by index.
const productLinks: [index: number, hash: string][] = [
  [0, "#ecommerce"],
  [1, "#pos"],
  [2, "#inventory"],
  [3, "#orders"],
  [4, "#inbox"],
  [6, "#accounting"],
];

// Simple brand marks (lucide has no brand icons).
const socialIcons: Record<string, string> = {
  Facebook: "M14 8.5V7c0-.6.4-1 1-1h2V2.5h-3C11.2 2.5 10 4.4 10 7v1.5H7.5V12H10v9.5h4V12h2.8l.7-3.5H14Z",
  Instagram:
    "M7.5 2.5h9a5 5 0 0 1 5 5v9a5 5 0 0 1-5 5h-9a5 5 0 0 1-5-5v-9a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h9a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3h-9ZM12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm5-3.3a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z",
  LinkedIn:
    "M4.5 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm-1.8 5.5h3.6V21H2.7V8.5Zm6 0h3.4v1.7c.5-.9 1.7-2 3.6-2 3.7 0 4.4 2.4 4.4 5.6V21H16.5v-6.2c0-1.5 0-3.3-2-3.3s-2.3 1.6-2.3 3.2V21H8.7V8.5Z",
};

// Renders a "{company}" template with the company name in bold.
function WithCompany({ template }: { template: string }) {
  const [before, after] = template.split("{company}");
  return (
    <>
      {before}
      <span className="font-semibold text-neutral-950">{company.parent}</span>
      {after}
    </>
  );
}

export default function Footer({
  t,
  products,
  lang,
}: {
  t: Dictionary["footer"];
  products: Dictionary["nav"]["productsList"];
  lang: Locale;
}) {
  const home = `/${lang}`;
  const columns = [
    {
      title: t.columns.product,
      links: productLinks.map(([i, hash]) => ({ name: products[i].name, href: `${home}${hash}` })),
    },
    {
      title: t.columns.why,
      links: [
        { name: t.links.howItWorks, href: `${home}#how-it-works` },
        { name: t.links.madeForBangladesh, href: `${home}#solutions` },
        { name: t.links.integrations, href: `${home}#integrations` },
        { name: t.links.pricing, href: `${home}#pricing` },
        { name: t.links.faq, href: `${home}#faq` },
      ],
    },
    {
      title: t.columns.company,
      links: [
        { name: t.legalLinks.about, href: `${home}/about` },
        { name: t.legalLinks.terms, href: `${home}/terms` },
        { name: t.legalLinks.refund, href: `${home}/refund-policy` },
        { name: t.legalLinks.privacy, href: `${home}/privacy-policy` },
        { name: t.legalLinks.delivery, href: `${home}/delivery-policy` },
      ],
    },
  ];
  const [copyBefore, copyAfter] = t.copyright.split("{company}");
  const c = t.contact;

  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 pb-10 pt-14 sm:px-6 lg:grid-cols-[1.2fr_2fr] lg:px-8 lg:pb-12 lg:pt-20 xl:px-12 min-[90rem]:px-20">
        <div>
          <Link href={home} aria-label="Brikvent home" className="inline-block">
            <Logo className="h-10 w-auto" />
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-neutral-600">{t.description}</p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-600">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            <span>
              <WithCompany template={t.productOf} />
            </span>
          </p>

          <ul className="mt-6 flex items-center gap-2" aria-label={c.follow}>
            {company.socials.map((s) => (
              <li key={s.name}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition-colors hover:border-brand hover:bg-brand hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                    <path d={socialIcons[s.name]} fillRule="evenodd" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold text-neutral-950">{col.title}</p>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-neutral-600 transition-colors hover:text-neutral-950"
                    >
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Business details required for payment gateway verification */}
      <div className="mx-auto max-w-[1440px] px-4 pb-12 sm:px-6 lg:px-8 xl:px-12 min-[90rem]:px-20">
        <address className="grid gap-3 rounded-3xl border border-neutral-200 bg-neutral-50 p-4 not-italic sm:grid-cols-2 sm:p-5 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
          {[
            { icon: MapPin, label: c.address, value: company.address[lang] },
            { icon: Phone, label: c.phone, value: company.phone, href: company.phoneHref },
            { icon: Mail, label: c.email, value: company.email, href: `mailto:${company.email}` },
            { icon: FileBadge, label: c.license, value: company.tradeLicense },
          ].map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="flex items-start gap-3 rounded-2xl bg-white p-3.5 ring-1 ring-neutral-200/70">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-lime/30 text-brand-dark">
                <Icon size={17} strokeWidth={2} aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                  {label}
                </span>
                {href ? (
                  <a href={href} className="mt-0.5 block break-words text-sm font-medium text-neutral-900 hover:text-brand-dark">
                    {value}
                  </a>
                ) : (
                  <span className="mt-0.5 block break-words text-sm font-medium text-neutral-900">{value}</span>
                )}
              </span>
            </div>
          ))}
        </address>
      </div>

      <div className="border-t border-neutral-200">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-6 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 xl:px-12 min-[90rem]:px-20">
          <p>
            {copyBefore}
            <span className="font-medium text-neutral-700">{company.parent}</span>
            {copyAfter}
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href={`${home}/terms`} className="hover:text-neutral-900">
              {t.legalLinks.terms}
            </Link>
            <Link href={`${home}/privacy-policy`} className="hover:text-neutral-900">
              {t.privacy}
            </Link>
            <Link href={`${home}/refund-policy`} className="hover:text-neutral-900">
              {t.legalLinks.refund}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

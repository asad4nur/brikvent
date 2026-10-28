import Link from "next/link";
import type { Dictionary } from "@/dictionaries/en";
import type { Locale } from "@/lib/i18n";
import Logo from "./logo";

const COMPANY = "Webbriks";

// Anchors for the product links, matched to nav.productsList by index.
const productLinks: [index: number, href: string][] = [
  [0, "#ecommerce"],
  [1, "#pos"],
  [2, "#inventory"],
  [3, "#orders"],
  [4, "#inbox"],
  [6, "#accounting"],
];

// Renders a "{company}" template with the company name in bold.
function WithCompany({ template }: { template: string }) {
  const [before, after] = template.split("{company}");
  return (
    <>
      {before}
      <span className="font-semibold text-neutral-950">{COMPANY}</span>
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
  const columns = [
    {
      title: t.columns.product,
      links: productLinks.map(([i, href]) => ({ name: products[i].name, href })),
    },
    {
      title: t.columns.why,
      links: [
        { name: t.links.howItWorks, href: "#how-it-works" },
        { name: t.links.madeForBangladesh, href: "#solutions" },
        { name: t.links.integrations, href: "#integrations" },
        { name: t.links.pricing, href: "#pricing" },
      ],
    },
    {
      title: t.columns.support,
      links: [
        { name: t.links.faq, href: "#faq" },
        { name: t.links.demo, href: "#demo" },
        { name: t.links.login, href: "#login" },
      ],
    },
  ];
  const [copyBefore, copyAfter] = t.copyright.split("{company}");

  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.3fr_2fr] lg:px-8 lg:py-20 xl:px-12 min-[90rem]:px-20">
        <div>
          <Link href={`/${lang}`} aria-label="Brikvent home" className="inline-block">
            <Logo className="h-10 w-auto" />
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-neutral-600">{t.description}</p>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-600">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            <span>
              <WithCompany template={t.productOf} />
            </span>
          </p>
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

      <div className="border-t border-neutral-200">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-6 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 xl:px-12 min-[90rem]:px-20">
          <p>
            {copyBefore}
            <span className="font-medium text-neutral-700">{COMPANY}</span>
            {copyAfter}
          </p>
          <div className="flex gap-5">
            <Link href="#privacy" className="hover:text-neutral-900">
              {t.privacy}
            </Link>
            <Link href="#terms" className="hover:text-neutral-900">
              {t.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

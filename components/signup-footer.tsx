import Link from "next/link";
import type { Dictionary } from "@/dictionaries/en";
import type { Locale } from "@/lib/i18n";
import { company } from "@/lib/company";

// Small footer for the signup pages: legal links and a way to reach support.
export default function SignupFooter({
  t,
  whatsapp,
  lang,
}: {
  t: Dictionary["footer"];
  whatsapp: Dictionary["whatsapp"];
  lang: Locale;
}) {
  const home = `/${lang}`;
  const linkClass =
    "inline-flex min-h-11 items-center font-medium text-neutral-600 underline-offset-2 hover:text-deep hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-1 px-4 py-4 text-center text-xs text-neutral-500 sm:px-6 lg:flex-row lg:justify-between lg:px-8 lg:text-left xl:px-12 min-[90rem]:px-20">
        <p>{t.copyright.replace("{company}", company.parent)}</p>
        <nav aria-label="Legal and support" className="flex flex-wrap items-center justify-center gap-x-5">
          <Link href={`${home}/terms`} className={linkClass}>
            {t.legalLinks.terms}
          </Link>
          <Link href={`${home}/privacy-policy`} className={linkClass}>
            {t.legalLinks.privacy}
          </Link>
          <a href={company.whatsappHref} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {whatsapp.label}
          </a>
        </nav>
      </div>
    </footer>
  );
}

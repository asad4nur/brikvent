"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Languages } from "lucide-react";
import type { Dictionary } from "@/dictionaries/en";
import type { Locale } from "@/lib/i18n";
import { getMerchantAdminUrl } from "@/lib/config";
import Logo from "./logo";

// Small header for the signup pages: logo, language switch and login. Nothing else to click.
export default function SignupHeader({ t, lang }: { t: Dictionary["nav"]; lang: Locale }) {
  const otherLang: Locale = lang === "en" ? "bn" : "en";
  // Same page in the other language, e.g. /en/signup -> /bn/signup.
  const pathname = usePathname();
  const switchHref = pathname.replace(/^\/(en|bn)(?=\/|$)/, `/${otherLang}`);

  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-8 xl:px-12 min-[90rem]:px-20">
        <Link href={`/${lang}`} aria-label="Brikvent home" className="inline-flex min-h-11 shrink-0 items-center">
          <Logo tone="teal" className="h-7 w-auto min-[360px]:h-8 sm:h-9" />
        </Link>
        <nav aria-label="Account" className="flex items-center gap-1 whitespace-nowrap sm:gap-2">
          <Link
            href={switchHref}
            hrefLang={otherLang}
            lang={otherLang}
            aria-label={t.switchLanguageLabel}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-neutral-200 px-3 text-sm min-[360px]:px-3.5 font-semibold text-neutral-700 transition-colors hover:border-mint-line hover:bg-mint-wash hover:text-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <Languages size={15} strokeWidth={2} aria-hidden className="hidden text-mint-ink min-[380px]:block" />
            {t.switchLanguage}
          </Link>
          <a
            href={getMerchantAdminUrl()}
            className="inline-flex min-h-11 items-center rounded-full px-2.5 text-sm font-semibold text-neutral-800 min-[360px]:px-3.5 transition-colors hover:bg-mint-wash hover:text-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {t.login}
          </a>
        </nav>
      </div>
    </header>
  );
}

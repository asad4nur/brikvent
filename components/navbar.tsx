"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Boxes,
  ChartColumnBig,
  ChevronDown,
  Languages,
  Megaphone,
  Menu,
  MessagesSquare,
  ScanBarcode,
  ShoppingBag,
  Truck,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
import type { Dictionary } from "@/dictionaries/en";
import type { Locale } from "@/lib/i18n";
import { getMerchantAdminUrl } from "@/lib/config";
import Logo from "./logo";

type Product = {
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

// Anchor and icon per product; names and descriptions come from the dictionary.
const productMeta: Pick<Product, "href" | "icon">[] = [
  { href: "#ecommerce", icon: ShoppingBag },
  { href: "#pos", icon: ScanBarcode },
  { href: "#inventory", icon: Boxes },
  { href: "#orders", icon: Truck },
  { href: "#inbox", icon: MessagesSquare },
  { href: "#marketing", icon: Megaphone },
  { href: "#accounting", icon: Wallet },
  { href: "#analytics", icon: ChartColumnBig },
];

function Chevron({ open }: { open: boolean }) {
  return (
    <ChevronDown
      size={14}
      strokeWidth={2}
      aria-hidden
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    />
  );
}

export default function Navbar({ t, lang }: { t: Dictionary["nav"]; lang: Locale }) {
  const home = `/${lang}`;
  // Absolute anchors, so the links also work from the policy pages.
  const products: Product[] = t.productsList.map((p, i) => ({
    ...p,
    ...productMeta[i],
    href: `${home}${productMeta[i].href}`,
  }));
  const links = [
    { name: t.links.solutions, href: `${home}#solutions` },
    { name: t.links.pricing, href: `${home}#pricing` },
    { name: t.links.integrations, href: `${home}#integrations` },
    { name: t.links.faq, href: `${home}#faq` },
  ];
  const otherLang: Locale = lang === "en" ? "bn" : "en";
  // Same page in the other language, e.g. /en/terms -> /bn/terms.
  const pathname = usePathname();
  const switchHref = pathname.replace(/^\/(en|bn)(?=\/|$)/, `/${otherLang}`);
  const [scrolled, setScrolled] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const productsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!productsRef.current?.contains(e.target as Node)) {
        setProductsOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setProductsOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  const closeAll = () => {
    setProductsOpen(false);
    setMobileOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled || mobileOpen
          ? "bg-white/95 shadow-[0_8px_24px_-16px_rgba(16,42,39,0.25)] backdrop-blur"
          : "bg-white"
      }`}
    >
      <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-neutral-200" />
      {/* Announcement bar */}
      <div className="relative bg-deep text-white">
        <div className="mx-auto flex h-9 max-w-[1440px] items-center justify-center gap-2 px-4 text-xs sm:text-sm min-[90rem]:h-10">
          <span className="rounded-full bg-mint px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-deep">
            {t.announcementBadge}
          </span>
          <span className="truncate text-white/85">
            {t.announcement}
          </span>
          <Link
            href={`${home}#orders`}
            className="hidden font-semibold text-mint hover:underline sm:inline"
          >
            {t.learnMore}
          </Link>
        </div>
      </div>

      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 xl:gap-6 px-4 sm:px-6 lg:h-[72px] lg:px-8 xl:px-12 min-[90rem]:h-20 min-[90rem]:px-20"
      >
        <Link href={`/${lang}`} onClick={closeAll} className="shrink-0" aria-label="Brikvent home">
          <Logo tone="teal" className="h-9 w-auto lg:h-10 min-[90rem]:h-11" />
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 whitespace-nowrap lg:flex min-[90rem]:gap-2">
          <div
            ref={productsRef}
            className="relative"
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
          >
            <button
              type="button"
              aria-expanded={productsOpen}
              aria-haspopup="true"
              // Hover already opens the menu, so a toggle here would close it
              // on the same click. Outside click and Escape handle closing.
              onClick={() => setProductsOpen(true)}
              className={`flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium xl:px-4 min-[90rem]:text-[15px] transition-colors ${
                productsOpen
                  ? "bg-mint-wash text-deep"
                  : "text-neutral-600 hover:bg-mint-wash hover:text-deep"
              }`}
            >
              {t.products}
              <Chevron open={productsOpen} />
            </button>

            {/* Mega menu */}
            <div
              className={`absolute left-1/2 top-full w-[680px] -translate-x-1/2 min-[90rem]:w-[760px] whitespace-normal pt-3 transition-all duration-200 ${
                productsOpen
                  ? "visible translate-y-0 opacity-100"
                  : "invisible -translate-y-1 opacity-0"
              }`}
            >
              <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_24px_60px_-12px_rgba(0,0,0,0.18)]">
                <div className="grid grid-cols-2 gap-1 p-3">
                  {products.map((p) => (
                    <Link
                      key={p.name}
                      href={p.href}
                      onClick={closeAll}
                      className="group flex gap-3 rounded-xl p-3 transition-colors hover:bg-mint-wash"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 transition-colors group-hover:border-mint-line group-hover:bg-white group-hover:text-mint-ink">
                        <p.icon size={20} strokeWidth={1.75} aria-hidden />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-deep">
                          {p.name}
                        </span>
                        <span className="mt-0.5 block text-[13px] leading-snug text-neutral-500">
                          {p.description}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-mint-line bg-mint-wash px-6 py-4">
                  <div>
                    <p className="text-sm font-semibold text-deep">
                      {t.megaTitle}
                    </p>
                    <p className="text-[13px] text-neutral-500">
                      {t.megaBody}
                    </p>
                  </div>
                  <Link
                    href={`${home}#platform`}
                    onClick={closeAll}
                    className="shrink-0 text-sm font-semibold text-mint-ink hover:underline"
                  >
                    {t.megaLink}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-3 py-2 text-sm font-medium xl:px-4 min-[90rem]:text-[15px] text-neutral-600 transition-colors hover:bg-mint-wash hover:text-deep"
            >
              {l.name}
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden shrink-0 items-center gap-2 whitespace-nowrap lg:flex min-[90rem]:gap-3">
          <Link
            href={switchHref}
            hrefLang={otherLang}
            lang={otherLang}
            aria-label={t.switchLanguageLabel}
            className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1.5 text-sm font-semibold text-neutral-700 transition-colors hover:border-mint-line hover:bg-mint-wash hover:text-deep"
          >
            <Languages size={15} strokeWidth={2} aria-hidden className="text-mint-ink" />
            {t.switchLanguage}
          </Link>
          <a
            href={getMerchantAdminUrl()}
            className="rounded-full px-3 py-2 text-sm font-medium xl:px-4 min-[90rem]:text-[15px] text-neutral-700 transition-colors hover:text-deep"
          >
            {t.login}
          </a>
          <Link
            href={`${home}#demo`}
            className="hidden rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-deep transition-colors hover:border-deep xl:inline-flex"
          >
            {t.demo}
          </Link>
          <Link
            href={`${home}/signup`}
            className="group inline-flex items-center gap-2 rounded-full bg-deep py-2 pl-5 pr-2 text-sm font-semibold text-white transition-colors hover:bg-deep-soft"
          >
            {t.trial}
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-mint text-deep transition-transform group-hover:translate-x-0.5">
              <ArrowRight size={13} strokeWidth={2.5} aria-hidden />
            </span>
          </Link>
        </div>

        {/* Mobile language switch + menu toggle */}
        <div className="flex items-center gap-2 lg:hidden">
        <Link
          href={switchHref}
          hrefLang={otherLang}
          lang={otherLang}
          aria-label={t.switchLanguageLabel}
          className="flex h-10 items-center gap-1.5 rounded-full border border-neutral-200 px-3 text-sm font-semibold text-neutral-700"
        >
          <Languages size={15} strokeWidth={2} aria-hidden className="text-mint-ink" />
          {t.switchLanguage}
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? t.closeMenu : t.openMenu}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-900 transition-colors hover:bg-neutral-50 lg:hidden"
        >
          {mobileOpen ? (
            <X size={18} strokeWidth={2} aria-hidden />
          ) : (
            <Menu size={18} strokeWidth={2} aria-hidden />
          )}
        </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`overflow-y-auto bg-white transition-[max-height,opacity] duration-300 lg:hidden ${
          mobileOpen ? "max-h-[calc(100dvh-100px)] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-1 border-t border-neutral-100 px-4 pb-6 pt-3 sm:px-6">
          <button
            type="button"
            onClick={() => setMobileProductsOpen((v) => !v)}
            aria-expanded={mobileProductsOpen}
            className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-base font-medium text-neutral-900 hover:bg-neutral-50"
          >
            {t.products}
            <Chevron open={mobileProductsOpen} />
          </button>
          {mobileProductsOpen && (
            <div className="grid gap-1 pb-2 pl-2">
              {products.map((p) => (
                <Link
                  key={p.name}
                  href={p.href}
                  onClick={closeAll}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-neutral-50"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-neutral-200 text-neutral-700">
                    <p.icon size={18} strokeWidth={1.75} aria-hidden />
                  </span>
                  <span className="text-sm font-medium text-neutral-900">{p.name}</span>
                </Link>
              ))}
            </div>
          )}

          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={closeAll}
              className="block rounded-xl px-3 py-3 text-base font-medium text-neutral-900 hover:bg-neutral-50"
            >
              {l.name}
            </Link>
          ))}

          <div className="grid gap-2 pt-4">
            <Link
              href={`${home}/signup`}
              onClick={closeAll}
              className="rounded-full bg-deep py-3 text-center text-sm font-semibold text-white"
            >
              {t.trial}
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href={`${home}#demo`}
                onClick={closeAll}
                className="rounded-full border border-neutral-200 py-3 text-center text-sm font-medium text-neutral-900"
              >
                {t.demo}
              </Link>
              <a
                href={getMerchantAdminUrl()}
                onClick={closeAll}
                className="rounded-full border border-neutral-200 py-3 text-center text-sm font-medium text-neutral-900"
              >
                {t.login}
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

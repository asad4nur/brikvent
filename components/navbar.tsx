"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Boxes,
  ChartColumnBig,
  ChevronDown,
  Infinity as MetaIcon,
  Menu,
  MessagesSquare,
  ScanBarcode,
  ShoppingBag,
  X,
  type LucideIcon,
} from "lucide-react";
import Logo from "./logo";

type Product = {
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

const products: Product[] = [
  {
    name: "E-commerce",
    description: "Launch a storefront that syncs with your stock in real time.",
    href: "#ecommerce",
    icon: ShoppingBag,
  },
  {
    name: "Point of Sale",
    description: "Fast in-store checkout, receipts and cash drawer control.",
    href: "#pos",
    icon: ScanBarcode,
  },
  {
    name: "Unified Inbox",
    description: "Messenger, Instagram and WhatsApp chats in one place.",
    href: "#inbox",
    icon: MessagesSquare,
  },
  {
    name: "Meta Commerce",
    description: "Sync catalogs to Facebook & Instagram Shops automatically.",
    href: "#meta",
    icon: MetaIcon,
  },
  {
    name: "Inventory",
    description: "One stock count across every channel and warehouse.",
    href: "#inventory",
    icon: Boxes,
  },
  {
    name: "Analytics",
    description: "Sales, margins and best sellers in a single dashboard.",
    href: "#analytics",
    icon: ChartColumnBig,
  },
];

const links = [
  { name: "Solutions", href: "#solutions" },
  { name: "Pricing", href: "#pricing" },
  { name: "Integrations", href: "#integrations" },
  { name: "Resources", href: "#resources" },
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

export default function Navbar() {
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
          ? "border-b border-neutral-200/80 bg-white/85 backdrop-blur-xl"
          : "border-b border-transparent bg-white"
      }`}
    >
      {/* Announcement bar */}
      <div className="bg-neutral-950 text-white">
        <div className="mx-auto flex h-9 max-w-[1440px] items-center justify-center gap-2 px-4 text-xs sm:text-sm min-[90rem]:h-10">
          <span className="rounded-full bg-[#CCFF00] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-950">
            New
          </span>
          <span className="truncate text-neutral-300">
            Unified Inbox for Messenger, Instagram &amp; WhatsApp is live
          </span>
          <Link
            href="#inbox"
            className="hidden font-medium text-[#CCFF00] hover:underline sm:inline"
          >
            Learn more →
          </Link>
        </div>
      </div>

      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 px-4 sm:px-6 lg:h-[72px] lg:px-8 xl:px-12 min-[90rem]:h-20 min-[90rem]:px-20"
      >
        <Link href="/" onClick={closeAll} className="shrink-0" aria-label="Brikvent home">
          <Logo className="h-9 w-auto lg:h-10 min-[90rem]:h-11" />
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
              className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium min-[90rem]:text-[15px] transition-colors ${
                productsOpen
                  ? "bg-neutral-100 text-neutral-950"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
              }`}
            >
              Products
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
                      className="group flex gap-3 rounded-xl p-3 transition-colors hover:bg-neutral-50"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 transition-colors group-hover:border-[#00A63E]/30 group-hover:bg-[#CCFF00]/25 group-hover:text-[#00A63E]">
                        <p.icon size={20} strokeWidth={1.75} aria-hidden />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-neutral-950">
                          {p.name}
                        </span>
                        <span className="mt-0.5 block text-[13px] leading-snug text-neutral-500">
                          {p.description}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-neutral-100 bg-neutral-50 px-6 py-4">
                  <div>
                    <p className="text-sm font-semibold text-neutral-950">
                      One platform. Every channel.
                    </p>
                    <p className="text-[13px] text-neutral-500">
                      Online store, POS and social inbox, all sharing one inventory.
                    </p>
                  </div>
                  <Link
                    href="#platform"
                    onClick={closeAll}
                    className="shrink-0 text-sm font-semibold text-[#00A63E] hover:underline"
                  >
                    See the platform →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {links.map((l) => (
            <Link
              key={l.name}
              href={l.href}
              className="rounded-full px-4 py-2 text-sm font-medium min-[90rem]:text-[15px] text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
            >
              {l.name}
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden shrink-0 items-center gap-2 whitespace-nowrap lg:flex min-[90rem]:gap-3">
          <Link
            href="#login"
            className="rounded-full px-4 py-2 text-sm font-medium min-[90rem]:text-[15px] text-neutral-700 transition-colors hover:text-neutral-950"
          >
            Log in
          </Link>
          <Link
            href="#demo"
            className="hidden rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-900 transition-colors hover:border-neutral-300 hover:bg-neutral-50 xl:inline-flex"
          >
            Book a demo
          </Link>
          <Link
            href="#signup"
            className="group inline-flex items-center gap-2 rounded-full bg-neutral-950 py-2 pl-5 pr-2 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
          >
            Start free trial
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#CCFF00] text-neutral-950 transition-transform group-hover:translate-x-0.5">
              <ArrowRight size={13} strokeWidth={2.5} aria-hidden />
            </span>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-900 transition-colors hover:bg-neutral-50 lg:hidden"
        >
          {mobileOpen ? (
            <X size={18} strokeWidth={2} aria-hidden />
          ) : (
            <Menu size={18} strokeWidth={2} aria-hidden />
          )}
        </button>
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
            Products
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
              key={l.name}
              href={l.href}
              onClick={closeAll}
              className="block rounded-xl px-3 py-3 text-base font-medium text-neutral-900 hover:bg-neutral-50"
            >
              {l.name}
            </Link>
          ))}

          <div className="grid gap-2 pt-4">
            <Link
              href="#signup"
              onClick={closeAll}
              className="rounded-full bg-neutral-950 py-3 text-center text-sm font-semibold text-white"
            >
              Start free trial
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="#demo"
                onClick={closeAll}
                className="rounded-full border border-neutral-200 py-3 text-center text-sm font-medium text-neutral-900"
              >
                Book a demo
              </Link>
              <Link
                href="#login"
                onClick={closeAll}
                className="rounded-full border border-neutral-200 py-3 text-center text-sm font-medium text-neutral-900"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

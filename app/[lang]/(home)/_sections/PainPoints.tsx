"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  BellRing,
  Boxes,
  Globe,
  LayoutGrid,
  ListChecks,
  MessagesSquare,
  NotebookPen,
  PackageX,
  PhoneCall,
  PhoneOff,
  ScanBarcode,
  SearchX,
  Store,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { Dictionary } from "@/dictionaries/en";

type Filter = "all" | "shop" | "online";
type Audience = "shop" | "online" | "both";

// Icons per problem (pain, fix), in dictionary order; the words come from the dictionary.
const icons: [LucideIcon, LucideIcon][] = [
  [Users, ScanBarcode],
  [NotebookPen, Wallet],
  [PackageX, Boxes],
  [SearchX, BellRing],
  [MessagesSquare, ListChecks],
  [PhoneOff, PhoneCall],
];

const filterIcons: Record<Filter, LucideIcon> = { all: LayoutGrid, shop: Store, online: Globe };

export default function PainPoints({ t, lang }: { t: Dictionary["painPoints"]; lang: string }) {
  const [filter, setFilter] = useState<Filter>("all");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const filters: Filter[] = ["all", "shop", "online"];

  const items = t.items
    .map((item, i) => ({ ...item, for: item.for as Audience, pain: icons[i][0], fix: icons[i][1] }))
    .filter((item) => filter === "all" || item.for === filter || item.for === "both")
    // Under a filter, problems specific to that business type come first.
    .sort((a, b) => (filter === "all" ? 0 : Number(b.for === filter) - Number(a.for === filter)));

  // Arrow keys move between filters (WAI-ARIA tabs pattern).
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (filters.indexOf(filter) + step + filters.length) % filters.length;
    setFilter(filters[next]);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="problems" className="relative border-t border-neutral-200 bg-neutral-50 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12 min-[90rem]:px-20">
        <div className="reveal-group mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-mint-line bg-mint-wash px-3 py-1 text-[13px] font-semibold text-mint-ink">
            <span className="h-2 w-2 rounded-full bg-mint" />
            {t.eyebrow}
          </p>
          <h2 className="mt-5 text-3xl font-bold leading-[1.15] tracking-[-0.02em] text-deep sm:text-[44px]">
            {t.title}{" "}
            <span className="box-decoration-clone bg-[linear-gradient(transparent_62%,rgba(49,214,170,0.45)_62%,rgba(49,214,170,0.45)_92%,transparent_92%)]">
              {t.titleAccent}
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg">{t.body}</p>

          {/* Business-type filter, matching the hero tabs */}
          <div
            role="tablist"
            aria-label={t.filterLabel}
            className="mx-auto mt-8 grid max-w-md grid-cols-3 gap-1 rounded-2xl border border-neutral-200 bg-white p-1"
          >
            {filters.map((f, i) => {
              const selected = f === filter;
              const Icon = filterIcons[f];
              return (
                <button
                  key={f}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="problems-list"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setFilter(f)}
                  onKeyDown={onKeyDown}
                  className={`flex items-center justify-center gap-2 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                    selected ? "bg-deep text-white" : "text-neutral-600 hover:bg-neutral-50 hover:text-deep"
                  }`}
                >
                  <Icon size={15} strokeWidth={2.25} aria-hidden className={selected ? "text-mint" : "text-neutral-400"} />
                  {t.filters[f]}
                </button>
              );
            })}
          </div>
        </div>

        <ul
          id="problems-list"
          role="tabpanel"
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:gap-5 xl:grid-cols-3"
        >
          {items.map((item, i) => {
            const Pain = item.pain;
            const Fix = item.fix;
            return (
              <li
                key={`${filter}-${item.module}`}
                className="pop flex flex-col rounded-3xl border border-neutral-200 bg-white p-5 transition-shadow hover:shadow-[0_18px_40px_-24px_rgba(16,42,39,0.35)] sm:p-6"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-600">
                    {t.tags[item.for]}
                  </span>
                  <span className="truncate text-[12px] font-medium text-neutral-400">{item.module}</span>
                </div>

                {/* Before */}
                <div className="mt-5 flex gap-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
                    <Pain size={19} strokeWidth={2} aria-hidden />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-red-500">{t.before}</p>
                    <h3 className="mt-0.5 text-base font-semibold text-neutral-800 sm:text-[17px]">{item.painTitle}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">{item.painBody}</p>
                  </div>
                </div>

                {/* Divider + fix stay pinned to the bottom so fixes line up across a row. */}
                <div className="mt-auto pt-4">
                <div aria-hidden className="mb-4 flex items-center gap-3">
                  <span className="h-px flex-1 bg-neutral-200" />
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-mint-line bg-white text-mint-ink">
                    <ArrowDown size={14} strokeWidth={2.5} />
                  </span>
                  <span className="h-px flex-1 bg-neutral-200" />
                </div>

                {/* After */}
                <div className="flex gap-3.5 rounded-2xl border border-mint-line bg-mint-wash p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mint text-deep">
                    <Fix size={19} strokeWidth={2} aria-hidden />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-mint-ink">{t.after}</p>
                    <h3 className="mt-0.5 text-base font-bold text-deep sm:text-[17px]">{item.fixTitle}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-neutral-700">{item.fixBody}</p>
                  </div>
                </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Closing line + CTA */}
        <div className="mt-12 flex flex-col items-center gap-5 rounded-3xl bg-deep px-6 py-8 text-center sm:px-10 lg:flex-row lg:justify-between lg:text-left">
          <p className="text-lg text-white/75 sm:text-xl">
            <span className="font-bold text-white">{t.closingStrong}</span> {t.closingRest}
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Link
              href={`/${lang}/signup`}
              className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-mint py-3 pl-6 pr-3 text-[15px] font-semibold text-deep transition-colors hover:bg-white"
            >
              {t.trial}
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-deep text-mint transition-transform group-hover:translate-x-0.5">
                <ArrowRight size={15} strokeWidth={2.5} aria-hidden />
              </span>
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center gap-1.5 whitespace-nowrap text-[15px] font-semibold text-mint hover:text-white"
            >
              {t.link}
              <ArrowRight size={16} strokeWidth={2.25} aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

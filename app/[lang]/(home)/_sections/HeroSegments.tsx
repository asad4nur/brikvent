"use client";

import type { CSSProperties, KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  Boxes,
  CalendarCheck,
  CircleCheck,
  Globe,
  ListChecks,
  PhoneCall,
  RefreshCw,
  ScanBarcode,
  Store,
  Truck,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { Dictionary } from "@/dictionaries/en";
import SyncVisual, { type SyncMode } from "./SyncVisual";

type Segment = Dictionary["hero"]["segments"][number] & { id: SyncMode };

// Staggers the .rise entrance animation.
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

const DEFAULT: SyncMode = "both";

// Icons for each segment's three benefits, in dictionary order.
const benefitIcons: Record<SyncMode, LucideIcon[]> = {
  shop: [ScanBarcode, Wallet, BellRing],
  both: [Boxes, RefreshCw, Store],
  online: [ListChecks, PhoneCall, Truck],
};

function TabIcon({ id }: { id: SyncMode }) {
  const icons: LucideIcon[] = id === "shop" ? [Store] : id === "online" ? [Globe] : [Store, Globe];
  return (
    <span aria-hidden className="flex items-center gap-0.5">
      {icons.map((Icon, i) => (
        <Icon key={i} size={15} strokeWidth={2.25} />
      ))}
    </span>
  );
}

export default function HeroSegments({ t, lang }: { t: Dictionary["hero"]; lang: string }) {
  const segments = t.segments as Segment[];
  const [active, setActive] = useState<SyncMode>(DEFAULT);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Ads can deep-link a segment, e.g. /bn?type=shop. Read after hydration
  // (the page is static), on the next frame.
  useEffect(() => {
    const type = new URLSearchParams(window.location.search).get("type");
    if (!type || !segments.some((s) => s.id === type)) return;
    const id = requestAnimationFrame(() => setActive(type as SyncMode));
    return () => cancelAnimationFrame(id);
  }, [segments]);

  const current = segments.find((s) => s.id === active) ?? segments[0];
  const index = segments.indexOf(current);

  // Arrow keys move between tabs (WAI-ARIA tabs pattern).
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (index + step + segments.length) % segments.length;
    setActive(segments[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:px-8 lg:pb-20 lg:pt-14 xl:px-12 min-[90rem]:px-20">
      <div>
        <p
          className="rise inline-flex items-center gap-2 rounded-full border border-mint-line bg-mint-wash px-3 py-1 text-[13px] font-semibold text-mint-ink"
          style={delay(0)}
        >
          <span className="h-2 w-2 rounded-full bg-mint" />
          {t.eyebrow}
        </p>

        <h1
          className="rise mt-5 text-[36px] font-bold leading-[1.08] tracking-[-0.03em] text-deep sm:text-[50px] lg:text-[40px] xl:text-[50px] min-[90rem]:text-[58px]"
          style={delay(80)}
        >
          {t.title1}
          <br />
          {/* Flat mint highlighter band; clones onto each line if it wraps. */}
          <span className="box-decoration-clone bg-[linear-gradient(transparent_62%,rgba(49,214,170,0.45)_62%,rgba(49,214,170,0.45)_92%,transparent_92%)]">
            {t.title2}
          </span>
        </h1>

        <p
          className="rise mt-5 max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg"
          style={delay(140)}
        >
          {t.body}
        </p>

        {/* Segment switcher */}
        <div className="rise mt-8" style={delay(200)}>
          <p id="segments-label" className="text-sm font-semibold text-neutral-700">
            {t.segmentsLabel}
          </p>
          <div
            role="tablist"
            aria-labelledby="segments-label"
            className="mt-2.5 grid grid-cols-3 gap-1 rounded-2xl border border-neutral-200 bg-neutral-50 p-1 sm:inline-grid"
          >
            {segments.map((s, i) => {
              const selected = s.id === active;
              return (
                <button
                  key={s.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`segment-tab-${s.id}`}
                  aria-label={s.tab}
                  aria-selected={selected}
                  aria-controls="segment-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(s.id)}
                  onKeyDown={onKeyDown}
                  className={`flex items-center justify-center gap-2 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors sm:px-4 ${
                    selected ? "bg-deep text-white shadow-sm" : "text-neutral-600 hover:bg-white hover:text-deep"
                  }`}
                >
                  <span className={selected ? "text-mint" : "text-neutral-400"}>
                    <TabIcon id={s.id} />
                  </span>
                  <span className="sm:hidden">{s.tabShort}</span>
                  <span className="hidden sm:inline">{s.tab}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Three benefit tiles for the chosen business; keyed so they fade in on switch. */}
        <ul
          key={current.id}
          id="segment-panel"
          role="tabpanel"
          aria-labelledby={`segment-tab-${current.id}`}
          className="mt-4 grid gap-2.5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3"
        >
          {current.benefits.map((b, i) => {
            const Icon = benefitIcons[current.id][i];
            return (
              <li
                key={b.title}
                className="pop flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-3 sm:block sm:p-3.5 lg:flex xl:block"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-mint-wash text-mint-ink">
                  <Icon size={18} strokeWidth={2} aria-hidden />
                </span>
                <span className="block sm:mt-2.5 lg:mt-0 xl:mt-2.5">
                  <span className="block text-[15px] font-bold leading-snug text-deep">{b.title}</span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-neutral-500">{b.sub}</span>
                </span>
              </li>
            );
          })}
        </ul>

        <div className="rise mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center" style={delay(260)}>
          <Link
            href={`/${lang}/signup`}
            className="group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-deep py-3.5 pl-6 pr-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-deep-soft"
          >
            {t.trial}
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-mint text-deep transition-transform group-hover:translate-x-0.5">
              <ArrowRight size={15} strokeWidth={2.5} aria-hidden />
            </span>
          </Link>
          <Link
            href="#demo"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-neutral-300 bg-white px-6 py-3.5 text-[15px] font-semibold text-deep transition-colors hover:border-deep"
          >
            <CalendarCheck size={16} strokeWidth={2.25} className="text-mint-ink" aria-hidden />
            {t.demo}
          </Link>
        </div>

        <ul className="rise mt-5 flex flex-wrap gap-x-5 gap-y-2" style={delay(320)}>
          {t.trust.map((item) => (
            <li key={item} className="flex items-center gap-1.5 text-[13px] font-medium text-neutral-600">
              <CircleCheck size={15} strokeWidth={2.25} aria-hidden className="text-mint-ink" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Shop + online visual; the tab decides which side is live. */}
      <div className="rise rounded-[2rem] border border-mint-line bg-mint-wash px-3 py-5 sm:p-8" style={delay(200)}>
        <SyncVisual mode={active} addShop={t.addShop} addOnline={t.addOnline} onAdd={() => setActive("both")} />
      </div>
    </div>
  );
}

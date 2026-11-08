"use client";

import type { CSSProperties, KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarCheck, Check, Globe, Rocket, Store, type LucideIcon } from "lucide-react";
import type { Dictionary } from "@/dictionaries/en";
import HeroVisual from "./HeroVisual";
import ShopVisual from "./ShopVisual";
import OnlineVisual from "./OnlineVisual";

type Segment = Dictionary["hero"]["segments"][number];
type SegmentId = "shop" | "both" | "online";

// Staggers the .rise entrance animation.
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

const DEFAULT: SegmentId = "both";

function TabIcon({ id }: { id: SegmentId }) {
  const icons: LucideIcon[] = id === "shop" ? [Store] : id === "online" ? [Globe] : [Store, Globe];
  return (
    <span aria-hidden className="flex items-center gap-0.5">
      {icons.map((Icon, i) => (
        <Icon key={i} size={15} strokeWidth={2.25} />
      ))}
    </span>
  );
}

export default function HeroSegments({
  t,
  lang,
  finePrint,
}: {
  t: Dictionary["hero"];
  lang: string;
  finePrint: string;
}) {
  const segments = t.segments as (Segment & { id: SegmentId })[];
  const [active, setActive] = useState<SegmentId>(DEFAULT);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Ads can deep-link a segment, e.g. /bn?type=shop. Read after hydration
  // (the page is static), on the next frame.
  useEffect(() => {
    const type = new URLSearchParams(window.location.search).get("type");
    if (!type || !segments.some((s) => s.id === type)) return;
    const id = requestAnimationFrame(() => setActive(type as SegmentId));
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
    <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:px-8 lg:pb-24 lg:pt-14 xl:px-12 min-[90rem]:px-20">
      <div>
        <p
          className="rise inline-flex items-center gap-2 rounded-full border border-mint-line bg-mint-wash px-3 py-1 text-[13px] font-semibold text-mint-ink"
          style={delay(0)}
        >
          <span className="h-2 w-2 rounded-full bg-mint" />
          {t.eyebrow}
        </p>

        <h1
          className="rise mt-5 text-[38px] font-bold leading-[1.08] tracking-[-0.03em] text-deep sm:text-[52px] lg:text-[46px] xl:text-[54px] min-[90rem]:text-[62px]"
          style={delay(80)}
        >
          {t.title1}
          <br />
          {/* Flat mint highlighter band; clones onto each line if it wraps. */}
          <span className="box-decoration-clone bg-[linear-gradient(transparent_62%,rgba(49,214,170,0.45)_62%,rgba(49,214,170,0.45)_92%,transparent_92%)]">
            {t.title2}
          </span>
        </h1>

        {/* Segment switcher */}
        <div className="rise mt-8" style={delay(160)}>
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
                    selected
                      ? "bg-deep text-white shadow-sm"
                      : "text-neutral-600 hover:bg-white hover:text-deep"
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

        {/* Segment copy; keyed so it fades in again on every switch. */}
        <div
          key={current.id}
          id="segment-panel"
          role="tabpanel"
          aria-labelledby={`segment-tab-${current.id}`}
          className="pop mt-6 min-h-[15rem] sm:min-h-[12.5rem]"
        >
          <p className="max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg">{current.line}</p>
          <ul className="mt-5 grid max-w-xl gap-x-6 gap-y-3 sm:grid-cols-2" aria-label={t.benefitsLabel}>
            {current.benefits.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-[15px] font-medium leading-snug text-neutral-800">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mint text-deep">
                  <Check size={12} strokeWidth={3} aria-hidden />
                </span>
                {b}
              </li>
            ))}
          </ul>
          {current.note && (
            <p className="mt-5 flex max-w-xl items-start gap-2.5 rounded-xl border border-mint-line bg-mint-wash px-3.5 py-2.5 text-sm font-medium text-deep">
              <Rocket size={16} strokeWidth={2.25} aria-hidden className="mt-0.5 shrink-0 text-mint-ink" />
              {current.note}
            </p>
          )}
        </div>

        <div className="rise mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center" style={delay(240)}>
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

        <p className="rise mt-4 text-[13px] text-neutral-500" style={delay(300)}>
          {finePrint}
        </p>
      </div>

      {/* Product visual for the selected segment, on a flat mint panel */}
      <div className="rise rounded-[2rem] border border-mint-line bg-mint-wash px-2 py-4 sm:p-6" style={delay(200)}>
        <div key={current.id} className="pop">
          {current.id === "shop" ? <ShopVisual /> : current.id === "online" ? <OnlineVisual /> : <HeroVisual />}
        </div>
      </div>
    </div>
  );
}

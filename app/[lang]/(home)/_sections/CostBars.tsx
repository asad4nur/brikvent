"use client";

import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/dictionaries/en";
import { localizeDigits } from "@/lib/i18n";
import { costComparison } from "@/lib/pricing";

const max = Math.max(...costComparison.map((r) => r.value));

// Horizontal bars of the monthly bill per platform type; they grow in when
// the chart scrolls into view.
export default function CostBars({
  t,
  numberLocale,
}: {
  t: Dictionary["comparison"];
  numberLocale: string;
}) {
  const ref = useRef<HTMLUListElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <ul ref={ref} className="space-y-3">
      {costComparison.map((row, i) => {
        const label = t.rows[row.id];
        // Keep tiny bars visible so their label still reads as a bar.
        const pct = Math.max(8, (row.value / max) * 100);
        return (
          <li key={row.id} className="grid gap-1.5 sm:grid-cols-[minmax(0,15rem)_1fr] sm:items-center sm:gap-5">
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-sm font-semibold text-neutral-950">
                <span className="truncate">{label.name}</span>
                {row.ours && (
                  <span className="shrink-0 rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
                    {t.us}
                  </span>
                )}
              </p>
              <p className="truncate text-xs text-neutral-500">{label.note}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 flex-1 overflow-hidden rounded-full bg-neutral-100">
                <div
                  className={`h-full rounded-full transition-[width] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    row.ours ? "bg-gradient-to-r from-lime to-brand" : "bg-neutral-300"
                  }`}
                  style={{ width: shown ? `${pct}%` : "0%", transitionDelay: `${i * 90}ms` }}
                />
              </div>
              <p
                className={`min-w-24 shrink-0 whitespace-nowrap text-right text-base font-semibold tabular-nums sm:min-w-32 sm:text-lg ${
                  row.ours ? "text-brand-dark" : "text-neutral-950"
                }`}
              >
                {localizeDigits(row.cost, numberLocale)}
                <span className="text-xs font-medium text-neutral-500">{t.perMonthShort}</span>
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

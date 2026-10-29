import { Check, Sparkles, X } from "lucide-react";
import type { Dictionary } from "@/dictionaries/en";
import { fill, localizeDigits } from "@/lib/i18n";
import { costComparison } from "@/lib/pricing";
import CostBars from "./CostBars";

const cheapest = costComparison.find((r) => r.ours)!;
const others = costComparison.filter((r) => !r.ours);
const othersMin = Math.min(...others.map((r) => r.from ?? r.value));
const othersMax = Math.max(...others.map((r) => r.value));

export default function Comparison({
  t,
  numberLocale,
}: {
  t: Dictionary["comparison"];
  numberLocale: string;
}) {
  return (
    <section className="bg-white py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12 min-[90rem]:px-20">
        <div className="reveal mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-neutral-950 sm:text-5xl">
            {t.title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-neutral-600 sm:text-lg">
            {t.body}
          </p>
        </div>

        <div className="reveal mx-auto mt-12 grid max-w-5xl gap-4 lg:mt-16 lg:grid-cols-2">
          <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
              {t.beforeLabel}
            </p>
            <ul className="mt-6 space-y-3.5">
              {t.before.map((item) => (
                <li key={item} className="flex gap-3 text-[15px] text-neutral-600">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
                    <X size={12} strokeWidth={3} aria-hidden />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 border-t border-neutral-200 pt-5 text-sm text-neutral-500">
              {t.beforeFoot}
            </p>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-neutral-950 p-6 text-white sm:p-8">
            <div
              aria-hidden
              className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-lime/20 blur-3xl"
            />
            <p className="relative text-sm font-semibold uppercase tracking-wider text-lime">
              {t.afterLabel}
            </p>
            <ul className="relative mt-6 space-y-3.5">
              {t.after.map((item) => (
                <li key={item} className="flex gap-3 text-[15px] text-neutral-100">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime text-neutral-950">
                    <Check size={12} strokeWidth={3} aria-hidden />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="relative mt-8 border-t border-white/10 pt-5 text-sm text-neutral-400">
              {t.afterFoot}
            </p>
          </div>
        </div>

        {/* Value comparison: Brikvent vs other platform types (no names) */}
        <div className="reveal mx-auto mt-20 max-w-5xl lg:mt-28">
          <div className="text-center">
            <h3 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">
              {t.valueTitle}
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg">
              {t.valueBody}
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-[1.15fr_1fr]">
            <div className="relative overflow-hidden rounded-3xl border-2 border-brand bg-gradient-to-br from-lime/25 via-white to-white p-6 sm:p-8">
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-brand-dark">
                <Sparkles size={15} strokeWidth={2.25} aria-hidden />
                {t.usLabel}
              </p>
              <p className="mt-3 text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">
                {fill(t.usPrice, { price: localizeDigits(cheapest.cost, numberLocale) })}
              </p>
              <p className="mt-1 text-sm text-neutral-500">{t.usCaption}</p>
              <ul className="mt-6 space-y-3">
                {t.usPoints.map((item) => (
                  <li key={item} className="flex gap-3 text-[15px] text-neutral-800">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                      <Check size={12} strokeWidth={3} aria-hidden />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
                {t.othersLabel}
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-neutral-400 sm:text-4xl">
                {fill(t.othersPrice, {
                  min: localizeDigits(`৳${othersMin.toLocaleString("en-IN")}`, numberLocale),
                  max: localizeDigits(`৳${othersMax.toLocaleString("en-IN")}`, numberLocale),
                })}
              </p>
              <p className="mt-1 text-sm text-neutral-500">{t.othersCaption}</p>
              <ul className="mt-6 space-y-3">
                {t.othersPoints.map((item) => (
                  <li key={item} className="flex gap-3 text-[15px] text-neutral-600">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
                      <X size={12} strokeWidth={3} aria-hidden />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4 rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
              {t.barsTitle}
            </p>
            <div className="mt-6">
              <CostBars t={t} numberLocale={numberLocale} />
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-neutral-400">{t.footnote}</p>
        </div>
      </div>
    </section>
  );
}

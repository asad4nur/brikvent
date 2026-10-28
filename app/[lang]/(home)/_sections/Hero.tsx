import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import type { Dictionary } from "@/dictionaries/en";
import { fill } from "@/lib/i18n";
import { lowestMonthlyPrice } from "@/lib/pricing";
import HeroVisual from "./HeroVisual";

// Staggers the .rise entrance animation.
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

const integrations = [
  "bKash",
  "Nagad",
  "Rocket",
  "SSLCommerz",
  "Steadfast",
  "Pathao",
  "Meta",
  "WhatsApp",
];

export default function Hero({ t, numberLocale }: { t: Dictionary["hero"]; numberLocale: string }) {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Soft brand glow + grid backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_75%_30%,rgba(204,255,0,0.22),transparent_70%),radial-gradient(45%_40%_at_10%_10%,rgba(0,166,62,0.10),transparent_70%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#0a0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a0a_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(70%_60%_at_50%_30%,black,transparent)]"
      />

      <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:px-8 lg:pb-24 lg:pt-20 xl:px-12 min-[90rem]:px-20">
        <div>
          <p
            className="rise inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-3 py-1 text-xs font-medium text-neutral-600 backdrop-blur"
            style={delay(0)}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            {t.eyebrow}
          </p>

          <h1
            className="rise mt-5 text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] text-neutral-950 sm:text-6xl min-[90rem]:text-7xl"
            style={delay(80)}
          >
            {t.title1}
            <br />
            <span className="relative sm:whitespace-nowrap">
              <span className="relative z-10">{t.title2}</span>
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-[0.08em] -z-0 h-[0.32em] rounded-sm bg-lime/80"
              />
            </span>
          </h1>

          <p
            className="rise mt-6 max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg"
            style={delay(160)}
          >
            {t.body}
          </p>

          <ul
            className="rise mt-6 flex flex-wrap gap-2"
            style={delay(220)}
            aria-label={t.channelsLabel}
          >
            {t.channels.map((c) => (
              <li
                key={c}
                className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-[13px] font-medium text-neutral-700"
              >
                {c}
              </li>
            ))}
          </ul>

          <div
            className="rise mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={delay(280)}
          >
            <Link
              href="#signup"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-neutral-950 py-3 pl-6 pr-3 text-[15px] font-semibold text-white transition-colors hover:bg-neutral-800"
            >
              {t.trial}
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-lime text-neutral-950 transition-transform group-hover:translate-x-0.5">
                <ArrowRight size={15} strokeWidth={2.5} aria-hidden />
              </span>
            </Link>
            <Link
              href="#demo"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-6 py-3 text-[15px] font-semibold text-neutral-900 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
            >
              <Play size={15} strokeWidth={2.25} className="text-brand" aria-hidden />
              {t.demo}
            </Link>
          </div>

          <p
            className="rise mt-4 text-[13px] text-neutral-500"
            style={delay(320)}
          >
            {fill(t.finePrint, { price: `৳${lowestMonthlyPrice.toLocaleString(numberLocale)}` })}
          </p>
        </div>

        <div className="rise" style={delay(200)}>
          <HeroVisual />
        </div>
      </div>

      {/* Local integrations strip */}
      <div className="border-y border-neutral-200/70 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:gap-10 lg:px-8 xl:px-12 min-[90rem]:px-20">
          <p className="shrink-0 text-xs font-medium uppercase tracking-wider text-neutral-500">
            {t.integrationsLabel}
          </p>
          <ul className="flex flex-wrap gap-x-7 gap-y-2">
            {integrations.map((name) => (
              <li
                key={name}
                className="text-[15px] font-semibold tracking-tight text-neutral-400 transition-colors hover:text-neutral-900"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import type { Dictionary } from "@/dictionaries/en";
import { fill } from "@/lib/i18n";
import { lowestMonthlyPrice } from "@/lib/pricing";

export default function FinalCta({ t, numberLocale }: { t: Dictionary["cta"]; numberLocale: string }) {
  return (
    <section id="signup" className="bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28 xl:px-12 min-[90rem]:px-20">
      {/* #demo lands here too, until a booking page exists. */}
      <span id="demo" className="block" aria-hidden />
      <div className="reveal relative mx-auto max-w-[1440px] overflow-hidden rounded-[36px] bg-gradient-to-br from-lime via-[#7fe01f] to-brand px-6 py-14 text-center sm:px-10 sm:py-20">
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_right,#0a0a0a10_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a10_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(60%_70%_at_50%_50%,black,transparent)]"
        />
        <div aria-hidden className="drift absolute -left-16 -top-20 h-72 w-72 rounded-full bg-white/40 blur-3xl" />
        <div aria-hidden className="drift-reverse absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-[#00702a]/40 blur-3xl" />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="text-3xl font-semibold leading-[1.05] tracking-[-0.03em] text-neutral-950 sm:text-6xl">
            {t.title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-neutral-900/80 sm:text-lg">
            {fill(t.body, { price: `৳${lowestMonthlyPrice.toLocaleString(numberLocale)}` })}
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="#signup"
              className="shine group inline-flex items-center justify-center gap-2 rounded-full bg-neutral-950 py-3.5 pl-7 pr-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-neutral-800"
            >
              {t.trial}
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-lime text-neutral-950 transition-transform group-hover:translate-x-0.5">
                <ArrowRight size={15} strokeWidth={2.5} aria-hidden />
              </span>
            </Link>
            <Link
              href="#demo"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-950/15 bg-white/70 px-7 py-3.5 text-[15px] font-semibold text-neutral-950 backdrop-blur transition-colors hover:bg-white"
            >
              <CalendarDays size={16} strokeWidth={2.25} aria-hidden />
              {t.demo}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

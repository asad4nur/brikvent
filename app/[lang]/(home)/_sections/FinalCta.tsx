import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Dictionary } from "@/dictionaries/en";
import { fill } from "@/lib/i18n";

export default function FinalCta({ t, numberLocale, lowestPrice }: { t: Dictionary["cta"]; numberLocale: string; lowestPrice: number }) {
  const lang = numberLocale.startsWith("bn") ? "bn" : "en";
  return (
    <section id="signup" className="bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28 xl:px-12 min-[90rem]:px-20">
      <div className="reveal relative mx-auto max-w-[1440px] overflow-hidden rounded-[36px] bg-mint px-6 py-14 text-center sm:px-10 sm:py-20">
        <div className="relative mx-auto max-w-2xl">
          <h2 className="text-3xl font-semibold leading-[1.05] tracking-[-0.03em] text-deep sm:text-6xl">
            {t.title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-neutral-900/80 sm:text-lg">
            {fill(t.body, { price: `৳${lowestPrice.toLocaleString(numberLocale)}` })}
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={`/${lang}/signup`}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-deep py-3.5 pl-7 pr-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-deep-soft"
            >
              {t.trial}
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-lime text-deep transition-transform group-hover:translate-x-0.5">
                <ArrowRight size={15} strokeWidth={2.5} aria-hidden />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

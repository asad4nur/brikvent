import { Plus } from "lucide-react";
import type { Dictionary } from "@/dictionaries/en";
import Backdrop from "@/components/backdrop";

export default function Faq({ t }: { t: Dictionary["faq"] }) {
  return (
    <section
      id="faq"
      className="relative isolate bg-gradient-to-b from-white to-[#f3fbe8] py-20 sm:py-24 lg:py-28"
    >
      <Backdrop pattern="dots" glows={[{ color: "green", className: "-right-24 top-10 h-80 w-80" }]} />
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-8 xl:px-12 min-[90rem]:px-20">
        <div className="reveal-group">
          <p className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-600">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            {t.eyebrow}
          </p>
          <h2 className="mt-5 text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-neutral-950 sm:text-5xl">
            {t.title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-neutral-600">
            {t.body}
          </p>
        </div>

        <div className="reveal-group divide-y divide-neutral-200 rounded-3xl border border-neutral-200 bg-white">
          {t.items.map((f, i) => (
            <details key={f.q} className="group px-5 sm:px-7" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-base font-semibold text-neutral-950 [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition-transform duration-300 group-open:rotate-45 group-open:border-brand group-open:bg-brand group-open:text-white">
                  <Plus size={16} strokeWidth={2.25} aria-hidden />
                </span>
              </summary>
              <p className="-mt-1 pb-5 pr-10 text-[15px] leading-relaxed text-neutral-600">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

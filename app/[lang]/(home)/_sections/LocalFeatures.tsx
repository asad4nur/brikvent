import {
  Banknote,
  Building2,
  Globe,
  PhoneCall,
  Printer,
  ShieldCheck,
  ShoppingCart,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import type { Dictionary } from "@/dictionaries/en";
import Backdrop from "@/components/backdrop";
import Integrations from "./Integrations";

// Icon and accent color per feature; titles and descriptions come from the dictionary.
// Icon per feature; titles and descriptions come from the dictionary.
const featureIcons: LucideIcon[] = [PhoneCall, ShieldCheck, Banknote, ShoppingCart, Building2, Printer, Globe, UsersRound];

export default function LocalFeatures({
  t,
  numberLocale,
}: {
  t: Dictionary["local"];
  numberLocale: string;
}) {
  return (
    <section
      id="solutions"
      className="relative isolate border-t border-neutral-200 bg-white py-20 sm:py-24 lg:py-28"
    >
      <Backdrop
        pattern="dots"
        glows={[{ color: "lime", className: "-right-24 -top-10 h-96 w-96" }]}
      />
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12 min-[90rem]:px-20">
        <div className="reveal-group grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-mint-line bg-mint-wash px-3 py-1 text-[13px] font-semibold text-mint-ink">
              <span className="h-2 w-2 rounded-full bg-mint" />
              {t.eyebrow}
            </p>
            <h2 className="mt-5 text-3xl font-bold leading-[1.15] tracking-[-0.02em] text-deep sm:text-5xl">
              {t.title}
            </h2>
          </div>
          <p className="text-base leading-relaxed text-neutral-600 sm:text-lg lg:pb-1">
            {t.body}
          </p>
        </div>

        <ul className="reveal-group mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {t.features.map((f, i) => {
            const Icon = featureIcons[i];
            return (
              <li
                key={f.title}
                className={`group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-1.5 hover:border-deep/30 hover:shadow-[0_28px_60px_-34px_rgba(16,42,39,0.45)] sm:p-7`}
              >
                <span
                  className={`relative flex h-12 w-12 items-center justify-center rounded-2xl bg-deep text-mint transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110`}
                >
                  <Icon size={21} strokeWidth={2} aria-hidden />
                </span>
                <h3 className="relative mt-5 text-base font-semibold tracking-tight text-deep">
                  {f.title}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-neutral-600">{f.body}</p>
              </li>
            );
          })}
        </ul>

        <Integrations t={t} numberLocale={numberLocale} />
      </div>
    </section>
  );
}

import {
  Globe,
  PhoneCall,
  ReceiptText,
  ShieldCheck,
  ShoppingBag,
  UserRoundCog,
  WalletCards,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import type { Dictionary } from "@/dictionaries/en";
import Backdrop from "@/components/backdrop";
import Integrations from "./Integrations";

// Icon per feature; titles and descriptions come from the dictionary.
const featureIcons: LucideIcon[] = [PhoneCall, ShieldCheck, WalletCards, ShoppingBag, Warehouse, ReceiptText, Globe, UserRoundCog];

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

        {/* One lime-to-green gradient, shared by the strokes of the eight icons */}
        <svg aria-hidden width="0" height="0" className="absolute">
          <defs>
            <linearGradient id="feature-icon-stroke" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#f6ffd1" />
              <stop offset="0.5" stopColor="#ccff00" />
              <stop offset="1" stopColor="#52dc86" />
            </linearGradient>
          </defs>
        </svg>

        <ul className="reveal-group mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {t.features.map((f, i) => {
            const Icon = featureIcons[i];
            return (
              <li
                key={f.title}
                className={`group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-1.5 hover:border-deep/30 hover:shadow-[0_28px_60px_-34px_rgba(10,10,10,0.45)] sm:p-7`}
              >
                {/* Emerald tile: light from the top left, a hairline lime edge and a thin outer ring */}
                <span className="relative ml-1.5 mt-1.5 flex h-14 w-14 items-center justify-center rounded-[18px] bg-[linear-gradient(145deg,#1b5336_0%,#0c2a1b_46%,#04100a_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.22),inset_0_0_0_1px_rgba(204,255,0,0.18),0_16px_30px_-14px_rgba(5,70,36,0.7)] transition-transform duration-500 group-hover:-translate-y-0.5">
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-[18px] bg-[radial-gradient(circle_at_28%_14%,rgba(204,255,0,0.3),transparent_56%)]"
                  />
                  <span
                    aria-hidden
                    className="absolute -inset-1.5 rounded-[23px] border border-mint-ink/20 transition-colors duration-500 group-hover:border-mint-ink/50"
                  />
                  <Icon size={26} strokeWidth={1.5} stroke="url(#feature-icon-stroke)" className="relative" aria-hidden />
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

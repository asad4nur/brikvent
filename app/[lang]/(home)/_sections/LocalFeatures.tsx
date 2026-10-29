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
const featureStyles: { icon: LucideIcon; tile: string; blob: string; hover: string }[] = [
  { icon: PhoneCall, tile: "from-emerald-400 to-emerald-600", blob: "bg-emerald-200", hover: "hover:border-emerald-300" },
  { icon: ShieldCheck, tile: "from-rose-400 to-rose-600", blob: "bg-rose-200", hover: "hover:border-rose-300" },
  { icon: Banknote, tile: "from-pink-500 to-fuchsia-600", blob: "bg-pink-200", hover: "hover:border-pink-300" },
  { icon: ShoppingCart, tile: "from-amber-400 to-orange-500", blob: "bg-amber-200", hover: "hover:border-amber-300" },
  { icon: Building2, tile: "from-sky-400 to-blue-600", blob: "bg-sky-200", hover: "hover:border-sky-300" },
  { icon: Printer, tile: "from-violet-400 to-purple-600", blob: "bg-violet-200", hover: "hover:border-violet-300" },
  { icon: Globe, tile: "from-teal-400 to-cyan-600", blob: "bg-teal-200", hover: "hover:border-teal-300" },
  { icon: UsersRound, tile: "from-lime-400 to-green-600", blob: "bg-lime-200", hover: "hover:border-lime-300" },
];

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
      className="relative isolate bg-white py-20 sm:py-24 lg:py-28"
    >
      <Backdrop
        pattern="dots"
        glows={[{ color: "lime", className: "-right-24 -top-10 h-96 w-96" }]}
      />
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12 min-[90rem]:px-20">
        <div className="reveal-group grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-600">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              {t.eyebrow}
            </p>
            <h2 className="mt-5 text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-neutral-950 sm:text-5xl">
              {t.title}
            </h2>
          </div>
          <p className="text-base leading-relaxed text-neutral-600 sm:text-lg lg:pb-1">
            {t.body}
          </p>
        </div>

        <ul className="reveal-group mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {t.features.map((f, i) => {
            const { icon: Icon, tile, blob, hover } = featureStyles[i];
            return (
              <li
                key={f.title}
                className={`group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-34px_rgba(10,10,10,0.45)] sm:p-7 ${hover}`}
              >
                {/* Soft colored blob that grows on hover */}
                <span
                  aria-hidden
                  className={`absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-50 blur-2xl transition-transform duration-700 group-hover:scale-[1.8] ${blob}`}
                />
                <span
                  className={`relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110 ${tile}`}
                >
                  <Icon size={21} strokeWidth={2} aria-hidden />
                </span>
                <h3 className="relative mt-5 text-base font-semibold tracking-tight text-neutral-950">
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

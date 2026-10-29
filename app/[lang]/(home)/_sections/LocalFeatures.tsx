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

// Icons per feature; titles and descriptions come from the dictionary.
const featureIcons: LucideIcon[] = [
  PhoneCall,
  ShieldCheck,
  Banknote,
  ShoppingCart,
  Building2,
  Printer,
  Globe,
  UsersRound,
];

// Brand names, grouped in the same order as `integrationGroups` in the dictionary.
const integrations: string[][] = [
  ["bKash", "Nagad", "Rocket", "Upay", "SSLCommerz", "PayStation", "Stripe", "PayPal", "Visa & Mastercard"],
  ["Steadfast", "Pathao"],
  ["DHL Express", "FedEx", "UPS", "Aramex"],
  ["Facebook", "Instagram", "Messenger", "WhatsApp"],
  ["Meta Pixel & CAPI", "Meta Ads", "Google Ads", "Google Analytics", "Google Tag Manager", "TikTok Pixel"],
  ["SMS gateway", "Email (SMTP)", "Voice call (IVR)"],
];

export default function LocalFeatures({ t }: { t: Dictionary["local"] }) {
  return (
    <section
      id="solutions"
      className="bg-white py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12 min-[90rem]:px-20">
        <div className="reveal grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
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

        <ul className="reveal mt-12 grid gap-px overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {t.features.map((f, i) => {
            const Icon = featureIcons[i];
            return (
            <li key={f.title} className="group bg-white p-6 transition-colors hover:bg-neutral-50 sm:p-7">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700 transition-colors group-hover:bg-gradient-to-br group-hover:from-lime group-hover:to-brand group-hover:text-neutral-950">
                <Icon size={19} strokeWidth={1.9} aria-hidden />
              </span>
              <h3 className="mt-5 text-base font-semibold tracking-tight text-neutral-950">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{f.body}</p>
            </li>
            );
          })}
        </ul>

        {/* Integrations */}
        <div
          id="integrations"
          className="reveal mt-16 rounded-3xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8 lg:mt-20 lg:p-10"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h3 className="text-xl font-semibold tracking-tight text-neutral-950 sm:text-2xl">
              {t.integrationsTitle}
            </h3>
            <p className="text-sm text-neutral-500">{t.integrationsNote}</p>
          </div>
          <dl className="mt-8 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
            {integrations.map((items, i) => (
              <div key={t.integrationGroups[i]}>
                <dt className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  {t.integrationGroups[i]}
                </dt>
                <dd className="mt-3 flex flex-wrap gap-2">
                  {items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-[13px] font-medium text-neutral-800"
                    >
                      {item}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

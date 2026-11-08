import type { Dictionary } from "@/dictionaries/en";
import { fill } from "@/lib/i18n";
import { lowestMonthlyPrice } from "@/lib/pricing";
import HeroSegments from "./HeroSegments";

// Payments, couriers, channels and marketing tools, shown as a scrolling strip.
const integrations = [
  "bKash",
  "Nagad",
  "Rocket",
  "SSLCommerz",
  "PayStation",
  "ShurjoPay",
  "UddoktaPay",
  "EPS",
  "Stripe",
  "PayPal",
  "Steadfast",
  "Pathao",
  "RedX",
  "Carrybee",
  "Paperfly",
  "eCourier",
  "DHL Express",
  "FedEx",
  "UPS",
  "Aramex",
  "Facebook",
  "Messenger",
  "Instagram",
  "WhatsApp",
  "Meta Ads",
  "Google Ads",
  "Google Analytics",
  "Google Tag Manager",
  "TikTok",
];

export default function Hero({ t, numberLocale }: { t: Dictionary["hero"]; numberLocale: string }) {
  const lang = numberLocale.startsWith("bn") ? "bn" : "en";
  return (
    <section className="relative bg-white">
      <HeroSegments
        t={t}
        lang={lang}
        finePrint={fill(t.finePrint, { price: `৳${lowestMonthlyPrice.toLocaleString(numberLocale)}` })}
      />

      {/* Integrations strip */}
      <div className="border-y border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:gap-10 lg:px-8 xl:px-12 min-[90rem]:px-20">
          <p className="shrink-0 text-xs font-semibold uppercase tracking-wider text-deep">
            {t.integrationsLabel}
          </p>
          {/* The list renders twice so the strip loops without a gap; the
              copy is hidden from screen readers. */}
          <div className="marquee-wrap relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
            <div className="marquee flex w-max">
              {[false, true].map((copy) => (
                <ul key={String(copy)} aria-hidden={copy || undefined} className="flex shrink-0 items-center">
                  {integrations.map((name) => (
                    <li
                      key={name}
                      className="flex items-center whitespace-nowrap pr-8 text-[15px] font-semibold tracking-tight text-neutral-400 transition-colors hover:text-deep"
                    >
                      <span aria-hidden className="mr-8 h-1 w-1 rounded-full bg-mint" />
                      {name}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

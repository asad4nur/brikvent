import type { CSSProperties } from "react";
import {
  CreditCard,
  Megaphone,
  MessageSquareText,
  Plane,
  Store,
  Truck,
  type LucideIcon,
} from "lucide-react";
import Logo from "@/components/logo";
import type { Dictionary } from "@/dictionaries/en";
import { fill, localizeDigits } from "@/lib/i18n";

// Each tool shows a small colored monogram in its brand color (letters, not
// logos, so no trademark artwork is reproduced).
type Tool = { name: string; mono: string; bg: string; fg?: string };

const tool = (name: string, mono: string, bg: string, fg?: string): Tool => ({ name, mono, bg, fg });

// Same order as `integrationGroups` in the dictionary.
const groups: { icon: LucideIcon; tools: Tool[] }[] = [
  {
    icon: CreditCard,
    tools: [
      tool("bKash", "bK", "#e2136e"),
      tool("Nagad", "N", "#f6921e"),
      tool("Rocket", "R", "#8c3494"),
      tool("Upay", "U", "#0b4da2"),
      tool("SSLCommerz", "SSL", "#1e4b9c"),
      tool("PayStation", "PS", "#4b2c8f"),
      tool("ShurjoPay", "SP", "#f37021"),
      tool("UddoktaPay", "UP", "#1e88e5"),
      tool("EPS", "EPS", "#0e7c3a"),
      tool("Stripe", "S", "#635bff"),
      tool("PayPal", "PP", "#003087"),
      tool("Visa & Mastercard", "V/M", "#1a1f71"),
    ],
  },
  {
    icon: Truck,
    tools: [
      tool("Steadfast", "SF", "#00a651"),
      tool("Pathao", "P", "#e21f26"),
      tool("RedX", "RX", "#e31e24"),
      tool("Carrybee", "CB", "#f7b500", "#1c1917"),
      tool("Paperfly", "PF", "#0072bc"),
      tool("eCourier", "eC", "#f15a22"),
    ],
  },
  {
    icon: Plane,
    tools: [
      tool("DHL Express", "DHL", "#ffcc00", "#d40511"),
      tool("FedEx", "Fx", "#4d148c"),
      tool("UPS", "UPS", "#351c15", "#ffb500"),
      tool("Aramex", "Ax", "#e1261c"),
    ],
  },
  {
    icon: Store,
    tools: [
      tool("Facebook", "f", "#1877f2"),
      tool("Instagram", "IG", "#e1306c"),
      tool("Messenger", "M", "#0084ff"),
      tool("WhatsApp", "W", "#25d366"),
    ],
  },
  {
    icon: Megaphone,
    tools: [
      tool("Meta Pixel & CAPI", "∞", "#0866ff"),
      tool("Meta Ads", "∞", "#0866ff"),
      tool("Google Ads", "G", "#4285f4"),
      tool("Google Analytics", "GA", "#f9ab00", "#1c1917"),
      tool("Google Tag Manager", "GTM", "#246fdb"),
      tool("TikTok Pixel", "T", "#111111"),
    ],
  },
  {
    icon: MessageSquareText,
    tools: [
      tool("SMS gateway", "SMS", "#00a63e"),
      tool("Email (SMTP)", "@", "#525252"),
      tool("Voice call (IVR)", "IVR", "#008a33"),
    ],
  },
];

const all = groups.flatMap((g) => g.tools);
const byName = (name: string) => all.find((t) => t.name === name)!;

// Tools that circle the Brikvent hub, inner ring first.
const innerRing = ["bKash", "Nagad", "Steadfast", "Pathao", "Facebook", "WhatsApp"].map(byName);
const outerRing = [
  "Stripe",
  "PayPal",
  "DHL Express",
  "Google Ads",
  "Instagram",
  "RedX",
  "SSLCommerz",
  "FedEx",
].map(byName);

function Mono({ t, size = "sm" }: { t: Tool; size?: "sm" | "lg" }) {
  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-md font-bold leading-none tracking-tight ${
        size === "lg" ? "h-8 w-8 text-[11px]" : "h-5 w-5 text-[8px]"
      }`}
      style={{ background: t.bg, color: t.fg ?? "#fff" }}
    >
      {t.mono}
    </span>
  );
}

// A ring of tools that slowly rotates; each bubble counter-rotates to stay upright.
function Ring({ tools, radius, reverse }: { tools: Tool[]; radius: string; reverse?: boolean }) {
  return (
    <div className={`absolute inset-0 ${reverse ? "orbit-reverse" : "orbit"}`}>
      {tools.map((t, i) => {
        const angle = (360 / tools.length) * i;
        return (
          <div
            key={t.name}
            className="absolute left-1/2 top-1/2"
            style={{ transform: `rotate(${angle}deg) translate(${radius}) rotate(${-angle}deg)` } as CSSProperties}
          >
            <div className={reverse ? "orbit" : "orbit-reverse"}>
              <span
                title={t.name}
                className="-ml-6 -mt-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-[0_8px_24px_-10px_rgba(10,10,10,0.35)] ring-1 ring-neutral-200"
              >
                <Mono t={t} size="lg" />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Integrations({
  t,
  numberLocale,
}: {
  t: Dictionary["local"];
  numberLocale: string;
}) {
  return (
    <div
      id="integrations"
      className="reveal relative mt-16 overflow-hidden rounded-[32px] border border-neutral-200 bg-gradient-to-br from-white via-[#f6fcef] to-[#ecf9df] p-6 sm:p-8 lg:mt-20 lg:p-12"
    >
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-3 py-1 text-xs font-semibold text-lime">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime" />
            {localizeDigits(fill(t.integrationsCount, { n: all.length }), numberLocale)}
          </p>
          <h3 className="mt-5 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
            {t.integrationsTitle}
          </h3>
          <p className="mt-3 max-w-md text-base text-neutral-600">{t.integrationsNote}</p>
        </div>

        {/* Orbit: Brikvent in the middle, tools circling around it */}
        <div
          aria-hidden
          className="relative mx-auto h-[280px] w-[280px] sm:h-[360px] sm:w-[360px] [--r-in:76px] [--r-out:124px] sm:[--r-in:100px] sm:[--r-out:166px]"
        >
          <div className="absolute inset-[calc(50%-var(--r-out))] rounded-full border border-dashed border-brand/25" />
          <div className="absolute inset-[calc(50%-var(--r-in))] rounded-full border border-dashed border-brand/30" />
          <Ring tools={outerRing} radius="var(--r-out)" />
          <Ring tools={innerRing} radius="var(--r-in)" reverse />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="ping-soft absolute inset-0 rounded-3xl bg-lime/60" />
            <span className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-[0_18px_40px_-14px_rgba(0,166,62,0.6)] ring-1 ring-brand/30">
              <Logo viewBox="0 0 40 40" className="h-12 w-12" />
            </span>
          </div>
        </div>
      </div>

      <div className="reveal-group mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
        {groups.map((g, i) => (
          <div
            key={t.integrationGroups[i]}
            className="group rounded-3xl border border-neutral-200/80 bg-white/80 p-5 backdrop-blur transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_24px_50px_-28px_rgba(0,166,62,0.55)]"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-lime to-brand text-neutral-950 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                <g.icon size={18} strokeWidth={2} aria-hidden />
              </span>
              <p className="text-sm font-semibold text-neutral-950">{t.integrationGroups[i]}</p>
              <span className="ml-auto rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-semibold tabular-nums text-neutral-600">
                {localizeDigits(String(g.tools.length), numberLocale)}
              </span>
            </div>
            <ul className="mt-4 flex flex-wrap gap-2">
              {g.tools.map((tl) => (
                <li
                  key={tl.name}
                  className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white py-1 pl-1 pr-3 text-[13px] font-medium text-neutral-800 transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-neutral-400"
                >
                  <Mono t={tl} />
                  {tl.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

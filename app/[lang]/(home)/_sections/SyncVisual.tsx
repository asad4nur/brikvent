"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  Boxes,
  Check,
  Globe,
  MessageCircle,
  Plus,
  ScanBarcode,
  Store,
  ThumbsUp,
  type LucideIcon,
} from "lucide-react";
import ProductArt from "@/components/product-art";

// Hero visual: a shop counter and an online store feeding one shared stock.
// "both" lights up both sides; "shop" or "online" dims the other side and
// offers to add it, which is the upgrade story in one picture.
// Mock screens stay in English, like the Brikvent app itself.

export type SyncMode = "shop" | "both" | "online";
type Source = "shop" | "online";

const channels: { name: string; icon: LucideIcon }[] = [
  { name: "Facebook", icon: ThumbsUp },
  { name: "WhatsApp", icon: MessageCircle },
  { name: "Website", icon: Globe },
];

const TICK_MS = 700;
const EVENT_TICKS = 4; // 0: sale on a side + flow line, 1: hub updates, 2-3: hold
const START_STOCK = 128;
const START_SALES = 42560;
const START_ORDERS = 37;
const PRICE = 2450;
const taka = (n: number) => `৳${n.toLocaleString("en-IN")}`;

// Curves from each card up to the hub, in a 100x100 box.
const paths: Record<Source, string> = {
  shop: "M25 100 C25 45, 50 55, 50 0",
  online: "M75 100 C75 45, 50 55, 50 0",
};

export default function SyncVisual({
  mode,
  addShop,
  addOnline,
  onAdd,
}: {
  mode: SyncMode;
  addShop: string;
  addOnline: string;
  onAdd: () => void;
}) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = setInterval(() => setTick((t) => t + 1), reduce ? TICK_MS * 3 : TICK_MS);
    return () => clearInterval(id);
  }, []);

  const event = Math.floor(tick / EVENT_TICKS);
  const phase = tick % EVENT_TICKS;
  const source: Source = mode === "both" ? (event % 2 === 0 ? "shop" : "online") : mode;
  const channel = channels[Math.floor(event / (mode === "both" ? 2 : 1)) % channels.length];
  const completed = event + (phase >= 1 ? 1 : 0);
  const stock = START_STOCK - (completed % 60);
  const sales = START_SALES + completed * PRICE;
  const orders = START_ORDERS + completed;
  const enabled = { shop: mode !== "online", online: mode !== "shop" };
  const subtitle = mode === "both" ? "Shop + online" : mode === "shop" ? "Shop counter" : "Online store";
  const ToastIcon = source === "shop" ? Store : channel.icon;

  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      {/* Shared stock hub */}
      <div className="relative z-10 mx-auto w-full max-w-[420px] rounded-3xl border border-neutral-200 bg-white p-4 shadow-[0_24px_60px_-28px_rgba(16,42,39,0.4)] sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-deep text-mint">
              <Boxes size={18} strokeWidth={2} aria-hidden />
            </span>
            <div>
              <p className="text-sm font-bold text-deep">Shared stock</p>
              <p key={subtitle} className="pop text-[11px] font-medium text-neutral-500">
                {subtitle}
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-mint-wash px-2 py-1 text-[11px] font-semibold text-mint-ink">
            <span className="relative flex h-1.5 w-1.5">
              <span className="ping-soft absolute inset-0 rounded-full bg-mint" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-mint" />
            </span>
            Live sync
          </span>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <ProductArt look="tealThreePiece" className="h-14 w-12 shrink-0 rounded-xl ring-1 ring-neutral-200" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-deep">Teal Three-Piece</p>
            <p className="truncate text-xs text-neutral-500">SKU INAY-213 · {taka(PRICE)}</p>
          </div>
          <div className="ml-auto text-right">
            <p key={stock} className="pop text-3xl font-bold tabular-nums tracking-tight text-deep">
              {stock}
            </p>
            <p className="text-[11px] text-neutral-500">in stock</p>
          </div>
        </div>

        {/* Latest stock movement */}
        <div
          key={`${event}-${phase >= 1}`}
          className="pop mt-3 flex items-center gap-2.5 rounded-xl border border-mint-line bg-mint-wash px-3 py-2"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white text-mint-ink">
            <ToastIcon size={13} strokeWidth={2.25} aria-hidden />
          </span>
          <span className="min-w-0 flex-1 truncate text-[12px] font-medium text-deep">
            {phase >= 1
              ? source === "shop"
                ? "Sold at Gulshan shop"
                : `${channel.name} order received`
              : source === "shop"
                ? "Scanning at the counter…"
                : `New order on ${channel.name}…`}
          </span>
          {phase >= 1 && (
            <span className="rounded-full bg-deep px-2 py-0.5 text-[11px] font-bold tabular-nums text-mint">−1</span>
          )}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-neutral-50 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Today&apos;s sales</p>
            <p key={sales} className="pop text-base font-bold tabular-nums text-deep">
              {taka(sales)}
            </p>
          </div>
          <div className="rounded-xl bg-neutral-50 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Orders today</p>
            <p key={orders} className="pop text-base font-bold tabular-nums text-deep">
              {orders}
            </p>
          </div>
        </div>
      </div>

      {/* Connectors from each side up to the hub */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="-my-1 block h-14 w-full sm:h-16"
      >
        {(["shop", "online"] as Source[]).map((s) => (
          <path
            key={s}
            d={paths[s]}
            fill="none"
            stroke="#9fd3c3"
            strokeWidth={1.5}
            strokeDasharray="4 5"
            vectorEffect="non-scaling-stroke"
            className={`transition-opacity duration-500 ${enabled[s] ? "opacity-100" : "opacity-25"}`}
          />
        ))}
        {phase === 0 && (
          <path
            key={tick}
            d={paths[source]}
            pathLength={100}
            fill="none"
            stroke="#0b7f65"
            strokeWidth={3}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            className="flow-line"
          />
        )}
      </svg>

      {/* The two sides */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <Side
          enabled={enabled.shop}
          active={enabled.shop && source === "shop"}
          addLabel={addShop}
          onAdd={onAdd}
          icon={Store}
          title="Shop counter"
        >
          <div className="flex items-center gap-2">
            <ScanBarcode size={16} strokeWidth={2} aria-hidden className="shrink-0 text-mint-ink" />
            <Barcode />
          </div>
          <p className="mt-2.5 truncate text-[12px] font-semibold text-deep">Teal Three-Piece</p>
          <p className="text-[11px] text-neutral-500">{taka(PRICE)} · bKash</p>
          <Step done={source !== "shop" || phase >= 1} label="Paid" />
          <Step done={source !== "shop" || phase >= 2} label="Receipt printed" />
        </Side>

        <Side
          enabled={enabled.online}
          active={enabled.online && source === "online"}
          addLabel={addOnline}
          onAdd={onAdd}
          icon={Globe}
          title="Online store"
        >
          <div className="flex items-center gap-2">
            <channel.icon size={16} strokeWidth={2} aria-hidden className="shrink-0 text-mint-ink" />
            <span key={channel.name} className="pop truncate text-[11px] font-semibold text-neutral-600">{channel.name} order</span>
          </div>
          <p className="mt-2.5 truncate text-[12px] font-semibold text-deep">Teal Three-Piece</p>
          <p className="text-[11px] text-neutral-500">{taka(PRICE)} · COD</p>
          <Step done={source !== "online" || phase >= 2} label="AI call confirmed" />
          <Step done={source !== "online" || phase >= 3} label="Pathao booked" />
        </Side>
      </div>
    </div>
  );
}

function Side({
  enabled,
  active,
  addLabel,
  onAdd,
  icon: Icon,
  title,
  children,
}: {
  enabled: boolean;
  active: boolean;
  addLabel: string;
  onAdd: () => void;
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative rounded-2xl border bg-white p-3 transition-all duration-500 sm:p-4 ${
        !enabled
          ? "border-dashed border-neutral-300 bg-white/60"
          : active
            ? "border-deep shadow-[0_14px_30px_-16px_rgba(16,42,39,0.55)]"
            : "border-neutral-200"
      }`}
    >
      <div className={`transition-opacity duration-500 ${enabled ? "" : "pointer-events-none opacity-25 grayscale"}`}>
        <div className="flex items-center gap-2">
          <span className="flex min-w-0 items-center gap-2">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors duration-300 ${
                active ? "bg-deep text-mint" : "bg-neutral-100 text-neutral-600"
              }`}
            >
              <Icon size={14} strokeWidth={2.25} aria-hidden />
            </span>
            <span className="truncate text-[12px] font-bold text-deep sm:text-[13px]">{title}</span>
          </span>
        </div>
        <div className="mt-3">{children}</div>
      </div>

      {!enabled && (
        <div className="absolute inset-0 flex items-center justify-center p-2">
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-1.5 rounded-full border border-deep bg-white px-3 py-2 text-[12px] font-semibold text-deep shadow-sm transition-colors hover:bg-deep hover:text-white sm:text-[13px]"
          >
            <Plus size={14} strokeWidth={2.5} aria-hidden />
            {addLabel}
          </button>
        </div>
      )}
    </div>
  );
}

function Step({ done, label }: { done: boolean; label: string }) {
  return (
    <p
      className={`mt-1.5 flex items-center gap-1.5 text-[11px] font-medium transition-colors duration-300 ${
        done ? "text-deep" : "text-neutral-400"
      }`}
    >
      <span
        className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
          done ? "bg-mint text-deep" : "border border-neutral-300"
        }`}
      >
        {done && <Check size={9} strokeWidth={3.5} aria-hidden />}
      </span>
      <span className="truncate">{label}</span>
    </p>
  );
}

// Decorative barcode stripes.
function Barcode() {
  const bars = [2, 1, 1, 3, 1, 2, 1, 1, 2, 3, 1, 1, 2, 1, 3, 1, 2, 1];
  return (
    <span aria-hidden className="flex h-4 items-stretch gap-[1.5px] overflow-hidden">
      {bars.map((w, i) => (
        <span key={i} className="bg-deep/70" style={{ width: w }} />
      ))}
    </span>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  Check,
  Globe,
  MessageCircle,
  ScanBarcode,
  ThumbsUp,
  type LucideIcon,
} from "lucide-react";
import ProductArt from "@/components/product-art";

type Channel = {
  name: string;
  icon: LucideIcon;
  // Node centre, as a percentage of the visual's box.
  x: number;
  y: number;
  order: string;
  steps: [string, string, string];
};

// Each order walks through: received -> stock synced -> steps[1] -> steps[2].
const channels: Channel[] = [
  {
    name: "Online store",
    icon: Globe,
    x: 20,
    y: 9,
    order: "Web order · ৳2,450 COD",
    steps: ["Stock synced", "AI call confirmed", "Steadfast booked"],
  },
  {
    name: "Facebook",
    icon: ThumbsUp,
    x: 80,
    y: 9,
    order: "Messenger order · ৳2,450",
    steps: ["Stock synced", "Fraud check passed", "Pathao booked"],
  },
  {
    name: "POS counter",
    icon: ScanBarcode,
    x: 20,
    y: 91,
    order: "Gulshan outlet · ৳2,450",
    steps: ["Stock synced", "Paid via bKash", "Receipt printed"],
  },
  {
    name: "WhatsApp",
    icon: MessageCircle,
    x: 80,
    y: 91,
    order: "WhatsApp order · ৳2,450",
    steps: ["Stock synced", "AI call confirmed", "Steadfast booked"],
  },
];

const PHASES = 5; // 0: travelling, 1-4: pipeline steps lighting up
const TICK_MS = 750;
const START_STOCK = 128;

export default function HeroVisual() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    // Reduced-motion users still see the story, just at a calmer pace.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = setInterval(() => setTick((t) => t + 1), reduce ? TICK_MS * 3 : TICK_MS);
    return () => clearInterval(id);
  }, []);

  const orderIndex = Math.floor(tick / PHASES);
  const phase = tick % PHASES;
  const channel = channels[orderIndex % channels.length];
  const stock = START_STOCK - orderIndex - (phase >= 1 ? 1 : 0);
  const pipeline = ["Order received", ...channel.steps];

  return (
    <div className="relative mx-auto h-[480px] w-full max-w-[600px] sm:h-[540px]">
      {/* Connection lines from each channel to the hub */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        {channels.map((c) => (
          <line
            key={c.name}
            x1={c.x}
            y1={c.y}
            x2={50}
            y2={50}
            stroke="#d4d4d4"
            strokeWidth={1.25}
            strokeDasharray="3 4"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {phase === 0 && (
          <line
            key={tick}
            x1={channel.x}
            y1={channel.y}
            x2={50}
            y2={50}
            pathLength={100}
            stroke="#00a63e"
            strokeWidth={3}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            className="flow-line"
          />
        )}
      </svg>

      {/* Channel nodes */}
      {channels.map((c) => {
        const active = c === channel;
        return (
          <div
            key={c.name}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${c.x}%`, top: `${c.y}%` }}
          >
            <div
              className={`relative flex items-center gap-2 rounded-2xl border bg-white px-2 py-1.5 shadow-sm sm:py-2 transition-all duration-300 sm:px-3 ${
                active
                  ? "border-brand/40 shadow-[0_10px_30px_-10px_rgba(0,166,62,0.45)]"
                  : "border-neutral-200"
              }`}
            >
              <span
                className={`relative flex h-7 w-7 shrink-0 sm:h-8 sm:w-8 items-center justify-center rounded-xl transition-colors duration-300 ${
                  active ? "bg-brand text-white" : "bg-neutral-100 text-neutral-600"
                }`}
              >
                {active && phase === 0 && (
                  <span aria-hidden className="ping-soft absolute inset-0 rounded-xl bg-brand" />
                )}
                <c.icon size={16} strokeWidth={2} aria-hidden className="relative" />
              </span>
              <span className="whitespace-nowrap pr-1 text-xs font-semibold sm:text-[13px] text-neutral-900">
                {c.name}
              </span>
            </div>
          </div>
        );
      })}

      {/* Inventory hub */}
      <div className="absolute left-1/2 top-1/2 w-[88%] max-w-[340px] sm:w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-neutral-200 bg-white p-4 shadow-[0_30px_80px_-20px_rgba(10,10,10,0.25)] sm:p-5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
            Shared inventory
          </span>
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-brand">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            Live sync
          </span>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <ProductArt look="tealThreePiece" className="h-14 w-12 shrink-0 rounded-xl ring-1 ring-neutral-200" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-neutral-950">
              Teal Three-Piece
            </p>
            <p className="truncate text-xs text-neutral-500">SKU INAY-213 · 3 outlets</p>
          </div>
          <div className="ml-auto text-right">
            <p
              key={stock}
              className="pop text-3xl font-semibold tabular-nums tracking-tight text-neutral-950"
            >
              {stock}
            </p>
            <p className="text-[11px] text-neutral-500">in stock</p>
          </div>
        </div>

        <p className="mt-4 flex items-center justify-between gap-2 text-[11px] text-neutral-500">
          <span className="font-semibold uppercase tracking-wider">Latest order</span>
          <span key={orderIndex} className="pop truncate font-medium text-neutral-700">
            {channel.order}
          </span>
        </p>
        <ol className="mt-2 space-y-1.5">
          {pipeline.map((step, i) => {
            const done = phase >= i + 1;
            return (
              <li
                key={step + i}
                className={`flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] transition-colors duration-300 ${
                  done ? "bg-lime/25 text-neutral-950" : "bg-neutral-50 text-neutral-400"
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                    done ? "bg-brand text-white" : "border border-neutral-300 bg-white"
                  }`}
                >
                  {done && <Check size={12} strokeWidth={3} aria-hidden />}
                </span>
                <span className="font-medium">{step}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

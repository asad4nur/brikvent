"use client";

import { useEffect, useState } from "react";
import { Check, Globe, MessageCircle, PhoneCall, ShieldCheck, ThumbsUp, type LucideIcon } from "lucide-react";
import ProductArt, { type ProductLook } from "@/components/product-art";

// Hero visual for "Online only": an order arrives from a social channel or
// the website, an AI call confirms it and the courier is booked.
const orders: {
  channel: string;
  icon: LucideIcon;
  customer: string;
  product: string;
  look: ProductLook;
  price: string;
  courier: string;
}[] = [
  { channel: "Facebook", icon: ThumbsUp, customer: "Nusrat · Mirpur 10", product: "Rose Kurti", look: "roseKurti", price: "৳1,650", courier: "Steadfast" },
  { channel: "WhatsApp", icon: MessageCircle, customer: "Arif · Chattogram", product: "Blue Panjabi", look: "bluePanjabi", price: "৳1,890", courier: "Pathao" },
  { channel: "Website", icon: Globe, customer: "Tania · Sylhet", product: "Silk Three-Piece", look: "silkThreePiece", price: "৳3,200", courier: "RedX" },
];

const PHASES = 6; // 0: order arrives, 1-4: steps light up, 5: hold
const TICK_MS = 900;
const START_ORDERS = 61;

export default function OnlineVisual() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = setInterval(() => setTick((t) => t + 1), reduce ? TICK_MS * 3 : TICK_MS);
    return () => clearInterval(id);
  }, []);

  const round = Math.floor(tick / PHASES);
  const phase = tick % PHASES;
  const order = orders[round % orders.length];
  const steps = [
    "AI call: customer pressed 1",
    "Order confirmed",
    `${order.courier} parcel booked`,
    "Tracking sent to customer",
  ];
  const calling = phase === 1;

  return (
    <div className="relative mx-auto h-[480px] w-full max-w-[600px] sm:h-[540px]">
      {/* Orders today */}
      <div className="absolute right-0 top-1 z-10 rounded-2xl border border-neutral-200 bg-white px-3.5 py-2.5 shadow-sm sm:right-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Orders today</p>
        <p key={round} className="pop mt-0.5 text-xl font-bold tabular-nums tracking-tight text-deep">
          {START_ORDERS + round}
        </p>
      </div>

      {/* Order card */}
      <div className="absolute left-1/2 top-1/2 w-[92%] max-w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-neutral-200 bg-white p-4 shadow-[0_24px_60px_-24px_rgba(16,42,39,0.35)] sm:w-[80%] sm:p-5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">New order</span>
          <span key={round} className="pop flex items-center gap-1.5 rounded-full bg-deep px-2.5 py-1 text-[11px] font-semibold text-white">
            <order.icon size={12} strokeWidth={2.25} aria-hidden className="text-mint" />
            {order.channel}
          </span>
        </div>

        <div key={`o${round}`} className="pop mt-3 flex items-center gap-3">
          <ProductArt look={order.look} className="h-14 w-12 shrink-0 rounded-xl ring-1 ring-neutral-200" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-deep">{order.product}</p>
            <p className="truncate text-xs text-neutral-500">{order.customer}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-base font-bold tabular-nums text-deep">{order.price}</p>
            <p className="text-[11px] text-neutral-500">Cash on delivery</p>
          </div>
        </div>

        <ol className="mt-4 space-y-1.5">
          {steps.map((step, i) => {
            const done = phase >= i + 1;
            return (
              <li
                key={i}
                className={`flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] transition-colors duration-300 ${
                  done ? "bg-mint-wash text-deep" : "bg-neutral-50 text-neutral-400"
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                    done ? "bg-mint text-deep" : "border border-neutral-300 bg-white"
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

      {/* Bottom tile: the AI call while it rings, then the fraud check */}
      <div className="absolute bottom-1 left-0 z-10 sm:left-2">
        {calling ? (
          <div key="call" className="pop flex items-center gap-2.5 rounded-2xl border border-deep bg-deep px-3.5 py-2.5 text-white shadow-sm">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-mint text-deep">
              <span aria-hidden className="ping-soft absolute inset-0 rounded-xl bg-mint" />
              <PhoneCall size={16} strokeWidth={2.25} aria-hidden className="relative" />
            </span>
            <span>
              <span className="block text-[13px] font-semibold">Calling the customer…</span>
              <span className="block text-[11px] text-white/70">&quot;Press 1 to confirm your order&quot;</span>
            </span>
          </div>
        ) : (
          <div key="fraud" className="pop flex items-center gap-2.5 rounded-2xl border border-neutral-200 bg-white px-3.5 py-2.5 shadow-sm">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-mint-wash text-mint-ink">
              <ShieldCheck size={16} strokeWidth={2.25} aria-hidden />
            </span>
            <span>
              <span className="block text-[13px] font-semibold text-deep">Fraud check passed</span>
              <span className="block text-[11px] text-neutral-500">12 of 13 past parcels delivered</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

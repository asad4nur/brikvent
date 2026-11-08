"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Check, Printer, ScanBarcode, TrendingUp } from "lucide-react";
import ProductArt, { type ProductLook } from "@/components/product-art";

// Hero visual for "Shop only": a POS counter scanning a basket, taking
// bKash and printing the receipt, while today's sales tick up.
const items: { name: string; sku: string; price: number; look: ProductLook }[] = [
  { name: "Teal Three-Piece", sku: "INAY-213", price: 2450, look: "tealThreePiece" },
  { name: "Linen Kurti", sku: "INAY-108", price: 1350, look: "linenKurti" },
  { name: "Blue Panjabi", sku: "INAY-341", price: 1890, look: "bluePanjabi" },
];

const PHASES = 7; // 0: empty, 1-3: items scanned, 4: paid, 5: receipt, 6: hold
const TICK_MS = 850;
const START_SALES = 42560;
const basket = items.reduce((sum, i) => sum + i.price, 0);
const taka = (n: number) => `৳${n.toLocaleString("en-IN")}`;

export default function ShopVisual() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = setInterval(() => setTick((t) => t + 1), reduce ? TICK_MS * 3 : TICK_MS);
    return () => clearInterval(id);
  }, []);

  const round = Math.floor(tick / PHASES);
  const phase = tick % PHASES;
  const scanned = items.slice(0, Math.min(phase, items.length));
  const total = scanned.reduce((sum, i) => sum + i.price, 0);
  const paid = phase >= 4;
  const printed = phase >= 5;
  const sales = START_SALES + round * basket + (paid ? basket : 0);

  return (
    <div className="relative mx-auto h-[480px] w-full max-w-[600px] sm:h-[540px]">
      {/* Today's sales */}
      <div className="absolute left-0 top-1 z-10 rounded-2xl border border-neutral-200 bg-white px-3.5 py-2.5 shadow-sm sm:left-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Today&apos;s sales</p>
        <p className="mt-0.5 flex items-center gap-2">
          <span key={sales} className="pop text-xl font-bold tabular-nums tracking-tight text-deep">
            {taka(sales)}
          </span>
          <span className="flex items-center gap-0.5 rounded-full bg-mint-wash px-1.5 py-0.5 text-[11px] font-semibold text-mint-ink">
            <TrendingUp size={11} strokeWidth={2.5} aria-hidden />
            12%
          </span>
        </p>
      </div>

      {/* POS checkout */}
      <div className="absolute left-1/2 top-1/2 w-[92%] max-w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-neutral-200 bg-white p-4 shadow-[0_24px_60px_-24px_rgba(16,42,39,0.35)] sm:w-[80%] sm:p-5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
            POS · Gulshan outlet
          </span>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-mint-ink">
            <ScanBarcode size={13} strokeWidth={2.25} aria-hidden />
            Scanning
          </span>
        </div>

        <ul className="mt-3 min-h-[11.25rem] space-y-2">
          {scanned.map((item) => (
            <li key={item.sku} className="pop flex items-center gap-3 rounded-xl bg-neutral-50 px-2.5 py-2">
              <ProductArt look={item.look} className="h-10 w-9 shrink-0 rounded-lg ring-1 ring-neutral-200" />
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-semibold text-deep">{item.name}</span>
                <span className="block text-[11px] text-neutral-500">SKU {item.sku} · stock −1</span>
              </span>
              <span className="ml-auto text-[13px] font-semibold tabular-nums text-deep">{taka(item.price)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-3 flex items-center justify-between border-t border-dashed border-neutral-200 pt-3">
          <span className="text-sm font-semibold text-neutral-600">Total</span>
          <span key={total} className="pop text-2xl font-bold tabular-nums tracking-tight text-deep">
            {taka(total)}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-[12px] font-semibold">
          <span
            className={`flex items-center justify-center gap-1.5 rounded-xl px-2 py-2 transition-colors duration-300 ${
              paid ? "bg-mint text-deep" : "bg-neutral-100 text-neutral-400"
            }`}
          >
            <Check size={13} strokeWidth={3} aria-hidden />
            Paid via bKash
          </span>
          <span
            className={`flex items-center justify-center gap-1.5 rounded-xl px-2 py-2 transition-colors duration-300 ${
              printed ? "bg-deep text-white" : "bg-neutral-100 text-neutral-400"
            }`}
          >
            <Printer size={13} strokeWidth={2.25} aria-hidden />
            Receipt printed
          </span>
        </div>
      </div>

      {/* Low-stock alert */}
      <div className="absolute bottom-1 right-0 z-10 flex items-center gap-2.5 rounded-2xl border border-amber-200 bg-white px-3.5 py-2.5 shadow-sm sm:right-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
          <AlertTriangle size={16} strokeWidth={2.25} aria-hidden />
        </span>
        <span>
          <span className="block text-[13px] font-semibold text-deep">Linen Kurti is running low</span>
          <span className="block text-[11px] text-neutral-500">4 left · reorder suggested</span>
        </span>
      </div>
    </div>
  );
}

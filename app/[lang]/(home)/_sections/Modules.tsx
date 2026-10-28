"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import {
  Boxes,
  ChartColumnBig,
  Check,
  Megaphone,
  MessagesSquare,
  ScanBarcode,
  ShoppingBag,
  Truck,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { Dictionary } from "@/dictionaries/en";
import ProductArt, { type ProductLook } from "@/components/product-art";

// Staggers the .rise entrance animation inside each mock.
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

type Module = {
  // Matches the navbar's #anchors so "Products" links open the right tab.
  id: string;
  name: string;
  icon: LucideIcon;
  headline: string;
  body: string;
  points: string[];
  // Empty when nothing is coming soon.
  soon: string;
  mock: () => ReactNode;
};

// Anchor, icon and mock screen per module; the words come from the dictionary.
const moduleMeta: Pick<Module, "id" | "icon" | "mock">[] = [
  { id: "ecommerce", icon: ShoppingBag, mock: StoreMock },
  { id: "pos", icon: ScanBarcode, mock: PosMock },
  { id: "inventory", icon: Boxes, mock: InventoryMock },
  { id: "orders", icon: Truck, mock: OrdersMock },
  { id: "inbox", icon: MessagesSquare, mock: InboxMock },
  { id: "marketing", icon: Megaphone, mock: MarketingMock },
  { id: "accounting", icon: Wallet, mock: AccountingMock },
  { id: "analytics", icon: ChartColumnBig, mock: ReportsMock },
];

export default function Modules({ t }: { t: Dictionary["modules"] }) {
  const modules: Module[] = t.items.map((item, i) => ({ ...item, ...moduleMeta[i] }));
  const [active, setActive] = useState(0);

  // Open the tab named by a "#module" link (navbar, footer) or the URL hash.
  // next/link updates the hash with pushState, which fires no hashchange, so
  // listen for the clicks themselves. The scrolling is done by the anchors below.
  useEffect(() => {
    const open = (hash: string) => {
      const i = moduleMeta.findIndex((m) => `#${m.id}` === hash);
      if (i !== -1) setActive(i);
    };
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element).closest?.("a[href^='#']");
      if (link) open(link.getAttribute("href")!);
    };
    const initial = setTimeout(() => open(window.location.hash), 0);
    document.addEventListener("click", onClick);
    return () => {
      clearTimeout(initial);
      document.removeEventListener("click", onClick);
    };
  }, []);

  const m = modules[active];

  return (
    <section
      id="platform"
      className="bg-neutral-50 py-20 sm:py-24 lg:py-28"
    >
      {/* Scroll targets for each module's #anchor. */}
      {moduleMeta.map((mod) => (
        <span key={mod.id} id={mod.id} aria-hidden className="block" />
      ))}
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12 min-[90rem]:px-20">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-600">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            {t.eyebrow}
          </p>
          <h2 className="mt-5 text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-neutral-950 sm:text-5xl">
            {t.title} <span className="text-neutral-400">{t.titleMuted}</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-neutral-600 sm:text-lg">
            {t.body}
          </p>
        </div>

        {/* Tabs (scroll sideways on small screens) */}
        <div className="reveal -mx-4 mt-10 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0 lg:mt-14">
          <div
            role="tablist"
            aria-label={t.tablistLabel}
            className="mx-auto flex w-max gap-1.5 rounded-full border border-neutral-200 bg-white p-1.5 shadow-sm"
          >
            {modules.map((mod, i) => (
              <button
                key={mod.id}
                type="button"
                role="tab"
                id={`tab-${mod.id}`}
                aria-selected={i === active}
                aria-controls={`panel-${mod.id}`}
                onClick={() => setActive(i)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  i === active
                    ? "bg-neutral-950 text-white"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
                }`}
              >
                <mod.icon
                  size={15}
                  strokeWidth={2}
                  aria-hidden
                  className={i === active ? "text-lime" : ""}
                />
                {mod.name}
              </button>
            ))}
          </div>
        </div>

        <div
          key={m.id}
          role="tabpanel"
          id={`panel-${m.id}`}
          aria-labelledby={`tab-${m.id}`}
          className="mt-8 grid items-center gap-10 rounded-[32px] border border-neutral-200 bg-white p-5 shadow-sm sm:p-8 lg:mt-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14 lg:p-12"
        >
          <div className="rise">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-lime to-brand text-neutral-950">
              <m.icon size={22} strokeWidth={1.9} aria-hidden />
            </span>
            <h3 className="mt-6 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
              {m.headline}
            </h3>
            <p className="mt-3 text-base leading-relaxed text-neutral-600">{m.body}</p>
            <ul className="mt-6 space-y-3">
              {m.points.map((p, i) => (
                <li
                  key={p}
                  className="rise flex gap-3 text-[15px] text-neutral-800"
                  style={delay(80 + i * 60)}
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime/40 text-brand-dark">
                    <Check size={12} strokeWidth={3} aria-hidden />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            {m.soon && (
              <p className="rise mt-5 inline-flex items-center gap-2 rounded-full border border-dashed border-brand/40 bg-lime/10 px-3 py-1.5 text-[13px] text-neutral-700">
                <span className="rounded-full bg-neutral-950 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-lime">
                  {t.comingSoon}
                </span>
                {m.soon}
              </p>
            )}
          </div>

          <div className="rise rounded-3xl bg-neutral-50 p-4 ring-1 ring-neutral-200 sm:p-6" style={delay(120)}>
            {m.mock()}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Mock screens ---------- */

function Card({ className = "", style, children }: { className?: string; style?: CSSProperties; children: ReactNode }) {
  return (
    <div className={`rounded-2xl border border-neutral-200 bg-white p-4 ${className}`} style={style}>
      {children}
    </div>
  );
}

function Chip({ tone = "neutral", children }: { tone?: "neutral" | "green" | "amber" | "blue"; children: ReactNode }) {
  const tones = {
    neutral: "bg-neutral-100 text-neutral-600",
    green: "bg-lime/40 text-brand-dark",
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-blue-50 text-blue-600",
  };
  return (
    <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}

function StoreMock() {
  const products: [string, string, string, ProductLook][] = [
    ["Linen Kurti", "৳1,250", "৳1,600", "linenKurti"],
    ["Silk Three-Piece", "৳2,450", "৳3,100", "silkThreePiece"],
    ["Cotton Panjabi", "৳1,850", "৳2,300", "cottonPanjabi"],
  ];
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3 text-xs">
        <span className="font-semibold text-neutral-950">yourshop.com</span>
        <span className="hidden gap-4 text-neutral-500 sm:flex">
          <span>Home</span>
          <span>Women</span>
          <span>Men</span>
          <span>Offers</span>
        </span>
      </div>
      <div className="rise m-3 flex items-center justify-between rounded-xl bg-gradient-to-r from-neutral-950 to-neutral-800 px-4 py-5 text-white">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-lime">Flash sale</p>
          <p className="mt-1 text-lg font-semibold">Up to 25% off</p>
        </div>
        <span className="rounded-lg bg-white/10 px-2.5 py-1.5 font-mono text-sm tabular-nums">
          02:14:33
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 px-3 pb-3">
        {products.map(([name, price, was, look], i) => (
          <div key={name} className="rise group" style={delay(150 + i * 100)}>
            <div className="relative overflow-hidden rounded-lg">
              <ProductArt
                look={look}
                className="block aspect-[4/5] w-full transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute left-1.5 top-1.5 rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                −{Math.round((1 - parseInt(price.replace(/\D/g, "")) / parseInt(was.replace(/\D/g, ""))) * 100)}%
              </span>
            </div>
            <p className="mt-2 truncate text-[11px] font-medium text-neutral-800 sm:text-xs">{name}</p>
            <p className="text-[11px] sm:text-xs">
              <span className="font-semibold text-neutral-950">{price}</span>{" "}
              <span className="text-neutral-400 line-through">{was}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PosMock() {
  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_0.9fr]">
      <Card className="rise">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Scan barcode</p>
        <div className="mt-2 flex items-center gap-2 rounded-xl border border-brand/40 bg-lime/10 px-3 py-2 font-mono text-xs text-neutral-700">
          <ScanBarcode size={14} aria-hidden className="text-brand" />
          8941100500123
        </div>
        <div className="mt-3 space-y-2">
          {[
            ["Cotton Panjabi · L", "৳1,850"],
            ["Leather Belt", "৳650"],
          ].map(([n, p], i) => (
            <div key={n} className="rise flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2 text-xs" style={delay(200 + i * 150)}>
              <span className="font-medium text-neutral-800">{n}</span>
              <span className="font-semibold text-neutral-950">{p}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card className="rise" style={delay(150)}>
        <div className="flex justify-between text-xs text-neutral-500">
          <span>Subtotal</span>
          <span>৳2,500</span>
        </div>
        <div className="mt-1 flex justify-between text-xs text-neutral-500">
          <span>Discount</span>
          <span>−৳100</span>
        </div>
        <div className="mt-2 flex justify-between border-t border-neutral-100 pt-2 text-sm font-semibold text-neutral-950">
          <span>Total</span>
          <span>৳2,400</span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-1.5 text-center text-[11px] font-semibold">
          <span className="rounded-lg bg-neutral-100 py-1.5 text-neutral-600">Cash</span>
          <span className="rounded-lg bg-neutral-100 py-1.5 text-neutral-600">Card</span>
          <span className="rounded-lg bg-pink-50 py-1.5 text-pink-600 ring-1 ring-pink-300">bKash</span>
        </div>
        <div className="mt-3 rounded-xl bg-gradient-to-r from-lime to-brand py-2.5 text-center text-xs font-semibold text-neutral-950">
          Submit &amp; print receipt
        </div>
      </Card>
    </div>
  );
}

function InventoryMock() {
  const rows = [
    ["Red", "M", "৳1,000", "৳800", "15"],
    ["Red", "L", "৳1,000", "৳800", "12"],
    ["Black", "M", "৳1,050", "৳800", "3"],
    ["Black", "L", "৳1,050", "৳800", "9"],
  ];
  return (
    <Card className="overflow-x-auto p-0">
      <div className="flex items-center justify-between px-4 py-3">
        <p className="text-sm font-semibold text-neutral-950">Variant matrix · 4 variants</p>
        <Chip tone="green">Auto-generated</Chip>
      </div>
      <table className="w-full min-w-[320px] text-left text-xs">
        <thead className="border-y border-neutral-100 bg-neutral-50 text-[11px] uppercase tracking-wider text-neutral-500">
          <tr>
            <th className="px-4 py-2 font-semibold">Variant</th>
            <th className="px-2 py-2 font-semibold">Price</th>
            <th className="px-2 py-2 font-semibold">Cost</th>
            <th className="px-4 py-2 text-right font-semibold">Stock</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([color, size, price, cost, stock], i) => {
            const low = Number(stock) <= 5;
            return (
              <tr key={color + size} className="rise border-b border-neutral-100 last:border-0" style={delay(100 + i * 100)}>
                <td className="px-4 py-2.5">
                  <span className="flex items-center gap-2 font-medium text-neutral-800">
                    <span className={`h-2.5 w-2.5 rounded-full ${color === "Red" ? "bg-red-500" : "bg-neutral-900"}`} />
                    {color} · {size}
                  </span>
                </td>
                <td className="px-2 py-2.5 text-neutral-800">{price}</td>
                <td className="px-2 py-2.5 text-neutral-500">{cost}</td>
                <td className="px-4 py-2.5 text-right">
                  {low ? <Chip tone="amber">{stock} · Low</Chip> : <span className="font-semibold text-neutral-950">{stock}</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}

function OrdersMock() {
  const rows: [string, string, string, ReactNode, ReactNode][] = [
    ["#4188", "Facebook", "৳1,850", <Chip key="c" tone="green">Call confirmed</Chip>, <Chip key="d" tone="blue">Steadfast</Chip>],
    ["#4187", "Website", "৳2,450", <Chip key="c" tone="green">Call confirmed</Chip>, <Chip key="d" tone="blue">Pathao</Chip>],
    ["#4186", "WhatsApp", "৳990", <Chip key="c" tone="amber">Calling…</Chip>, <Chip key="d">Not booked</Chip>],
    ["#4185", "POS", "৳3,200", <Chip key="c">Paid in store</Chip>, <Chip key="d">Picked up</Chip>],
  ];
  return (
    <div className="space-y-2">
      {rows.map(([id, channel, amount, call, courier], i) => (
        <Card key={id} className="rise flex flex-wrap items-center gap-x-3 gap-y-2 py-3" style={delay(i * 110)}>
          <span className="text-sm font-semibold text-neutral-950">{id}</span>
          <Chip>{channel}</Chip>
          <span className="ml-auto text-sm font-semibold text-neutral-950">{amount}</span>
          <span className="flex w-full gap-1.5 sm:w-auto">
            {call}
            {courier}
          </span>
        </Card>
      ))}
    </div>
  );
}

function InboxMock() {
  const chats = [
    ["Nusrat J.", "WhatsApp", "bg-green-500", "Is this available in black?"],
    ["Tanvir A.", "Messenger", "bg-blue-500", "Delivery charge to Sylhet?"],
    ["Mim's Closet", "Instagram", "bg-pink-500", "Can I get 3 pieces?"],
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-2">
        {chats.map(([name, ch, dot, msg], i) => (
          <Card key={name} className={`rise py-3 ${i === 0 ? "border-brand/40" : ""}`} style={delay(i * 100)}>
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${dot}`} />
              <span className="text-xs font-semibold text-neutral-950">{name}</span>
              <span className="ml-auto text-[10px] text-neutral-400">{ch}</span>
            </div>
            <p className="mt-1 truncate text-xs text-neutral-500">{msg}</p>
          </Card>
        ))}
      </div>
      <Card className="rise flex flex-col gap-2" style={delay(250)}>
        <p className="w-fit max-w-[90%] rounded-2xl rounded-bl-md bg-neutral-100 px-3 py-2 text-xs text-neutral-800">
          Is this available in black?
        </p>
        <p className="ml-auto w-fit max-w-[90%] rounded-2xl rounded-br-md bg-neutral-950 px-3 py-2 text-xs text-white">
          Yes, 6 left in black. Want me to book one?
        </p>
        <div className="mt-auto flex items-center gap-2 rounded-xl bg-lime/20 px-3 py-2 text-[11px] text-neutral-700">
          <Boxes size={13} aria-hidden className="text-brand" />
          Black · M — <span className="font-semibold text-neutral-950">6 in stock</span>
        </div>
      </Card>
    </div>
  );
}

function MarketingMock() {
  return (
    <div className="space-y-3">
      <Card className="rise">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-neutral-950">Eid comeback offer</p>
          <Chip tone="green">SMS</Chip>
        </div>
        <p className="mt-1 text-xs text-neutral-500">Audience: VIP buyers · 312 customers</p>
        <p className="mt-3 rounded-xl bg-neutral-50 px-3 py-2.5 text-xs leading-relaxed text-neutral-700">
          Hello <span className="rounded bg-lime/40 px-1 font-semibold text-brand-dark">{"{{customer_name}}"}</span>, your
          Eid gift is here: 15% off everything until Friday.
        </p>
      </Card>
      <div className="grid grid-cols-3 gap-2">
        {[
          ["৳18,400", "Ad spend"],
          ["4.2x", "ROAS"],
          ["৳6.80", "CPC"],
        ].map(([v, l], i) => (
          <Card key={l} className="rise py-3 text-center" style={delay(150 + i * 100)}>
            <p className="text-base font-semibold text-neutral-950">{v}</p>
            <p className="text-[11px] text-neutral-500">{l}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AccountingMock() {
  const accounts = [
    ["Cash drawer", "৳42,300", "bg-neutral-900"],
    ["bKash merchant", "৳68,150", "bg-pink-500"],
    ["Nagad business", "৳12,900", "bg-orange-500"],
    ["Cash on delivery", "৳31,450", "bg-amber-400"],
    ["Bank (DBBL)", "৳1,05,000", "bg-blue-500"],
  ];
  return (
    <Card className="p-0">
      <div className="flex items-center justify-between px-4 py-3">
        <p className="text-sm font-semibold text-neutral-950">Accounts</p>
        <p className="text-sm font-semibold text-brand">৳2,59,800</p>
      </div>
      <ul className="border-t border-neutral-100">
        {accounts.map(([name, amount, dot], i) => (
          <li key={name} className="rise flex items-center gap-3 border-b border-neutral-100 px-4 py-2.5 text-xs last:border-0" style={delay(i * 90)}>
            <span className={`h-2 w-2 rounded-full ${dot}`} />
            <span className="font-medium text-neutral-800">{name}</span>
            <span className="ml-auto font-semibold tabular-nums text-neutral-950">{amount}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function ReportsMock() {
  const bars = [38, 52, 44, 61, 57, 74, 88];
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {[
          ["৳3.2L", "Revenue"],
          ["214", "Orders"],
          ["৳1.1L", "Gross profit"],
        ].map(([v, l], i) => (
          <Card key={l} className="rise py-3" style={delay(i * 90)}>
            <p className="text-[11px] text-neutral-500">{l}</p>
            <p className="text-base font-semibold text-neutral-950 sm:text-lg">{v}</p>
          </Card>
        ))}
      </div>
      <Card className="rise" style={delay(200)}>
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-neutral-950">Last 7 days</span>
          <span className="flex gap-3 text-neutral-500">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-brand" />Online</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-lime" />POS</span>
          </span>
        </div>
        <div className="mt-4 flex h-28 items-end gap-2">
          {bars.map((h, i) => (
            <div key={i} className="flex flex-1 flex-col justify-end gap-0.5" style={{ height: `${h}%` }}>
              <span className="rise flex-[3] rounded-t bg-brand" style={delay(250 + i * 60)} />
              <span className="rise flex-[2] rounded-b bg-lime" style={delay(250 + i * 60)} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

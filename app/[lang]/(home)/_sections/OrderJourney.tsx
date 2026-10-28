"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { Dictionary } from "@/dictionaries/en";
import ProductArt from "@/components/product-art";
import InboxChat from "./InboxChat";
import {
  Boxes,
  Check,
  ListChecks,
  MessagesSquare,
  Phone,
  PhoneCall,
  ShieldCheck,
  Truck,
  Wallet,
  type LucideIcon,
} from "lucide-react";

// Staggers the .rise entrance animation inside each screen.
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

type Step = {
  time: string;
  module: string;
  icon: LucideIcon;
  title: string;
  body: string;
  screen: (props: { summary: string }) => ReactNode;
};

// Icon and mock screen per step; the words come from the dictionary.
const stepMeta: Pick<Step, "icon" | "screen">[] = [
  { icon: MessagesSquare, screen: InboxChat },
  { icon: ListChecks, screen: OrderScreen },
  { icon: Boxes, screen: StockScreen },
  { icon: PhoneCall, screen: CallScreen },
  { icon: Truck, screen: CourierScreen },
  { icon: Wallet, screen: AccountsScreen },
];

export default function OrderJourney({ t }: { t: Dictionary["journey"] }) {
  const steps: Step[] = t.steps.map((step, i) => ({ ...step, ...stepMeta[i] }));
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  // The step crossing the middle of the viewport is the active one.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(Number((entry.target as HTMLElement).dataset.index));
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    stepRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="how-it-works"
      className="relative bg-white py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12 min-[90rem]:px-20">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-600">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            {t.eyebrow}
          </p>
          <h2 className="mt-5 text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-neutral-950 sm:text-5xl">
            {t.title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-neutral-600 sm:text-lg">
            {t.body}
          </p>
        </div>

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-[1fr_1.1fr] lg:gap-16 xl:gap-24">
          {/* Steps */}
          <ol className="relative">
            {/* Progress rail */}
            <span
              aria-hidden
              className="absolute bottom-6 left-[19px] top-6 w-px bg-neutral-200"
            />
            <span
              aria-hidden
              className="absolute left-[19px] top-6 w-px bg-brand transition-[height] duration-500 ease-out"
              style={{ height: `calc((100% - 48px) * ${active / (steps.length - 1)})` }}
            />

            {steps.map((step, i) => {
              const isActive = i === active;
              const isDone = i < active;
              return (
                <li
                  key={step.title}
                  ref={(el) => {
                    stepRefs.current[i] = el;
                  }}
                  data-index={i}
                  className="relative pb-14 pl-14 last:pb-0 lg:flex lg:min-h-[52vh] lg:flex-col lg:justify-center lg:pb-0"
                >
                  <span
                    className={`absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition-all duration-500 lg:top-1/2 lg:-translate-y-1/2 ${
                      isActive
                        ? "border-brand bg-brand text-white shadow-[0_0_0_6px_rgba(0,166,62,0.12)]"
                        : isDone
                          ? "border-brand/40 bg-lime/30 text-brand-dark"
                          : "border-neutral-200 bg-white text-neutral-400"
                    }`}
                  >
                    {isDone ? <Check size={16} strokeWidth={2.75} aria-hidden /> : i + 1}
                  </span>

                  <div
                    className={`transition-opacity duration-500 ${
                      isActive ? "opacity-100" : "lg:opacity-40"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                      <span className="text-neutral-500">{step.time}</span>
                      <span className="h-1 w-1 rounded-full bg-neutral-300" />
                      <span className="inline-flex items-center gap-1 rounded-full bg-lime/30 px-2 py-0.5 font-semibold text-brand-dark">
                        <step.icon size={12} strokeWidth={2.25} aria-hidden />
                        {step.module}
                      </span>
                    </div>
                    <h3 className="mt-3 text-xl font-semibold tracking-tight text-neutral-950 sm:text-2xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-md text-[15px] leading-relaxed text-neutral-600 sm:text-base">
                      {step.body}
                    </p>

                    {/* On small screens each step carries its own screen. */}
                    <div className="relative -ml-14 mt-6 sm:ml-0 lg:hidden">
                      <Device step={step}>
                        <div key={isActive ? "on" : "off"}><step.screen summary={t.chatSummary} /></div>
                      </Device>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Sticky screen (desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-[calc(50vh-255px)]">
              <Device step={steps[active]}>
                <div className="grid">
                  {steps.map((step, i) => (
                    <div
                      key={step.title}
                      aria-hidden={i !== active}
                      className={`col-start-1 row-start-1 transition-opacity duration-300 ${
                        i === active ? "opacity-100" : "pointer-events-none opacity-0"
                      }`}
                    >
                      {/* Remount on activation so the screen's animation replays. */}
                      <div key={i === active ? "on" : "off"}><step.screen summary={t.chatSummary} /></div>
                    </div>
                  ))}
                </div>
              </Device>
              <div className="mt-5 flex justify-center gap-1.5" aria-hidden>
                {steps.map((s, i) => (
                  <span
                    key={s.title}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === active ? "w-6 bg-brand" : "w-1.5 bg-neutral-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Device({ step, children }: { step: Step; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-neutral-200 bg-neutral-50 shadow-[0_30px_80px_-30px_rgba(10,10,10,0.3)]">
      <div className="flex items-center gap-3 border-b border-neutral-200 bg-white px-4 py-3">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-neutral-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-neutral-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-neutral-200" />
        </span>
        <span className="flex min-w-0 items-center gap-1.5 text-[13px] font-semibold text-neutral-900">
          <step.icon size={14} strokeWidth={2.25} className="shrink-0 text-brand" aria-hidden />
          <span className="truncate">{step.module}</span>
        </span>
        <span className="ml-auto hidden text-xs text-neutral-400 sm:block">
          merchant.brikvent.com
        </span>
      </div>
      <div className="p-4 sm:p-6 lg:h-[460px]">{children}</div>
    </div>
  );
}

function Panel({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`rounded-2xl border border-neutral-200 bg-white p-4 ${className}`}>
      {children}
    </div>
  );
}

function OrderScreen() {
  const rows = [
    { id: "#4187", channel: "Website", amount: "৳2,450", status: "Paid" },
    { id: "#4186", channel: "POS", amount: "৳980", status: "Paid" },
  ];
  return (
    <div className="space-y-3">
      <Panel className="rise border-brand/30 shadow-[0_12px_40px_-20px_rgba(0,166,62,0.5)]">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-neutral-950">Order #4188</p>
          <span className="rounded-full bg-lime/40 px-2 py-0.5 text-[11px] font-semibold text-brand-dark">
            New
          </span>
        </div>
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
          <div>
            <dt className="text-neutral-500">Customer</dt>
            <dd className="font-medium text-neutral-900">Rakib Hasan</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Address</dt>
            <dd className="font-medium text-neutral-900">Mirpur 10, Dhaka</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Item</dt>
            <dd className="font-medium text-neutral-900">Blue Panjabi · L × 1</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Payment</dt>
            <dd className="font-medium text-neutral-900">Cash on delivery</dd>
          </div>
        </dl>
        <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-3">
          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-600">
            Facebook
          </span>
          <span className="text-base font-semibold text-neutral-950">৳1,850</span>
        </div>
      </Panel>
      <p className="rise px-1 pt-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-500" style={delay(300)}>
        Same list as every other channel
      </p>
      {rows.map((r, i) => (
        <div
          key={r.id}
          className="rise flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-xs"
          style={delay(400 + i * 120)}
        >
          <span className="font-semibold text-neutral-900">{r.id}</span>
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 font-medium text-neutral-600">
            {r.channel}
          </span>
          <span className="ml-auto font-medium text-neutral-900">{r.amount}</span>
          <span className="text-brand">{r.status}</span>
        </div>
      ))}
    </div>
  );
}

function StockScreen() {
  const places = ["Website", "Facebook shop", "Instagram shop", "Gulshan outlet (POS)"];
  return (
    <div className="space-y-3">
      <Panel className="rise flex items-center gap-4">
        <ProductArt look="bluePanjabi" className="h-16 w-14 shrink-0 rounded-xl ring-1 ring-neutral-200" />
        <div>
          <p className="text-sm font-semibold text-neutral-950">Blue Panjabi · L</p>
          <p className="text-xs text-neutral-500">SKU BP-L · one shared stock</p>
        </div>
        <div className="ml-auto flex items-baseline gap-2">
          <span className="text-xl font-semibold tabular-nums text-neutral-300 line-through">5</span>
          <span className="rise text-4xl font-semibold tabular-nums text-neutral-950" style={delay(450)}>
            4
          </span>
        </div>
      </Panel>
      {places.map((p, i) => (
        <div
          key={p}
          className="rise flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm"
          style={delay(600 + i * 150)}
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white">
            <Check size={12} strokeWidth={3} aria-hidden />
          </span>
          <span className="font-medium text-neutral-800">{p}</span>
          <span className="ml-auto text-xs text-neutral-500">Updated to 4</span>
        </div>
      ))}
    </div>
  );
}

function CallScreen() {
  return (
    <div className="space-y-3">
      <Panel className="rise">
        <div className="flex items-center gap-3">
          <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white">
            <span aria-hidden className="ping-soft absolute inset-0 rounded-full bg-brand" />
            <Phone size={17} strokeWidth={2.25} aria-hidden className="relative" />
          </span>
          <div>
            <p className="text-sm font-semibold text-neutral-950">Calling 017•• ••• 421</p>
            <p className="text-xs text-neutral-500">Order #4188 · ৳1,850 COD</p>
          </div>
        </div>
        <p
          className="rise mt-4 rounded-xl bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-700"
          style={delay(500)}
        >
          “Press 1 to confirm your order, or 2 to cancel.”
        </p>
        <div
          className="rise mt-3 flex items-center gap-2 rounded-xl bg-lime/30 px-3.5 py-2.5 text-sm font-semibold text-brand-dark"
          style={delay(1200)}
        >
          <Check size={16} strokeWidth={2.75} aria-hidden />
          Customer pressed 1 · Order confirmed
        </div>
      </Panel>
      <Panel className="rise">
        <div className="flex items-center gap-2 text-sm font-semibold text-neutral-950">
          <ShieldCheck size={16} strokeWidth={2.25} className="text-brand" aria-hidden />
          Fraud check
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
          {[
            ["9", "Past orders"],
            ["8", "Delivered"],
            ["1", "Returned"],
          ].map(([n, label]) => (
            <div key={label} className="rounded-xl bg-neutral-50 py-2">
              <p className="text-base font-semibold text-neutral-950">{n}</p>
              <p className="text-neutral-500">{label}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs font-semibold text-brand">Low risk · safe to ship</p>
      </Panel>
    </div>
  );
}

function CourierScreen() {
  const timeline = ["Booked", "Picked up", "In transit", "Delivered"];
  return (
    <div className="space-y-3">
      <div className="rise grid grid-cols-2 gap-3">
        <div className="rounded-2xl border-2 border-brand bg-white p-3">
          <p className="text-sm font-semibold text-neutral-950">Steadfast</p>
          <p className="text-xs text-neutral-500">Selected</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-3">
          <p className="text-sm font-semibold text-neutral-400">Pathao</p>
          <p className="text-xs text-neutral-400">Available</p>
        </div>
      </div>
      <Panel className="rise">
        <div className="flex items-center justify-between text-xs">
          <span className="text-neutral-500">Consignment</span>
          <span className="font-semibold text-neutral-950">SF-58210394</span>
        </div>
        <div className="mt-1 flex items-center justify-between text-xs">
          <span className="text-neutral-500">Deliver to</span>
          <span className="font-medium text-neutral-900">Rakib Hasan · Mirpur 10</span>
        </div>
        <div className="mt-1 flex items-center justify-between text-xs">
          <span className="text-neutral-500">Collect</span>
          <span className="font-medium text-neutral-900">৳1,850</span>
        </div>
      </Panel>
      <Panel className="rise">
        <ol className="space-y-3">
          {timeline.map((t, i) => {
            const done = i < 3;
            return (
              <li key={t} className="rise flex items-center gap-3 text-sm" style={delay(400 + i * 350)}>
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full ${
                    done ? "bg-brand text-white" : "border border-neutral-300 bg-white"
                  }`}
                >
                  {done && <Check size={12} strokeWidth={3} aria-hidden />}
                </span>
                <span className={done ? "font-medium text-neutral-900" : "text-neutral-400"}>
                  {t}
                </span>
                {i === 2 && (
                  <span className="ml-auto text-xs text-neutral-500">Synced from Steadfast</span>
                )}
              </li>
            );
          })}
        </ol>
      </Panel>
    </div>
  );
}

function AccountsScreen() {
  const lines = [
    ["Sale", "৳1,850"],
    ["Cost of goods", "−৳1,050"],
    ["Delivery charge", "−৳70"],
  ];
  return (
    <div className="space-y-3">
      <Panel className="rise flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-lime to-brand">
          <Wallet size={18} strokeWidth={2} aria-hidden />
        </span>
        <div>
          <p className="text-sm font-semibold text-neutral-950">COD collected</p>
          <p className="text-xs text-neutral-500">Posted to Cash on Delivery account</p>
        </div>
        <span className="ml-auto text-lg font-semibold text-brand">+৳1,850</span>
      </Panel>
      <Panel className="rise">
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Order #4188 profit
        </p>
        <dl className="mt-3 space-y-2 text-sm">
          {lines.map(([label, value], i) => (
            <div key={label} className="rise flex justify-between" style={delay(300 + i * 150)}>
              <dt className="text-neutral-600">{label}</dt>
              <dd className="font-medium tabular-nums text-neutral-900">{value}</dd>
            </div>
          ))}
          <div
            className="rise flex justify-between border-t border-neutral-100 pt-2"
            style={delay(800)}
          >
            <dt className="font-semibold text-neutral-950">Net profit</dt>
            <dd className="font-semibold tabular-nums text-brand">৳730</dd>
          </div>
        </dl>
      </Panel>
      <p
        className="rise flex items-center gap-2 px-1 text-xs text-neutral-500"
        style={delay(1000)}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-brand" />
        Dashboard, P&amp;L and sales report updated
      </p>
    </div>
  );
}

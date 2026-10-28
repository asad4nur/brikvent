"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, ChevronDown, Minus } from "lucide-react";
import type { Dictionary } from "@/dictionaries/en";
import { fill } from "@/lib/i18n";
import {
  featureTable,
  planFeatures,
  planIncludes,
  plans,
  type FeatureRow,
  type Plan,
} from "@/lib/pricing";

type T = Dictionary["pricing"] & { numberLocale: string };

// Number formatters for the page language (bn-BD prints Bangla digits).
function formatters(locale: string) {
  const number = (n: number) => n.toLocaleString(locale);
  const taka = (n: number) =>
    `৳${n.toLocaleString(locale, { minimumFractionDigits: Number.isInteger(n) ? 0 : 2 })}`;
  return { number, taka };
}

// What a plan costs in a month with `orders` sales orders, or null if the
// plan has no fixed price (Enterprise).
function monthlyCost(plan: Plan, orders: number) {
  if (plan.startingFrom) return null;
  const { freeOrdersPerMonth: free, overagePerOrder: fee } = plan.limits;
  if (free === null || fee === null) return plan.monthly;
  return plan.monthly + Math.max(0, orders - free) * fee;
}

export default function Pricing({ t }: { t: T }) {
  const [yearly, setYearly] = useState(false);
  const [orders, setOrders] = useState(500);

  const costs = plans
    .map((p) => ({ plan: p, cost: monthlyCost(p, orders) }))
    .filter((c): c is { plan: Plan; cost: number } => c.cost !== null);
  const best = costs.reduce((a, b) => (b.cost < a.cost ? b : a));
  const c = t.calculator;
  const { number, taka } = formatters(t.numberLocale);

  return (
    <section id="pricing" className="bg-neutral-50 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12 min-[90rem]:px-20">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-600">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            {t.eyebrow}
          </p>
          <h2 className="mt-5 text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-neutral-950 sm:text-5xl">
            {t.title} <span className="text-neutral-400">{t.titleMuted}</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-neutral-600 sm:text-lg">{t.body}</p>

          <div
            role="radiogroup"
            aria-label={t.billingLabel}
            className="relative mx-auto mt-8 grid w-full max-w-sm grid-cols-2 rounded-full border border-neutral-200 bg-white p-1 shadow-sm"
          >
            <span
              aria-hidden
              className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-neutral-950 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                yearly ? "translate-x-full" : ""
              }`}
            />
            {[false, true].map((y) => (
              <button
                key={String(y)}
                type="button"
                role="radio"
                aria-checked={yearly === y}
                onClick={() => setYearly(y)}
                className={`relative z-10 flex items-center justify-center gap-1.5 rounded-full py-2.5 text-sm font-semibold transition-colors ${
                  yearly === y ? "text-white" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                {y ? t.yearly : t.monthly}
                {y && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                      yearly ? "bg-lime text-neutral-950" : "bg-lime/40 text-brand-dark"
                    }`}
                  >
                    {t.twoMonthsFree}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Plan cards */}
        <div className="reveal mt-12 grid gap-4 md:grid-cols-2 lg:mt-14 xl:grid-cols-4">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} yearly={yearly} t={t} />
          ))}
        </div>

        <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-neutral-600">
          {t.promises.map((p) => (
            <li key={p} className="flex items-center gap-1.5">
              <Check size={15} strokeWidth={2.5} className="text-brand" aria-hidden />
              {p}
            </li>
          ))}
        </ul>

        <FeatureTable t={t} />

        {/* Order calculator */}
        <div className="reveal mt-16 grid gap-8 rounded-[32px] border border-neutral-200 bg-white p-6 shadow-sm sm:p-8 lg:mt-20 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:gap-14 lg:p-12">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
              {c.title}
            </h3>
            <p className="mt-3 text-base leading-relaxed text-neutral-600">{c.body}</p>
            <label htmlFor="monthly-orders" className="mt-8 flex items-baseline justify-between">
              <span className="text-sm font-medium text-neutral-600">{c.ordersLabel}</span>
              <span className="text-3xl font-semibold tabular-nums tracking-tight text-neutral-950">
                {number(orders)}
              </span>
            </label>
            <input
              id="monthly-orders"
              type="range"
              min={100}
              max={10000}
              step={100}
              value={orders}
              onChange={(e) => setOrders(Number(e.target.value))}
              className="mt-4 w-full accent-[#00a63e]"
            />
            <div className="mt-1 flex justify-between text-xs text-neutral-400">
              <span>{number(100)}</span>
              <span>{number(10000)}</span>
            </div>
          </div>

          <ul className="space-y-2.5">
            {costs.map(({ plan, cost }) => {
              const isBest = plan.id === best.plan.id;
              const extra = cost - plan.monthly;
              return (
                <li
                  key={plan.id}
                  className={`flex items-center gap-4 rounded-2xl border px-4 py-3.5 transition-colors duration-300 sm:px-5 ${
                    isBest ? "border-brand bg-lime/15" : "border-neutral-200 bg-white"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-sm font-semibold text-neutral-950">
                      {plan.name}
                      {isBest && (
                        <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                          {c.best}
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      {extra > 0
                        ? fill(c.extra, { base: taka(plan.monthly), extra: taka(extra) })
                        : plan.limits.freeOrdersPerMonth === null
                          ? c.unlimitedIncluded
                          : fill(c.within, { n: number(plan.limits.freeOrdersPerMonth) })}
                    </p>
                  </div>
                  <p className="ml-auto whitespace-nowrap text-lg font-semibold tabular-nums text-neutral-950">
                    {taka(cost)}
                    <span className="text-xs font-medium text-neutral-500">{t.perMonthShort}</span>
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

// Plan limits shown at the top of the full comparison.
function limitRows(t: T): { name: string; value: (p: Plan) => string }[] {
  const { number, taka } = formatters(t.numberLocale);
  const n = (v: number | null) => (v === null ? t.values.unlimited : number(v));
  const r = t.limitRows;
  return [
    { name: r.pricePerMonth, value: (p) => `${p.startingFrom ? `${t.values.from} ` : ""}${taka(p.monthly)}` },
    { name: r.pricePerYear, value: (p) => (p.yearly === null ? t.values.custom : taka(p.yearly)) },
    { name: r.outlets, value: (p) => n(p.limits.outlets) },
    { name: r.skus, value: (p) => n(p.limits.skus) },
    { name: r.users, value: (p) => n(p.limits.users) },
    { name: r.salesOrders, value: () => t.values.unlimited },
    { name: r.freeOrders, value: (p) => n(p.limits.freeOrdersPerMonth) },
    {
      name: r.overage,
      value: (p) => (p.limits.overagePerOrder === null ? "—" : taka(p.limits.overagePerOrder)),
    },
    { name: r.purchaseOrders, value: (p) => n(p.limits.purchaseOrdersPerMonth) },
    {
      name: r.storage,
      value: (p) => (typeof p.limits.storageGb === "number" ? `${number(p.limits.storageGb)} GB` : t.values.custom),
    },
    { name: r.trial, value: (p) => (p.trial === "14-day" ? t.values.days14 : t.values.demoCall) },
  ];
}

function IncludedMark({ included, t }: { included: boolean; t: T }) {
  return included ? (
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-white">
      <Check size={13} strokeWidth={3} aria-label={t.included} />
    </span>
  ) : (
    <Minus size={16} strokeWidth={2} className="text-neutral-300" aria-label={t.notIncluded} />
  );
}

function FeatureLabel({ row, t }: { row: FeatureRow; t: T }) {
  return (
    <>
      {t.features[row.id]}
      {row.credits && (
        <span className="block text-xs font-normal text-neutral-400">{t.notes.credits}</span>
      )}
    </>
  );
}

function FeatureTable({ t }: { t: T }) {
  const [open, setOpen] = useState(false);
  const rows = limitRows(t);

  return (
    <div className="mt-12">
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="feature-table"
          className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 shadow-sm transition-colors hover:border-neutral-300"
        >
          {open ? t.compareClose : t.compareOpen}
          <ChevronDown
            size={16}
            strokeWidth={2.25}
            aria-hidden
            className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Animates open by growing the row from 0fr to 1fr. */}
      <div
        id="feature-table"
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "mt-8 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden" inert={!open}>
          <MobileFeatureList t={t} rows={rows} />
          <div className="hidden overflow-hidden rounded-3xl border border-neutral-200 bg-white md:block">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th scope="col" className="bg-white px-5 py-5 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    {t.featuresHeader}
                  </th>
                  {plans.map((p) => (
                    <th
                      key={p.id}
                      scope="col"
                      className={`px-4 py-5 text-center ${p.popular ? "bg-lime/15" : ""}`}
                    >
                      <span className="block text-base font-semibold text-neutral-950">{p.name}</span>
                      {p.popular && (
                        <span className="mt-1 inline-block rounded-full bg-lime px-2 py-0.5 text-[10px] font-bold uppercase text-neutral-950">
                          {t.mostPopular}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <GroupRow name={t.limitsGroup} />
                {rows.map((r) => (
                  <tr key={r.name} className="border-b border-neutral-100">
                    <th scope="row" className="bg-white px-5 py-3 font-medium text-neutral-700">
                      {r.name}
                    </th>
                    {plans.map((p) => (
                      <td
                        key={p.id}
                        className={`px-4 py-3 text-center font-medium tabular-nums text-neutral-950 ${p.popular ? "bg-lime/15" : ""}`}
                      >
                        {r.value(p)}
                      </td>
                    ))}
                  </tr>
                ))}
                {featureTable.map((g) => (
                  <FeatureGroup key={g.group} group={g} t={t} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Phones get one plan at a time instead of a four-column table.
function MobileFeatureList({ t, rows }: { t: T; rows: ReturnType<typeof limitRows> }) {
  const [planId, setPlanId] = useState(plans.find((p) => p.popular)?.id ?? plans[0].id);
  const plan = plans.find((p) => p.id === planId)!;
  const groupLabel = "bg-neutral-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-500";

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white md:hidden">
      <div
        role="radiogroup"
        aria-label={t.planLabel}
        className="grid grid-cols-4 gap-1 border-b border-neutral-200 p-1.5"
      >
        {plans.map((p) => (
          <button
            key={p.id}
            type="button"
            role="radio"
            aria-checked={p.id === planId}
            onClick={() => setPlanId(p.id)}
            className={`rounded-full py-2 text-xs font-semibold transition-colors ${
              p.id === planId ? "bg-neutral-950 text-white" : "text-neutral-600"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div key={planId} className="pop">
        <p className={groupLabel}>{t.limitsGroup}</p>
        <dl>
          {rows.map((r) => (
            <div key={r.name} className="flex justify-between gap-4 border-b border-neutral-100 px-4 py-3 text-sm">
              <dt className="text-neutral-600">{r.name}</dt>
              <dd className="text-right font-semibold tabular-nums text-neutral-950">{r.value(plan)}</dd>
            </div>
          ))}
        </dl>
        {featureTable.map((g) => (
          <div key={g.group}>
            <p className={groupLabel}>{t.groups[g.group]}</p>
            <dl>
              {g.rows.map((r) => {
                const included = r.plans.includes(plan.id);
                return (
                  <div
                    key={r.id}
                    className="flex items-center justify-between gap-4 border-b border-neutral-100 px-4 py-3 text-sm last:border-0"
                  >
                    <dt className={included ? "text-neutral-800" : "text-neutral-400"}>
                      <FeatureLabel row={r} t={t} />
                    </dt>
                    <dd className="shrink-0">
                      <IncludedMark included={included} t={t} />
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}

function GroupRow({ name }: { name: string }) {
  return (
    <tr className="bg-neutral-50">
      <th
        scope="colgroup"
        colSpan={plans.length + 1}
        className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-500"
      >
        {name}
      </th>
    </tr>
  );
}

function FeatureGroup({ group, t }: { group: (typeof featureTable)[number]; t: T }) {
  return (
    <>
      <GroupRow name={t.groups[group.group]} />
      {group.rows.map((r) => (
        <tr key={r.id} className="border-b border-neutral-100 last:border-0">
          <th scope="row" className="bg-white px-5 py-3 font-medium text-neutral-700">
            <FeatureLabel row={r} t={t} />
          </th>
          {plans.map((p) => (
            <td key={p.id} className={`px-4 py-3 ${p.popular ? "bg-lime/15" : ""}`}>
              <span className="flex justify-center">
                <IncludedMark included={r.plans.includes(p.id)} t={t} />
              </span>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function PlanCard({ plan, yearly, t }: { plan: Plan; yearly: boolean; t: T }) {
  const l = plan.limits;
  const k = t.card;
  const { number, taka } = formatters(t.numberLocale);
  const n = (v: number | null) => (v === null ? t.values.unlimited : number(v));
  const showYearly = yearly && plan.yearly !== null;
  const limits = [
    l.outlets === null ? k.outletsUnlimited : l.outlets === 1 ? k.outletsOne : fill(k.outlets, { n: n(l.outlets) }),
    l.skus === null ? k.skusUnlimited : fill(k.skus, { n: n(l.skus) }),
    l.users === null ? k.usersUnlimited : l.users === 1 ? k.usersOne : fill(k.users, { n: n(l.users) }),
    l.freeOrdersPerMonth === null
      ? k.unlimitedOrders
      : fill(k.freeOrders, { n: n(l.freeOrdersPerMonth), fee: taka(l.overagePerOrder ?? 0) }),
    fill(k.storage, { n: typeof l.storageGb === "number" ? `${number(l.storageGb)} GB` : t.values.custom }),
  ];

  return (
    <div
      className={`relative flex flex-col rounded-3xl border bg-white p-6 sm:p-7 ${
        plan.popular
          ? "border-neutral-950 shadow-[0_30px_70px_-30px_rgba(10,10,10,0.45)] ring-1 ring-neutral-950"
          : "border-neutral-200"
      }`}
    >
      {plan.popular && (
        <span className="absolute -top-3 left-6 rounded-full bg-lime px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-neutral-950">
          {t.mostPopular}
        </span>
      )}
      <h3 className="text-lg font-semibold text-neutral-950">{plan.name}</h3>
      <p className="mt-1 min-h-10 text-sm text-neutral-500">{t.taglines[plan.id]}</p>

      <div className="mt-6 min-h-[72px]">
        <p className="flex items-baseline gap-1">
          {plan.startingFrom && <span className="text-sm text-neutral-500">{t.from}</span>}
          <span key={String(showYearly)} className="pop text-4xl font-semibold tracking-tight text-neutral-950">
            {taka(showYearly ? plan.yearly! : plan.monthly)}
            {plan.startingFrom && "+"}
          </span>
          <span className="text-sm text-neutral-500">{showYearly ? t.perYear : t.perMonth}</span>
        </p>
        <p className="mt-1 text-xs text-neutral-500">
          {showYearly
            ? fill(t.billedYearly, { price: taka(Math.round(plan.yearly! / 12)) })
            : plan.yearly === null
              ? t.customContract
              : fill(t.orYearly, { price: taka(plan.yearly) })}
        </p>
      </div>

      <Link
        href={plan.trial === "demo-call" ? "#demo" : "#signup"}
        className={`group mt-6 inline-flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition-colors ${
          plan.popular
            ? "bg-neutral-950 text-white hover:bg-neutral-800"
            : "border border-neutral-200 text-neutral-900 hover:border-neutral-300 hover:bg-neutral-50"
        }`}
      >
        {plan.trial === "demo-call" ? t.bookDemo : t.startTrial}
        <ArrowRight size={15} strokeWidth={2.25} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
      </Link>

      <ul className="mt-7 space-y-2.5 border-t border-neutral-100 pt-6 text-sm text-neutral-800">
        {limits.map((item, i) => (
          <li key={i} className="flex gap-2.5">
            <Check size={16} strokeWidth={2.5} className="mt-0.5 shrink-0 text-brand" aria-hidden />
            {item}
          </li>
        ))}
      </ul>
      <ul className="mt-5 space-y-2.5 border-t border-neutral-100 pt-5 text-sm">
        {planFeatures.map((id) => {
          const included = planIncludes(plan.id, id);
          return (
            <li
              key={id}
              className={`flex gap-2.5 ${included ? "text-neutral-800" : "text-neutral-400"}`}
            >
              {included ? (
                <Check size={16} strokeWidth={2.5} className="mt-0.5 shrink-0 text-brand" aria-hidden />
              ) : (
                <Minus size={16} strokeWidth={2} className="mt-0.5 shrink-0" aria-hidden />
              )}
              <span>
                {t.features[id]}
                <span className="sr-only"> ({included ? t.included : t.notIncluded})</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

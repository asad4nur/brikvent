"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  ClipboardPaste,
  ListChecks,
  MessagesSquare,
  NotebookPen,
  PackageX,
  PhoneCall,
  PhoneOff,
  ShoppingCart,
  Truck,
  UserRoundCheck,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { Dictionary } from "@/dictionaries/en";

type Side = { icon: LucideIcon; title: string; body: string };

// Icons per problem (pain, fix); the words come from the dictionary.
const icons: [LucideIcon, LucideIcon][] = [
  [MessagesSquare, ListChecks],
  [PackageX, Boxes],
  [PhoneOff, PhoneCall],
  [ClipboardPaste, Truck],
  [NotebookPen, Wallet],
  [ShoppingCart, UserRoundCheck],
];

export default function PainPoints({ t }: { t: Dictionary["painPoints"] }) {
  const problems = t.items.map((item, i) => ({
    module: item.module,
    pain: { icon: icons[i][0], title: item.painTitle, body: item.painBody },
    fix: { icon: icons[i][1], title: item.fixTitle, body: item.fixBody },
  }));
  const [fixed, setFixed] = useState(false);
  const touched = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Flip to "With Brikvent" once the section has been in view for a moment,
  // unless the visitor has already used the switch.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        timer = setTimeout(() => {
          if (!touched.current) setFixed(true);
        }, 1600);
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  const choose = (value: boolean) => {
    touched.current = true;
    setFixed(value);
  };

  return (
    <section
      ref={sectionRef}
      id="problems"
      className="relative bg-neutral-50 py-20 sm:py-24 lg:py-28"
    >
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

          {/* Without / With switch */}
          <div
            role="radiogroup"
            aria-label={t.switchLabel}
            className="relative mx-auto mt-8 grid w-full max-w-sm grid-cols-2 rounded-full border border-neutral-200 bg-white p-1 shadow-sm"
          >
            <span
              aria-hidden
              className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                fixed ? "translate-x-full bg-neutral-950" : "translate-x-0 bg-neutral-200"
              }`}
            />
            <button
              type="button"
              role="radio"
              aria-checked={!fixed}
              onClick={() => choose(false)}
              className={`relative z-10 rounded-full py-2.5 text-sm font-semibold transition-colors ${
                fixed ? "text-neutral-500 hover:text-neutral-900" : "text-neutral-950"
              }`}
            >
              {t.without}
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={fixed}
              onClick={() => choose(true)}
              className={`relative z-10 flex items-center justify-center gap-1.5 rounded-full py-2.5 text-sm font-semibold transition-colors ${
                fixed ? "text-white" : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  fixed ? "bg-lime" : "bg-brand"
                }`}
              />
              {t.with}
            </button>
          </div>
        </div>

        <ul className="reveal mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-5">
          {problems.map((p, i) => (
            <li
              key={p.module}
              className={`relative overflow-hidden rounded-3xl border bg-white p-6 transition-[border-color,box-shadow] duration-500 sm:p-7 ${
                fixed
                  ? "border-brand/25 shadow-[0_18px_50px_-24px_rgba(0,166,62,0.45)]"
                  : "border-neutral-200 shadow-sm"
              }`}
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              {/* Both states share one grid cell so the card never changes height. */}
              <div className="grid">
                <Card side={p.pain} tone="pain" label={t.headache} visible={!fixed} delay={i * 70} />
                <Card
                  side={p.fix}
                  tone="fix"
                  label={p.module}
                  visible={fixed}
                  delay={i * 70}
                />
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:gap-5">
          <p className="text-sm text-neutral-600 sm:text-base">
            {fixed ? (
              <>
                <span className="font-semibold text-neutral-950">{t.fixedStrong}</span> {t.fixedRest}
              </>
            ) : (
              <>
                <span className="font-semibold text-neutral-950">{t.painStrong}</span> {t.painRest}
              </>
            )}
          </p>
          <Link
            href="#how-it-works"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-dark sm:text-base"
          >
            {t.link}
            <ArrowRight
              size={16}
              strokeWidth={2.25}
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Card({
  side,
  tone,
  label,
  visible,
  delay,
}: {
  side: Side;
  tone: "pain" | "fix";
  label: string;
  visible: boolean;
  delay: number;
}) {
  const Icon = side.icon;
  return (
    <div
      aria-hidden={!visible}
      className={`col-start-1 row-start-1 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        visible
          ? "translate-y-0 opacity-100 blur-0"
          : `pointer-events-none opacity-0 blur-[2px] ${
              tone === "pain" ? "-translate-y-3" : "translate-y-3"
            }`
      }`}
      style={{ transitionDelay: `${visible ? delay + 120 : delay}ms` }}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
            tone === "pain"
              ? "bg-red-50 text-red-500"
              : "bg-gradient-to-br from-lime to-brand text-neutral-950"
          }`}
        >
          <Icon size={20} strokeWidth={1.9} aria-hidden />
        </span>
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${
            tone === "pain" ? "bg-neutral-100 text-neutral-500" : "bg-lime/30 text-brand-dark"
          }`}
        >
          {label}
        </span>
      </div>
      <h3
        className={`mt-5 text-lg font-semibold tracking-tight sm:text-xl ${
          tone === "pain" ? "text-neutral-800" : "text-neutral-950"
        }`}
      >
        {side.title}
      </h3>
      <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">{side.body}</p>
    </div>
  );
}

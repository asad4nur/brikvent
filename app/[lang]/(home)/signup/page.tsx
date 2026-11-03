import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Boxes,
  CheckCircle2,
  Clock,
  Headphones,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Zap,
} from "lucide-react";
import { getDictionary, hasLocale, locales } from "@/lib/i18n";
import SignupForm from "@/components/signup-form";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/signup">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang);

  return {
    title: t.signup.title,
    description: t.signup.subtitle,
    alternates: {
      canonical: `/${lang}/signup`,
      languages: { en: "/en/signup", bn: "/bn/signup" },
    },
  };
}

const benefitIcons = [Clock, Boxes, Zap, Headphones];

export default async function SignupPage({ params }: PageProps<"/[lang]/signup">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <main className="relative isolate overflow-hidden bg-gradient-to-b from-[#f8fdf4] via-white to-white py-12 sm:py-16 lg:py-20">
      {/* Visual backdrops & glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-dots opacity-40 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_10%,black,transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-0 -z-10 h-96 w-96 rounded-full bg-brand/10 blur-3xl drift"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-40 -z-10 h-96 w-96 rounded-full bg-lime/25 blur-3xl drift-reverse"
      />

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12 min-[90rem]:px-20">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Value Proposition & Social Proof */}
          <div className="lg:col-span-6 xl:col-span-7 lg:pr-6">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-lime/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-900">
              <Sparkles size={13} className="text-brand" />
              {t.signup.badge}
            </span>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl">
              {t.signup.title}
            </h1>

            <p className="mt-4 text-base leading-relaxed text-neutral-600 sm:text-lg">
              {t.signup.subtitle}
            </p>

            {/* Benefits Grid */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {t.signup.benefits.map((b, idx) => {
                const IconComponent = benefitIcons[idx] || CheckCircle2;
                return (
                  <div
                    key={b.title}
                    className="flex items-start gap-3.5 rounded-2xl border border-neutral-200/70 bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-all hover:border-brand/30 hover:bg-white"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lime/30 text-brand">
                      <IconComponent size={20} strokeWidth={2} />
                    </span>
                    <div>
                      <h2 className="text-sm font-semibold text-neutral-950">
                        {b.title}
                      </h2>
                      <p className="mt-0.5 text-xs leading-relaxed text-neutral-500">
                        {b.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Trust Quote / Assurance */}
            <div className="mt-8 rounded-2xl border border-neutral-200 bg-gradient-to-r from-lime/10 via-brand/5 to-transparent p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-white font-bold text-sm">
                  BV
                </div>
                <div>
                  <div className="flex items-center gap-1 text-emerald-600">
                    <ShieldCheck size={16} />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      {lang === "bn" ? "নিরাপদ ও বিশ্বস্ত" : "Enterprise-Grade Reliability"}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600">
                    {lang === "bn"
                      ? "আপনার ডেটা ১০০% এনক্রিপ্টেড ও সুরক্ষিত। কোনো ক্রেডিট কার্ড বা অগ্রিম পেমেন্টের শর্ত নেই।"
                      : "Zero upfront commitment. No credit card required. Cancel or upgrade anytime."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Signup Form */}
          <div className="lg:col-span-6 xl:col-span-5">
            <SignupForm t={t.signup} lang={lang} />
          </div>
        </div>
      </div>
    </main>
  );
}

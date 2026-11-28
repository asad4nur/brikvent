import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Boxes, CheckCircle2, Clock, Headphones, Sparkles, Zap } from "lucide-react";
import { getSiteDictionary } from "@/lib/site-dictionary";
import { getPricing } from "@/lib/pricing-api";
import { hasLocale, locales } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import SignupForm from "@/components/signup-form";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/signup">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = await getSiteDictionary(lang);

  return {
    title: t.signup.title,
    ...pageMetadata({ lang, path: "/signup", title: t.signup.title, description: t.signup.subtitle }),
  };
}

const benefitIcons = [Clock, Boxes, Zap, Headphones];

export default async function SignupPage({ params }: PageProps<"/[lang]/signup">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getSiteDictionary(lang);
  // Plans a visitor can start a free trial on (a plan without a trial is a demo call instead)
  const { plans } = await getPricing();
  const trialPlans = plans.flatMap((p) =>
    p.trialDays
      ? [{
          code: p.id,
          name: p.name,
          monthly: p.monthly,
          yearly: p.yearly,
          trialDays: p.trialDays,
          popular: Boolean(p.popular),
          freeOrdersPerMonth: p.limits.freeOrdersPerMonth,
        }]
      : [],
  );

  // Form first on every screen size. In the source order the badge comes first, then the form, then
  // the benefits: on phones and tablets that is also the visual order. From lg up, the badge and the
  // sales text sit in the left column, the benefits under them, and the form fills the right column.
  return (
    <main className="bg-white px-4 pb-10 pt-5 sm:bg-neutral-50 sm:px-6 sm:pb-12 sm:pt-8 lg:px-8 lg:pb-16 lg:pt-12 xl:px-12">
      <div className="mx-auto grid max-w-[1120px] items-start gap-6 sm:gap-8 lg:grid-cols-[5fr_7fr] lg:grid-rows-[auto_1fr] lg:gap-x-12 lg:gap-y-8">
        {/* Badge, and the sales text on large screens */}
        <div className="mx-auto w-full max-w-xl lg:col-start-1 lg:row-start-1 lg:max-w-none">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-mint-line bg-mint-wash px-3 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-900">
            <Sparkles size={13} className="text-brand" aria-hidden />
            {t.signup.badge}
          </span>
          <p className="mt-5 hidden text-4xl font-extrabold leading-[1.1] tracking-tight text-deep lg:block xl:text-[2.75rem]">
            {t.signup.salesHeadline}
          </p>
          <p className="mt-4 hidden text-lg leading-relaxed text-neutral-600 lg:block">
            {t.signup.salesDescription}
          </p>
        </div>

        {/* Signup form */}
        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <SignupForm t={t.signup} lang={lang} plans={trialPlans} />
        </div>

        {/* Benefits: under the form on phones and tablets, beside it on large screens */}
        <ul className="mx-auto grid w-full max-w-xl gap-3 sm:grid-cols-2 lg:col-start-1 lg:row-start-2 lg:max-w-none lg:grid-cols-1 lg:gap-5">
          {t.signup.benefits.map((b, idx) => {
            const IconComponent = benefitIcons[idx] || CheckCircle2;
            return (
              <li
                key={b.title}
                className="flex items-start gap-3.5 rounded-2xl border border-neutral-200 bg-white p-4 lg:border-0 lg:bg-transparent lg:p-0"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mint-wash text-brand">
                  <IconComponent size={20} strokeWidth={2} aria-hidden />
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-deep sm:text-base">{b.title}</h2>
                  <p className="mt-0.5 text-sm leading-relaxed text-neutral-600">{b.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}

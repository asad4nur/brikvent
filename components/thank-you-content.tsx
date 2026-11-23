"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Clock } from "lucide-react";
import type { Dictionary } from "@/dictionaries/en";
import { fill, localizeDigits, type Locale } from "@/lib/i18n";
import { getMerchantAdminUrl } from "@/lib/config";

// Seconds on the page before the visitor is sent to the merchant dashboard
export const REDIRECT_SECONDS = 10;

// The signup form leaves these in this tab's sessionStorage (not in the address, so the
// page link carries no personal details).
export const SIGNUP_RESULT_KEY = "brikvent:signup-result";

type SignupResult = { businessName?: string; subdomain?: string; adminEmail?: string };

function readResult(): SignupResult | null {
  try {
    const raw = window.sessionStorage.getItem(SIGNUP_RESULT_KEY);
    return raw ? (JSON.parse(raw) as SignupResult) : null;
  } catch {
    return null;
  }
}

export default function ThankYouContent({ t, lang }: { t: Dictionary["signup"]["success"]; lang: Locale }) {
  const merchantAdminUrl = getMerchantAdminUrl();
  const [result, setResult] = useState<SignupResult | null>(null);
  // Only someone who has just signed up is sent on. A direct visit (or a crawler) stays on the page.
  const [redirecting, setRedirecting] = useState(false);
  const [seconds, setSeconds] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    const stored = readResult();
    // Reading sessionStorage is only possible in the browser, after the first render
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResult(stored);
    setRedirecting(stored !== null);
  }, []);

  useEffect(() => {
    if (!redirecting) return;
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [redirecting]);

  useEffect(() => {
    if (redirecting && seconds <= 0) window.location.href = merchantAdminUrl;
  }, [redirecting, seconds, merchantAdminUrl]);

  const digits = (n: number) => localizeDigits(String(Math.max(n, 0)), lang === "bn" ? "bn-BD" : "en-US");

  return (
    <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-neutral-200/80 bg-white p-8 shadow-2xl sm:p-12">
      <div className="text-center">
        <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-mint-wash text-brand ring-8 ring-mint/15">
          <CheckCircle2 size={36} strokeWidth={2.2} className="text-brand" />
        </div>
        <span className="mt-5 inline-block rounded-full bg-mint-wash px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-900">
          {t.badge}
        </span>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-deep sm:text-3xl">{t.title}</h1>
        <p className="mt-2 text-sm text-neutral-600 sm:text-base">{t.subtitle}</p>
      </div>

      {result && (
        <div className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50/80 p-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            {result.businessName && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">{t.storeNameLabel}</dt>
                <dd className="mt-1 font-semibold text-neutral-900">{result.businessName}</dd>
              </div>
            )}
            {result.subdomain && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">{t.storeUrlLabel}</dt>
                <dd className="mt-1 font-semibold text-brand">{result.subdomain}.brikvent.com</dd>
              </div>
            )}
            {result.adminEmail && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">{t.adminEmailLabel}</dt>
                <dd className="mt-1 font-semibold text-neutral-900">{result.adminEmail}</dd>
              </div>
            )}
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">{t.trialDurationLabel}</dt>
              <dd className="mt-1 inline-flex items-center gap-1.5 font-semibold text-brand">
                <Clock size={14} />
                {t.trialDurationValue}
              </dd>
            </div>
          </dl>
        </div>
      )}

      <div className="mt-8 text-center">
        <a
          href={merchantAdminUrl}
          className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-deep px-6 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-deep-soft"
        >
          <span>{t.ctaButton}</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-mint text-deep transition-transform group-hover:translate-x-1">
            <ArrowRight size={15} strokeWidth={2.5} />
          </span>
        </a>
        {redirecting && (
          <p className="mt-3 text-xs text-neutral-500" aria-live="polite">
            {fill(t.redirectNotice, { n: digits(seconds) })}
          </p>
        )}
        <p className="mt-6 text-xs text-neutral-400">{t.contactSupport}</p>
      </div>
    </div>
  );
}

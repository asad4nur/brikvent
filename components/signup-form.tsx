"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Mail,
} from "lucide-react";
import type { Dictionary } from "@/dictionaries/en";
import { fill, localizeDigits, type Locale } from "@/lib/i18n";
import { useRouter } from "next/navigation";
import { getApiUrl, getMerchantAdminUrl } from "@/lib/config";
import { SIGNUP_RESULT_KEY } from "@/components/thank-you-content";

// What the form needs of a plan; refreshed from the backend when the page opens
export type SignupPlan = {
  code: string;
  name: string;
  monthly: number;
  yearly: number | null;
  trialDays: number;
  popular: boolean;
  freeOrdersPerMonth: number | null;
};

interface SignupFormProps {
  t: Dictionary["signup"];
  lang: Locale;
  plans: SignupPlan[];
}

type LivePlan = {
  code: string;
  name: string;
  isPopular: boolean;
  price: { monthly: number; yearly: number | null };
  trialDays: number | null;
  freeOrdersPerMonth: number | null;
};

// Same address the page uses for its own check of a Facebook page link (the server checks it again)
const FACEBOOK_PAGE_URL = /^https?:\/\/(?:www\.|m\.|web\.|business\.)?(?:facebook\.com|fb\.com|fb\.me)\/[^\s/?#][^\s]*$/i;

// A domain like trendylifestyle.com (also accepts a pasted address with http://, www. or a path)
const DOMAIN_NAME = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/;
const cleanDomain = (v: string) => v.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/[/?#].*$/, "");

const TRIAL_SIGNUP_TRACKED_KEY = "bv_trial_signup_tracked";

// Tells GTM (GTM-N676Z6KP, wired to `trial_signup_complete`) that a signup went
// through. Once per browser session: a sessionStorage flag stops repeats on
// retries, re-renders, back/forward or reload. No personal data goes in the push.
function trackTrialSignupComplete(plan: { code: string; trialDays: number } | undefined) {
  try {
    if (window.sessionStorage.getItem(TRIAL_SIGNUP_TRACKED_KEY)) return;
  } catch {
    // Storage blocked: still push, the redirect follows anyway.
  }
  const w = window as Window & { dataLayer?: Record<string, unknown>[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({
    event: "trial_signup_complete",
    signup_method: "email_otp",
    // The plan the owner picked and the trial length it gives (both are set in the SaaS admin)
    plan: plan ? `${plan.trialDays}_day_free_trial` : "free_trial",
    plan_code: plan?.code,
  });
  try {
    window.sessionStorage.setItem(TRIAL_SIGNUP_TRACKED_KEY, "1");
  } catch {
    // Storage blocked: nothing more to do.
  }
}

// 45 -> "45s", 125 -> "2:05"
const formatWait = (s: number) => (s < 60 ? `${s}s` : `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`);

export default function SignupForm({ t, lang, plans: initialPlans }: SignupFormProps) {
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [brandDomain, setBrandDomain] = useState("");
  const [plans, setPlans] = useState<SignupPlan[]>(initialPlans);
  const [planCode, setPlanCode] = useState(
    () => (initialPlans.find((p) => p.popular) ?? initialPlans[0])?.code ?? "",
  );
  const [facebookUrl, setFacebookUrl] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Email verification (a code is emailed; a verified email gets a single-use token)
  const [step, setStep] = useState<"form" | "verify">("form");
  const [code, setCode] = useState("");
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  // Where the last code went: SMS to the phone (first choice) or the email
  const [sentVia, setSentVia] = useState<{ channel: "sms" | "email"; destination: string }>({ channel: "email", destination: "" });
  const [verifiedPhone, setVerifiedPhone] = useState("");

  // Form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const merchantAdminUrl = getMerchantAdminUrl();
  const apiUrl = getApiUrl();

  const handleBusinessNameChange = (val: string) => {
    setBusinessName(val);
    if (fieldErrors.businessName) {
      setFieldErrors((prev) => ({ ...prev, businessName: "" }));
    }
  };

  // Resend cooldown ticks down once a second
  useEffect(() => {
    if (resendIn <= 0) return;
    const id = setTimeout(() => setResendIn((n) => n - 1), 1000);
    return () => clearTimeout(id);
  }, [resendIn]);

  const readError = (data: { message?: unknown } | null, fallback: string) => {
    const m = data?.message;
    if (Array.isArray(m)) return m.join(", ");
    return (typeof m === "string" && m) || fallback;
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      errs.fullName = t.errors.fullNameRequired;
    }

    if (!businessName.trim() || businessName.trim().length < 2) {
      errs.businessName = t.errors.businessNameRequired;
    }

    if (brandDomain.trim() && !DOMAIN_NAME.test(cleanDomain(brandDomain))) {
      errs.brandDomain = t.errors.brandDomainInvalid;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errs.email = t.errors.emailRequired;
    } else if (!emailRegex.test(email.trim())) {
      errs.email = t.errors.emailInvalid;
    }

    if (!phone.trim()) {
      errs.phone = t.errors.phoneRequired;
    } else if (phone.trim().length < 6) {
      errs.phone = t.errors.phoneInvalid;
    }

    if (!facebookUrl.trim()) {
      errs.facebook = t.errors.facebookRequired;
    } else if (!FACEBOOK_PAGE_URL.test(facebookUrl.trim())) {
      errs.facebook = t.errors.facebookInvalid;
    }

    if (!plans.some((p) => p.code === planCode)) {
      errs.plan = t.errors.planRequired;
    }

    if (!password) {
      errs.password = t.errors.passwordRequired;
    } else if (password.length < 8) {
      errs.password = t.errors.passwordMin;
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Prices are read from the backend again when the page opens, so the owner always sees the
  // plans as they are set right now (the page itself may be up to a minute old). A plan in the
  // link (?plan=growth) is pre-selected.
  useEffect(() => {
    let cancelled = false;
    const wanted = new URLSearchParams(window.location.search).get("plan");
    fetch(`${apiUrl}/public/pricing-plans`, { headers: { Accept: "application/json" } })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((body: { data?: { plans?: LivePlan[] } }) => {
        // Only plans that come with a free trial
        const live = (body.data?.plans ?? [])
          .filter((p) => p.trialDays !== null && p.trialDays > 0)
          .map<SignupPlan>((p) => ({
            code: p.code,
            name: p.name,
            monthly: p.price.monthly,
            yearly: p.price.yearly,
            trialDays: p.trialDays as number,
            popular: p.isPopular,
            freeOrdersPerMonth: p.freeOrdersPerMonth,
          }));
        if (cancelled || live.length === 0) return;
        setPlans(live);
        setPlanCode((current) =>
          live.some((p) => p.code === wanted)
            ? (wanted as string)
            : live.some((p) => p.code === current)
              ? current
              : (live.find((p) => p.popular) ?? live[0]).code,
        );
      })
      .catch(() => {
        // Keep the plans the page came with
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cleanEmail = () => email.trim().toLowerCase();

  // Step 1: ask the server to email a code to this address
  const sendCode = async (): Promise<boolean> => {
    setIsSendingCode(true);
    setFormError(null);
    try {
      const res = await fetch(`${apiUrl}/tenants/public/send-email-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email: cleanEmail(), phone: phone.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 429 && typeof data?.retryAfter === "number") setResendIn(data.retryAfter);
        throw new Error(readError(data, t.verify.sendFailed));
      }
      setResendIn(Number(data.resendAfterSeconds) || 60);
      setSentVia({ channel: data.channel === "sms" ? "sms" : "email", destination: String(data.destination || "") });
      return true;
    } catch (err) {
      setFormError((err instanceof Error && err.message) || t.verify.sendFailed);
      return false;
    } finally {
      setIsSendingCode(false);
    }
  };

  // Final step: create the store. Only works with a verified-email token.
  const createStore = async (token: string) => {
    setIsSubmitting(true);
    setFormError(null);
    try {
      const payload = {
        fullName: fullName.trim(),
        businessName: businessName.trim(),
        email: cleanEmail(),
        phone: phone.trim(),
        password: password,
        planCode,
        ...(brandDomain.trim() && { brandDomain: cleanDomain(brandDomain) }),
        facebookPageUrl: facebookUrl.trim(),
        verificationToken: token,
      };

      const res = await fetch(`${apiUrl}/tenants/public/start-trial`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        // A problem with the details (e.g. store URL taken): go back and fix it.
        // The token is kept, so the email does not need verifying again.
        setStep("form");
        throw new Error(readError(data, t.errors.genericError));
      }
      // The email code was verified (start-trial only accepts a verified token)
      // and the store exists: record it before the thank-you page redirect starts.
      trackTrialSignupComplete(plans.find((p) => p.code === planCode));
      setVerificationToken(null);
      // Go to the thank-you page (its own address, for the ad conversion). The store details
      // are handed over in this tab's sessionStorage, so they are not in the address.
      try {
        window.sessionStorage.setItem(
          SIGNUP_RESULT_KEY,
          JSON.stringify({
            businessName: data.data?.businessName || businessName.trim(),
            subdomain: data.data?.subdomain,
            adminEmail: data.data?.adminEmail || cleanEmail(),
          }),
        );
      } catch {
        // The page still works without them
      }
      router.push(`/${lang}/thank-you`);
      return;
    } catch (err) {
      setFormError((err instanceof Error && err.message) || t.errors.genericError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!validateForm()) return;

    // Already verified this exact email: no need to send another code
    if (verificationToken && verifiedEmail === cleanEmail() && verifiedPhone === phone.trim()) {
      await createStore(verificationToken);
      return;
    }

    setCode("");
    if (await sendCode()) setStep("verify");
  };

  // Step 2: exchange the emailed code for a token, then create the store
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!/^\d{6}$/.test(code)) {
      setFormError(t.verify.codeRequired);
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/tenants/public/verify-email-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email: cleanEmail(), code }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.verificationToken) {
        throw new Error(readError(data, t.verify.verifyFailed));
      }
      setVerificationToken(data.verificationToken);
      setVerifiedEmail(cleanEmail());
      setVerifiedPhone(phone.trim());
      setIsSubmitting(false);
      await createStore(data.verificationToken);
    } catch (err) {
      setFormError((err instanceof Error && err.message) || t.verify.verifyFailed);
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendIn > 0 || isSendingCode) return;
    setCode("");
    await sendCode();
  };

  // SUCCESS STATE
  // EMAIL VERIFICATION STATE
  if (step === "verify") {
    return (
      <div className="mx-auto w-full max-w-xl">
        <div className="overflow-hidden rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-xl sm:p-8 md:p-10">
          <div className="text-center">
            <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-mint-wash text-brand ring-8 ring-mint/15">
              <Mail size={26} strokeWidth={2.2} />
            </div>
            <h2 className="mt-4 text-xl font-bold tracking-tight text-deep sm:text-2xl">{sentVia.channel === "sms" ? t.verify.titleSms : t.verify.title}</h2>
            <p className="mt-1 text-sm text-neutral-500">{sentVia.channel === "sms" ? fill(t.verify.subtitleSms, { phone: sentVia.destination }) : fill(t.verify.subtitle, { email: cleanEmail() })}</p>
          </div>

          {formError && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-600" />
              <div className="leading-snug">{formError}</div>
            </div>
          )}

          <form onSubmit={handleVerify} className="mt-6 space-y-4" noValidate>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700">
                {t.verify.codeLabel}
              </label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                autoFocus
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                  if (formError) setFormError(null);
                }}
                placeholder={t.verify.codePlaceholder}
                className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-3 text-center text-2xl font-semibold tracking-[0.5em] text-neutral-900 transition-colors placeholder:text-neutral-300 focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
              <p className="mt-2 text-xs text-neutral-400">{sentVia.channel === "sms" ? t.verify.codeSentNoteSms : t.verify.codeSentNote}</p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || code.length !== 6}
              className="group relative flex w-full items-center justify-center gap-2 rounded-full bg-deep py-3.5 px-6 text-sm font-semibold text-white shadow-lg transition-all hover:bg-deep-soft disabled:cursor-not-allowed disabled:opacity-70 sm:text-base"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin text-lime" />
                  <span>{t.verify.verifyingButton}</span>
                </>
              ) : (
                <>
                  <span>{t.verify.verifyButton}</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-mint text-deep transition-transform group-hover:translate-x-1">
                    <ArrowRight size={14} strokeWidth={2.5} />
                  </span>
                </>
              )}
            </button>

            <div className="flex flex-col items-center gap-2 pt-1 text-xs sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={handleResend}
                disabled={resendIn > 0 || isSendingCode}
                className="font-semibold text-brand hover:underline disabled:cursor-not-allowed disabled:text-neutral-400 disabled:no-underline"
              >
                {isSendingCode
                  ? t.verify.sendingButton
                  : resendIn > 0
                    ? fill(t.verify.resendIn, { n: localizeDigits(formatWait(resendIn), lang === "bn" ? "bn-BD" : "en-US") })
                    : t.verify.resend}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("form");
                  setFormError(null);
                  setCode("");
                }}
                className="text-neutral-500 hover:text-neutral-800 hover:underline"
              >
                {t.verify.changeEmail}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ACTIVE FORM STATE
  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="overflow-hidden rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-xl sm:p-8 md:p-10">
        <div className="mb-6">
          <h2 className="text-xl font-bold tracking-tight text-deep sm:text-2xl">
            {t.form.title}
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            {t.form.subtitle}
          </p>
        </div>

        {formError && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-600" />
            <div className="leading-snug">{formError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700">
              {t.form.fullNameLabel} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (fieldErrors.fullName) setFieldErrors((p) => ({ ...p, fullName: "" }));
              }}
              placeholder={t.form.fullNamePlaceholder}
              className={`mt-1.5 w-full rounded-xl border bg-neutral-50/50 px-4 py-2.5 text-sm text-neutral-900 transition-colors placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 ${
                fieldErrors.fullName
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "border-neutral-200 focus:border-brand focus:ring-brand/20"
              }`}
            />
            {fieldErrors.fullName && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.fullName}</p>
            )}
          </div>

          {/* Business Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700">
              {t.form.businessNameLabel} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => handleBusinessNameChange(e.target.value)}
              placeholder={t.form.businessNamePlaceholder}
              className={`mt-1.5 w-full rounded-xl border bg-neutral-50/50 px-4 py-2.5 text-sm text-neutral-900 transition-colors placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 ${
                fieldErrors.businessName
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "border-neutral-200 focus:border-brand focus:ring-brand/20"
              }`}
            />
            {fieldErrors.businessName && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.businessName}</p>
            )}
          </div>

          {/* Brand domain (optional): kept as a domain that is not verified yet */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700">
              {t.form.brandDomainLabel}
            </label>
            <input
              type="text"
              inputMode="url"
              autoCapitalize="none"
              value={brandDomain}
              onChange={(e) => {
                setBrandDomain(e.target.value);
                if (fieldErrors.brandDomain) setFieldErrors((p) => ({ ...p, brandDomain: "" }));
              }}
              placeholder={t.form.brandDomainPlaceholder}
              className={`mt-1.5 w-full rounded-xl border bg-neutral-50/50 px-4 py-2.5 text-sm text-neutral-900 lowercase transition-colors placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 ${
                fieldErrors.brandDomain
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "border-neutral-200 focus:border-brand focus:ring-brand/20"
              }`}
            />
            {fieldErrors.brandDomain ? (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.brandDomain}</p>
            ) : (
              <p className="mt-1 text-xs text-neutral-400">{t.form.brandDomainHint}</p>
            )}
          </div>

          {/* Plan picker: live prices from the backend */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700">
              {t.form.planLabel} <span className="text-red-500">*</span>
            </label>
            <select
              value={planCode}
              onChange={(e) => {
                setPlanCode(e.target.value);
                if (fieldErrors.plan) setFieldErrors((p) => ({ ...p, plan: "" }));
              }}
              className={`mt-1.5 w-full rounded-xl border bg-neutral-50/50 px-4 py-2.5 text-sm text-neutral-900 transition-colors focus:bg-white focus:outline-none focus:ring-2 ${
                fieldErrors.plan
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "border-neutral-200 focus:border-brand focus:ring-brand/20"
              }`}
            >
              {plans.map((plan) => (
                <option key={plan.code} value={plan.code}>
                  {`${plan.name} - ৳${localizeDigits(plan.monthly.toLocaleString("en-US"), lang)}${t.form.planPerMonth}`}
                  {plan.freeOrdersPerMonth === null
                    ? ` - ${t.form.planOrdersUnlimited}`
                    : ` - ${fill(t.form.planOrders, { n: localizeDigits(plan.freeOrdersPerMonth.toLocaleString("en-US"), lang) })}`}
                </option>
              ))}
            </select>
            {plans.length === 0 && <p className="mt-1 text-xs text-red-600">{t.form.planLoadFailed}</p>}
            {fieldErrors.plan ? (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.plan}</p>
            ) : (
              <p className="mt-1 text-xs text-neutral-400">{t.form.planHint}</p>
            )}
          </div>

          {/* Facebook page (required) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700">
              {t.form.facebookLabel} <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              inputMode="url"
              value={facebookUrl}
              onChange={(e) => {
                setFacebookUrl(e.target.value);
                if (fieldErrors.facebook) setFieldErrors((p) => ({ ...p, facebook: "" }));
              }}
              placeholder={t.form.facebookPlaceholder}
              className={`mt-1.5 w-full rounded-xl border bg-neutral-50/50 px-4 py-2.5 text-sm text-neutral-900 transition-colors placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 ${
                fieldErrors.facebook
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "border-neutral-200 focus:border-brand focus:ring-brand/20"
              }`}
            />
            {fieldErrors.facebook ? (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.facebook}</p>
            ) : (
              <p className="mt-1 text-xs text-neutral-400">{t.form.facebookHint}</p>
            )}
            <p className="mt-2 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900">
              <AlertCircle size={14} className="mt-0.5 shrink-0" aria-hidden />
              {t.form.phoneNote}
            </p>
          </div>

          {/* Email & Phone Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700">
                {t.form.emailLabel} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (verificationToken && e.target.value.trim().toLowerCase() !== verifiedEmail) {
                    setVerificationToken(null);
                  }
                  if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: "" }));
                }}
                placeholder={t.form.emailPlaceholder}
                className={`mt-1.5 w-full rounded-xl border bg-neutral-50/50 px-4 py-2.5 text-sm text-neutral-900 transition-colors placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 ${
                  fieldErrors.email
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : "border-neutral-200 focus:border-brand focus:ring-brand/20"
                }`}
              />
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700">
                {t.form.phoneLabel} <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (fieldErrors.phone) setFieldErrors((p) => ({ ...p, phone: "" }));
                }}
                placeholder={t.form.phonePlaceholder}
                className={`mt-1.5 w-full rounded-xl border bg-neutral-50/50 px-4 py-2.5 text-sm text-neutral-900 transition-colors placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 ${
                  fieldErrors.phone
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : "border-neutral-200 focus:border-brand focus:ring-brand/20"
                }`}
              />
              {fieldErrors.phone && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>
              )}
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700">
              {t.form.passwordLabel} <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1.5">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: "" }));
                }}
                placeholder={t.form.passwordPlaceholder}
                className={`w-full rounded-xl border bg-neutral-50/50 py-2.5 pl-4 pr-11 text-sm text-neutral-900 transition-colors placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 ${
                  fieldErrors.password
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : "border-neutral-200 focus:border-brand focus:ring-brand/20"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                aria-label="Toggle password visibility"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-700"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {fieldErrors.password ? (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
            ) : (
              <p className="mt-1 text-xs text-neutral-400">{t.form.passwordHint}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || isSendingCode}
              className="group relative flex w-full items-center justify-center gap-2 rounded-full bg-deep py-3.5 px-6 text-sm font-semibold text-white shadow-lg transition-all hover:bg-deep-soft disabled:cursor-not-allowed disabled:opacity-70 sm:text-base"
            >
              {isSubmitting || isSendingCode ? (
                <>
                  <Loader2 size={18} className="animate-spin text-lime" />
                  <span>{isSendingCode ? t.verify.sendingButton : t.form.submittingButton}</span>
                </>
              ) : (
                <>
                  <span>{verificationToken && verifiedEmail === cleanEmail() && verifiedPhone === phone.trim() ? t.form.submitButton : t.verify.continueButton}</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-mint text-deep transition-transform group-hover:translate-x-1">
                    <ArrowRight size={14} strokeWidth={2.5} />
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Terms & Privacy */}
          <p className="text-center text-[11px] leading-relaxed text-neutral-400 sm:text-xs">
            {t.form.termsAgreement}{" "}
            <Link href={`/${lang}/terms`} className="font-medium text-neutral-600 underline hover:text-neutral-900">
              {t.form.termsLink}
            </Link>{" "}
            &amp;{" "}
            <Link href={`/${lang}/privacy-policy`} className="font-medium text-neutral-600 underline hover:text-neutral-900">
              {t.form.privacyLink}
            </Link>
            .
          </p>

          {/* Already have store / login */}
          <div className="border-t border-neutral-100 pt-3 text-center text-xs text-neutral-500">
            {t.form.alreadyHaveAccount}{" "}
            <a
              href={merchantAdminUrl}
              className="font-semibold text-brand hover:underline"
            >
              {t.form.loginLink}
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
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

type SubdomainState = "idle" | "checking" | "available" | "taken" | "invalid";

export default function SignupForm({ t, lang, plans: initialPlans }: SignupFormProps) {
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [storeSlug, setStoreSlug] = useState("");
  const [slugManuallyChanged, setSlugManuallyChanged] = useState(false);
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

  // Subdomain validation
  const [subdomainState, setSubdomainState] = useState<SubdomainState>("idle");
  const [subdomainMessage, setSubdomainMessage] = useState("");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const merchantAdminUrl = getMerchantAdminUrl();
  const apiUrl = getApiUrl();

  // Helper to sanitize slug
  const sanitizeSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 30);
  };

  // Check subdomain availability with backend
  const checkSubdomain = async (slug: string) => {
    const trimmed = slug.trim().toLowerCase();
    if (!trimmed || trimmed.length < 3) {
      setSubdomainState("idle");
      setSubdomainMessage("");
      return;
    }

    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(trimmed)) {
      setSubdomainState("invalid");
      setSubdomainMessage(t.form.subdomainInvalid);
      return;
    }

    setSubdomainState("checking");
    setSubdomainMessage(t.form.checkingSubdomain);

    try {
      const res = await fetch(
        `${apiUrl}/tenants/public/check-subdomain?subdomain=${encodeURIComponent(trimmed)}`,
        {
          headers: { Accept: "application/json" },
        },
      );
      const data = await res.json();

      if (res.ok && data.available) {
        setSubdomainState("available");
        setSubdomainMessage(t.form.subdomainAvailable);
      } else {
        setSubdomainState("taken");
        setSubdomainMessage(data.message || t.form.subdomainUnavailable);
      }
    } catch {
      // If network fails during check, don't hard block typing
      setSubdomainState("idle");
      setSubdomainMessage("");
    }
  };

  // Auto-generate slug when businessName changes unless user typed slug manually
  const handleBusinessNameChange = (val: string) => {
    setBusinessName(val);
    if (fieldErrors.businessName) {
      setFieldErrors((prev) => ({ ...prev, businessName: "" }));
    }

    if (!slugManuallyChanged) {
      const autoSlug = sanitizeSlug(val);
      setStoreSlug(autoSlug);

      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (autoSlug.length >= 3) {
        debounceTimerRef.current = setTimeout(() => {
          checkSubdomain(autoSlug);
        }, 350);
      } else {
        setSubdomainState("idle");
        setSubdomainMessage("");
      }
    }
  };

  const handleSlugChange = (val: string) => {
    setSlugManuallyChanged(true);
    const sanitized = sanitizeSlug(val);
    setStoreSlug(sanitized);
    if (fieldErrors.storeSlug) {
      setFieldErrors((prev) => ({ ...prev, storeSlug: "" }));
    }

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    if (sanitized.length >= 3) {
      debounceTimerRef.current = setTimeout(() => {
        checkSubdomain(sanitized);
      }, 350);
    } else {
      setSubdomainState("idle");
      setSubdomainMessage("");
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

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  const validateForm = () => {
    const errs: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      errs.fullName = t.errors.fullNameRequired;
    }

    if (!businessName.trim() || businessName.trim().length < 2) {
      errs.businessName = t.errors.businessNameRequired;
    }

    const cleanSlug = storeSlug.trim().toLowerCase();
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!cleanSlug) {
      errs.storeSlug = t.errors.storeSlugRequired;
    } else if (cleanSlug.length < 3 || cleanSlug.length > 30 || !slugRegex.test(cleanSlug)) {
      errs.storeSlug = t.errors.storeSlugInvalid;
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
        body: JSON.stringify({ email: cleanEmail() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 429 && typeof data?.retryAfter === "number") setResendIn(data.retryAfter);
        throw new Error(readError(data, t.verify.sendFailed));
      }
      setResendIn(Number(data.resendAfterSeconds) || 60);
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
        storeSlug: storeSlug.trim().toLowerCase(),
        email: cleanEmail(),
        phone: phone.trim(),
        password: password,
        planCode,
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
      setVerificationToken(null);
      // Go to the thank-you page (its own address, for the ad conversion). The store details
      // are handed over in this tab's sessionStorage, so they are not in the address.
      try {
        window.sessionStorage.setItem(
          SIGNUP_RESULT_KEY,
          JSON.stringify({
            businessName: data.data?.businessName || businessName.trim(),
            subdomain: data.data?.subdomain || storeSlug.trim().toLowerCase(),
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

    if (subdomainState === "taken" || subdomainState === "invalid") {
      setFieldErrors((prev) => ({
        ...prev,
        storeSlug: subdomainMessage || t.errors.storeSlugInvalid,
      }));
      return;
    }

    // Already verified this exact email: no need to send another code
    if (verificationToken && verifiedEmail === cleanEmail()) {
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
            <h2 className="mt-4 text-xl font-bold tracking-tight text-deep sm:text-2xl">{t.verify.title}</h2>
            <p className="mt-1 text-sm text-neutral-500">{fill(t.verify.subtitle, { email: cleanEmail() })}</p>
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
              <p className="mt-2 text-xs text-neutral-400">{t.verify.codeSentNote}</p>
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
                    ? fill(t.verify.resendIn, { n: localizeDigits(String(resendIn), lang === "bn" ? "bn-BD" : "en-US") })
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

          {/* Store Subdomain / URL */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700">
              {t.form.storeSlugLabel} <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1.5 flex items-center">
              <input
                type="text"
                value={storeSlug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder={t.form.storeSlugPlaceholder}
                className={`w-full rounded-xl border bg-neutral-50/50 py-2.5 pl-4 pr-32 text-sm text-neutral-900 lowercase transition-colors placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 ${
                  fieldErrors.storeSlug || subdomainState === "taken" || subdomainState === "invalid"
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : subdomainState === "available"
                      ? "border-mint focus:border-brand focus:ring-mint/30"
                      : "border-neutral-200 focus:border-brand focus:ring-brand/20"
                }`}
              />
              <span className="pointer-events-none absolute right-3 text-xs font-medium text-neutral-500">
                .brikvent.com
              </span>
            </div>

            {/* Subdomain validation feedback */}
            <div className="mt-1.5 flex items-center gap-1.5 text-xs">
              {subdomainState === "checking" && (
                <span className="inline-flex items-center gap-1 text-neutral-500">
                  <Loader2 size={12} className="animate-spin text-neutral-400" />
                  {subdomainMessage}
                </span>
              )}
              {subdomainState === "available" && (
                <span className="inline-flex items-center gap-1 font-medium text-brand">
                  <CheckCircle2 size={13} className="text-brand" />
                  &quot;{storeSlug}.brikvent.com&quot; {subdomainMessage}
                </span>
              )}
              {(subdomainState === "taken" || subdomainState === "invalid") && (
                <span className="inline-flex items-center gap-1 font-medium text-red-600">
                  <AlertCircle size={13} className="text-red-500" />
                  {subdomainMessage}
                </span>
              )}
              {subdomainState === "idle" && (
                <span className="text-neutral-400">{t.form.storeSlugHint}</span>
              )}
            </div>
            {fieldErrors.storeSlug && subdomainState !== "taken" && subdomainState !== "invalid" && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.storeSlug}</p>
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
                  <span>{verificationToken && verifiedEmail === cleanEmail() ? t.form.submitButton : t.verify.continueButton}</span>
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

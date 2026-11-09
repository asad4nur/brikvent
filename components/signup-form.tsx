"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Boxes,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  Headphones,
  Loader2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
} from "lucide-react";
import type { Dictionary } from "@/dictionaries/en";
import { fill, localizeDigits, type Locale } from "@/lib/i18n";
import { getApiUrl, getMerchantAdminUrl } from "@/lib/config";

interface SignupFormProps {
  t: Dictionary["signup"];
  lang: Locale;
}

type SubdomainState = "idle" | "checking" | "available" | "taken" | "invalid";

export default function SignupForm({ t, lang }: SignupFormProps) {
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [storeSlug, setStoreSlug] = useState("");
  const [slugManuallyChanged, setSlugManuallyChanged] = useState(false);
  const [businessType, setBusinessType] = useState<"retail" | "online" | "both">("both");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Subdomain validation
  const [subdomainState, setSubdomainState] = useState<SubdomainState>("idle");
  const [subdomainMessage, setSubdomainMessage] = useState("");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successResult, setSuccessResult] = useState<any | null>(null);
  const [countdown, setCountdown] = useState(5);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

  // Countdown timer for automatic redirect on success
  useEffect(() => {
    if (!successResult) return;

    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
          window.location.href = merchantAdminUrl;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [successResult, merchantAdminUrl]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
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

    if (!password) {
      errs.password = t.errors.passwordRequired;
    } else if (password.length < 8) {
      errs.password = t.errors.passwordMin;
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!validateForm()) {
      return;
    }

    if (subdomainState === "taken" || subdomainState === "invalid") {
      setFieldErrors((prev) => ({
        ...prev,
        storeSlug: subdomainMessage || t.errors.storeSlugInvalid,
      }));
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        fullName: fullName.trim(),
        businessName: businessName.trim(),
        storeSlug: storeSlug.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password: password,
        businessType: businessType,
      };

      const res = await fetch(`${apiUrl}/tenants/public/start-trial`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMsg =
          data.message || (Array.isArray(data.messages) ? data.messages.join(", ") : null);
        throw new Error(errorMsg || t.errors.genericError);
      }

      setSuccessResult(data);
    } catch (err: any) {
      setFormError(err.message || t.errors.genericError);
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS STATE
  if (successResult) {
    const data = successResult.data || {};
    return (
      <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-neutral-200/80 bg-white p-8 shadow-2xl sm:p-12">
        <div className="text-center">
          <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-mint-wash text-brand ring-8 ring-mint/15">
            <CheckCircle2 size={36} strokeWidth={2.2} className="text-brand" />
          </div>

          <span className="mt-5 inline-block rounded-full bg-mint-wash px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-900">
            {t.success.badge}
          </span>

          <h2 className="mt-3 text-2xl font-bold tracking-tight text-deep sm:text-3xl">
            {t.success.title}
          </h2>
          <p className="mt-2 text-sm text-neutral-600 sm:text-base">
            {t.success.subtitle}
          </p>
        </div>

        {/* Details Card */}
        <div className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50/80 p-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                {t.success.storeNameLabel}
              </dt>
              <dd className="mt-1 font-semibold text-neutral-900">
                {data.businessName || businessName}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                {t.success.storeUrlLabel}
              </dt>
              <dd className="mt-1 font-semibold text-brand">
                {data.subdomain ? `${data.subdomain}.brikvent.com` : `${storeSlug}.brikvent.com`}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                {t.success.adminEmailLabel}
              </dt>
              <dd className="mt-1 font-semibold text-neutral-900">
                {data.adminEmail || email}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                {t.success.trialDurationLabel}
              </dt>
              <dd className="mt-1 inline-flex items-center gap-1.5 font-semibold text-brand">
                <Clock size={14} />
                {t.success.trialDurationValue}
              </dd>
            </div>
          </dl>
        </div>

        {/* Action Button & Countdown */}
        <div className="mt-8 text-center">
          <a
            href={merchantAdminUrl}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-deep py-3.5 px-6 text-base font-semibold text-white shadow-lg transition-all hover:bg-deep-soft"
          >
            <span>{t.success.ctaButton}</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-mint text-deep transition-transform group-hover:translate-x-1">
              <ArrowRight size={15} strokeWidth={2.5} />
            </span>
          </a>

          <p className="mt-3 text-xs text-neutral-500">
            {fill(t.success.redirectNotice, {
              n: localizeDigits(String(countdown), lang === "bn" ? "bn-BD" : "en-US"),
            })}
          </p>

          <p className="mt-6 text-xs text-neutral-400">
            {t.success.contactSupport}
          </p>
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

          {/* Business Type Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700">
              {t.form.businessTypeLabel}
            </label>
            <div className="mt-1.5 grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setBusinessType("both")}
                className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all ${
                  businessType === "both"
                    ? "border-brand bg-brand/5 text-deep font-semibold shadow-sm ring-1 ring-brand/30"
                    : "border-neutral-200 bg-neutral-50/50 text-neutral-600 hover:bg-neutral-100/60"
                }`}
              >
                <Boxes size={18} className={businessType === "both" ? "text-brand" : "text-neutral-400"} />
                <span className="mt-1 text-[11px] leading-tight sm:text-xs">
                  {t.form.businessTypeOptions.both}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setBusinessType("online")}
                className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all ${
                  businessType === "online"
                    ? "border-brand bg-brand/5 text-deep font-semibold shadow-sm ring-1 ring-brand/30"
                    : "border-neutral-200 bg-neutral-50/50 text-neutral-600 hover:bg-neutral-100/60"
                }`}
              >
                <ShoppingBag size={18} className={businessType === "online" ? "text-brand" : "text-neutral-400"} />
                <span className="mt-1 text-[11px] leading-tight sm:text-xs">
                  {t.form.businessTypeOptions.online}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setBusinessType("retail")}
                className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all ${
                  businessType === "retail"
                    ? "border-brand bg-brand/5 text-deep font-semibold shadow-sm ring-1 ring-brand/30"
                    : "border-neutral-200 bg-neutral-50/50 text-neutral-600 hover:bg-neutral-100/60"
                }`}
              >
                <Store size={18} className={businessType === "retail" ? "text-brand" : "text-neutral-400"} />
                <span className="mt-1 text-[11px] leading-tight sm:text-xs">
                  {t.form.businessTypeOptions.retail}
                </span>
              </button>
            </div>
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
              disabled={isSubmitting}
              className="group relative flex w-full items-center justify-center gap-2 rounded-full bg-deep py-3.5 px-6 text-sm font-semibold text-white shadow-lg transition-all hover:bg-deep-soft disabled:cursor-not-allowed disabled:opacity-70 sm:text-base"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin text-lime" />
                  <span>{t.form.submittingButton}</span>
                </>
              ) : (
                <>
                  <span>{t.form.submitButton}</span>
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

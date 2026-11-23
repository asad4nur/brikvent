import { getDictionary, type Dictionary, type Locale } from "@/lib/i18n";
import { getPricing } from "@/lib/pricing-api";

/** The text of the pages that mention the free trial uses {trialDays} where the number goes. */
const PLACEHOLDER = /\{trialDays\}/g;

function fillTrialDays<T>(value: T, days: string): T {
  if (typeof value === "string") return value.replace(PLACEHOLDER, days) as T;
  if (Array.isArray(value)) return value.map((v) => fillTrialDays(v, days)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, fillTrialDays(v, days)])) as T;
  }
  return value;
}

/**
 * The dictionary with the free trial length filled in. The number is the trial of the plan new visitors
 * sign up on, from the backend (the SaaS admin controls it), written in the page language.
 * Use this on every page that shows a "{trialDays}-day free trial" text instead of getDictionary.
 */
export async function getSiteDictionary(locale: Locale): Promise<Dictionary> {
  const dictionary = getDictionary(locale);
  const { trialDays } = await getPricing();
  return fillTrialDays(dictionary, trialDays.toLocaleString(dictionary.formats.number));
}

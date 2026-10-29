import bn from "@/dictionaries/bn";
import en, { type Dictionary } from "@/dictionaries/en";

export const locales = ["en", "bn"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

const dictionaries: Record<Locale, Dictionary> = { en, bn };

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

export const getDictionary = (locale: Locale) => dictionaries[locale];

// Replaces {name} placeholders: fill("{n} outlets", { n: 3 }) → "3 outlets".
export function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

export type { Dictionary };

const BANGLA_DIGITS = "০১২৩৪৫৬৭৮৯";

// Swaps 0-9 for Bangla digits when the number locale is Bangla, for numbers
// that arrive as ready-made strings (e.g. "৳1,999").
export const localizeDigits = (text: string, numberLocale: string) =>
  numberLocale.startsWith("bn") ? text.replace(/\d/g, (d) => BANGLA_DIGITS[Number(d)]) : text;

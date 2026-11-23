import { notFound } from "next/navigation";
import { hasLocale } from "@/lib/i18n";
import { getSiteDictionary } from "@/lib/site-dictionary";
import { lowestMonthlyPrice } from "@/lib/pricing";
import { getPricing } from "@/lib/pricing-api";
import Comparison from "./_sections/Comparison";
import Faq from "./_sections/Faq";
import FinalCta from "./_sections/FinalCta";
import Hero from "./_sections/Hero";
import LocalFeatures from "./_sections/LocalFeatures";
import Modules from "./_sections/Modules";
import OrderJourney from "./_sections/OrderJourney";
import PainPoints from "./_sections/PainPoints";
import Pricing from "./_sections/Pricing";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  // Plans, prices and the trial length come from the backend (cached for a minute), so the SaaS admin controls this page
  const t = await getSiteDictionary(lang);
  const { plans } = await getPricing();

  return (
    <main>
      <Hero t={t.hero} numberLocale={t.formats.number} />
      <PainPoints t={t.painPoints} lang={lang} />
      <OrderJourney t={t.journey} />
      <Modules t={t.modules} />
      <LocalFeatures t={t.local} numberLocale={t.formats.number} />
      <Pricing t={{ ...t.pricing, numberLocale: t.formats.number }} plans={plans} />
      <Comparison t={t.comparison} numberLocale={t.formats.number} />
      <Faq t={t.faq} />
      <FinalCta t={t.cta} numberLocale={t.formats.number} lowestPrice={lowestMonthlyPrice(plans)} />
    </main>
  );
}

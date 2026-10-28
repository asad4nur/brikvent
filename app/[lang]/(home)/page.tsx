import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/lib/i18n";
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
  const t = getDictionary(lang);

  return (
    <main>
      <Hero t={t.hero} numberLocale={t.formats.number} />
      <PainPoints t={t.painPoints} />
      <OrderJourney t={t.journey} />
      <Modules t={t.modules} />
      <LocalFeatures t={t.local} />
      <Pricing t={{ ...t.pricing, numberLocale: t.formats.number }} />
      <Comparison t={t.comparison} numberLocale={t.formats.number} />
      <Faq t={t.faq} />
      <FinalCta t={t.cta} numberLocale={t.formats.number} />
    </main>
  );
}

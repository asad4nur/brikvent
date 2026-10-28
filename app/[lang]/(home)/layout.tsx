import { notFound } from "next/navigation";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import ScrollReveal from "@/components/scroll-reveal";
import { getDictionary, hasLocale } from "@/lib/i18n";

export default async function HomeLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <>
      <Navbar t={t.nav} lang={lang} />
      {children}
      <Footer t={t.footer} products={t.nav.productsList} lang={lang} />
      <ScrollReveal />
    </>
  );
}

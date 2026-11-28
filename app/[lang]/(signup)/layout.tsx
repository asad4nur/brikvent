import { notFound } from "next/navigation";
import SignupFooter from "@/components/signup-footer";
import SignupHeader from "@/components/signup-header";
import { getDictionary, hasLocale } from "@/lib/i18n";

// The signup pages (/signup and /free-trial) keep a small header and footer so nothing pulls a
// visitor away from the form. The rest of the site keeps the full ones (see (home)/layout.tsx).
export default async function SignupLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <>
      <SignupHeader t={t.nav} lang={lang} />
      {children}
      <SignupFooter t={t.footer} whatsapp={t.whatsapp} lang={lang} />
    </>
  );
}

import { siWhatsapp } from "simple-icons";
import type { Dictionary } from "@/dictionaries/en";
import { company } from "@/lib/company";

// Floating chat button, bottom right on every page. Opens WhatsApp (app on
// phones, WhatsApp Web on desktop) with a greeting already typed in.
export default function WhatsAppButton({ t }: { t: Dictionary["whatsapp"] }) {
  const href = `${company.whatsappHref}?text=${encodeURIComponent(t.message)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.label}
      className="group fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-5 z-50 flex items-center gap-3 sm:bottom-6 sm:right-6"
    >
      <span className="pointer-events-none hidden translate-x-2 rounded-2xl bg-white px-4 py-2.5 text-right opacity-0 shadow-[0_12px_32px_-12px_rgba(10,10,10,0.35)] ring-1 ring-neutral-200 transition-[opacity,transform] duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 sm:block">
        <span className="block text-sm font-semibold text-neutral-950">{t.label}</span>
        <span className="block text-xs text-neutral-500">{t.hint}</span>
      </span>
      <span className="relative flex h-14 w-14 items-center justify-center">
        <span className="ping-soft absolute inset-0 rounded-full bg-[#25d366]/50 [animation-duration:2.4s]" />
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_14px_30px_-10px_rgba(37,211,102,0.8)] transition-transform duration-300 group-hover:scale-110">
          <svg viewBox="0 0 24 24" width={28} height={28} fill="currentColor" aria-hidden>
            <path d={siWhatsapp.path} />
          </svg>
        </span>
      </span>
    </a>
  );
}

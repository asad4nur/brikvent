"use client";

import { useEffect, useState } from "react";
import { Boxes, Check, MapPin, SendHorizontal } from "lucide-react";
import ProductArt from "@/components/product-art";

type Message =
  | { from: "customer" | "seller"; kind: "text"; text: string }
  | { from: "customer"; kind: "image"; text: string }
  | { from: "customer"; kind: "location"; text: string }
  | { from: "system"; kind: "stock" | "order"; text: string };

type Thread = {
  channel: "Messenger" | "WhatsApp";
  name: string;
  initials: string;
  context: string;
  messages: Message[];
};

const threads: Thread[] = [
  {
    channel: "Messenger",
    name: "Rakib Hasan",
    initials: "RH",
    context: "নীল পাঞ্জাবি পোস্ট থেকে",
    messages: [
      { from: "customer", kind: "text", text: "আসসালামু আলাইকুম। এই নীল পাঞ্জাবিটা কি এখনো আছে?" },
      { from: "seller", kind: "text", text: "ওয়ালাইকুম আসসালাম! জি ভাইয়া, আছে 😊 M, L আর XL সাইজ পাবেন। কোন সাইজ লাগবে?" },
      { from: "customer", kind: "text", text: "L সাইজ। দাম কত?" },
      { from: "system", kind: "stock", text: "লাইভ স্টক · নীল পাঞ্জাবি L — ৪টি আছে" },
      { from: "seller", kind: "text", text: "L সাইজ ৳১,৮৫০, ঢাকার ভেতরে ডেলিভারি ফ্রি। অর্ডার করে দিই?" },
      { from: "customer", kind: "text", text: "জি করে দেন। লোকেশন দিচ্ছি।" },
      { from: "customer", kind: "location", text: "মিরপুর ১০, রোড ৬, বাসা ১২, ঢাকা" },
      { from: "seller", kind: "text", text: "পেয়েছি ✅ আপনার ফোন নম্বরটা দিন প্লিজ।" },
      { from: "customer", kind: "text", text: "০১৭•• ••• ৪২১" },
      { from: "system", kind: "order", text: "অর্ডার #৪১৮৮ তৈরি · নীল পাঞ্জাবি (L) · ৳১,৮৫০ · ক্যাশ অন ডেলিভারি" },
      { from: "seller", kind: "text", text: "অর্ডার কনফার্ম ভাইয়া! কাল বিকেলের মধ্যে পৌঁছে যাবে ইনশাআল্লাহ।" },
      { from: "customer", kind: "text", text: "ধন্যবাদ ভাই 👍" },
    ],
  },
  {
    channel: "WhatsApp",
    name: "Nusrat Jahan",
    initials: "NJ",
    context: "WhatsApp Business",
    messages: [
      { from: "customer", kind: "image", text: "এই ড্রেসটা আছে আপু? দাম কত?" },
      { from: "system", kind: "stock", text: "লাইভ স্টক · রোজ জর্জেট কুর্তি — S: ২টি, M: ৫টি" },
      { from: "seller", kind: "text", text: "জি আপু, এটা আমাদের রোজ জর্জেট কুর্তি 🌸 দাম ৳২,২৫০। S আর M সাইজ আছে।" },
      { from: "customer", kind: "text", text: "M সাইজ নিবো। ক্যাশ অন ডেলিভারি হবে তো?" },
      { from: "seller", kind: "text", text: "জি অবশ্যই! ঠিকানাটা দিন আপু।" },
      { from: "customer", kind: "location", text: "ধানমন্ডি ২৭, ঢাকা" },
      { from: "seller", kind: "text", text: "ঢাকার ভেতরে, তাই ডেলিভারি ফ্রি 😊 অর্ডার করে দিচ্ছি।" },
      { from: "system", kind: "order", text: "অর্ডার #৪১৮৯ তৈরি · রোজ জর্জেট কুর্তি (M) · ৳২,২৫০ · ক্যাশ অন ডেলিভারি" },
      { from: "customer", kind: "text", text: "থ্যাংক ইউ আপু ❤️" },
    ],
  },
];

const styles = {
  Messenger: {
    dot: "bg-blue-500",
    chip: "bg-blue-50 text-blue-600",
    canvas: "bg-white",
    seller: "bg-gradient-to-br from-blue-500 to-violet-500 text-white",
    customer: "bg-neutral-100 text-neutral-900",
  },
  WhatsApp: {
    dot: "bg-green-500",
    chip: "bg-green-50 text-green-700",
    canvas: "bg-[#efeae2]",
    seller: "bg-[#d9fdd3] text-neutral-900",
    customer: "bg-white text-neutral-900",
  },
};

// Longer messages "take longer to type", within limits.
const typingTime = (m: Message) => Math.min(1500, 450 + m.text.length * 14);

export default function InboxChat({ summary }: { summary: string }) {
  const [state, setState] = useState({ thread: 0, shown: 0, typing: false });
  const { thread, shown, typing } = state;
  const t = threads[thread];
  const s = styles[t.channel];

  // Play the script one message at a time, with a typing indicator before
  // each typed message, then move to the next conversation.
  useEffect(() => {
    const next = t.messages[shown];
    let ms: number;
    let update: () => void;
    if (!next) {
      ms = 2800;
      update = () => setState({ thread: (thread + 1) % threads.length, shown: 0, typing: false });
    } else if (next.kind === "text" && !typing) {
      ms = 600;
      update = () => setState({ thread, shown, typing: true });
    } else {
      ms = typing ? typingTime(next) : 900;
      update = () => setState({ thread, shown: shown + 1, typing: false });
    }
    const id = setTimeout(update, ms);
    return () => clearTimeout(id);
  }, [t, thread, shown, typing]);

  const visible = t.messages.slice(0, shown);
  const typingFrom = typing ? t.messages[shown].from : null;

  return (
    <div className="grid h-[440px] gap-3 sm:grid-cols-[150px_1fr] lg:h-[412px]">
      <p className="sr-only">{summary}</p>

      {/* Conversation list */}
      <ul className="hidden space-y-2 sm:block" aria-hidden>
        {threads.map((th, i) => {
          const active = i === thread;
          const st = styles[th.channel];
          const last = active && visible.length ? visible[visible.length - 1] : th.messages[0];
          return (
            <li
              key={th.name}
              className={`rounded-2xl border p-3 transition-colors duration-300 ${
                active ? "border-brand/40 bg-white shadow-sm" : "border-neutral-200 bg-white/60"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 shrink-0 rounded-full ${st.dot}`} />
                <span className="truncate text-xs font-semibold text-neutral-950">{th.name}</span>
                {!active && (
                  <span className="ml-auto rounded-full bg-brand px-1.5 text-[10px] font-bold text-white">
                    1
                  </span>
                )}
              </div>
              <p className="mt-1 truncate text-[11px] text-neutral-500">
                {last.kind === "image" ? "📷 ছবি" : last.kind === "location" ? "📍 লোকেশন" : last.text}
              </p>
              <p className="mt-1 text-[10px] font-medium text-neutral-400">{th.channel}</p>
            </li>
          );
        })}
        <li className="rounded-2xl border border-neutral-200 bg-white/60 p-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 shrink-0 rounded-full bg-pink-500" />
            <span className="truncate text-xs font-semibold text-neutral-950">Tanvir Ahmed</span>
          </div>
          <p className="mt-1 truncate text-[11px] text-neutral-500">সিলেটে ডেলিভারি চার্জ কত?</p>
          <p className="mt-1 text-[10px] font-medium text-neutral-400">Instagram</p>
        </li>
      </ul>

      {/* Chat */}
      <div
        key={thread}
        className="pop flex min-h-0 flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-neutral-200"
        aria-hidden
      >
        <div className="flex items-center gap-2.5 border-b border-neutral-100 px-3.5 py-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-semibold text-white">
            {t.initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-neutral-950">{t.name}</p>
            <p className="truncate text-[11px] text-neutral-500">{t.context}</p>
          </div>
          <span className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${s.chip}`}>
            {t.channel}
          </span>
        </div>

        <div
          className={`flex min-h-0 flex-1 flex-col justify-end gap-2 overflow-hidden px-3 pb-3 pt-6 [mask-image:linear-gradient(to_bottom,transparent,black_40px)] ${s.canvas}`}
        >
          {visible.map((m, i) => (
            <Bubble key={i} m={m} st={s} />
          ))}
          {typingFrom && typingFrom !== "system" && (
            <div className={`pop flex ${typingFrom === "seller" ? "justify-end" : ""}`}>
              <span
                className={`flex gap-1 rounded-2xl px-3 py-2.5 ${
                  typingFrom === "seller" ? s.seller : s.customer
                }`}
              >
                {[0, 150, 300].map((d) => (
                  <span
                    key={d}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-current opacity-60"
                    style={{ animationDelay: `${d}ms` }}
                  />
                ))}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 border-t border-neutral-100 px-3 py-2">
          <span className="flex-1 rounded-full bg-neutral-100 px-3 py-1.5 text-[11px] text-neutral-400">
            উত্তর লিখুন…
          </span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-white">
            <SendHorizontal size={13} strokeWidth={2.25} />
          </span>
        </div>
      </div>
    </div>
  );
}

function Bubble({ m, st }: { m: Message; st: (typeof styles)["Messenger"] }) {
  if (m.from === "system") {
    const order = m.kind === "order";
    return (
      <div className="pop flex justify-center">
        <span
          className={`flex max-w-[95%] items-start gap-1.5 rounded-xl px-2.5 py-1.5 text-[11px] font-medium leading-snug shadow-sm ${
            order ? "bg-brand text-white" : "bg-lime/60 text-neutral-900"
          }`}
        >
          {order ? (
            <Check size={12} strokeWidth={3} className="mt-0.5 shrink-0" />
          ) : (
            <Boxes size={12} strokeWidth={2.25} className="mt-0.5 shrink-0" />
          )}
          {m.text}
        </span>
      </div>
    );
  }

  const seller = m.from === "seller";
  const bubble = `max-w-[82%] rounded-2xl px-3 py-2 text-[13px] leading-snug shadow-sm ${
    seller ? `rounded-br-md ${st.seller}` : `rounded-bl-md ${st.customer}`
  }`;

  return (
    <div className={`pop flex ${seller ? "justify-end" : ""}`}>
      {m.kind === "text" && <p className={bubble}>{m.text}</p>}

      {m.kind === "image" && (
        <div className={`${bubble} p-1.5`}>
          <ProductArt look="roseKurti" className="block h-36 w-28 rounded-xl" />
          <p className="px-1.5 pb-0.5 pt-1.5">{m.text}</p>
        </div>
      )}

      {m.kind === "location" && (
        <div className={`${bubble} w-48 p-1.5`}>
          <div className="relative h-20 overflow-hidden rounded-xl bg-[#e8efe6] bg-[linear-gradient(90deg,#fff8_1px,transparent_1px),linear-gradient(#fff8_1px,transparent_1px)] bg-[size:16px_16px]">
            <span className="absolute left-[-10%] top-[45%] h-2 w-[120%] -rotate-12 bg-white/90" />
            <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-full text-red-500">
              <MapPin size={22} strokeWidth={2.25} className="fill-red-500 stroke-white" />
            </span>
          </div>
          <p className="px-1.5 pb-0.5 pt-1.5 text-[12px] font-medium">📍 {m.text}</p>
        </div>
      )}
    </div>
  );
}

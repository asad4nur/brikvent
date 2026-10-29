import { Globe } from "lucide-react";
import { siInstagram, siMessenger, siWhatsapp, type SimpleIcon } from "simple-icons";

export type Channel = "Messenger" | "WhatsApp" | "Instagram" | "Website";

// Platform marks (Simple Icons, CC0) in white on each platform's colors,
// used in the inbox mocks. Website live chat uses Brikvent's own colors.
const tiles: Record<Channel, string> = {
  Messenger: "bg-gradient-to-br from-[#00b2ff] via-[#5b5bff] to-[#a334fa]",
  WhatsApp: "bg-[#25d366]",
  Instagram: "bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5]",
  Website: "bg-gradient-to-br from-lime to-brand",
};

const marks: Partial<Record<Channel, SimpleIcon>> = {
  Messenger: siMessenger,
  WhatsApp: siWhatsapp,
  Instagram: siInstagram,
};

export default function ChannelIcon({
  channel,
  size = "md",
}: {
  channel: Channel;
  size?: "sm" | "md";
}) {
  const box = size === "sm" ? "h-5 w-5 rounded-md" : "h-7 w-7 rounded-lg";
  const glyph = size === "sm" ? 12 : 16;
  const mark = marks[channel];
  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center text-white shadow-sm ${box} ${tiles[channel]}`}
    >
      {mark ? (
        <svg viewBox="0 0 24 24" width={glyph} height={glyph} fill="currentColor">
          <path d={mark.path} />
        </svg>
      ) : (
        <Globe size={glyph - 1} strokeWidth={2.4} className="text-neutral-950" />
      )}
    </span>
  );
}

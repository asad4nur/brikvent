import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import Logo from "@/components/logo";
import { getDictionary } from "@/lib/i18n";

// Link preview card (Facebook, WhatsApp, Messenger, LinkedIn, X, Slack...).
// Prerendered once at build time and inherited by every /en and /bn page.
// The text stays in English for both locales: the image renderer cannot
// shape Bangla script (vowel signs and conjuncts come out broken).

export const alt = "Brikvent: the all-in-one commerce app for Bangladesh";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Geist static weights (SIL OFL, see assets/fonts/Geist-OFL.txt).
const fontDir = join(process.cwd(), "assets/fonts");
const geistBold = readFile(join(fontDir, "Geist-Bold.ttf"));
const geistMedium = readFile(join(fontDir, "Geist-Medium.ttf"));

const features = ["POS", "Online store", "WhatsApp & Messenger", "Courier", "Accounts"];

export default async function OpenGraphImage() {
  const { hero } = getDictionary("en");
  const [bold, medium] = await Promise.all([geistBold, geistMedium]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#0a0a0a",
          backgroundImage:
            "radial-gradient(circle at 92% 8%, rgba(0,166,62,0.45), transparent 42%), radial-gradient(circle at 4% 100%, rgba(204,255,0,0.14), transparent 38%)",
          color: "#ffffff",
          fontFamily: "Geist",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo tone="dark" width={346} height={72} />
          <div
            style={{
              display: "flex",
              padding: "10px 22px",
              borderRadius: 999,
              border: "2px solid rgba(204,255,0,0.5)",
              color: "#ccff00",
              fontSize: 24,
              fontWeight: 500,
            }}
          >
            {hero.eyebrow}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", fontSize: 76, fontWeight: 700, lineHeight: 1.08, letterSpacing: -2 }}>
          <span>{hero.title1}</span>
          <span style={{ color: "#ccff00" }}>{hero.title2}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ display: "flex", gap: 14 }}>
            {features.map((name) => (
              <div
                key={name}
                style={{
                  display: "flex",
                  padding: "10px 20px",
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  fontSize: 24,
                  fontWeight: 500,
                }}
              >
                {name}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, fontWeight: 500 }}>
            <span style={{ color: "#a3a3a3" }}>{hero.trust.join("  ·  ")}</span>
            <span style={{ color: "#ffffff", fontWeight: 700 }}>brikvent.com</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: medium, weight: 500, style: "normal" },
        { name: "Geist", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}

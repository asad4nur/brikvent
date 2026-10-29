import type { SVGProps } from "react";

// Flat clothing illustrations used as product photos in the mock screens.
// Drawn inline so they stay sharp at any size and need no image files.

export type ProductKind = "kurti" | "threePiece" | "panjabi";

type Palette = { bg: [string, string]; cloth: string; shade: string; trim: string };

// One look per demo product in the mocks.
export const productLooks = {
  linenKurti: { kind: "kurti", bg: ["#fbf3e6", "#f1e2c8"], cloth: "#e4c99d", shade: "#cfae7b", trim: "#9a6b3a" },
  roseKurti: { kind: "kurti", bg: ["#fff1f2", "#fecdd3"], cloth: "#fb7185", shade: "#e15b70", trim: "#fff1f2" },
  tealThreePiece: { kind: "threePiece", bg: ["#ecfdf5", "#c7f0e2"], cloth: "#0f766e", shade: "#0b5c56", trim: "#f5c451" },
  silkThreePiece: { kind: "threePiece", bg: ["#f5f3ff", "#ddd6fe"], cloth: "#7c3aed", shade: "#6427cf", trim: "#fcd34d" },
  bluePanjabi: { kind: "panjabi", bg: ["#eff6ff", "#cfe0fb"], cloth: "#2f5fa7", shade: "#244c88", trim: "#e8eefb" },
  cottonPanjabi: { kind: "panjabi", bg: ["#f8fafc", "#e2e8f0"], cloth: "#f4f1ea", shade: "#ddd6c8", trim: "#8a7a5c" },
} satisfies Record<string, Palette & { kind: ProductKind }>;

export type ProductLook = keyof typeof productLooks;

export default function ProductArt({
  look,
  className,
  ...props
}: { look: ProductLook } & SVGProps<SVGSVGElement>) {
  const { kind, bg, cloth, shade, trim } = productLooks[look];
  return (
    <svg
      viewBox="0 0 120 150"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      className={className}
      {...props}
    >
      {/* Backdrop: soft vertical gradient made of two rects, no ids needed */}
      <rect width="120" height="150" fill={bg[0]} />
      <rect y="75" width="120" height="75" fill={bg[1]} opacity="0.7" />
      <ellipse cx="60" cy="142" rx="38" ry="5" fill="#0a0a0a" opacity="0.08" />
      {/* Hanger */}
      <path d="M60 4a4 4 0 1 1 3 4l-3 5" fill="none" stroke="#9ca3af" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M38 22 60 12 82 22" fill="none" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" />
      {kind === "kurti" && <Kurti cloth={cloth} shade={shade} trim={trim} />}
      {kind === "threePiece" && <ThreePiece cloth={cloth} shade={shade} trim={trim} />}
      {kind === "panjabi" && <Panjabi cloth={cloth} shade={shade} trim={trim} />}
    </svg>
  );
}

type Colors = Omit<Palette, "bg">;

function Kurti({ cloth, shade, trim }: Colors) {
  // Printed motifs scattered over the body.
  const dots = [
    [50, 48], [70, 48], [60, 62], [46, 78], [74, 78], [60, 94], [44, 108], [76, 108], [60, 122],
  ];
  return (
    <g>
      <path d="M47 20q13 12 26 0l17 7 12 30-11 5-8-17 7 82q-30 8-60 0l7-82-8 17-11-5 12-30z" fill={cloth} />
      <path d="M90 27l12 30-11 5-8-17z M30 27 18 57l11 5 8-17z" fill={shade} />
      <path d="M53 21q7 9 14 0" fill="none" stroke={trim} strokeWidth="2.2" />
      <path d="M60 27v22" stroke={trim} strokeWidth="1.4" />
      {dots.map(([x, y]) => (
        <g key={`${x}-${y}`} fill={trim} opacity="0.85">
          <circle cx={x} cy={y} r="2.2" />
          <circle cx={x - 3.2} cy={y} r="1.1" />
          <circle cx={x + 3.2} cy={y} r="1.1" />
          <circle cx={x} cy={y - 3.2} r="1.1" />
          <circle cx={x} cy={y + 3.2} r="1.1" />
        </g>
      ))}
      {/* Hem border and side slits */}
      <path d="M30 131q30 7 60 0" fill="none" stroke={trim} strokeWidth="2.4" />
      <path d="M33 112l-2 18 M87 112l2 18" stroke={shade} strokeWidth="1.6" />
    </g>
  );
}

function ThreePiece({ cloth, shade, trim }: Colors) {
  return (
    <g>
      {/* Salwar legs peeking below the kameez */}
      <path d="M44 118h14l-2 22h-10z M62 118h14l-2 22h-10z" fill={shade} />
      <path d="M45 136h10 M65 136h10" stroke={trim} strokeWidth="2" />
      {/* Kameez */}
      <path d="M48 20q12 11 24 0l16 7 10 34-10 4-8-20 3 80q-23 6-46 0l3-80-8 20-10-4 10-34z" fill={cloth} />
      <path d="M53 21q7 9 14 0" fill="none" stroke={trim} strokeWidth="2.4" />
      {/* Embroidered yoke */}
      <path d="M50 30q10 10 20 0" fill="none" stroke={trim} strokeWidth="1.4" strokeDasharray="2 2" />
      <path d="M41 120q19 5 38 0" fill="none" stroke={trim} strokeWidth="2.6" />
      <path d="M43 112q17 4 34 0" fill="none" stroke={trim} strokeWidth="1.2" strokeDasharray="2 2" />
      {/* Dupatta draped from the left shoulder across to the right hip */}
      <path d="M34 26 48 22 92 92 86 140 76 138 80 96z" fill={trim} opacity="0.55" />
      <path d="M86 140l-10-2" stroke={trim} strokeWidth="2" />
    </g>
  );
}

function Panjabi({ cloth, shade, trim }: Colors) {
  return (
    <g>
      <path d="M48 20q12 8 24 0l16 6 16 40-10 4-11-26 2 92q-25 6-50 0l2-92-11 26-10-4 16-40z" fill={cloth} />
      <path d="M88 26l16 40-10 4-11-26z M32 26 16 66l10 4 11-26z" fill={shade} />
      {/* Band collar and placket with buttons */}
      <path d="M51 19q9 6 18 0v-4q-9 5-18 0z" fill={shade} />
      <path d="M57 22h6v34h-6z" fill={shade} opacity="0.6" />
      {[30, 39, 48].map((y) => (
        <circle key={y} cx="60" cy={y} r="1.6" fill={trim} />
      ))}
      {/* Embroidery around the placket */}
      <path d="M55 22v36 M65 22v36" stroke={trim} strokeWidth="1.2" strokeDasharray="2 2" />
      {/* Cuffs and side seams */}
      <path d="M94 70l10-4 M26 70l-10-4" stroke={trim} strokeWidth="2.4" />
      <path d="M37 120l-1 16 M83 120l1 16" stroke={shade} strokeWidth="1.6" />
    </g>
  );
}

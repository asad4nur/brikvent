// Decorative layer behind a section: an optional brand pattern plus soft,
// slowly drifting glows. The section needs `relative isolate`. Clipping
// happens here, not on the section, so sticky children keep working.

type Glow = {
  // Position and size utilities, e.g. "-left-24 top-10 h-96 w-96".
  className: string;
  color: "lime" | "green" | "mint";
  reverse?: boolean;
};

const colors = {
  lime: "bg-lime/30",
  green: "bg-brand/15",
  mint: "bg-emerald-200/40",
};

export default function Backdrop({
  pattern,
  glows = [],
}: {
  pattern?: "dots" | "grid";
  glows?: Glow[];
}) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {pattern === "dots" && (
        <div className="bg-dots absolute inset-0 [mask-image:radial-gradient(70%_60%_at_50%_40%,black,transparent)]" />
      )}
      {pattern === "grid" && (
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00a63e12_1px,transparent_1px),linear-gradient(to_bottom,#00a63e12_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(65%_55%_at_50%_45%,black,transparent)]" />
      )}
      {glows.map((g, i) => (
        <div
          key={i}
          className={`absolute rounded-full blur-3xl ${colors[g.color]} ${g.reverse ? "drift-reverse" : "drift"} ${g.className}`}
        />
      ))}
    </div>
  );
}

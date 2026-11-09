// Decorative layer behind a section. The flat teal/mint design has no
// patterns or glows, so this renders nothing; it stays so sections keep
// their markup and can opt back in later.

type Glow = {
  className: string;
  color: "lime" | "green" | "mint";
  reverse?: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Backdrop(props: { pattern?: "dots" | "grid"; glows?: Glow[] }) {
  return null;
}

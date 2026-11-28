import Image, { type StaticImageData } from "next/image";
import bluePanjabi from "@/public/products/blue-panjabi.jpg";
import cottonPanjabi from "@/public/products/cotton-panjabi.jpg";
import greenThreePiece from "@/public/products/green-three-piece.jpg";
import kidsKurtiSet from "@/public/products/kids-kurti-set.jpg";
import roseKurti from "@/public/products/rose-kurti.jpg";
import whiteFloralKurti from "@/public/products/white-floral-kurti.jpg";

// Real product photos for the demo products in the mock screens.
// All are free for commercial use with no attribution required: from Unsplash
// under the Unsplash License, except kids-kurti-set (Pexels License). The two
// full-length shots stay 2:3, the rest are cropped to 4:5:
//   green-three-piece      unsplash.com/photos/Oa02eUVr1-Q (2:3)
//   kids-kurti-set         pexels.com/photo/36836754 (Alok Das)
//   white-floral-kurti     unsplash.com/photos/Yci8aYzkjpk
//   rose-kurti             unsplash.com/photos/kN3tHdXDDrs
//   cotton-panjabi         unsplash.com/photos/hEuVOYuq1l4
//   blue-panjabi           unsplash.com/photos/sLRFg-VC2FY (2:3)
export const productLooks = {
  linenKurti: whiteFloralKurti,
  roseKurti,
  tealThreePiece: greenThreePiece,
  kidsKurtiSet,
  bluePanjabi,
  cottonPanjabi,
} satisfies Record<string, StaticImageData>;

export type ProductLook = keyof typeof productLooks;

// Decorative: the product name always sits next to the photo.
export default function ProductArt({
  look,
  className = "",
  sizes = "160px",
}: {
  look: ProductLook;
  className?: string;
  sizes?: string;
}) {
  return (
    <Image
      src={productLooks[look]}
      alt=""
      sizes={sizes}
      placeholder="blur"
      className={`object-cover ${className}`}
    />
  );
}

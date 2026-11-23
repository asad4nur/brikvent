import type { MetadataRoute } from "next";

// /manifest.webmanifest: name, colours and icons for "Add to home screen".
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Brikvent: POS, Online Store & Inventory App",
    short_name: "Brikvent",
    description: "The all-in-one commerce app for Bangladesh.",
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#0a0a0a",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}

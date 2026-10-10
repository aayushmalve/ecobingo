import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "EcoBingo — Less scrolling. More living.",
    short_name: "EcoBingo",
    description: "Little outdoor missions to reconnect with the world around you.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f7f6f0",
    theme_color: "#183d30",
    orientation: "portrait-primary",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}

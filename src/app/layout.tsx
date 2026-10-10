import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EcoBingo — Less scrolling. More living.",
  description: "Little outdoor missions. Take a break from your feed and reconnect with the world around you.",
  applicationName: "EcoBingo",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "EcoBingo" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#183d30",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-theme="light"><body>{children}</body></html>;
}

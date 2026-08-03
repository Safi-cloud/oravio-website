import type { Metadata } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/jetbrains-mono/500.css";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import StickyMobileCta from "@/components/StickyMobileCta";

export const metadata: Metadata = {
  metadataBase: new URL("https://oravio.nl"),
  title: {
    default: "Oravio — De complete software voor moderne ondernemingen",
    template: "%s",
  },
  description:
    "Verkoop, verhuur, reserveringen, betalingen en klantbeheer in één schaalbaar cloudplatform. Onder jouw eigen merk en domein.",
  openGraph: {
    title: "Oravio — De complete software voor moderne ondernemingen",
    description:
      "Verkoop, verhuur, reserveringen, betalingen en klantbeheer in één schaalbaar cloudplatform. Onder jouw eigen merk en domein.",
    url: "https://oravio.nl",
    siteName: "Oravio",
    locale: "nl_NL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Oravio — De complete software voor moderne ondernemingen",
    description:
      "Verkoop, verhuur, reserveringen, betalingen en klantbeheer in één schaalbaar cloudplatform.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className="antialiased">
        <SiteHeader />
        <main className="pb-20 md:pb-0">{children}</main>
        <SiteFooter />
        <StickyMobileCta />
      </body>
    </html>
  );
}

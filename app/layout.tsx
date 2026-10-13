import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { Toaster } from "sonner";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { siteConfig, siteMetadataBase } from "@/lib/config";
import { pexelsPhoto } from "@/lib/utils";
import "./globals.css";

const ogImage = pexelsPhoto(7546645, { width: 1200, height: 630 });

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: siteMetadataBase,
  title: {
    default: `${siteConfig.brandName} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.brandName}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.brandName,
  keywords: [
    "interior design",
    "interior decorator",
    "residential interiors",
    "commercial interiors",
    "space planning",
    "interior styling",
  ],
  authors: [{ name: siteConfig.brandName }],
  creator: siteConfig.brandName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.brandName,
    title: `${siteConfig.brandName} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "A warm, light-filled interior by Aurelia Interiors",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.brandName} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#f6f2ec",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jost.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-canvas text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-ivory"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1 pt-20">
          {children}
        </main>
        <SiteFooter />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#ffffff",
              border: "1px solid #e6dfd3",
              color: "#26231f",
            },
          }}
        />
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { siteConfig, siteMetadataBase } from "@/lib/config";
import { themeInitScript } from "@/lib/theme";
import { pexelsPhoto } from "@/lib/utils";
import { getSiteSettings } from "@/server/services/settings";
import "./globals.css";

/**
 * Portfolio content, settings and availability are all database-driven, so
 * pages are rendered per request rather than baked at build time.
 */
export const dynamic = "force-dynamic";

const ogImage = pexelsPhoto(7546645, { width: 1200, height: 630 });

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = settings.seo.seoTitle || `${settings.brand.brandName} — ${settings.brand.tagline}`;
  const description = settings.seo.seoDescription || settings.brand.description;

  return {
    metadataBase: siteMetadataBase,
    title: {
      default: title,
      template: `%s — ${settings.brand.brandName}`,
    },
    description,
    applicationName: settings.brand.brandName,
    keywords: [
      "interior design",
      "interior decorator",
      "residential interiors",
      "commercial interiors",
      "space planning",
      "interior styling",
    ],
    authors: [{ name: settings.brand.brandName }],
    creator: settings.brand.brandName,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      siteName: settings.brand.brandName,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "A warm, light-filled interior",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f2ec" },
    { media: "(prefers-color-scheme: dark)", color: "#171412" },
  ],
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
      suppressHydrationWarning
      className={`${roboto.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-canvas text-ink">
        <ThemeProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-ivory"
          >
            Skip to content
          </a>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "var(--color-card)",
                border: "1px solid var(--color-line)",
                color: "var(--color-ink)",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}

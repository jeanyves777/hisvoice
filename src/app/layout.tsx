import type { Metadata } from "next";
import { Cinzel_Decorative, Cinzel, Crimson_Text, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SessionProvider } from "@/components/providers/session-provider";
import { Toaster } from "sonner";
import { CuriosityWidget } from "@/components/curiosity/curiosity-widget";
import "./globals.css";

const cinzelDecorative = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-cinzel-decorative",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cinzel",
  display: "swap",
});

const crimsonText = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-crimson-text",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "His Voice — Every Word He Spoke",
    template: "%s | His Voice",
  },
  description:
    "The most comprehensive interactive harmony of Jesus Christ across all world traditions. 70+ sources from 10 civilizations spanning 3,000 years.",
  keywords: [
    "Jesus", "Gospel Harmony", "Bible", "Quran", "Historical Jesus",
    "Prophecy", "Messianic Prophecy", "Dead Sea Scrolls", "Josephus",
    "Tacitus", "Bible Study", "Cross-tradition", "Jesus in Islam",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "His Voice",
    title: "His Voice — Every Word He Spoke",
    description: "From the first prophecy to the last word. 70+ sources, 10 civilizations, the most documented life in history.",
  },
  twitter: {
    card: "summary_large_image",
    title: "His Voice — Every Word He Spoke",
    description: "The most comprehensive interactive harmony of Jesus Christ across all world traditions.",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${cinzelDecorative.variable} ${cinzel.variable} ${crimsonText.variable} ${inter.variable}`}
    >
      <body className="antialiased min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SessionProvider>
            {children}
            <CuriosityWidget />
            <Toaster
              position="bottom-right"
              richColors
              closeButton
              toastOptions={{
                style: {
                  fontFamily: "var(--font-inter), system-ui, sans-serif",
                },
              }}
            />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

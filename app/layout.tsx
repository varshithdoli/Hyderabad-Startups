import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth-context";
import { ToastProvider } from "@/components/ui/toast";
import { Navbar } from "@/components/navbar";

const geistSans = Geist({ variable: "--font-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "StartupHyd — Hyderabad Startup Intelligence Platform",
    template: "%s | StartupHyd",
  },
  description: "Discover 9,000+ startups, track ₹5.8B+ in funding, explore India's #1 liveable city. The ultimate Hyderabad startup ecosystem platform.",
  keywords: "Hyderabad, startups, T-Hub, Darwinbox, Zenoti, HITEC City, startup ecosystem, India, unicorns, soonicorns, jobs",
  openGraph: {
    title: "StartupHyd — Hyderabad Startup Intelligence Platform",
    description: "Discover 9,000+ startups, track ₹5.8B+ in funding, explore India's #1 liveable city.",
    type: "website",
    locale: "en_IN",
    siteName: "StartupHyd",
  },
  twitter: {
    card: "summary_large_image",
    title: "StartupHyd — Hyderabad Startup Intelligence Platform",
    description: "Discover 9,000+ startups, track ₹5.8B+ in funding.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <Navbar />
              <main className="pt-16">{children}</main>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

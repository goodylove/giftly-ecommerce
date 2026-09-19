import type { Metadata } from "next";
import localFont from "next/font/local";
import { Poppins } from "next/font/google";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MotionProvider } from "@/components/ui/motion-provider";
import { PageLoader } from "@/components/ui/page-loader";
import { ToastProvider } from "@/components/ui/toast-provider";

import "./globals.css";
import { CartProvider } from "../context/cartProvider";

const geistSans = localFont({
  src: "./fonts/geist-latin.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

// A distinct display face for headings/wordmark, paired with Geist for body
// text — gives the brand its own voice instead of one typeface doing everything.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Giftly — A little gift. A lot of happy.",
  description:
    "Make their day with digital gift cards from brands they love. Discover Amazon, Apple, and Steam gift cards on Giftly.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${poppins.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        {/* Framer renders its `initial` state as inline styles during SSR, so without
            this a no-JS visitor would be left looking at permanently hidden sections. */}
        <noscript>
          <style>{`[data-reveal],[data-page-transition]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <PageLoader />
        <MotionProvider>
          <CartProvider>
            <ToastProvider>
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </ToastProvider>
          </CartProvider>
        </MotionProvider>
      </body>
    </html>
  );
}

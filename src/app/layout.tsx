import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/context";
import { AuthProvider } from "@/lib/auth/context";
import { PlatformProvider } from "@/lib/store/platform-store";
import PwaInstaller from "@/components/pwa-installer";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mana Ruchulu — మన రుచులు | Authentic Food Delivery",
  description:
    "Order hot and authentic South Indian tiffins, Hyderabadi Dum Biryani, and Andhra meals delivered to your doorstep.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Mana Ruchulu",
  },
  icons: {
    icon: [
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  keywords: ["food delivery", "Telugu", "Andhra Pradesh", "Telangana", "local restaurants", "biryani", "swiggy", "zomato"],
  openGraph: {
    title: "Mana Ruchulu — మన రుచులు",
    description: "Order authentic Andhra & Telangana delicacies from your favourite neighbourhood spots",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ea580c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <I18nProvider>
          <AuthProvider>
            <PlatformProvider>
              {children}
              <PwaInstaller />
            </PlatformProvider>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/context";
import { AuthProvider } from "@/lib/auth/context";
import { PlatformProvider } from "@/lib/store/platform-store";

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
  themeColor: "#f97316",
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
            </PlatformProvider>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}

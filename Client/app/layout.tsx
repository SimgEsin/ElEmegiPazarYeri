import type { Metadata } from "next";
import { Epilogue, Geist_Mono } from "next/font/google";

import { AuthProvider } from "@/components/providers/auth-provider";
import { SiteShell } from "@/components/site/site-shell";

import "./globals.css";

const epilogue = Epilogue({
  variable: "--font-epilogue",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "El İşi Pazarı",
    template: "%s | El İşi Pazarı",
  },
  description: "El emeği ürünlerin hikayelerini öne çıkaran butik pazar yeri arayüzü.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${epilogue.variable} ${geistMono.variable} font-sans antialiased`}>
        <AuthProvider>
          <SiteShell>{children}</SiteShell>
        </AuthProvider>
      </body>
    </html>
  );
}

import Script from 'next/script'
import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

export const metadata: Metadata = {
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  icons: [
    {
      url: "/logo.svg",
      href: "/logo.svg",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} scroll-smooth`}>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans`}>{children}        <Script id="visus-init" strategy="afterInteractive">{`window.__VISUS_SITE_ID__="cmtj4dqtx0005e21x62vbdddt";window.__VISUS_API__="https://visus-m49n.onrender.com";`}</Script>
        <Script src="https://visus-m49n.onrender.com/tracker.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}

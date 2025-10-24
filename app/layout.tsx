import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/animations/SmoothScroll";

const roboto = Roboto({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: "Eversong AI - Making AI Valuable, Secure and Practical for SMEs on Microsoft",
  description: "We help European mid-sized businesses adopt AI safely and effectively within the Microsoft ecosystem. Elite consulting with calm authority and intellectual clarity.",
  keywords: [
    "AI Consulting",
    "Microsoft AI",
    "AI Strategy",
    "Azure AI",
    "Business AI Adoption",
    "AI Security",
    "SME AI Solutions",
    "AI Executive Sprint",
  ],
  authors: [{ name: "Eversong AI" }],
  openGraph: {
    title: "Eversong AI - Clarity on AI for Your Business",
    description: "Practical, secure adoption on Microsoft—without the noise.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} antialiased`}>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}

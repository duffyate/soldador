import type { Metadata } from "next";
import localFont from "next/font/local";
import { AppShell } from "@/components/AppShell/AppShell";
import "./globals.css";

const mulish = localFont({
  src: [
    {
      path: "./fonts/Mulish-VariableFont_wght.ttf",
      weight: "200 900",
      style: "normal",
    },
    {
      path: "./fonts/Mulish-Italic-VariableFont_wght.ttf",
      weight: "200 900",
      style: "italic",
    },
  ],
  variable: "--font-mulish",
});

export const metadata: Metadata = {
  title: "Soldador",
  description: "Corporate furniture website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={mulish.variable}>
      <body className={mulish.className}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Мечта в джоба — Творчески лагери 2026 | Глемпинг Столът",
  description:
    "Премиум творчески лагери за деца 7–18 г. сред природата на Глемпинг Столът, Севлиево. Изкуство, STEAM, природа. От €650. Максимум 30 деца на сесия.",
  openGraph: {
    title: "Мечта в джоба — Творчески лагери 2026",
    description:
      "Творчески лагери за деца 7–18 г. сред природата на Глемпинг Столът, Севлиево. Изкуство, STEAM, природа. От €650 за седмица.",
    locale: "bg_BG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Мечта в джоба — Творчески лагери 2026",
    description:
      "Творчески лагери за деца 7–18 г. сред природата на Глемпинг Столът. От €650 за седмица.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bg" className={`${dmSans.variable} ${cormorant.variable} h-full antialiased`}>
      <body className="min-h-full bg-sand text-forest" style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}

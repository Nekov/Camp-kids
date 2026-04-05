import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Мечта в джоба — Творчески лагери 2026 | Глемпинг Столът",
  description:
    "Премиум творчески лагери за деца 7–18 г. сред природата на Глемпинг Столът, Севлиево. Изкуство, STEAM, природа. От €650. Максимум 28 деца на сесия.",
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
    <html lang="bg" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#12253a] text-white" style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}

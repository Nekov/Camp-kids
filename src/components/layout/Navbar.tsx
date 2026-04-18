"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const sessions = [
  { name: "Сесия 1 — 31 май–6 юни", slug: "session-1", ages: "7–10 г." },
  { name: "Сесия 2 — 7–13 юни", slug: "session-2", ages: "7–10 г." },
  { name: "Сесия 3 — 14–20 юни", slug: "session-3", ages: "7–14 г." },
  { name: "Сесия 4 — 21–27 юни", slug: "session-4", ages: "7–14 г." },
  { name: "Сесия 5 — 28 юни–4 юли", slug: "session-5", ages: "7–14 г." },
  { name: "Пленер — 5–18 юли", slug: "plein-air", ages: "14–18 г." },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [programsOpen, setProgramsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-forest/95 backdrop-blur-md shadow-lg border-b border-white/10"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 lg:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-forest font-bold text-sm">
            М
          </div>
          <span className="font-semibold text-white text-sm sm:text-base leading-tight">
            Мечта в джоба
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="text-white/80 hover:text-white transition-colors">
            Начало
          </Link>

          {/* Programs dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-1 text-white/80 hover:text-white transition-colors"
              onMouseEnter={() => setProgramsOpen(true)}
              onMouseLeave={() => setProgramsOpen(false)}
            >
              Програми <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {programsOpen && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-72"
                onMouseEnter={() => setProgramsOpen(true)}
                onMouseLeave={() => setProgramsOpen(false)}
              >
                <div className="bg-forest rounded-xl border border-white/10 overflow-hidden shadow-xl">
                  {sessions.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/programs/${s.slug}`}
                      className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                    >
                      <span className="text-white/90 text-sm">{s.name}</span>
                      <span className="text-gold text-xs">{s.ages}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link href="/about" className="text-white/80 hover:text-white transition-colors">
            За нас
          </Link>
          <Link href="/location" className="text-white/80 hover:text-white transition-colors">
            Локацията
          </Link>
          <Link href="/faq" className="text-white/80 hover:text-white transition-colors">
            Въпроси
          </Link>
        </div>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href="tel:+359885571638"
            className="text-white/70 hover:text-white text-sm transition-colors"
          >
            0885 571 638
          </a>
          <Link
            href="/programs/session-1"
            className="bg-teal hover:bg-teal-dark text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-all duration-200 shadow-lg"
          >
            Запишете дете →
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Меню"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-forest/98 backdrop-blur-md border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            <Link href="/" className="block py-3 text-white/80 border-b border-white/5" onClick={() => setMobileOpen(false)}>
              Начало
            </Link>
            <div>
              <button
                className="flex items-center justify-between w-full py-3 text-white/80 border-b border-white/5"
                onClick={() => setProgramsOpen(!programsOpen)}
              >
                <span>Програми</span>
                <ChevronDown className={cn("w-4 h-4 transition-transform", programsOpen && "rotate-180")} />
              </button>
              {programsOpen && (
                <div className="bg-forest-mid/50 rounded-lg my-2 overflow-hidden">
                  {sessions.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/programs/${s.slug}`}
                      className="flex items-center justify-between px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 border-b border-white/5 last:border-0"
                      onClick={() => setMobileOpen(false)}
                    >
                      <span>{s.name}</span>
                      <span className="text-gold text-xs">{s.ages}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link href="/about" className="block py-3 text-white/80 border-b border-white/5" onClick={() => setMobileOpen(false)}>За нас</Link>
            <Link href="/location" className="block py-3 text-white/80 border-b border-white/5" onClick={() => setMobileOpen(false)}>Локацията</Link>
            <Link href="/faq" className="block py-3 text-white/80 border-b border-white/5" onClick={() => setMobileOpen(false)}>Въпроси</Link>
            <div className="pt-3 space-y-3">
              <a href="tel:+359885571638" className="block text-center text-white/70 text-sm py-2">
                📞 0885 571 638
              </a>
              <Link
                href="/programs/session-1"
                className="block text-center bg-teal text-white font-semibold py-3 rounded-full"
                onClick={() => setMobileOpen(false)}
              >
                Запишете дете →
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

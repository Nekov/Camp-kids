"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { countdownToDate } from "@/lib/utils";

const EARLY_BIRD_DEADLINE = new Date("2026-04-25T23:59:59");
const FAMILIES_ENROLLED = 47;

type Star = { left: string; top: string; delay: string; duration: string };

export default function HeroSection() {
  const [countdown, setCountdown] = useState(countdownToDate(EARLY_BIRD_DEADLINE));
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    setStars(
      Array.from({ length: 60 }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 60}%`,
        delay: `${Math.random() * 3}s`,
        duration: `${2 + Math.random() * 2}s`,
      }))
    );
    const interval = setInterval(() => {
      setCountdown(countdownToDate(EARLY_BIRD_DEADLINE));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#12253a] to-[#0d2040]" />
      {/* Decorative glow */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#f5a623]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-[#2d6a2f]/15 rounded-full blur-3xl pointer-events-none" />
      {/* Stars effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-40"
            style={{
              left: star.left,
              top: star.top,
              animationDelay: star.delay,
              animation: `pulse ${star.duration} ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-16">
        {/* Urgency banner */}
        {!countdown.expired && (
          <div className="inline-flex items-center gap-3 bg-[#f5a623]/15 border border-[#f5a623]/30 rounded-full px-4 py-2 mb-8 text-sm">
            <span className="w-2 h-2 bg-[#f5a623] rounded-full animate-pulse" />
            <span className="text-[#f5a623] font-semibold">Ранна цена изтича след:</span>
            <span className="text-white font-mono font-bold">
              {countdown.days}д {String(countdown.hours).padStart(2, "0")}ч {String(countdown.minutes).padStart(2, "0")}м
            </span>
          </div>
        )}

        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Седмица,{" "}
            <span className="text-[#f5a623]">която ще помнят</span>{" "}
            завинаги.
          </h1>
          <p className="text-lg sm:text-xl text-white/70 mb-3 leading-relaxed">
            Творчески лагери сред природата на Глемпинг Столът, Севлиево.
            Деца 7–18 г. • От €650 за седмица • Максимум 28 деца на сесия.
          </p>
          <p className="text-white/50 text-base mb-10">
            Изкуство, наука, природа — всяка сесия е различна. Всеки ден е незабравим.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <a
              href="#sessions"
              className="inline-flex items-center justify-center gap-2 bg-[#f5a623] hover:bg-[#f7b84a] text-[#0d1b2a] font-bold px-8 py-4 rounded-full text-base transition-all duration-200 shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5"
            >
              Виж програмите
              <span>↓</span>
            </a>
            <Link
              href="/register/session-1"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-full text-base border border-white/20 transition-all duration-200 hover:-translate-y-0.5"
            >
              Запишете дете →
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <div className="flex -space-x-2">
              {["Д", "И", "М", "Е", "Т"].map((letter, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full bg-gradient-to-br from-[#f5a623] to-[#d4890a] flex items-center justify-center text-[#0d1b2a] text-xs font-bold border-2 border-[#12253a]"
                >
                  {letter}
                </div>
              ))}
            </div>
            <span>
              <span className="text-white font-semibold">{FAMILIES_ENROLLED} семейства</span> вече са записани тази година
            </span>
          </div>
        </div>
      </div>

      {/* Trust badge strip */}
      <div className="relative z-10 border-t border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-white/50">
            <span className="flex items-center gap-1.5">
              <span className="text-[#f5a623]">✦</span> Фондация „Мечта в джоба"
            </span>
            <span className="hidden sm:block w-px h-4 bg-white/20" />
            <span className="flex items-center gap-1.5">
              <span className="text-[#f5a623]">✦</span> 8+ години опит
            </span>
            <span className="hidden sm:block w-px h-4 bg-white/20" />
            <span className="flex items-center gap-1.5">
              <span className="text-[#f5a623]">✦</span> Глемпинг Столът, Севлиево
            </span>
            <span className="hidden sm:block w-px h-4 bg-white/20" />
            <span className="flex items-center gap-1.5">
              <span className="text-[#f5a623]">✦</span> 1:6 ратио деца/педагог
            </span>
            <span className="hidden sm:block w-px h-4 bg-white/20" />
            <span className="flex items-center gap-1.5">
              <span className="text-[#f5a623]">✦</span> Магистри педагози
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

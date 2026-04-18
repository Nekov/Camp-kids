"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { countdownToDate } from "@/lib/utils";

const EARLY_BIRD_DEADLINE = new Date("2026-04-25T23:59:59");
const FAMILIES_ENROLLED = 47;

export default function HeroSection() {
  const [countdown, setCountdown] = useState(countdownToDate(EARLY_BIRD_DEADLINE));

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(countdownToDate(EARLY_BIRD_DEADLINE));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen bg-sand flex flex-col justify-center overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-8rem)]">

          {/* Left: Text */}
          <div className="flex flex-col justify-center">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-teal" />
              <span className="text-teal text-xs font-semibold uppercase tracking-widest">
                Лятна програма 2026
              </span>
            </div>

            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-light text-forest leading-[1.08] mb-6"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Седмица,{" "}
              <em className="text-teal">която ще помнят</em>{" "}
              завинаги.
            </h1>

            <p className="text-moss text-lg leading-relaxed mb-10 max-w-md">
              Творчески лагери сред природата на Глемпинг Столът,
              Севлиево. Деца 7–18 г. От €650 за седмица. Максимум 28
              деца на сесия.
            </p>

            {/* Countdown pill */}
            {!countdown.expired && (
              <div className="inline-flex items-center gap-2 bg-amber/10 border border-amber/25 rounded-full px-4 py-2 mb-8 text-sm w-fit">
                <span className="w-1.5 h-1.5 bg-amber rounded-full animate-pulse" />
                <span className="text-amber font-semibold">Ранна цена изтича след:</span>
                <span className="text-forest font-mono font-bold text-xs">
                  {countdown.days}д {String(countdown.hours).padStart(2, "0")}ч {String(countdown.minutes).padStart(2, "0")}м
                </span>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <a
                href="#sessions"
                className="inline-flex items-center justify-center bg-teal hover:bg-teal-dark text-white font-semibold px-8 py-4 rounded-xl text-base transition-all duration-200 shadow-sm hover:-translate-y-0.5"
              >
                Виж програмите
              </a>
              <Link
                href="/register/session-1"
                className="inline-flex items-center justify-center text-forest font-semibold px-8 py-4 rounded-xl text-base border border-forest/25 hover:border-forest/50 hover:bg-forest/5 transition-all duration-200"
              >
                Запишете дете →
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-2 text-moss text-sm">
              <div className="flex -space-x-2">
                {["Д", "И", "М", "Е", "Т"].map((letter, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full bg-teal/20 flex items-center justify-center text-teal text-xs font-bold border-2 border-sand"
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <span>
                <span className="text-forest font-semibold">{FAMILIES_ENROLLED} семейства</span> вече са записани тази година
              </span>
            </div>
          </div>

          {/* Right: Photo collage */}
          <div className="relative hidden lg:block h-[540px]">
            {/* Main large image — top right */}
            <div className="absolute right-0 top-0 w-[58%] h-[56%] rounded-2xl bg-forest overflow-hidden shadow-xl">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/30">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-xs text-center px-4">Снимки на деца в<br />творческа дейност</span>
              </div>
            </div>

            {/* Stat card */}
            <div className="absolute left-0 top-[20%] w-[42%] bg-cream rounded-2xl shadow-lg border border-forest/8 p-5 z-10">
              <p className="text-teal text-xs font-semibold uppercase tracking-widest mb-2">Деца на сесия</p>
              <p className="text-forest text-5xl font-light mb-1" style={{ fontFamily: "var(--font-serif)" }}>28</p>
              <p className="text-moss text-sm">Малки групи, голямо внимание</p>
            </div>

            {/* Bottom left — landscape */}
            <div className="absolute left-0 bottom-0 w-[48%] h-[40%] rounded-2xl bg-forest-mid overflow-hidden shadow-lg">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/30">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs">Глемпинг</span>
              </div>
            </div>

            {/* Bottom right — accent */}
            <div className="absolute right-0 bottom-0 w-[46%] h-[38%] rounded-2xl bg-sage/60 overflow-hidden shadow-lg border border-sage" />
          </div>

        </div>
      </div>

      {/* Trust strip */}
      <div className="border-t border-forest/10 bg-cream/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-moss">
            {[
              "Фондация \u201eМечта в джоба\u201c",
              "8+ години опит",
              "Глемпинг Столът, Севлиево",
              "1:6 ратио деца/педагог",
              "Магистри педагози",
            ].map((item, i, arr) => (
              <span key={item} className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="text-teal">✦</span> {item}
                </span>
                {i < arr.length - 1 && <span className="hidden sm:block w-px h-3 bg-forest/15" />}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

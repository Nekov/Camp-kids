"use client";

import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SessionGalleryProps {
  images?: string[]; // URLs; falls back to placeholders when empty
  sessionName: string;
}

// Placeholder colours until real photos are uploaded
const PLACEHOLDER_COLORS = [
  "bg-forest/20",
  "bg-teal/20",
  "bg-sage/40",
  "bg-forest/15",
  "bg-teal/15",
  "bg-moss/20",
];

const PLACEHOLDER_LABELS = [
  "Творчески ателие",
  "Природни разходки",
  "Лагерен огън",
  "STEAM проекти",
  "Глемпинг тентове",
  "Лятно кино",
];

export default function SessionGallery({ images = [], sessionName }: SessionGalleryProps) {
  const slots = images.length > 0 ? images : PLACEHOLDER_LABELS.map((_, i) => null as null);
  const count = slots.length;
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  function goTo(i: number) {
    const next = Math.max(0, Math.min(count - 1, i));
    setActive(next);
    trackRef.current?.children[next]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  }

  return (
    <div className="relative">
      {/* Scrollable track */}
      <div
        ref={trackRef}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-1"
        style={{ scrollbarWidth: "none" }}
        onScroll={(e) => {
          const el = e.currentTarget;
          const itemW = el.scrollWidth / count;
          setActive(Math.round(el.scrollLeft / itemW));
        }}
      >
        {slots.map((src, i) => (
          <div
            key={i}
            className="snap-start shrink-0 w-[85%] sm:w-[60%] lg:w-[48%] rounded-2xl overflow-hidden aspect-[4/3] relative"
          >
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt={`${sessionName} — снимка ${i + 1}`} className="w-full h-full object-cover" />
            ) : (
              <div className={`w-full h-full ${PLACEHOLDER_COLORS[i % PLACEHOLDER_COLORS.length]} flex flex-col items-center justify-center gap-2`}>
                <span className="text-4xl opacity-40">📷</span>
                <span className="text-forest/40 text-xs font-medium">{PLACEHOLDER_LABELS[i % PLACEHOLDER_LABELS.length]}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop prev/next arrows */}
      <button
        onClick={() => goTo(active - 1)}
        disabled={active === 0}
        className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-cream/90 border border-forest/15 shadow-sm items-center justify-center text-forest hover:bg-cream transition-all disabled:opacity-30"
        aria-label="Предишна"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => goTo(active + 1)}
        disabled={active >= count - 1}
        className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-cream/90 border border-forest/15 shadow-sm items-center justify-center text-forest hover:bg-cream transition-all disabled:opacity-30"
        aria-label="Следваща"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 mt-3">
        {slots.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all ${i === active ? "w-5 h-1.5 bg-teal" : "w-1.5 h-1.5 bg-forest/20 hover:bg-forest/40"}`}
            aria-label={`Снимка ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

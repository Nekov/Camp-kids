"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface StickyCtaBarProps {
  spotsLeft?: number;
  sessionSlug?: string;
}

export default function StickyCtaBar({ spotsLeft, sessionSlug = "session-1" }: StickyCtaBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Show after scrolling past hero (approx 600px)
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 lg:hidden transition-all duration-300",
        visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      )}
    >
      <div className="bg-[#0d1b2a]/95 backdrop-blur-md border-t border-white/10 px-4 py-3">
        <Link
          href={`/register/${sessionSlug}`}
          className="flex items-center justify-center gap-2 w-full bg-[#f5a623] hover:bg-[#f7b84a] text-[#0d1b2a] font-bold py-3.5 rounded-full text-base shadow-lg transition-all active:scale-95"
        >
          Запази място
          {spotsLeft !== undefined && (
            <span className="bg-[#0d1b2a]/20 rounded-full px-2 py-0.5 text-xs font-semibold">
              само {spotsLeft} остават
            </span>
          )}
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}

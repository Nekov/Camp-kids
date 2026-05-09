"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-sand flex flex-col items-center justify-center px-4 text-center">
      <div className="text-5xl mb-6">😔</div>
      <h1 className="text-2xl font-light text-forest mb-3" style={{ fontFamily: "var(--font-serif)" }}>
        Временен технически проблем
      </h1>
      <p className="text-moss text-base max-w-md mb-8 leading-relaxed">
        Страницата не може да се зареди в момента. Опитайте отново — обикновено
        проблемът изчезва след секунди.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={reset}
          className="inline-flex items-center justify-center bg-teal hover:bg-teal-dark text-white font-semibold px-7 py-3 rounded-full transition-all"
        >
          Опитай пак
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center border border-forest/25 hover:border-forest/50 text-forest font-semibold px-7 py-3 rounded-full transition-all"
        >
          Към началото
        </Link>
      </div>
      <p className="text-moss/40 text-xs mt-10">
        За директна помощ:{" "}
        <a href="tel:+359885571638" className="hover:text-teal transition-colors">0885 571 638</a>
      </p>
    </div>
  );
}

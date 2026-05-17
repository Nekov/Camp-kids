"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const PHOTOS = [
  { src: "/images/location/gallery-01.jpg", alt: "Глемпинг Столът" },
  { src: "/images/location/gallery-02.jpg", alt: "Глемпинг Столът" },
  { src: "/images/location/gallery-03.jpg", alt: "Глемпинг Столът" },
  { src: "/images/location/gallery-04.jpg", alt: "Глемпинг Столът" },
  { src: "/images/location/gallery-05.jpg", alt: "Глемпинг Столът" },
  { src: "/images/location/gallery-06.jpg", alt: "Глемпинг Столът" },
  { src: "/images/location/gallery-07.jpg", alt: "Глемпинг Столът" },
  { src: "/images/location/gallery-08.jpg", alt: "Глемпинг Столът" },
  { src: "/images/location/gallery-09.jpg", alt: "Глемпинг Столът" },
  { src: "/images/location/gallery-10.jpg", alt: "Глемпинг Столът" },
  { src: "/images/location/gallery-11.jpg", alt: "Глемпинг Столът" },
  { src: "/images/location/gallery-12.jpg", alt: "Глемпинг Столът" },
  { src: "/images/pool-1.png",              alt: "Басейн — Глемпинг Столът" },
  { src: "/images/location/gallery-13.jpg", alt: "Глемпинг Столът" },
  { src: "/images/location/gallery-14.jpg", alt: "Глемпинг Столът" },
  { src: "/images/location/gallery-15.jpg", alt: "Глемпинг Столът" },
  { src: "/images/location/gallery-16.jpg", alt: "Глемпинг Столът" },
  { src: "/images/location/gallery-17.jpg", alt: "Глемпинг Столът" },
  { src: "/images/location/gallery-18.jpg", alt: "Глемпинг Столът" },
  { src: "/images/location/gallery-19.jpg", alt: "Глемпинг Столът" },
  { src: "/images/location/gallery-20.jpg", alt: "Глемпинг Столът" },
  { src: "/images/location/gallery-21.jpg", alt: "Глемпинг Столът" },
  { src: "/images/pool-2.png",              alt: "Басейн с деца — Глемпинг Столът" },
  { src: "/images/location/gallery-22.jpg", alt: "Глемпинг Столът" },
  { src: "/images/location/gallery-23.jpg", alt: "Глемпинг Столът" },
  { src: "/images/location/gallery-24.jpg", alt: "Глемпинг Столът" },
  { src: "/images/location/gallery-26.jpg", alt: "Глемпинг Столът" },
  { src: "/images/location/gallery-27.jpg", alt: "Глемпинг Столът" },
  { src: "/images/location/gallery-28.jpg", alt: "Глемпинг Столът" },
  { src: "/images/location/gallery-29.jpg", alt: "Глемпинг Столът" },
  { src: "/images/location/gallery-30.jpg", alt: "Глемпинг Столът" },
];

export default function LocationGallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const close = useCallback(() => setLightbox(null), []);
  const prev = useCallback(() =>
    setLightbox((i) => (i !== null ? (i - 1 + PHOTOS.length) % PHOTOS.length : null)),
    []
  );
  const next = useCallback(() =>
    setLightbox((i) => (i !== null ? (i + 1) % PHOTOS.length : null)),
    []
  );

  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [lightbox, close, prev, next]);

  return (
    <>
      {/* Grid */}
      <div className="columns-2 sm:columns-3 gap-2 sm:gap-3 space-y-2 sm:space-y-3">
        {PHOTOS.map((photo, i) => (
          <button
            key={i}
            onClick={() => setLightbox(i)}
            className="block w-full overflow-hidden rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-teal group"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={600}
              height={450}
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, 33vw"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={close}
        >
          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm tabular-nums select-none">
            {lightbox + 1} / {PHOTOS.length}
          </div>

          {/* Close */}
          <button
            onClick={close}
            className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl leading-none select-none transition-colors"
            aria-label="Затвори"
          >
            ×
          </button>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-2 sm:left-6 text-white/70 hover:text-white text-4xl select-none transition-colors p-2"
            aria-label="Предишна"
          >
            ‹
          </button>

          {/* Image */}
          <div
            className="relative max-w-5xl max-h-[85vh] mx-12 sm:mx-20"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={PHOTOS[lightbox].src}
              alt={PHOTOS[lightbox].alt}
              width={1400}
              height={1050}
              className="max-h-[85vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
              priority
              sizes="(max-width: 1400px) 100vw, 1400px"
            />
          </div>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-2 sm:right-6 text-white/70 hover:text-white text-4xl select-none transition-colors p-2"
            aria-label="Следваща"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}

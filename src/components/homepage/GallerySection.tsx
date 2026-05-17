import Link from "next/link";
import Image from "next/image";

// Pick a curated subset that looks great in the homepage grid
const photos = [
  { src: "/images/location/gallery-01.jpg", wide: true },
  { src: "/images/location/gallery-04.jpg", wide: false },
  { src: "/images/location/gallery-07.jpg", wide: false },
  { src: "/images/location/gallery-10.jpg", wide: false },
  { src: "/images/location/gallery-13.jpg", wide: false },
  { src: "/images/location/gallery-16.jpg", wide: false },
  { src: "/images/location/gallery-19.jpg", wide: false },
  { src: "/images/location/gallery-22.jpg", wide: false },
  { src: "/images/location/gallery-25.png", wide: false },
  { src: "/images/location/gallery-28.jpg", wide: false },
  { src: "/images/location/gallery-03.jpg", wide: false },
];

export default function GallerySection() {
  return (
    <section className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-teal text-sm font-semibold uppercase tracking-widest">
            Галерия
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-light text-forest" style={{ fontFamily: "var(--font-serif)" }}>
            Усети атмосферата
          </h2>
          <p className="mt-3 text-moss max-w-xl mx-auto text-sm">
            Снимки от Глемпинг Столът — нашата база сред природата в с. Столът, Севлиево.
          </p>
        </div>

        {/* Photo grid — first photo spans 2 cols + 2 rows */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          {photos.map((photo, i) => (
            <Link
              key={i}
              href="/location"
              className={`group relative rounded-xl overflow-hidden bg-linen ${
                i === 0 ? "col-span-2 row-span-2" : ""
              }`}
              style={{ aspectRatio: i === 0 ? "1" : "4/3" }}
            >
              <Image
                src={photo.src}
                alt="Глемпинг Столът"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes={
                  i === 0
                    ? "(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 50vw"
                    : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                }
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/location"
            className="inline-flex items-center gap-2 bg-teal hover:bg-teal-dark text-white font-semibold px-6 py-3 rounded-full transition-all"
          >
            Виж всички снимки от локацията →
          </Link>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";

// Placeholder gallery items — will be replaced with real photos
const galleryItems = [
  { emoji: "🎨", label: "Творческо ателие", category: "Ателие" },
  { emoji: "🌿", label: "Глемпинг тентовете", category: "Нощувка" },
  { emoji: "🔬", label: "STEAM работилница", category: "STEAM" },
  { emoji: "🌅", label: "Залез над поляната", category: "Природа" },
  { emoji: "🏕️", label: "Лагерен огън", category: "Вечер" },
  { emoji: "🖌️", label: "Пленер сред природата", category: "Ателие" },
  { emoji: "🤝", label: "Групов проект", category: "Екип" },
  { emoji: "🏆", label: "Ден на родителите", category: "Празник" },
];

export default function GallerySection() {
  return (
    <section className="py-24 bg-[#12253a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-[#f5a623] text-sm font-semibold uppercase tracking-widest">
            Галерия
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-white">
            Усети атмосферата
          </h2>
          <p className="mt-3 text-white/60 max-w-xl mx-auto text-sm">
            Снимки от предишни сесии — ателиетата, глемпинга, природата и незабравимите моменти.
          </p>
        </div>

        {/* Gallery grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {galleryItems.map((item, i) => (
            <div
              key={i}
              className={`group relative rounded-xl overflow-hidden bg-[#1e3a52]/50 border border-white/10 hover:border-[#f5a623]/30 transition-all duration-300 cursor-pointer ${i === 0 ? "col-span-2 row-span-2" : ""}`}
              style={{ aspectRatio: i === 0 ? "1" : "1" }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <span className={`${i === 0 ? "text-6xl" : "text-4xl"}`}>{item.emoji}</span>
                <span className="text-white/40 text-xs">{item.category}</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                <p className="text-white text-xs font-medium">{item.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/location"
            className="inline-flex items-center gap-2 bg-[#f5a623] hover:bg-[#f7b84a] text-[#0d1b2a] font-bold px-6 py-3 rounded-full transition-all"
          >
            Виж локацията в детайл →
          </Link>
        </div>
      </div>
    </section>
  );
}

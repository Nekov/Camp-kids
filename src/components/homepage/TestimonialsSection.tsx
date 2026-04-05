import { prisma } from "@/lib/db";

export default async function TestimonialsSection() {
  const testimonials = await prisma.testimonial.findMany({
    where: { featured: true },
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="py-24 bg-[#0d1b2a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-[#f5a623] text-sm font-semibold uppercase tracking-widest">
            Отзиви
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-white">
            Какво казват родителите?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-2xl bg-[#1e3a52]/50 border border-white/10 hover:border-white/20 transition-all flex flex-col gap-4"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="text-[#f5a623] text-sm">★</span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-white/80 text-sm leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#f5a623]/30 to-[#2d6a2f]/30 flex items-center justify-center text-white font-bold text-sm">
                  {t.parentName.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{t.parentName}</p>
                  <p className="text-white/40 text-xs">
                    {t.childAge && `Дете ${t.childAge} г.`}
                    {t.sessionYear && ` • Лагер ${t.sessionYear}`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

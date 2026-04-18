import { prisma } from "@/lib/db";

export default async function TestimonialsSection() {
  const testimonials = await prisma.testimonial.findMany({
    where: { featured: true },
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="py-24 bg-sand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-teal text-sm font-semibold uppercase tracking-widest">
            Отзиви
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-light text-forest" style={{ fontFamily: "var(--font-serif)" }}>
            Какво казват родителите?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-2xl bg-cream border border-forest/10 hover:border-teal/20 hover:shadow-md transition-all flex flex-col gap-4"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="text-gold text-sm">★</span>
                ))}
              </div>

              <p className="text-moss text-sm leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-2 border-t border-forest/10">
                <div className="w-9 h-9 rounded-full bg-teal/15 flex items-center justify-center text-teal font-bold text-sm">
                  {t.parentName.charAt(0)}
                </div>
                <div>
                  <p className="text-forest font-semibold text-sm">{t.parentName}</p>
                  <p className="text-moss/60 text-xs">
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

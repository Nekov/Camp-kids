export default function PhilosophySection() {
  return (
    <section className="py-14 bg-sand border-b border-forest/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left: heading */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-teal" />
              <span className="text-teal text-xs font-semibold uppercase tracking-widest">
                Нашата философия
              </span>
            </div>
            <h2
              className="text-4xl sm:text-5xl font-light text-forest leading-[1.1]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Не просто лагер.<br />
              <em className="text-teal">Среда</em> за растеж.
            </h2>
          </div>

          {/* Right: quote + two paragraphs */}
          <div>
            <blockquote className="border-l-2 border-teal pl-5 mb-6">
              <p
                className="text-forest text-lg font-light leading-snug italic"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                „Детското любопитство има нужда от терен. То се отглежда с
                предизвикателства, изненадващи задачи и време за провал."
              </p>
            </blockquote>

            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 text-moss text-sm leading-relaxed">
              <p>
                За нас всяка творческа форма е език — инструмент към способността
                ни да разказваме истории. С нас децата чуват идеите си,
                преодоляват срамежливостта си и развиват уменията си.
              </p>
              <p>
                Осигуряваме огромно разнообразие от материали и гарантираме
                растежа на всяко дете. Нашият екип е от професионалисти–магистри
                с педагогическо образование. И най-важното — забавляват се истински.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

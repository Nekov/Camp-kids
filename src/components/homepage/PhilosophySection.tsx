export default function PhilosophySection() {
  return (
    <section className="py-24 bg-sand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left: Big heading */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-teal" />
              <span className="text-teal text-xs font-semibold uppercase tracking-widest">
                Нашата философия
              </span>
            </div>
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-light text-forest leading-[1.1]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Не просто<br />
              лагер.<br />
              <em className="text-teal">Среда</em><br />
              за растеж.
            </h2>
          </div>

          {/* Right: Quote + body */}
          <div className="lg:pt-16">
            <blockquote className="border-l-2 border-teal pl-5 mb-8">
              <p
                className="text-forest text-xl sm:text-2xl font-light leading-snug italic"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                „Детското любопитство има нужда от терен. То се отглежда с
                предизвикателства, изненадващи задачи и време за провал."
              </p>
            </blockquote>

            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5 text-moss text-base leading-relaxed">
              <p>
                За нас всяка творческа форма е език —
                инструмент към способността ни да разказваме
                истории. С нас децата чуват идеите си,
                преодоляват срамежливостта си и развиват
                уменията си.
              </p>
              <p>
                гарантираме растежа на всяко дете и да запалим
                неговото любопитство.
              </p>
              <p>
                Осигуряваме огромно разнообразие от
                материали, притежаваме достатъчно опит, за да
              </p>
              <p>
                Нашият екип е от професионалисти–магистри в
                различни творчески и научни сфери, с
                педагогическо образование и богат натрупан
                опит. И най-важното — забавляват се истински.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

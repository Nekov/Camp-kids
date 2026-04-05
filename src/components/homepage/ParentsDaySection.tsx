import Link from "next/link";

export default function ParentsDaySection() {
  return (
    <section className="py-24 bg-[#0d1b2a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: visual */}
          <div className="relative">
            <div className="rounded-2xl bg-gradient-to-br from-[#f5a623]/10 to-[#2d6a2f]/10 border border-[#f5a623]/20 p-10 text-center">
              <div className="text-7xl mb-4">🏆</div>
              <div className="text-[#f5a623] font-bold text-xl mb-2">Денят на таланта</div>
              <div className="text-white/60 text-sm">Последният ден от всяка сесия</div>
              <div className="mt-6 space-y-2 text-left">
                {[
                  "Изложба на детските творби",
                  "Разходка из глемпинга",
                  "Запознанство с новите приятели",
                  "Споделяне на историите от седмицата",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-white/70 text-sm">
                    <span className="text-[#f5a623]">✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: text */}
          <div>
            <span className="text-[#f5a623] text-sm font-semibold uppercase tracking-widest">
              Последният ден
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-white leading-tight mb-5">
              Празникът на таланта — <span className="text-[#f5a623]">моментът, за който чакате</span>
            </h2>
            <p className="text-white/70 text-base leading-relaxed mb-4">
              Последният ден от всяка сесия е посветен на вас — родителите. Пристигате, за да видите
              резултата от седмицата: изложба на творбите, представяне на проектите, срещи с новите приятели.
            </p>
            <p className="text-white/70 text-base leading-relaxed mb-4">
              Ще видите истинска грижа и любов към децата. Ще чуете как детето ви разказва
              за ателиетата, за лагерния огън, за дружбата. Ще видите работи, в които няма перфектни
              линии — само истинско изразяване.
            </p>
            <blockquote className="border-l-2 border-[#f5a623] pl-4 italic text-white/50 text-sm mb-6">
              „Когато дойдох на Деня на родителите, дъщеря ми ме срещна с усмивка, каквато рядко виждам.
              Тя ми показа всяко нещо, което беше направила — с гордост и увереност."
              <span className="block mt-1 not-italic text-white/40">— Майка на 9-годишна участничка, 2025</span>
            </blockquote>
            <Link
              href="/programs/session-1"
              className="inline-flex items-center gap-2 bg-[#f5a623] hover:bg-[#f7b84a] text-[#0d1b2a] font-bold px-6 py-3 rounded-full transition-all"
            >
              Запишете дете за 2026 →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

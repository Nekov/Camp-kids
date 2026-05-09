import Link from "next/link";

const weekProgram = [
  { day: "Ден 1", label: "Пристигане & запознанство", desc: "Настаняване в глемпинга, опознаване на групата, първи творчески занимания." },
  { day: "Ден 2–4", label: "Творчески ателиета", desc: "Живопис, скулптура, STEAM проекти, природни науки и работа на открито." },
  { day: "Ден 5", label: "Представяне на проектите", desc: "Всяко дете довършва работата си и се подготвя за изложбата." },
  { day: "Ден 6", label: "Лагерен огън & кино", desc: "Вечер на споделяне, лятно кино под звездите, последна нощ заедно." },
  { day: "Ден 7", label: "Празникът на таланта", desc: "Родителите пристигат. Изложба на творбите, разходка, сбогом." },
];

export default function ParentsDaySection() {
  return (
    <section className="py-24 bg-night">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Left: weekly program */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-teal" />
              <span className="text-teal text-xs font-semibold uppercase tracking-widest">Програма на седмицата</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-light text-white leading-tight mb-8" style={{ fontFamily: "var(--font-serif)" }}>
              Какво се случва{" "}
              <em className="text-gold not-italic">всеки ден</em>
            </h2>

            <div className="space-y-4">
              {weekProgram.map((item) => (
                <div key={item.day} className="flex gap-4">
                  <div className="shrink-0 w-16 text-right">
                    <span className="text-teal text-xs font-bold uppercase tracking-wider">{item.day}</span>
                  </div>
                  <div className="flex-1 border-l border-forest/40 pl-4 pb-4">
                    <p className="text-white font-semibold text-sm mb-0.5">{item.label}</p>
                    <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Parents Day highlight */}
          <div>
            <div className="rounded-2xl bg-forest/40 border border-gold/20 p-8 text-center mb-8">
              <div className="text-7xl mb-4">🏆</div>
              <div className="text-gold font-semibold text-xl mb-2" style={{ fontFamily: "var(--font-serif)" }}>Денят на таланта</div>
              <div className="text-white/60 text-sm mb-6">Последният ден от всяка сесия</div>
              <div className="space-y-2 text-left">
                {[
                  "Изложба на детските творби",
                  "Разходка из глемпинга",
                  "Запознанство с новите приятели",
                  "Споделяне на историите от седмицата",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-white/70 text-sm">
                    <span className="text-teal">✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <h3 className="text-2xl font-light text-white mb-4" style={{ fontFamily: "var(--font-serif)" }}>
              Празникът на таланта —{" "}
              <em className="text-gold not-italic">моментът, за който чакате</em>
            </h3>
            <p className="text-white/70 text-base leading-relaxed mb-4">
              Последният ден от всяка сесия е посветен на вас — родителите. Пристигате, за да видите
              резултата от работата на вашето дете: изложба на творбите, представяне на проектите, срещи с новите приятели.
            </p>
            <blockquote className="border-l-2 border-teal pl-4 italic text-white/50 text-sm mb-6">
              „Когато дойдох на Деня на родителите, дъщеря ми ме срещна с усмивка, каквато рядко виждам.
              Тя ми показа всяко нещо, което беше направила — с гордост и увереност."
              <span className="block mt-1 not-italic text-white/40">— Майка на 9-годишна участничка, 2025</span>
            </blockquote>
            <Link
              href="/#sessions"
              className="inline-flex items-center gap-2 bg-teal hover:bg-teal-dark text-white font-semibold px-6 py-3 rounded-full transition-all"
            >
              Запишете дете за 2026 →
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}

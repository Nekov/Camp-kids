const pillars = [
  {
    icon: "🔍",
    title: "Любопитство",
    subtitle: "Детското любопитство има нужда от терен",
    body: "Не задаваме темата — задаваме пространството. Всяко дете пристига с въпроси, ние им даваме материалите и свободата да открият отговорите сами.",
  },
  {
    icon: "⚗️",
    title: "Експеримент",
    subtitle: "Безброй материали, абсолютно забавление",
    body: "Отказваме се от перфектния резултат. Важен е процесът: пробата, грешката, опитът отново. Децата учат, че провалът е просто следващата стъпка.",
  },
  {
    icon: "🎨",
    title: "Творчество",
    subtitle: "Всяка творческа форма е език",
    body: "Живопис, скулптура, театър, наука — всяка дисциплина е инструмент за разказване на истории. Детето, което може да се изрази по много начини, е дете без граници.",
  },
  {
    icon: "✨",
    title: "Въображение",
    subtitle: "Пряк път към откритията на бъдещето",
    body: "Имаме пряк път към откритията на бъдещето — въображението. Всяко дете, което вярва, че може да създаде нещо, е дете, което вярва, че може да промени света.",
  },
];

export default function PhilosophySection() {
  return (
    <section className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mb-16">
          <span className="text-teal text-sm font-semibold uppercase tracking-widest">
            Нашата философия
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-light text-forest leading-tight" style={{ fontFamily: "var(--font-serif)" }}>
            Децата умеят да създават.{" "}
            <em className="text-teal not-italic">Ние им правим терена.</em>
          </h2>
          <p className="mt-5 text-moss text-base leading-relaxed">
            Не сме просто лагер. Сме творческа среда, проектирана да активира потенциала
            на всяко дете чрез четири фундаментални принципа.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="group p-6 rounded-2xl bg-linen border border-forest/10 hover:border-teal/30 hover:shadow-md transition-all duration-300"
            >
              <div className="text-4xl mb-4">{p.icon}</div>
              <h3 className="text-forest font-semibold text-lg mb-1 group-hover:text-teal transition-colors">
                {p.title}
              </h3>
              <p className="text-teal text-xs font-medium mb-3 italic">
                {p.subtitle}
              </p>
              <p className="text-moss text-sm leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-2xl bg-mint border border-teal/20">
          <p className="text-fern text-base leading-relaxed text-center italic max-w-3xl mx-auto">
            „Вдъхновени от философията на Buck&apos;s Rock — целта не е перфектният резултат.
            Целта е откривателят, не откритието. Процесът е продуктът."
          </p>
          <p className="text-center text-moss text-sm mt-3">
            — Фондация „Мечта в джоба"
          </p>
        </div>
      </div>
    </section>
  );
}

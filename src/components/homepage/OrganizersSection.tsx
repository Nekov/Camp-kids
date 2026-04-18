import Link from "next/link";

const teamMembers = [
  {
    name: "Мария Николова",
    title: "Художник и педагог",
    credentials: "НХА, магистър живопис",
    icon: "👩‍🎨",
  },
  {
    name: "Петър Стоянов",
    title: "Скулптор и арт педагог",
    credentials: "НХА, магистър скулптура",
    icon: "👨‍🏫",
  },
  {
    name: "Елена Иванова",
    title: "Художник и илюстратор",
    credentials: "НБУ, магистър илюстрация",
    icon: "👩‍🎨",
  },
];

export default function OrganizersSection() {
  return (
    <section className="py-24 bg-linen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div>
            <span className="text-teal text-sm font-semibold uppercase tracking-widest">
              Екипът
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-light text-forest leading-tight mb-4" style={{ fontFamily: "var(--font-serif)" }}>
              Кой стои зад лагера?
            </h2>
            <p className="text-moss text-base leading-relaxed mb-4">
              Фондация „Мечта в джоба" е създадена от хора, влюбени в изкуството и детското развитие.
              Всеки от нашите педагози е практикуващ художник с магистърска степен и специализация
              в работа с деца.
            </p>
            <p className="text-moss text-base leading-relaxed mb-6">
              Вярваме, че децата заслужават да работят с истински творци —
              не просто с хора, прочели книги за изкуство.
            </p>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-teal/15 flex items-center justify-center text-teal font-bold text-sm">
                400+
              </div>
              <p className="text-moss text-sm">
                <span className="text-forest font-semibold">Доверени от 400+ семейства</span>{" "}
                от цяла България
              </p>
            </div>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 bg-forest hover:bg-forest-mid text-white font-semibold px-6 py-3 rounded-full transition-all"
            >
              Узнайте повече за нас →
            </Link>
          </div>

          {/* Right: Team cards */}
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="flex items-center gap-4 p-4 rounded-xl bg-cream border border-forest/10 hover:border-teal/20 transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-teal/10 flex items-center justify-center text-2xl shrink-0">
                  {member.icon}
                </div>
                <div className="flex-1">
                  <h4 className="text-forest font-semibold text-sm">{member.name}</h4>
                  <p className="text-teal text-xs">{member.title}</p>
                  <p className="text-moss/60 text-xs mt-0.5">{member.credentials}</p>
                </div>
                <div className="shrink-0 flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-gold text-xs">★</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

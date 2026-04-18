const skills = [
  {
    icon: "💡",
    name: "Творчество и въображение",
    desc: "Изразяване чрез множество дисциплини — живопис, скулптура, дизайн.",
    level: 5,
  },
  {
    icon: "🔧",
    name: "Решаване на проблеми",
    desc: "158 опита преди пробива. Учим децата да не се предават.",
    level: 4,
  },
  {
    icon: "🤝",
    name: "Работа в екип",
    desc: "Нови приятелства, останали след лагера. Груповите проекти учат на сътрудничество.",
    level: 5,
  },
  {
    icon: "🦁",
    name: "Самостоятелност и увереност",
    desc: "Първите стъпки далеч от родителите, в безопасна и подкрепяща среда.",
    level: 4,
  },
  {
    icon: "🌿",
    name: "Екологична осъзнатост",
    desc: "Устойчивостта като творческа тема. Природата като партньор, не ресурс.",
    level: 3,
  },
  {
    icon: "🎯",
    name: "Фокус и търпение",
    desc: "Дисциплината на творческия процес — концентрацията, която изкуството изисква.",
    level: 4,
  },
];

export default function SkillsSection() {
  return (
    <section className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="text-teal text-sm font-semibold uppercase tracking-widest">
            Какво печели детето ви
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-light text-forest" style={{ fontFamily: "var(--font-serif)" }}>
            Умения за цял живот
          </h2>
          <p className="mt-4 text-moss max-w-xl mx-auto text-base">
            Всяка сесия развива конкретни умения — представени с реален напредък,
            не просто с обещания.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.map((skill) => (
            <div
              key={skill.name}
              className="flex gap-4 p-5 rounded-2xl bg-linen border border-forest/10 hover:border-teal/20 transition-all"
            >
              <span className="text-3xl shrink-0">{skill.icon}</span>
              <div className="flex-1">
                <h3 className="text-forest font-semibold text-sm mb-1">{skill.name}</h3>
                <p className="text-moss text-xs leading-relaxed mb-3">{skill.desc}</p>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-1.5 rounded-full ${i < skill.level ? "bg-teal" : "bg-forest/15"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const stats = [
  { number: "8+", label: "Години опит" },
  { number: "400+", label: "Деца участвали" },
  { number: "4.9★", label: "Рейтинг от родители" },
  { number: "12+", label: "Творчески дисциплини" },
  { number: "100%", label: "Педагози магистри" },
];

export default function NumbersStrip() {
  return (
    <section className="py-16 bg-forest">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl sm:text-4xl font-light text-gold mb-1" style={{ fontFamily: "var(--font-serif)" }}>
                {stat.number}
              </div>
              <div className="text-white/70 text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

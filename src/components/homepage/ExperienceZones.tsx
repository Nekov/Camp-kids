const zones = [
  {
    icon: "🌿",
    title: "Нощувка в глемпинг",
    desc: "Луксозни тентове с лично баня, климатик, удобни легла и WiFi. Природата среща комфорта.",
    detail: "Всяко дете има собствено легло и необходимото пространство. Частните санитарни помещения са задължителен стандарт.",
  },
  {
    icon: "🍳",
    title: "Храна и готварство",
    desc: "Три основни хранения и две закуски дневно. Пресни продукти, приготвени на място.",
    detail: "Децата участват в готвенето. Менюто е разработено от диетолог — питателно, разнообразно, приготвено с любов.",
  },
  {
    icon: "🎨",
    title: "Творческото ателие",
    desc: "Изящни изкуства, приложни изкуства, занаяти, експериментално творчество.",
    detail: "Изобилие от материали. Няма грешни отговори. Всяко ателие е уникален свят, чакащ да бъде открит.",
  },
  {
    icon: "🔬",
    title: "STEAM зоната",
    desc: "Научни експерименти, изобретения, проекти за устойчивост.",
    detail: "Любопитството среща метода. Децата правят истински хипотези, провеждат истински опити и получават истински отговори.",
  },
  {
    icon: "🌄",
    title: "Природа и откривания",
    desc: "Открити поляни, хълмове, чист въздух. Пленери, вечерни лагерни огньове.",
    detail: "Природата е нашето най-голямо ателие. Разходки, наблюдение на звезди, рисуване сред пейзажа — незабравими моменти.",
  },
];

export default function ExperienceZones() {
  return (
    <section className="py-24 bg-sand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="text-teal text-sm font-semibold uppercase tracking-widest">
            Петте зони на лагера
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-light text-forest" style={{ fontFamily: "var(--font-serif)" }}>
            Всяка зона е свой свят
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {zones.map((zone, i) => (
            <div
              key={zone.title}
              className={`group relative p-6 rounded-2xl bg-cream border border-forest/10 hover:border-teal/30 hover:shadow-md transition-all duration-300 ${i === 2 ? "md:col-span-2 lg:col-span-1" : ""}`}
            >
              <div className="text-4xl mb-4">{zone.icon}</div>
              <h3 className="text-forest font-semibold text-lg mb-2">{zone.title}</h3>
              <p className="text-moss text-sm leading-relaxed mb-3">{zone.desc}</p>
              <p className="text-moss/70 text-xs leading-relaxed">{zone.detail}</p>
              <div className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full bg-teal opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

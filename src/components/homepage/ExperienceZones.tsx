const zones = [
  {
    icon: "🌿",
    title: "Нощувка в глемпинг",
    desc: "Луксозни тентове с лично баня, климатик, удобни легла и WiFi. Природата среща комфорта.",
    detail: "Всяко дете има собствено легло и необходимото пространство. Частните санитарни помещения са задължителен стандарт.",
    color: "from-emerald-900/40 to-[#1e3a52]",
    accent: "#4cad4e",
  },
  {
    icon: "🍳",
    title: "Храна и готварство",
    desc: "Три основни хранения и две закуски дневно. Пресни продукти, приготвени на място.",
    detail: "Децата участват в готвенето. Менюто е разработено от диетолог — питателно, разнообразно, приготвено с любов.",
    color: "from-orange-900/40 to-[#1e3a52]",
    accent: "#f5a623",
  },
  {
    icon: "🎨",
    title: "Творческото ателие",
    desc: "Изящни изкуства, приложни изкуства, занаяти, експериментално творчество.",
    detail: "Изобилие от материали. Нняма грешни отговори. Всяко ателие е уникален свят, чакащ да бъде открит.",
    color: "from-purple-900/40 to-[#1e3a52]",
    accent: "#a78bfa",
  },
  {
    icon: "🔬",
    title: "STEAM зоната",
    desc: "Научни експерименти, изобретения, проекти за устойчивост.",
    detail: "Любопитството среща метода. Децата правят истински хипотези, провеждат истински опити и получават истински отговори.",
    color: "from-blue-900/40 to-[#1e3a52]",
    accent: "#60a5fa",
  },
  {
    icon: "🌄",
    title: "Природа и откривания",
    desc: "Открити поляни, хълмове, чист въздух. Пленери, вечерни лагерни огньове.",
    detail: "Природата е нашето най-голямо ателие. Разходки, наблюдение на звезди, рисуване сред пейзажа — незабравими моменти.",
    color: "from-teal-900/40 to-[#1e3a52]",
    accent: "#2dd4bf",
  },
];

export default function ExperienceZones() {
  return (
    <section className="py-24 bg-[#0d1b2a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="text-[#f5a623] text-sm font-semibold uppercase tracking-widest">
            Петте зони на лагера
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-white">
            Всяка зона е свой свят
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {zones.map((zone, i) => (
            <div
              key={zone.title}
              className={`group relative p-6 rounded-2xl bg-gradient-to-br ${zone.color} border border-white/10 hover:border-white/20 transition-all duration-300 ${i === 2 ? "md:col-span-2 lg:col-span-1" : ""}`}
            >
              <div className="text-4xl mb-4">{zone.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2">{zone.title}</h3>
              <p className="text-white/70 text-sm leading-relaxed mb-3">{zone.desc}</p>
              <p className="text-white/40 text-xs leading-relaxed">{zone.detail}</p>
              {/* Accent line */}
              <div
                className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: zone.accent }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

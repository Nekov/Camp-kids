export default function UspStrip() {
  const usps = [
    {
      icon: "🎨",
      title: "STEAM дисциплини",
      desc: "Изкуства и природни науки",
    },
    {
      icon: "🎓",
      title: "Експертен екип",
      desc: "Магистри с педагогическо образование",
    },
    {
      icon: "🌳",
      title: "Глемпинг в природата",
      desc: "21м2 луксозни палатки със собствена баня. Басейн.",
    },
    {
      icon: "👨‍👩‍👧‍👦",
      title: "Малки групи",
      desc: "Максимум 30 деца, ратио 1:6",
    },
    {
      icon: "✨",
      title: "All-inclusive",
      desc: "Нощувка, храна, всички материали",
    },
    {
      icon: "📞",
      title: "Личен контакт",
      desc: "Директна връзка с организаторите",
    },
  ];

  return (
    <section className="bg-sand border-y border-forest/10 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {usps.map((usp) => (
            <div key={usp.title} className="flex flex-col items-center text-center gap-2">
              <span className="text-3xl">{usp.icon}</span>
              <p className="text-forest font-semibold text-base leading-tight">{usp.title}</p>
              <p className="text-moss text-sm leading-relaxed">{usp.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

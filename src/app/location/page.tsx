import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Глемпинг Столът — Локацията | Мечта в джоба",
  description: "Запознай се с Глемпинг Столът — нашата база сред природата в с. Столът, общ. Севлиево.",
};

const amenities = [
  { icon: "🏕️", title: "Глемпинг тентове", desc: "Просторни тентове с климатик, удобни легла, топли завивки и безопасна система за съхранение на багаж." },
  { icon: "🚿", title: "Лична баня", desc: "Всеки тент разполага с собствена санитарна единица — душ, тоалетна, мивка." },
  { icon: "🍳", title: "Кухня и трапезария", desc: "Прясна храна, приготвена на място всеки ден. Три основни хранения и две закуски дневно." },
  { icon: "🏊", title: "Басейн", desc: "Открит басейн, достъпен по време на свободното време." },
  { icon: "☀️", title: "Открити ателиета", desc: "Специално оборудвани пространства за творческа работа на открито." },
  { icon: "🔥", title: "Лагерен огън", desc: "Вечерни събирания около огъня — разговори, музика, истории." },
  { icon: "🎬", title: "Лятно кино", desc: "Прожекции под открито небе с меки стелки и звезди." },
  { icon: "📶", title: "WiFi", desc: "Силна WiFi мрежа покрива цялата площадка." },
];

const distances = [
  { city: "София", time: "2ч 15мин" },
  { city: "Пловдив", time: "2ч 30мин" },
  { city: "Велико Търново", time: "45мин" },
  { city: "Габрово", time: "30мин" },
];

export default function LocationPage() {
  return (
    <>
      <Navbar />
      <main className="bg-sand min-h-screen">
        {/* Hero */}
        <section className="pt-28 pb-16 bg-cream border-b border-forest/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-teal" />
              <span className="text-teal text-xs font-semibold uppercase tracking-widest">Локацията</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-light text-forest leading-tight mb-4" style={{ fontFamily: "var(--font-serif)" }}>
              Глемпинг Столът
            </h1>
            <p className="text-moss text-lg leading-relaxed max-w-2xl">
              Природата като класна стая. С. Столът, общ. Севлиево — сред хълмове, ливади и
              чист въздух, на 2 часа от София.
            </p>
          </div>
        </section>

        {/* Description */}
        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-10">
            <div className="space-y-4 text-moss text-base leading-relaxed">
              <p>
                Глемпинг Столът е нашата база — но да го наречеш „база" е недостатъчно. Това е
                пространство, внимателно избрано, за да активира в децата онова, което класните стаи
                не могат: присъствие, любопитство и чувство за принадлежност към природата.
              </p>
              <p>
                Хълмовете около Столът предлагат панорамна гледка, открити ливади за пленери и
                вечерно небе, рядко видяно от градски деца. Звездите над лагерния огън правят
                всяка вечер незабравима.
              </p>
              <p>
                Комбинацията от луксозен глемпинг и природна аутентичност е нашата формула:
                децата са удобни — но напълно потопени в природата.
              </p>
            </div>

            {/* Amenities mini-grid */}
            <div className="grid grid-cols-2 gap-3">
              {amenities.slice(0, 6).map((a) => (
                <div key={a.title} className="p-3 rounded-xl bg-cream border border-forest/10 text-center">
                  <span className="text-2xl">{a.icon}</span>
                  <p className="text-forest text-xs font-semibold mt-1">{a.title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Full amenities */}
        <section className="py-16 bg-cream border-y border-forest/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-light text-forest mb-8" style={{ fontFamily: "var(--font-serif)" }}>Всичко на едно място</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {amenities.map((a) => (
                <div key={a.title} className="flex gap-4 p-4 rounded-xl bg-linen border border-forest/10">
                  <span className="text-2xl shrink-0">{a.icon}</span>
                  <div>
                    <h3 className="text-forest font-semibold text-sm mb-1">{a.title}</h3>
                    <p className="text-moss text-xs leading-relaxed">{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Getting there */}
        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-light text-forest mb-6" style={{ fontFamily: "var(--font-serif)" }}>Как да стигнете</h2>
          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <h3 className="text-moss font-semibold text-sm mb-3">Разстояния от основни градове</h3>
              <div className="space-y-2">
                {distances.map((d) => (
                  <div key={d.city} className="flex items-center justify-between p-3 rounded-xl bg-cream border border-forest/10 text-sm">
                    <span className="text-forest">{d.city}</span>
                    <span className="text-teal font-semibold">{d.time}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3 text-moss text-sm leading-relaxed">
              <p><strong className="text-forest">Адрес:</strong> с. Столът, общ. Севлиево, обл. Габрово</p>
              <p><strong className="text-forest">Точна локация:</strong> Ще изпратим GPS координати и детайлни инструкции след потвърждение на записването.</p>
              <p><strong className="text-forest">Организиран транспорт:</strong> При интерес от достатъчно семейства можем да организираме транспорт от София и Велико Търново.</p>
            </div>
          </div>
        </section>

        {/* Gallery placeholder */}
        <section className="py-16 bg-linen border-y border-forest/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-light text-forest mb-8" style={{ fontFamily: "var(--font-serif)" }}>Галерия</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {["🏕️", "🌄", "🔥", "🏊", "🌿", "⛺"].map((emoji, i) => (
                <div key={i} className={`rounded-xl bg-forest/10 border border-forest/10 flex items-center justify-center ${i === 0 ? "col-span-2 h-48" : "h-32"}`}>
                  <span className="text-4xl opacity-40">{emoji}</span>
                </div>
              ))}
            </div>
            <p className="text-moss/50 text-sm mt-4 text-center">Снимки от Глемпинг Столът — очаквайте скоро</p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 text-center bg-sand">
          <Link href="/#sessions" className="inline-flex items-center gap-2 bg-teal hover:bg-teal-dark text-white font-semibold px-8 py-4 rounded-full transition-all">
            Запишете дете за 2026 →
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}

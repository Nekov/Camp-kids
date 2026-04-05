import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "За нас | Мечта в джоба",
  description: "Фондация Мечта в джоба - нашата история, философия и екип.",
};

const team = [
  {
    name: "Мария Николова",
    title: "Основател и художник педагог",
    credentials: "Магистър живопис, НХА · 8 г. опит",
    bio: "Мария е основател на фондацията и главен идеолог на творческите лагери. Художник с активна изложбена практика и над 8 години опит в работата с деца от всички възрасти. Вярва, че изкуството е език — и всяко дете може да го говори.",
    icon: "👩‍🎨",
  },
  {
    name: "Петър Стоянов",
    title: "Скулптор и STEAM педагог",
    credentials: "Магистър скулптура, НХА · STEAM сертификат",
    bio: "Петър разработва уникалните STEAM програми на лагера, обединяващи изкуство и наука. Специализира работа с глина и природни материали. Има опит в разработката на образователни програми за НЕ и частни институции.",
    icon: "👨‍🏫",
  },
  {
    name: "Елена Иванова",
    title: "Илюстратор и арт педагог",
    credentials: "Магистър илюстрация, НБУ · 6 г. опит",
    bio: "Елена е илюстратор с две публикувани детски книги и 6 години опит в работата с деца. Специализира в разказването чрез образи — и учи децата да намерят своята уникална творческа гледна точка.",
    icon: "👩‍🎨",
  },
];

const trustSignals = [
  { icon: "📅", label: "8+", desc: "Години работа с деца" },
  { icon: "👧", label: "400+", desc: "Деца участвали в програмите" },
  { icon: "🏆", label: "4.9★", desc: "Средна оценка от родители" },
  { icon: "🔐", label: "100%", desc: "Застраховани участници" },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#0d1b2a] min-h-screen">
        {/* Hero */}
        <section className="pt-28 pb-16 bg-gradient-to-br from-[#0a1628] to-[#12253a]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <span className="text-[#f5a623] text-sm font-semibold uppercase tracking-widest">За нас</span>
            <h1 className="mt-2 text-3xl sm:text-5xl font-bold text-white leading-tight mb-4">
              Хората зад лагера
            </h1>
            <p className="text-white/60 text-lg leading-relaxed">
              Фондация „Мечта в джоба" — екип от практикуващи художници и педагози, обединени
              от убеждението, че творчеството е основна детска потребност, не лукс.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-white mb-6">Нашата история</h2>
          <div className="prose prose-invert max-w-none space-y-4">
            <p className="text-white/70 leading-relaxed">
              Мечта в джоба се роди от един прост въпрос: защо толкова малко деца имат достъп до
              истинско, дълбоко творческо образование? Не рисуване в час по изобразително изкуство,
              а истинско ателие — с реални материали, реални художници и реален процес на откривание.
            </p>
            <p className="text-white/70 leading-relaxed">
              Фондацията е регистрирана с цел развитие на детското творческо образование и организиране
              на програми, в които изкуството, науката и природата се срещат. „Мечта в джоба" е метафора —
              идеята, че всяко дете носи в себе си нещо уникално, нещо, което чака да бъде открито и
              изразено. Нашата роля е да създадем терена за това.
            </p>
            <p className="text-white/70 leading-relaxed">
              Изборът на Глемпинг Столът като локация не е случаен. Природата не е просто фон —
              тя е активен участник в творческия процес. Открити поляни, чист въздух, звезди —
              те активират вид присъствие и внимание, което е невъзможно в класна стая.
            </p>
          </div>
        </section>

        {/* Philosophy */}
        <section className="py-16 bg-[#12253a]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-white mb-6">Нашата философия</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  title: "Процесът над продукта",
                  body: "Не се интересуваме от перфектния резултат. Интересуваме се от откривателя — детето, което пробва, греши, учи и пробва пак. Тази философия е вдъхновена от Buck's Rock в САЩ.",
                },
                {
                  title: "Изкуството като език",
                  body: "Всяка творческа форма — живопис, скулптура, театър, наука — е инструмент за разказване. Детето, което може да се изрази по много начини, е дете без граници.",
                },
                {
                  title: "Природата като партньор",
                  body: "Работим навън. Рисуваме пейзажи. Правим бои от пръст. Събираме природни материали. Природата ни учи на наблюдателност, търпение и смирение пред красотата.",
                },
                {
                  title: "Малки групи, голям ефект",
                  body: "Максимум 28 деца, ратио 1:6. Всеки педагог познава всяко дете. Индивидуалният подход не е обещание — той е структурна необходимост.",
                },
              ].map((item) => (
                <div key={item.title} className="p-5 rounded-xl bg-[#1e3a52]/50 border border-white/10">
                  <h3 className="text-white font-bold text-sm mb-2">{item.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-white mb-8">Екипът</h2>
          <div className="space-y-6">
            {team.map((member) => (
              <div key={member.name} className="flex gap-5 p-6 rounded-2xl bg-[#1e3a52]/40 border border-white/10">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#f5a623]/20 to-[#2d6a2f]/20 flex items-center justify-center text-3xl shrink-0">
                  {member.icon}
                </div>
                <div>
                  <h3 className="text-white font-bold text-base">{member.name}</h3>
                  <p className="text-[#f5a623]/80 text-sm mb-1">{member.title}</p>
                  <p className="text-white/40 text-xs mb-3">🎓 {member.credentials}</p>
                  <p className="text-white/60 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-white/40 text-sm mt-4">
            Всички педагози са преминали проверка на съдебно минало и обучение по първа помощ.
            Ратио деца/педагог: максимум 6:1.
          </p>
        </section>

        {/* Trust signals */}
        <section className="py-12 bg-[#12253a]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              {trustSignals.map((s) => (
                <div key={s.label}>
                  <div className="text-3xl font-bold text-[#f5a623] mb-1">{s.label}</div>
                  <div className="text-white/50 text-xs">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Готови сте?</h2>
          <Link
            href="/#sessions"
            className="inline-flex items-center gap-2 bg-[#f5a623] hover:bg-[#f7b84a] text-[#0d1b2a] font-bold px-8 py-4 rounded-full transition-all"
          >
            Виж програмите за 2026 →
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}

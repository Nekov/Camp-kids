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
  { label: "8+", desc: "Години работа с деца" },
  { label: "280+", desc: "Деца участвали" },
  { label: "4.9★", desc: "Оценка от родители" },
  { label: "100%", desc: "Застраховани участници" },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="bg-sand min-h-screen">
        {/* Hero */}
        <section className="pt-28 pb-16 bg-cream border-b border-forest/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-teal" />
              <span className="text-teal text-xs font-semibold uppercase tracking-widest">За нас</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-light text-forest leading-tight mb-4" style={{ fontFamily: "var(--font-serif)" }}>
              Хората зад лагера
            </h1>
            <p className="text-moss text-lg leading-relaxed max-w-2xl">
              Фондация „Мечта в джоба" — основана от Севда Троева с убеждението, че творчеството
              е основна детска потребност, не лукс.
            </p>
          </div>
        </section>

        {/* Founder */}
        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-teal" />
            <span className="text-teal text-xs font-semibold uppercase tracking-widest">Основателят</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            <div className="w-20 h-20 rounded-full bg-teal/10 flex items-center justify-center text-4xl shrink-0">
              👩‍🎨
            </div>
            <div className="space-y-4 text-moss text-base leading-relaxed">
              <h2 className="text-2xl font-light text-forest" style={{ fontFamily: "var(--font-serif)" }}>
                Здравейте! Аз съм Севда.
              </h2>
              <p>
                Като малка имах много мечти — някои много смешни и детски, някои твърде сериозни. Не се отказах от никоя от тях. Израснах с прекрасни родители, които никога не сложиха граница на възможностите ми. Напротив, дадоха ми философския поглед за света и ме научиха да щастливея насред работата си. Показаха ми, че имам силата да случвам, каквото мечтая. Но най-вече ме научиха да давам винаги когато мога. И когато не мога.
              </p>
              <p>
                Фондацията създадох с подкрепата на моя съпруг и вярата на всички мои приятели, че има смисъл от това начинание. За съжаление, поводът беше загубата на много ценен за мен човек — Учител, който също като родителите ми вдъхновяваше детето, което бях, така че да постигна човека, който съм днес.
              </p>
              <p>
                Продължих образованието си в сферата на педагогика по изкуствата, първо в Софийския университет „Св. Климент Охридски", а впоследствие на различни обмени и проекти в Европа.
              </p>
              <p className="text-forest font-medium">Благодаря ви, че сте тук!</p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 bg-cream border-y border-forest/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-teal" />
              <span className="text-teal text-xs font-semibold uppercase tracking-widest">Мисията</span>
            </div>
            <h2 className="text-2xl font-light text-forest mb-6" style={{ fontFamily: "var(--font-serif)" }}>
              Фондация „Мечта в джоба"
            </h2>
            <div className="space-y-4 text-moss text-base leading-relaxed">
              <p>
                Фондация „Мечта в джоба" се стреми да поощрява децата и младите хора да следват мечтите си и да развиват потенциала си. Чрез различни курсове, семинари, конкурси, стипендии и разнообразни дейности ние даваме на децата възможност да разширят хоризонтите си. Основен фокус в нашата работа са изкуствата, науката и образованието.
              </p>
              <p>
                Вярваме, че освен трупане на знания в училище, едно подрастващо дете трябва да се докосне до различните творчески форми, така че да обогати личността си и да развие все по-осезаемо нужните качества за общуване, презентиране и критично мислене. Ние помагаме за това със занятия и събития в сферата на изящните и приложни изкуства и сценичните форми.
              </p>
              <p>
                А когато стане лято, обединяваме всички изкуства в една чудесна ваканция — Международен летен лагер „Приятели". Лагерът притежава уникална структура, която освен приятното време заедно, помага на децата да усетят своята сила, да прескочат своите притеснения и да развият качествата си за работа в екип.
              </p>
              <p>
                Накратко, ние не признаваме израза „Това не може да стане". Търсим начини, питаме „Защо?", „Каква е пречката?", „Какво ни спира?". Задаваме най-важния въпрос — „Как може да стане?".
              </p>
              <p>
                Намираме отговори и подкрепяме деца, млади хора и организации в техните проекти, желания и мечти — с обучение, информация, лични примери, срещи с успешни хора в различните сфери и не на последно място с финансиране. Ние сме приятел, съветник и настойник в преследването на техните мечти.
              </p>
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section className="py-16 bg-cream border-y border-forest/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-light text-forest mb-6" style={{ fontFamily: "var(--font-serif)" }}>Нашата философия</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { title: "Процесът над продукта", body: "Не се интересуваме от перфектния резултат. Интересуваме се от откривателя — детето, което пробва, греши, учи и пробва пак. Тази философия е вдъхновена от Buck's Rock в САЩ." },
                { title: "Изкуството като език", body: "Всяка творческа форма — живопис, скулптура, театър, наука — е инструмент за разказване. Детето, което може да се изрази по много начини, е дете без граници." },
                { title: "Природата като партньор", body: "Работим навън. Рисуваме пейзажи. Правим бои от пръст. Събираме природни материали. Природата ни учи на наблюдателност, търпение и смирение пред красотата." },
                { title: "Малки групи, голям ефект", body: "Максимум 30 деца с минимум 5 педагога. Всеки педагог познава всяко дете. Индивидуалният подход не е обещание — той е фундаментална необходимост." },
              ].map((item) => (
                <div key={item.title} className="p-5 rounded-xl bg-linen border border-forest/10">
                  <h3 className="text-forest font-semibold text-sm mb-2">{item.title}</h3>
                  <p className="text-moss text-sm leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-light text-forest mb-8" style={{ fontFamily: "var(--font-serif)" }}>Екипът</h2>
          <div className="space-y-6">
            {team.map((member) => (
              <div key={member.name} className="flex gap-5 p-6 rounded-2xl bg-cream border border-forest/10">
                <div className="w-16 h-16 rounded-full bg-teal/10 flex items-center justify-center text-3xl shrink-0">
                  {member.icon}
                </div>
                <div>
                  <h3 className="text-forest font-semibold text-base">{member.name}</h3>
                  <p className="text-teal text-sm mb-1">{member.title}</p>
                  <p className="text-moss/60 text-xs mb-3">🎓 {member.credentials}</p>
                  <p className="text-moss text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-moss/50 text-sm mt-4">
            Всички педагози са преминали проверка на съдебно минало и обучение по първа помощ.
            Ратио деца/педагог: максимум 6:1.
          </p>
        </section>

        {/* Trust signals */}
        <section className="py-12 bg-forest">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              {trustSignals.map((s) => (
                <div key={s.label}>
                  <div className="text-3xl font-light text-gold mb-1" style={{ fontFamily: "var(--font-serif)" }}>{s.label}</div>
                  <div className="text-white/60 text-xs">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 text-center bg-sand">
          <h2 className="text-2xl font-light text-forest mb-4" style={{ fontFamily: "var(--font-serif)" }}>Готови сте?</h2>
          <Link href="/#sessions" className="inline-flex items-center gap-2 bg-teal hover:bg-teal-dark text-white font-semibold px-8 py-4 rounded-full transition-all">
            Виж програмите за 2026 →
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}

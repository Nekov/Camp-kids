"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqCategories = [
  {
    category: "Записване и плащане",
    items: [
      { q: "Как да запиша дете?", a: "Изберете сесия от нашия уебсайт, попълнете формата за записване (2–3 минути) и платете депозита от €200. След това ще се свържем с вас в рамките на 24 часа с потвърждение и договор." },
      { q: "Какъв е размерът на депозита?", a: "Депозитът за потвърждение на място е €200 на дете. Той се приспада от общата сума. Окончателното плащане е дължимо в рамките на 4 седмици от подписването на договора." },
      { q: "Мога ли да платя с карта?", a: "Да, приемаме плащания с карта чрез Stripe. Можете също да платите с банков превод — банковите данни са посочени в потвърждението." },
      { q: "Каква е политиката при отказ?", a: "При отказ повече от 30 дни преди началото: пълно възстановяване на депозита. При отказ 14–30 дни: 50% от депозита. При отказ по-малко от 14 дни: депозитът не се възстановява, освен при извънредни обстоятелства." },
      { q: "Има ли отстъпка за второ дете?", a: "Да — 6% отстъпка за всяко следващо дете от едно и също семейство, независимо дали записват за същата или различна сесия. Отстъпката се прилага автоматично при попълване на формата." },
    ],
  },
  {
    category: "За лагера",
    items: [
      { q: "Колко деца има на сесия?", a: "Максимум 28 деца на сесия. Това е строго ограничение — не правим изключения, тъй като ратиото деца/педагог е фундаментално за качеството на програмата." },
      { q: "Какво е ратиото деца/педагог?", a: "1 педагог на 6 деца максимум. Всеки педагог е практикуващ художник с магистърска степен и специализация в работата с деца." },
      { q: "Какво включва all-inclusive пакетът?", a: "Нощувка в глемпинг тент с лична баня, три основни хранения и две закуски дневно, всички материали за творческите ателиета, STEAM оборудване, достъп до басейна и всички вечерни активности." },
      { q: "На колко години са децата на Creative Camp?", a: "Сесии 1 и 2 са за деца 7–10 г., Сесии 3, 4 и 5 са за деца 7–14 г. Пленер програмата е за тийнейджъри 14–18 г." },
    ],
  },
  {
    category: "Логистика и практическо",
    items: [
      { q: "Как да стигна до лагера?", a: "Лагерът се провежда в Глемпинг Столът, с. Столът, общ. Севлиево — около 2ч 15мин от София, 45мин от Велико Търново. Точни инструкции изпращаме след потвърждение. При интерес можем да организираме транспорт от основни градове." },
      { q: "Какво да взема детето си?", a: "Детайлен списък с неща за носене изпращаме 2 седмици преди началото на сесията. Основното: удобни дрехи за работа навън, гумени обувки, нощни дрехи, лична аптечка. Творческите материали са осигурени от нас." },
      { q: "Мога ли да се свържа с детето си по време на лагера?", a: "Да. Имаме WiFi на площадката и децата могат да се свържат с родителите вечер. Ние имаме политика за ограничен екранен достъп по време на ателиетата — за максимален фокус и присъствие." },
      { q: "Какво ако детето ми се разболее?", a: "Разполагаме с медицинска аптечка и обучен в първа помощ персонал. При по-сериозно заболяване незабавно уведомяваме родителите. Лагерът е на 30 минути от Севлиево, където има болница." },
    ],
  },
  {
    category: "Денят на родителите",
    items: [
      { q: "Кога е Денят на родителите?", a: "Последният ден от всяка сесия (Ден 7) е посветен на семействата. Родителите пристигат следобед и са добре дошли да разгледат изложбата, да се разходят из глемпинга и да чуят историите от седмицата." },
      { q: "Трябва ли да регистрирам участието си в Деня на родителите?", a: "Не — просто пристигнете в посочения час. Ще уточним точния час в имейла, изпратен 3 дни преди края на сесията." },
    ],
  },
];

export default function FaqPage() {
  const [openItem, setOpenItem] = useState<string | null>(null);

  return (
    <>
      <Navbar />
      <main className="bg-[#0d1b2a] min-h-screen">
        <section className="pt-28 pb-16 bg-gradient-to-br from-[#0a1628] to-[#12253a]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <span className="text-[#f5a623] text-sm font-semibold uppercase tracking-widest">FAQ</span>
            <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-white mb-4">
              Въпроси и отговори
            </h1>
            <p className="text-white/60 text-base">
              Не намирате отговора? Пишете ни на{" "}
              <a href="mailto:info@dreaminmypocket.org" className="text-[#f5a623] hover:underline">
                info@dreaminmypocket.org
              </a>{" "}
              или се обадете на{" "}
              <a href="tel:+359885571638" className="text-[#f5a623] hover:underline">
                0885 571 638
              </a>
              .
            </p>
          </div>
        </section>

        <section className="py-12 max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
          {faqCategories.map((cat) => (
            <div key={cat.category}>
              <h2 className="text-white font-bold text-base mb-3 border-b border-white/10 pb-2">
                {cat.category}
              </h2>
              <div className="space-y-2">
                {cat.items.map((item) => {
                  const key = `${cat.category}-${item.q}`;
                  const isOpen = openItem === key;
                  return (
                    <div key={key} className="rounded-xl bg-[#1e3a52]/40 border border-white/10 overflow-hidden">
                      <button
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
                        onClick={() => setOpenItem(isOpen ? null : key)}
                      >
                        <span className="text-white font-medium text-sm">{item.q}</span>
                        <ChevronDown className={cn("w-4 h-4 text-white/40 shrink-0 ml-3 transition-transform", isOpen && "rotate-180")} />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 border-t border-white/5">
                          <p className="text-white/70 text-sm leading-relaxed pt-3">{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        <section className="py-12 text-center">
          <p className="text-white/50 text-sm mb-4">Готови да запишете дете?</p>
          <Link href="/#sessions" className="inline-flex items-center gap-2 bg-[#f5a623] hover:bg-[#f7b84a] text-[#0d1b2a] font-bold px-8 py-4 rounded-full transition-all">
            Виж програмите →
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}

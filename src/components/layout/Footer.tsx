import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-night border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center text-forest font-bold">
                М
              </div>
              <div>
                <div className="font-semibold text-white text-sm">Мечта в джоба</div>
                <div className="text-white/50 text-xs">Dream in My Pocket Foundation</div>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Творчески лагери за деца 7–18 г. сред природата на Глемпинг Столът.
              Изкуство, природа, наука и незабравими спомени.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://instagram.com/dreaminmypocket"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-teal/20 flex items-center justify-center text-white/70 hover:text-teal transition-all"
                aria-label="Instagram"
              >
                <span className="text-xs font-bold">IG</span>
              </a>
              <a
                href="https://facebook.com/dreaminmypocket"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-teal/20 flex items-center justify-center text-white/70 hover:text-teal transition-all"
                aria-label="Facebook"
              >
                <span className="text-xs font-bold">f</span>
              </a>
            </div>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Програми</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { name: "Сесия 1 — 31 май–6 юни", slug: "session-1" },
                { name: "Сесия 2 — 7–13 юни", slug: "session-2" },
                { name: "Сесия 3 — 14–20 юни", slug: "session-3" },
                { name: "Сесия 4 — 21–27 юни", slug: "session-4" },
                { name: "Сесия 5 — 28 юни–4 юли", slug: "session-5" },
                { name: "Пленер — 5–18 юли", slug: "plein-air" },
              ].map((s) => (
                <li key={s.slug}>
                  <Link href={`/programs/${s.slug}`} className="text-white/60 hover:text-teal transition-colors">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Информация</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { name: "За нас", href: "/about" },
                { name: "Локацията — Глемпинг Столът", href: "/location" },
                { name: "Въпроси и отговори", href: "/faq" },
                { name: "Блог", href: "/blog" },
                { name: "Условия за ползване", href: "/terms" },
                { name: "Политика за поверителност", href: "/privacy" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/60 hover:text-teal transition-colors">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Контакти</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="tel:+359885571638" className="flex items-center gap-2.5 text-white/60 hover:text-teal transition-colors">
                  <Phone className="w-4 h-4 text-teal shrink-0" />
                  0885 571 638
                </a>
              </li>
              <li>
                <a href="mailto:info@dreaminmypocket.org" className="flex items-center gap-2.5 text-white/60 hover:text-teal transition-colors">
                  <Mail className="w-4 h-4 text-teal shrink-0" />
                  info@dreaminmypocket.org
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-white/60">
                <MapPin className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                <span>с. Столът, общ. Севлиево<br />Глемпинг Столът</span>
              </li>
            </ul>
            <Link
              href="/programs/session-1"
              className="inline-block mt-5 bg-teal hover:bg-teal-dark text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-all"
            >
              Запишете дете →
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© 2026 Фондация „Мечта в джоба". Всички права запазени.</p>
          <p>IBAN: BG64FINV91501217544623 • ФОНДАЦИЯ МЕЧТА В ДЖОБА</p>
        </div>
      </div>
    </footer>
  );
}

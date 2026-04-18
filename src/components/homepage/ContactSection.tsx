"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setLoading(false);
  }

  return (
    <section id="contact" className="py-24 bg-sand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Contact info */}
          <div>
            <span className="text-teal text-sm font-semibold uppercase tracking-widest">
              Свържете се с нас
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-light text-forest leading-tight mb-5" style={{ fontFamily: "var(--font-serif)" }}>
              Имате въпроси? <br />
              <em className="text-teal not-italic">Ние сме тук.</em>
            </h2>
            <p className="text-moss text-base leading-relaxed mb-8">
              Директна линия към организаторите. Отговаряме в рамките на 24 часа —
              обичайно много по-бързо.
            </p>

            <div className="space-y-4">
              <a
                href="tel:+359885571638"
                className="flex items-center gap-4 p-4 rounded-xl bg-cream border border-forest/10 hover:border-teal/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center text-teal group-hover:bg-teal/20 transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-forest font-semibold">0885 571 638</p>
                  <p className="text-moss text-xs">Обаждане, Viber, WhatsApp</p>
                </div>
              </a>

              <a
                href="mailto:info@dreaminmypocket.org"
                className="flex items-center gap-4 p-4 rounded-xl bg-cream border border-forest/10 hover:border-teal/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center text-teal group-hover:bg-teal/20 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-forest font-semibold">info@dreaminmypocket.org</p>
                  <p className="text-moss text-xs">Отговор в рамките на 24 ч.</p>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-cream border border-forest/10">
                <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center text-teal">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-forest font-semibold">Глемпинг Столът</p>
                  <p className="text-moss text-xs">с. Столът, общ. Севлиево</p>
                </div>
              </div>

              <a
                href="https://wa.me/359885571638"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-cream border border-forest/10 hover:border-teal/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center text-teal group-hover:bg-teal/20 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-forest font-semibold">WhatsApp / Viber</p>
                  <p className="text-moss text-xs">0885 571 638</p>
                </div>
              </a>
            </div>
          </div>

          {/* Right: Contact form */}
          <div className="bg-cream border border-forest/10 rounded-2xl p-6 sm:p-8">
            {submitted ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-forest font-semibold text-xl mb-2">Съобщението е изпратено!</h3>
                <p className="text-moss text-sm">
                  Ще се свържем с вас в рамките на 24 часа.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-forest font-semibold text-lg mb-5">Изпратете запитване</h3>

                <div>
                  <label htmlFor="contact-name" className="block text-moss text-sm mb-1.5">Вашето име *</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    className="w-full bg-sand border border-forest/15 rounded-xl px-4 py-3 text-forest text-sm placeholder-moss/40 focus:outline-none focus:border-teal/50 transition-all"
                    placeholder="Иван Иванов"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-moss text-sm mb-1.5">Имейл адрес *</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    className="w-full bg-sand border border-forest/15 rounded-xl px-4 py-3 text-forest text-sm placeholder-moss/40 focus:outline-none focus:border-teal/50 transition-all"
                    placeholder="ivan@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="contact-phone" className="block text-moss text-sm mb-1.5">Телефон</label>
                  <input
                    id="contact-phone"
                    type="tel"
                    className="w-full bg-sand border border-forest/15 rounded-xl px-4 py-3 text-forest text-sm placeholder-moss/40 focus:outline-none focus:border-teal/50 transition-all"
                    placeholder="0888 123 456"
                  />
                </div>

                <div>
                  <label htmlFor="contact-session" className="block text-moss text-sm mb-1.5">Интересуваща сесия</label>
                  <select id="contact-session" className="w-full bg-sand border border-forest/15 rounded-xl px-4 py-3 text-forest text-sm focus:outline-none focus:border-teal/50 transition-all">
                    <option value="">Изберете сесия</option>
                    <option value="session-1">Сесия 1 — 31 май–6 юни (7–10 г.)</option>
                    <option value="session-2">Сесия 2 — 7–13 юни (7–10 г.)</option>
                    <option value="session-3">Сесия 3 — 14–20 юни (7–14 г.)</option>
                    <option value="session-4">Сесия 4 — 21–27 юни (7–14 г.)</option>
                    <option value="session-5">Сесия 5 — 28 юни–4 юли (7–14 г.)</option>
                    <option value="plein-air">Пленер — 5–18 юли (14–18 г.)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-moss text-sm mb-1.5">Съобщение</label>
                  <textarea
                    id="contact-message"
                    rows={3}
                    className="w-full bg-sand border border-forest/15 rounded-xl px-4 py-3 text-forest text-sm placeholder-moss/40 focus:outline-none focus:border-teal/50 transition-all resize-none"
                    placeholder="Вашето запитване..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal hover:bg-teal-dark disabled:opacity-70 text-white font-semibold py-3.5 rounded-xl transition-all text-sm"
                >
                  {loading ? "Изпращане..." : "Изпрати →"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

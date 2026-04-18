import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StickyCtaBar from "@/components/layout/StickyCtaBar";
import SessionBookingBlock from "@/components/session/SessionBookingBlock";
import SessionSchedule from "@/components/session/SessionSchedule";
import SessionGallery from "@/components/session/SessionGallery";
import { formatDateRange, spotsRemaining, fillPercent, formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  try {
    const sessions = await prisma.session.findMany({ select: { slug: true } });
    return sessions.map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const session = await prisma.session.findUnique({ where: { slug } });
  if (!session) return {};
  return {
    title: `${session.name} | Мечта в джоба`,
    description: `${session.tagline ?? "Творчески лагер"} • ${formatDateRange(session.startDate, session.endDate)} • ${session.minAge}–${session.maxAge} г.`,
  };
}

export default async function SessionPage({ params }: Props) {
  const { slug } = await params;
  const session = await prisma.session.findUnique({
    where: { slug },
    include: {
      pricingTiers: true,
      trainers: { include: { trainer: true } },
      testimonials: { take: 3 },
    },
  });

  if (!session) notFound();

  const remaining = spotsRemaining(session.capacity, session.spotsTaken);
  const pct = fillPercent(session.capacity, session.spotsTaken);
  const isSoldOut = session.status === "SOLD_OUT" || remaining === 0;
  const isConfirmed = session.spotsTaken >= session.confirmedThreshold;
  const earlyBird = session.pricingTiers.find((t) => t.tierType === "EARLY_BIRD");

  const skills = [
    { icon: "💡", name: "Творчество и въображение", desc: "Изразяване чрез множество дисциплини." },
    { icon: "🔧", name: "Решаване на проблеми", desc: "Упоритост, повторен опит, финален пробив." },
    { icon: "🤝", name: "Работа в екип", desc: "Групови проекти и нови приятелства." },
    { icon: "🦁", name: "Самостоятелност", desc: "Увереност, изградена чрез лично постижение." },
    { icon: "🌿", name: "Екологична осъзнатост", desc: "Природата като партньор в творчеството." },
    { icon: "🎯", name: "Фокус и търпение", desc: "Концентрацията на истинския творец." },
  ];

  const amenities = [
    { icon: "🏕️", label: "Глемпинг тент с лична баня" },
    { icon: "🍳", label: "Прясна храна, приготвена на място" },
    { icon: "☀️", label: "Открити творчески пространства" },
    { icon: "🏊", label: "Басейн" },
    { icon: "⛰️", label: "Планински пейзаж" },
    { icon: "🔥", label: "Лагерен огън" },
    { icon: "🎬", label: "Лятно кино" },
    { icon: "📶", label: "Силен WiFi" },
  ];

  return (
    <>
      <Navbar />
      <main className="bg-sand">

        {/* ── Gallery: full width, above everything ── */}
        <div className="pt-20">
          {/* Back link */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-3">
            <Link href="/#sessions" className="inline-flex items-center gap-1.5 text-moss/60 hover:text-forest text-sm transition-colors">
              ← Всички програми
            </Link>
          </div>
          {/* Gallery bleeds to edges on mobile, padded on desktop */}
          <div className="px-4 sm:px-6 lg:px-8">
            <SessionGallery sessionName={session.name} />
          </div>
        </div>

        {/* ── Hero: title + meta below gallery ── */}
        <section className="py-8 border-b border-forest/8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-3 gap-10 items-start">
              <div className="lg:col-span-2">
                {isConfirmed && (
                  <div className="inline-flex items-center gap-2 bg-mint border border-teal/30 rounded-full px-3 py-1 mb-3 text-sm text-teal font-medium">
                    ✅ Сесията е потвърдена
                  </div>
                )}

                <h1
                  className="text-4xl sm:text-5xl lg:text-[3.5rem] font-light text-forest leading-tight mb-2"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {session.name}
                </h1>

                {session.tagline && (
                  <p className="text-teal text-lg font-medium mb-5">{session.tagline}</p>
                )}

                {/* Meta pills */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { icon: "📅", text: formatDateRange(session.startDate, session.endDate) },
                    { icon: "👶", text: `${session.minAge}–${session.maxAge} години` },
                    { icon: "📍", text: "Глемпинг Столът, Севлиево" },
                    ...(earlyBird ? [{ icon: "💰", text: `От ${formatPrice(earlyBird.price)}`, highlight: true }] : []),
                  ].map(({ icon, text, highlight }) => (
                    <span
                      key={text}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border",
                        highlight
                          ? "bg-mint border-teal/30 text-teal font-semibold"
                          : "bg-cream border-forest/10 text-moss"
                      )}
                    >
                      {icon} {text}
                    </span>
                  ))}
                </div>
              </div>

              {/* Booking block — desktop */}
              <div className="hidden lg:block lg:col-span-1">
                <div className="sticky top-24">
                  <SessionBookingBlock session={session} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Main content ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid lg:grid-cols-3 gap-10">

            {/* Left column */}
            <div className="lg:col-span-2 space-y-10">

              {/* 2. Description — right after gallery */}
              {session.description && (
                <section>
                  <h2 className="text-2xl font-light text-forest mb-4" style={{ fontFamily: "var(--font-serif)" }}>
                    За тази сесия
                  </h2>
                  <div>
                    {session.description.split("\n\n").map((para, i) => (
                      <p key={i} className="text-moss leading-relaxed mb-3">{para}</p>
                    ))}
                  </div>
                </section>
              )}

              {/* 3. Amenities */}
              <section>
                <h2 className="text-2xl font-light text-forest mb-4" style={{ fontFamily: "var(--font-serif)" }}>
                  Удобства и условия
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {amenities.map((a) => (
                    <div key={a.label} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-cream border border-forest/10 text-center">
                      <span className="text-2xl">{a.icon}</span>
                      <span className="text-moss text-xs leading-tight">{a.label}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* 4. Schedule */}
              {session.schedule && (
                <SessionSchedule
                  schedule={session.schedule as { days: Array<{ day: number; theme: string; morning: string; afternoon: string; evening: string }> }}
                />
              )}

              {/* 5. Trainers */}
              {session.trainers.length > 0 && (
                <section>
                  <h2 className="text-2xl font-light text-forest mb-4" style={{ fontFamily: "var(--font-serif)" }}>
                    Ръководители на лагера
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {session.trainers.map(({ trainer }) => (
                      <div key={trainer.id} className="p-5 rounded-xl bg-cream border border-forest/10">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-full bg-teal/10 flex items-center justify-center text-xl">
                            👩‍🎨
                          </div>
                          <div>
                            <h4 className="text-forest font-semibold text-sm">{trainer.name}</h4>
                            <p className="text-teal text-xs">{trainer.title}</p>
                          </div>
                        </div>
                        {trainer.credentials && (
                          <p className="text-moss/50 text-xs mb-2">🎓 {trainer.credentials}</p>
                        )}
                        {trainer.bio && (
                          <p className="text-moss text-xs leading-relaxed mb-2">{trainer.bio}</p>
                        )}
                        {trainer.personalStatement && (
                          <blockquote className="border-l-2 border-teal/30 pl-3 italic text-moss/70 text-xs">
                            &ldquo;{trainer.personalStatement}&rdquo;
                          </blockquote>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* 6. Skills */}
              <section>
                <h2 className="text-2xl font-light text-forest mb-4" style={{ fontFamily: "var(--font-serif)" }}>
                  Какво ще развие детето ви
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {skills.map((skill) => (
                    <div key={skill.name} className="flex items-start gap-3 p-4 rounded-xl bg-cream border border-forest/10">
                      <span className="text-xl shrink-0">{skill.icon}</span>
                      <div>
                        <h4 className="text-forest font-semibold text-sm mb-0.5">{skill.name}</h4>
                        <p className="text-moss/70 text-xs">{skill.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 7. Testimonials */}
              {session.testimonials.length > 0 && (
                <section>
                  <h2 className="text-2xl font-light text-forest mb-4" style={{ fontFamily: "var(--font-serif)" }}>
                    Какво казват родителите
                  </h2>
                  <div className="space-y-4">
                    {session.testimonials.map((t) => (
                      <div key={t.id} className="p-5 rounded-xl bg-cream border border-forest/10">
                        <div className="flex gap-0.5 mb-2">
                          {Array.from({ length: t.rating }).map((_, i) => (
                            <span key={i} className="text-gold text-sm">★</span>
                          ))}
                        </div>
                        <p className="text-forest/80 text-sm leading-relaxed mb-3">&ldquo;{t.quote}&rdquo;</p>
                        <p className="text-moss/50 text-xs">
                          {t.parentName}
                          {t.childAge && ` • Дете ${t.childAge} г.`}
                          {t.sessionYear && ` • ${t.sessionYear}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right column: booking block sticky (desktop hidden in hero, shown here on scroll; mobile always here) */}
            <div className="lg:col-span-1">
              <div className="lg:hidden">
                <SessionBookingBlock session={session} />
              </div>
            </div>
          </div>
        </div>

      </main>
      <Footer />
      <StickyCtaBar spotsLeft={remaining} sessionSlug={session.slug} />
    </>
  );
}

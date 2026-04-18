import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StickyCtaBar from "@/components/layout/StickyCtaBar";
import SessionBookingBlock from "@/components/session/SessionBookingBlock";
import SessionSchedule from "@/components/session/SessionSchedule";
import { formatDateRange, spotsRemaining, fillPercent, getProgressColor, getProgressLabel, formatPrice } from "@/lib/utils";
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
  const color = getProgressColor(pct);
  const label = getProgressLabel(pct);
  const isSoldOut = session.status === "SOLD_OUT" || remaining === 0;
  const isConfirmed = session.spotsTaken >= session.confirmedThreshold;
  const earlyBird = session.pricingTiers.find((t) => t.tierType === "EARLY_BIRD");
  const standard = session.pricingTiers.find((t) => t.tierType === "STANDARD");

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
      <main>
        {/* Hero */}
        <section className="relative pt-28 pb-12 bg-forest overflow-hidden">
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#f5a623]/8 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="max-w-3xl">
              <Link href="/#sessions" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-6 transition-colors">
                ← Всички програми
              </Link>

              {isConfirmed && (
                <div className="inline-flex items-center gap-2 bg-mint border border-teal/30 rounded-full px-4 py-2 mb-4 text-sm text-teal">
                  ✅ Сесията е потвърдена
                </div>
              )}

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white leading-tight mb-3" style={{ fontFamily: "var(--font-serif)" }}>
                {session.name}
              </h1>
              {session.tagline && (
                <p className="text-teal text-lg mb-5">{session.tagline}</p>
              )}

              {/* Key details strip */}
              <div className="flex flex-wrap gap-4 text-sm text-white/70 mb-8">
                <span className="flex items-center gap-1.5">
                  📅 {formatDateRange(session.startDate, session.endDate)}
                </span>
                <span className="flex items-center gap-1.5">
                  👶 {session.minAge}–{session.maxAge} години
                </span>
                <span className="flex items-center gap-1.5">
                  📍 Глемпинг Столът, Севлиево
                </span>
                {earlyBird && (
                  <span className="flex items-center gap-1.5 text-teal">
                    💰 От {formatPrice(earlyBird.price)}
                  </span>
                )}
              </div>

              {/* Progress bar */}
              <div className="max-w-md">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className={cn("font-semibold", color === "green" && "text-teal", color === "yellow" && "text-amber", color === "red" && "text-ember")}>
                    {isSoldOut ? "Изчерпано" : `🔥 ${remaining} свободни места`}
                  </span>
                  <span className="text-moss/50">{label}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all", color === "green" && "bg-sage", color === "yellow" && "bg-amber", color === "red" && "bg-ember")} style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main content */}
        <div className="bg-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Left: content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Description */}
              <section>
                <h2 className="text-2xl font-semibold text-forest mb-5">За тази сесия</h2>
                <div className="max-w-none">
                  {session.description?.split("\n\n").map((para, i) => (
                    <p key={i} className="text-moss leading-relaxed mb-4">{para}</p>
                  ))}
                </div>
              </section>

              {/* Amenities */}
              <section>
                <h2 className="text-2xl font-semibold text-forest mb-5">Удобства и условия</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {amenities.map((a) => (
                    <div key={a.label} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-cream border border-forest/10 text-center">
                      <span className="text-2xl">{a.icon}</span>
                      <span className="text-moss text-xs leading-tight">{a.label}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Schedule */}
              {session.schedule && (
                <SessionSchedule schedule={session.schedule as { days: Array<{ day: number; theme: string; morning: string; afternoon: string; evening: string }> }} />
              )}

              {/* Trainers */}
              {session.trainers.length > 0 && (
                <section>
                  <h2 className="text-2xl font-semibold text-forest mb-5">Ръководители на лагера</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {session.trainers.map(({ trainer }) => (
                      <div key={trainer.id} className="p-5 rounded-xl bg-cream border border-forest/10">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-full bg-teal/10 flex items-center justify-center text-xl">
                            👩‍🎨
                          </div>
                          <div>
                            <h4 className="text-forest font-semibold text-sm">{trainer.name}</h4>
                            <p className="text-teal/80 text-xs">{trainer.title}</p>
                          </div>
                        </div>
                        {trainer.credentials && (
                          <p className="text-moss/50 text-xs mb-2">🎓 {trainer.credentials}</p>
                        )}
                        {trainer.bio && (
                          <p className="text-moss text-xs leading-relaxed mb-2">{trainer.bio}</p>
                        )}
                        {trainer.personalStatement && (
                          <blockquote className="border-l-2 border-teal/30 pl-3 italic text-moss/50 text-xs">
                            &ldquo;{trainer.personalStatement}&rdquo;
                          </blockquote>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Skills */}
              <section>
                <h2 className="text-2xl font-semibold text-forest mb-5">Какво ще развие детето ви</h2>
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

              {/* Testimonials */}
              {session.testimonials.length > 0 && (
                <section>
                  <h2 className="text-2xl font-semibold text-forest mb-5">Какво казват родителите</h2>
                  <div className="space-y-4">
                    {session.testimonials.map((t) => (
                      <div key={t.id} className="p-5 rounded-xl bg-cream border border-forest/10">
                        <div className="flex gap-0.5 mb-2">
                          {Array.from({ length: t.rating }).map((_, i) => (
                            <span key={i} className="text-teal text-xs">★</span>
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

            {/* Right: sticky booking block */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <SessionBookingBlock session={session} />
              </div>
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

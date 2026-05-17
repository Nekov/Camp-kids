import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma, withRetry } from "@/lib/db";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StickyCtaBar from "@/components/layout/StickyCtaBar";
import SessionBookingBlock from "@/components/session/SessionBookingBlock";
import SessionGallery from "@/components/session/SessionGallery";
import DateSelector from "@/components/session/DateSelector";
import { formatDateRange, campDuration, spotsRemaining, fillPercent, formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { getGroupBySlug, PROGRAM_GROUPS } from "@/lib/programGroups";

interface Props {
  params: Promise<{ slug: string }>;
}

// Cache program pages for 30 seconds — spots data stays fresh enough
// while eliminating per-request DB hits during high ad traffic.
export const revalidate = 30;
export const maxDuration = 30;

export async function generateStaticParams() {
  // Group slugs
  const groupParams = PROGRAM_GROUPS.map((g) => ({ slug: g.slug }));
  // Individual session slugs (fallback)
  try {
    const sessions = await prisma.session.findMany({ select: { slug: true } });
    const sessionParams = sessions.map((s) => ({ slug: s.slug }));
    return [...groupParams, ...sessionParams];
  } catch {
    return groupParams;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // Check if group slug first
  const group = getGroupBySlug(slug);
  if (group) {
    return {
      title: `${group.name} | Мечта в джоба`,
      description: `${group.tagline} · ${group.ageRange} · Глемпинг Столът, Севлиево`,
    };
  }

  const session = await prisma.session.findUnique({ where: { slug } });
  if (!session) return {};
  return {
    title: `${session.name} | Мечта в джоба`,
    description: `${session.tagline ?? "Творчески лагер"} • ${formatDateRange(session.startDate, session.endDate)} • ${session.minAge}–${session.maxAge} г.`,
  };
}

// ─── GROUP PAGE ─────────────────────────────────────────────────────────────

async function GroupPage({ slug }: { slug: string }) {
  const group = getGroupBySlug(slug)!;

  const sessions = await withRetry(() =>
    prisma.session.findMany({
      where: { slug: { in: group.sessionSlugs }, status: { not: "ARCHIVED" } },
      include: { pricingTiers: true, trainers: { include: { trainer: true } }, testimonials: { take: 3 } },
      orderBy: { startDate: "asc" },
    })
  );

  if (sessions.length === 0) notFound();

  // Use the first confirmed/active session for trainers and testimonials (best available data)
  const primarySession =
    sessions.find((s) => s.status === "ACTIVE") ?? sessions[0];

  const allTestimonials = sessions.flatMap((s) => s.testimonials).slice(0, 3);
  const trainers = primarySession.trainers;

  // Find cheapest price across all active sessions
  const now = new Date();
  let lowestPrice: number | null = null;
  for (const s of sessions) {
    const eb = s.pricingTiers.find(
      (t) => t.tierType === "EARLY_BIRD" && t.isActive && t.activeUntil && new Date(t.activeUntil) > now
    );
    const std = s.pricingTiers.find((t) => t.tierType === "STANDARD");
    const price = eb?.price ?? std?.price ?? null;
    if (price !== null && (lowestPrice === null || price < lowestPrice)) lowestPrice = price;
  }

  // Next active session for sticky CTA
  const nextSession = sessions.find(
    (s) => s.status !== "SOLD_OUT" && s.status !== "DRAFT" && spotsRemaining(s.capacity, s.spotsTaken) > 0
  );
  const remaining = nextSession ? spotsRemaining(nextSession.capacity, nextSession.spotsTaken) : 0;

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

  const galleryImages = group.galleryImages;

  return (
    <>
      <Navbar />
      <main className="bg-sand">

        {/* COVER HERO */}
        <div className="relative w-full" style={{ height: "clamp(360px, 55vw, 620px)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={group.heroImage}
            alt={group.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night/80 via-night/30 to-transparent" />

          <div className="absolute top-0 left-0 right-0 pt-24 px-4 sm:px-6 lg:px-8">
            <Link
              href="/#sessions"
              className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-colors"
            >
              ← Всички програми
            </Link>
          </div>

          <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 pb-8 max-w-7xl mx-auto">
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-light text-white leading-tight mb-2 drop-shadow-lg"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {group.name}
            </h1>
            <p className="text-white/80 text-lg mb-4 drop-shadow">{group.tagline}</p>
            <div className="flex flex-wrap gap-2">
              {[
                { icon: "👶", text: group.ageRange },
                { icon: "📍", text: "Глемпинг Столът, Севлиево" },
                ...(lowestPrice !== null ? [{ icon: "💰", text: `От ${formatPrice(lowestPrice)}`, highlight: true }] : []),
              ].map(({ icon, text, highlight }) => (
                <span
                  key={text}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm backdrop-blur-sm border",
                    highlight
                      ? "bg-teal/80 border-teal/60 text-white font-semibold"
                      : "bg-white/15 border-white/25 text-white"
                  )}
                >
                  {icon} {text}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* CONTENT + DATE SELECTOR */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid lg:grid-cols-3 gap-10 items-start">

            {/* Left: Description */}
            <div className="lg:col-span-2">
              {primarySession.description && (
                <div className="mb-10">
                  <h2 className="text-2xl font-light text-forest mb-4" style={{ fontFamily: "var(--font-serif)" }}>
                    За тази програма
                  </h2>
                  {primarySession.description.split("\n\n").map((para, i) => (
                    <p key={i} className="text-moss leading-relaxed mb-3">{para}</p>
                  ))}
                </div>
              )}

              {/* Gallery */}
              {galleryImages.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-2xl font-light text-forest mb-4" style={{ fontFamily: "var(--font-serif)" }}>
                    Снимки
                  </h2>
                  <SessionGallery images={galleryImages} sessionName={group.name} />
                </div>
              )}

              {/* Amenities */}
              <section className="mb-10">
                <h2 className="text-2xl font-light text-forest mb-4" style={{ fontFamily: "var(--font-serif)" }}>
                  Удобства и условия
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {amenities.map((a) => (
                    <div key={a.label} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-cream border border-forest/10 text-center">
                      <span className="text-2xl">{a.icon}</span>
                      <span className="text-moss text-sm leading-tight">{a.label}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Trainers */}
              {trainers.length > 0 && (
                <section className="mb-10">
                  <h2 className="text-2xl font-light text-forest mb-4" style={{ fontFamily: "var(--font-serif)" }}>
                    Ръководители на лагера
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {trainers.map(({ trainer }) => (
                      <div key={trainer.id} className="p-5 rounded-xl bg-cream border border-forest/10">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-full bg-teal/10 flex items-center justify-center text-xl">
                            👩‍🎨
                          </div>
                          <div>
                            <h4 className="text-forest font-semibold text-sm">{trainer.name}</h4>
                            <p className="text-teal text-sm">{trainer.title}</p>
                          </div>
                        </div>
                        {trainer.credentials && (
                          <p className="text-moss/50 text-sm mb-2">🎓 {trainer.credentials}</p>
                        )}
                        {trainer.bio && (
                          <p className="text-moss text-sm leading-relaxed mb-2">{trainer.bio}</p>
                        )}
                        {trainer.personalStatement && (
                          <blockquote className="border-l-2 border-teal/30 pl-3 italic text-moss/70 text-sm">
                            &ldquo;{trainer.personalStatement}&rdquo;
                          </blockquote>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Skills */}
              <section className="mb-10">
                <h2 className="text-2xl font-light text-forest mb-4" style={{ fontFamily: "var(--font-serif)" }}>
                  Какво ще развие детето ви
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {skills.map((skill) => (
                    <div key={skill.name} className="flex items-start gap-3 p-4 rounded-xl bg-cream border border-forest/10">
                      <span className="text-xl shrink-0">{skill.icon}</span>
                      <div>
                        <h4 className="text-forest font-semibold text-sm mb-0.5">{skill.name}</h4>
                        <p className="text-moss/70 text-sm">{skill.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Testimonials */}
              {allTestimonials.length > 0 && (
                <section>
                  <h2 className="text-2xl font-light text-forest mb-4" style={{ fontFamily: "var(--font-serif)" }}>
                    Какво казват родителите
                  </h2>
                  <div className="space-y-4">
                    {allTestimonials.map((t) => (
                      <div key={t.id} className="p-5 rounded-xl bg-cream border border-forest/10">
                        <div className="flex gap-0.5 mb-2">
                          {Array.from({ length: t.rating }).map((_, i) => (
                            <span key={i} className="text-gold text-sm">★</span>
                          ))}
                        </div>
                        <p className="text-forest/80 text-sm leading-relaxed mb-3">&ldquo;{t.quote}&rdquo;</p>
                        <p className="text-moss/50 text-sm">
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

            {/* Right: Date selector — sticky */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <DateSelector sessions={sessions} />
              </div>
            </div>
          </div>
        </div>

      </main>
      <Footer />
      {nextSession && (
        <StickyCtaBar spotsLeft={remaining} sessionSlug={nextSession.slug} />
      )}
    </>
  );
}

// ─── SESSION PAGE (individual fallback) ─────────────────────────────────────

async function SessionPage({ slug }: { slug: string }) {
  const session = await withRetry(() =>
    prisma.session.findUnique({
      where: { slug },
      include: {
        pricingTiers: true,
        trainers: { include: { trainer: true } },
        testimonials: { take: 3 },
      },
    })
  );

  if (!session) notFound();

  const remaining = spotsRemaining(session.capacity, session.spotsTaken);
  const pct = fillPercent(session.capacity, session.spotsTaken);
  const isSoldOut = session.status === "SOLD_OUT" || remaining === 0;
  const isConfirmed = session.spotsTaken >= session.confirmedThreshold;
  const earlyBird = session.pricingTiers.find((t) => t.tierType === "EARLY_BIRD");
  const coverImage = session.photoUrls?.[0] ?? null;
  const galleryImages = session.photoUrls?.slice(1) ?? [];

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

        {/* COVER HERO */}
        <div className="relative w-full" style={{ height: "clamp(360px, 55vw, 620px)" }}>
          {coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverImage}
              alt={session.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-forest/80 flex items-center justify-center">
              <span className="text-white/20 text-7xl">📷</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-night/80 via-night/30 to-transparent" />

          <div className="absolute top-0 left-0 right-0 pt-24 px-4 sm:px-6 lg:px-8">
            <Link
              href="/#sessions"
              className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-colors"
            >
              ← Всички програми
            </Link>
          </div>

          <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 pb-8 max-w-7xl mx-auto">
            {isConfirmed && (
              <div className="inline-flex items-center gap-2 bg-mint/90 border border-teal/40 rounded-full px-3 py-1 mb-3 text-sm text-teal font-medium backdrop-blur-sm">
                ✅ Сесията е потвърдена
              </div>
            )}
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-light text-white leading-tight mb-2 drop-shadow-lg"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {session.name}
            </h1>
            {session.tagline && (
              <p className="text-white/80 text-lg mb-4 drop-shadow">{session.tagline}</p>
            )}
            <div className="flex flex-wrap gap-2">
              {[
                { icon: "📅", text: formatDateRange(session.startDate, session.endDate) },
                { icon: "🕐", text: campDuration(session.startDate, session.endDate) },
                { icon: "👶", text: `${session.minAge}–${session.maxAge} години` },
                { icon: "📍", text: "Глемпинг Столът, Севлиево" },
                ...(earlyBird ? [{ icon: "💰", text: `От ${formatPrice(earlyBird.price)}`, highlight: true }] : []),
              ].map(({ icon, text, highlight }) => (
                <span
                  key={text}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm backdrop-blur-sm border",
                    highlight
                      ? "bg-teal/80 border-teal/60 text-white font-semibold"
                      : "bg-white/15 border-white/25 text-white"
                  )}
                >
                  {icon} {text}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* CONTENT + BOOKING */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid lg:grid-cols-3 gap-10 items-start">
            <div className="lg:col-span-2">
              {session.description && (
                <div className="mb-10">
                  <h2 className="text-2xl font-light text-forest mb-4" style={{ fontFamily: "var(--font-serif)" }}>
                    За тази сесия
                  </h2>
                  {session.description.split("\n\n").map((para, i) => (
                    <p key={i} className="text-moss leading-relaxed mb-3">{para}</p>
                  ))}
                </div>
              )}

              <div className="mb-10">
                <h2 className="text-2xl font-light text-forest mb-4" style={{ fontFamily: "var(--font-serif)" }}>
                  Снимки
                </h2>
                <SessionGallery images={galleryImages} sessionName={session.name} />
              </div>

              <section className="mb-10">
                <h2 className="text-2xl font-light text-forest mb-4" style={{ fontFamily: "var(--font-serif)" }}>
                  Удобства и условия
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {amenities.map((a) => (
                    <div key={a.label} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-cream border border-forest/10 text-center">
                      <span className="text-2xl">{a.icon}</span>
                      <span className="text-moss text-sm leading-tight">{a.label}</span>
                    </div>
                  ))}
                </div>
              </section>

              {session.trainers.length > 0 && (
                <section className="mb-10">
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
                            <p className="text-teal text-sm">{trainer.title}</p>
                          </div>
                        </div>
                        {trainer.credentials && (
                          <p className="text-moss/50 text-sm mb-2">🎓 {trainer.credentials}</p>
                        )}
                        {trainer.bio && (
                          <p className="text-moss text-sm leading-relaxed mb-2">{trainer.bio}</p>
                        )}
                        {trainer.personalStatement && (
                          <blockquote className="border-l-2 border-teal/30 pl-3 italic text-moss/70 text-sm">
                            &ldquo;{trainer.personalStatement}&rdquo;
                          </blockquote>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section className="mb-10">
                <h2 className="text-2xl font-light text-forest mb-4" style={{ fontFamily: "var(--font-serif)" }}>
                  Какво ще развие детето ви
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {skills.map((skill) => (
                    <div key={skill.name} className="flex items-start gap-3 p-4 rounded-xl bg-cream border border-forest/10">
                      <span className="text-xl shrink-0">{skill.icon}</span>
                      <div>
                        <h4 className="text-forest font-semibold text-sm mb-0.5">{skill.name}</h4>
                        <p className="text-moss/70 text-sm">{skill.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

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
                        <p className="text-moss/50 text-sm">
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

            <div className="lg:col-span-1">
              <div className="sticky top-24">
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

// ─── ROUTE DISPATCHER ────────────────────────────────────────────────────────

export default async function ProgramPage({ params }: Props) {
  const { slug } = await params;

  // Check group slug first (also handles "plein-air" which exists as both)
  const group = getGroupBySlug(slug);
  if (group) return <GroupPage slug={slug} />;

  // Fall back to individual session page
  return <SessionPage slug={slug} />;
}

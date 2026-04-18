export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ id?: string; payment?: string }>;
}

export default async function ConfirmationPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { id, payment } = await searchParams;

  const registration = id
    ? await prisma.registration.findUnique({
        where: { id },
        include: { children: true, session: true },
      })
    : null;

  const isBankTransfer = payment === "bank";
  const isStripeSuccess = payment === "success";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-sand pt-24 pb-16">
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-mint border border-teal/30 flex items-center justify-center text-4xl mx-auto mb-6">
            {isStripeSuccess ? "✅" : "🎉"}
          </div>

          <h1 className="text-2xl sm:text-3xl font-light text-forest mb-3" style={{ fontFamily: "var(--font-serif)" }}>
            {registration?.children[0]?.firstName
              ? `Благодарим ви, ${registration.children[0].firstName}!`
              : "Благодарим ви!"}
          </h1>

          <p className="text-moss text-base leading-relaxed mb-8">
            {isStripeSuccess
              ? "Депозитът е получен успешно. Ще се свържем с вас в рамките на 24 часа с договора."
              : "Заявката ви е получена. Ще се свържем с вас в рамките на 24 часа."}
          </p>

          <div className="bg-cream rounded-2xl border border-forest/10 p-6 text-left mb-6">
            <h3 className="text-forest font-semibold text-sm mb-4">Следващи стъпки:</h3>
            <div className="space-y-3">
              {(isBankTransfer
                ? ["Ще се свържем с вас в рамките на 24 часа", "Преведете депозита €200 в рамките на 3 дни", "Ще получите договора по имейл", "Окончателното плащане е дължимо до 4 седмици от подписването"]
                : ["Ще получите имейл с потвърждение", "В рамките на 48 часа ще изпратим договора", "Подпишете и върнете договора", "Окончателното плащане е дължимо до 4 седмици"]
              ).map((step, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <span className="w-5 h-5 rounded-full bg-teal/15 text-teal font-bold flex items-center justify-center shrink-0 text-xs mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-moss">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {isBankTransfer && (
            <div className="bg-cream rounded-2xl border border-teal/20 p-6 text-left mb-6">
              <h3 className="text-teal font-semibold text-sm mb-4">🏦 Банкови данни за депозита</h3>
              <div className="space-y-2 text-sm font-mono">
                <div>
                  <span className="text-moss/50 text-xs">Получател:</span>
                  <p className="text-forest font-semibold">ФОНДАЦИЯ МЕЧТА В ДЖОБА</p>
                </div>
                <div>
                  <span className="text-moss/50 text-xs">IBAN:</span>
                  <p className="text-forest font-semibold">BG64FINV91501217544623</p>
                </div>
                <div>
                  <span className="text-moss/50 text-xs">Сума:</span>
                  <p className="text-teal font-bold">€200</p>
                </div>
                {registration?.children && (
                  <div>
                    <span className="text-moss/50 text-xs">Основание:</span>
                    <p className="text-forest">
                      Летен лагер — {registration.children.map((c) => `${c.firstName} ${c.lastName}`).join(", ")}
                    </p>
                  </div>
                )}
              </div>
              <p className="text-amber text-xs mt-3">
                ⚠️ Моля, преведете в рамките на 3 дни за потвърждение на местото.
              </p>
            </div>
          )}

          <div className="text-moss text-sm mb-8">
            Въпроси?{" "}
            <a href="tel:+359885571638" className="text-teal hover:underline">0885 571 638</a>
            {" "}или{" "}
            <a href="mailto:info@dreaminmypocket.org" className="text-teal hover:underline">info@dreaminmypocket.org</a>
          </div>

          <Link href="/" className="inline-flex items-center gap-2 bg-forest/8 hover:bg-forest/15 text-forest font-medium px-6 py-3 rounded-full border border-forest/20 transition-all">
            ← Към началната страница
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

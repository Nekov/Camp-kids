"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Session, PricingTier } from "@prisma/client";
import { formatDateRange, formatPrice } from "@/lib/utils";
import Step1Children from "./Step1Children";
import Step2Parent from "./Step2Parent";
import Step3Payment from "./Step3Payment";

type SessionWithPricing = Session & { pricingTiers: PricingTier[] };

interface RegistrationFormProps {
  session: SessionWithPricing;
}

export interface ChildData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  dietaryNotes?: string;
  medicalNotes?: string;
}

export default function RegistrationForm({ session }: RegistrationFormProps) {
  const router = useRouter();
  const isFlowB = session.flowType === "B";
  const totalSteps = isFlowB ? 3 : 2;

  const [step, setStep] = useState(1);
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [children, setChildren] = useState<ChildData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const earlyBird = session.pricingTiers.find(
    (t) => t.tierType === "EARLY_BIRD" && t.isActive && t.activeUntil && new Date(t.activeUntil) > new Date()
  );
  const displayPrice = earlyBird ?? session.pricingTiers.find((t) => t.tierType === "STANDARD");

  async function handleStep1(childrenData: ChildData[], promoCode?: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: 1,
          sessionId: session.id,
          flowType: session.flowType,
          children: childrenData,
          promoCode,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Грешка при записване");
      setRegistrationId(data.registrationId);
      setTotalAmount(data.totalAmount);
      setChildren(childrenData);
      setStep(2);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Грешка");
    } finally {
      setLoading(false);
    }
  }

  async function handleStep2(parentData: {
    parentName: string;
    email: string;
    phone: string;
    attribution?: string;
    notes?: string;
  }) {
    if (!registrationId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: 2, registrationId, ...parentData }),
      });
      if (!res.ok) throw new Error("Грешка при записване");

      if (!isFlowB) {
        // Flow A: submit and go to confirmation
        await fetch("/api/registrations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ step: "submit", registrationId }),
        });
        router.push(`/register/${session.slug}/confirmation?id=${registrationId}`);
      } else {
        setStep(3);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Грешка");
    } finally {
      setLoading(false);
    }
  }

  async function handlePayment(method: "STRIPE" | "BANK_TRANSFER") {
    if (!registrationId) return;
    setLoading(true);
    setError(null);
    try {
      if (method === "STRIPE") {
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ registrationId }),
        });
        const data = await res.json();
        if (data.url) window.location.href = data.url;
      } else {
        // Bank transfer: submit then go to confirmation
        await fetch("/api/registrations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ step: "submit", registrationId }),
        });
        router.push(`/register/${session.slug}/confirmation?id=${registrationId}&payment=bank`);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Грешка");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-forest mb-1">Записване</h1>
        <p className="text-moss text-sm">{session.name}</p>
        <p className="text-moss/60 text-xs">
          {formatDateRange(session.startDate, session.endDate)} • {session.minAge}–{session.maxAge} г.
          {displayPrice && ` • От ${formatPrice(displayPrice.price)}`}
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const s = i + 1;
          return (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  s < step
                    ? "bg-teal text-white"
                    : s === step
                    ? "bg-teal text-white"
                    : "bg-forest/10 text-moss/60"
                }`}
              >
                {s < step ? "✓" : s}
              </div>
              {i < totalSteps - 1 && (
                <div className={`flex-1 h-0.5 w-12 ${s < step ? "bg-teal" : "bg-forest/15"}`} />
              )}
            </div>
          );
        })}
        <div className="ml-2 text-moss text-xs">
          Стъпка {step} от {totalSteps}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {step === 1 && (
        <Step1Children
          session={session}
          onNext={handleStep1}
          loading={loading}
        />
      )}
      {step === 2 && (
        <Step2Parent
          onNext={handleStep2}
          onBack={() => setStep(1)}
          loading={loading}
          isFlowB={isFlowB}
          totalAmount={totalAmount}
          childCount={children.length}
        />
      )}
      {step === 3 && isFlowB && registrationId && (
        <Step3Payment
          onPay={handlePayment}
          onBack={() => setStep(2)}
          loading={loading}
          totalAmount={totalAmount}
          children={children}
          sessionName={session.name}
        />
      )}
    </div>
  );
}

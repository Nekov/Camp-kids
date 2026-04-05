import type {
  Session,
  PricingTier,
  Trainer,
  Testimonial,
  Registration,
  Child,
  PromoCode,
  BlogPost,
} from "@prisma/client";

export type SessionWithDetails = Session & {
  pricingTiers: PricingTier[];
  trainers: Array<{ trainer: Trainer }>;
  testimonials: Testimonial[];
  _count?: { registrations: number };
};

export type SessionWithPricing = Session & {
  pricingTiers: PricingTier[];
};

export type RegistrationWithDetails = Registration & {
  children: Child[];
  session: Session;
  priceTier?: PricingTier | null;
  promoCode?: PromoCode | null;
};

export type ActiveTier = PricingTier & { isCurrentlyActive: boolean };

export interface RegistrationStep1Data {
  sessionId: string;
  children: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    dietaryNotes?: string;
    medicalNotes?: string;
  }[];
  promoCode?: string;
}

export interface RegistrationStep2Data {
  parentName: string;
  email: string;
  phone: string;
  attribution?: string;
  notes?: string;
  agreeToTerms: boolean;
}

export interface RegistrationStep3Data {
  promoCode?: string;
}

export interface RegistrationStep4Data {
  paymentMethod: "STRIPE" | "BANK_TRANSFER";
}

export interface SessionCardProps {
  session: SessionWithPricing;
  activeTier: PricingTier | null;
  earlyBirdDeadline?: Date | null;
}

export interface BlogPostSummary {
  id: string;
  title: string;
  slug: string;
  coverImage?: string | null;
  author: string;
  publishedAt?: Date | null;
  tags: string[];
  status: string;
}

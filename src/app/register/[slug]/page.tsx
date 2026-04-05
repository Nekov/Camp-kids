export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RegistrationForm from "@/components/registration/RegistrationForm";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const session = await prisma.session.findUnique({ where: { slug }, select: { name: true } });
  return { title: `Записване — ${session?.name ?? "Лагер"} | Мечта в джоба` };
}

export default async function RegisterPage({ params }: Props) {
  const { slug } = await params;
  const session = await prisma.session.findUnique({
    where: { slug },
    include: { pricingTiers: true },
  });
  if (!session) notFound();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0d1b2a] pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <RegistrationForm session={session} />
        </div>
      </main>
      <Footer />
    </>
  );
}

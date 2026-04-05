export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import CampEditForm from "@/components/admin/CampEditForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CampEditPage({ params }: Props) {
  const { id } = await params;
  const session = await prisma.session.findUnique({
    where: { id },
    include: { pricingTiers: true, trainers: { include: { trainer: true } } },
  });
  if (!session) notFound();

  return (
    <div className="max-w-3xl pt-14 lg:pt-0">
      <h1 className="text-xl font-bold text-white mb-6">Редактиране: {session.name}</h1>
      <CampEditForm session={session} />
    </div>
  );
}

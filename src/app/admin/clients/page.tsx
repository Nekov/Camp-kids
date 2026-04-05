export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import Link from "next/link";
import ClientsTable from "@/components/admin/ClientsTable";
import type { RegistrationStatus } from "@prisma/client";

interface Props {
  searchParams: Promise<{ status?: string; session?: string; search?: string }>;
}

const STATUS_LABELS: Record<RegistrationStatus, string> = {
  UNFINISHED: "Незавършена",
  FORM_SUBMITTED: "Форма подадена",
  DEPOSIT_PAID: "Депозит платен",
  CONTRACT_SENT: "Договор изпратен",
  CONTRACT_SIGNED: "Договор подписан",
  PAID_IN_FULL: "Платено изцяло",
  CANCELLED: "Отказано",
  OTHER: "Друго",
};

export default async function ClientsPage({ searchParams }: Props) {
  const { status, session: sessionFilter } = await searchParams;

  const where = {
    ...(status ? { status: status as RegistrationStatus } : {}),
    ...(sessionFilter ? { sessionId: sessionFilter } : {}),
  };

  const [registrations, sessions] = await Promise.all([
    prisma.registration.findMany({
      where,
      include: { children: true, session: true, priceTier: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.session.findMany({ select: { id: true, name: true }, orderBy: { displayOrder: "asc" } }),
  ]);

  return (
    <div className="max-w-full pt-14 lg:pt-0">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Клиенти</h1>
          <p className="text-white/50 text-sm mt-0.5">{registrations.length} записа</p>
        </div>
        <a
          href={`/api/admin/export?${status ? `status=${status}` : ""}`}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 text-white/70 text-sm rounded-xl transition-all border border-white/10"
        >
          📥 CSV
        </a>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/admin/clients"
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${!status ? "bg-[#f5a623]/15 border-[#f5a623]/40 text-[#f5a623]" : "bg-white/5 border-white/10 text-white/50 hover:text-white"}`}
        >
          Всички
        </Link>
        {Object.entries(STATUS_LABELS).map(([key, label]) => (
          <Link
            key={key}
            href={`/admin/clients?status=${key}`}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${status === key ? "bg-[#f5a623]/15 border-[#f5a623]/40 text-[#f5a623]" : "bg-white/5 border-white/10 text-white/50 hover:text-white"}`}
          >
            {label}
          </Link>
        ))}
      </div>

      <ClientsTable registrations={registrations} sessions={sessions} statusLabels={STATUS_LABELS} />
    </div>
  );
}

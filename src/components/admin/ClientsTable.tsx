"use client";

import React, { useState } from "react";
import type { Registration, Child, Session, PricingTier, RegistrationStatus } from "@prisma/client";
import { formatPrice } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

type RegWithDetails = Registration & {
  children: Child[];
  session: Session;
  priceTier: PricingTier | null;
};

const STATUS_COLORS: Record<RegistrationStatus, string> = {
  UNFINISHED: "text-white/40 bg-white/5",
  FORM_SUBMITTED: "text-blue-400 bg-blue-500/10",
  DEPOSIT_PAID: "text-amber-400 bg-amber-500/10",
  CONTRACT_SENT: "text-purple-400 bg-purple-500/10",
  CONTRACT_SIGNED: "text-cyan-400 bg-cyan-500/10",
  PAID_IN_FULL: "text-emerald-400 bg-emerald-500/10",
  CANCELLED: "text-red-400 bg-red-500/10",
  OTHER: "text-white/50 bg-white/5",
};

interface ClientsTableProps {
  registrations: RegWithDetails[];
  sessions: { id: string; name: string }[];
  statusLabels: Record<RegistrationStatus, string>;
}

export default function ClientsTable({ registrations, statusLabels }: ClientsTableProps) {
  const [statuses, setStatuses] = useState<Record<string, RegistrationStatus>>(
    Object.fromEntries(registrations.map((r) => [r.id, r.status]))
  );
  const [expanded, setExpanded] = useState<string | null>(null);

  async function updateStatus(id: string, newStatus: RegistrationStatus) {
    setStatuses((prev) => ({ ...prev, [id]: newStatus }));
    await fetch("/api/admin/registrations/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });
  }

  if (registrations.length === 0) {
    return (
      <div className="text-center py-16 text-white/30 text-sm">
        Няма намерени записвания
      </div>
    );
  }

  return (
    <div className="bg-[#1e3a52]/30 border border-white/10 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/10">
              {["Родител", "Имейл / Телефон", "Сесия", "Деца", "Сума", "Статус", "Дата", ""].map((h) => (
                <th key={h} className="text-left text-white/40 font-medium px-4 py-3 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {registrations.map((reg) => (
              <React.Fragment key={reg.id}>
                <tr
                  className="border-b border-white/5 hover:bg-white/3 transition-colors cursor-pointer"
                  onClick={() => setExpanded(expanded === reg.id ? null : reg.id)}
                >
                  <td className="px-4 py-3 text-white font-medium">
                    {reg.parentName ?? <span className="text-white/30 italic">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div>{reg.email ? <a href={`mailto:${reg.email}`} className="text-white/60 hover:text-[#f5a623]" onClick={(e) => e.stopPropagation()}>{reg.email}</a> : <span className="text-white/20">—</span>}</div>
                    <div>{reg.phone ? <a href={`tel:${reg.phone}`} className="text-white/40 hover:text-white" onClick={(e) => e.stopPropagation()}>{reg.phone}</a> : null}</div>
                  </td>
                  <td className="px-4 py-3 text-white/60 whitespace-nowrap">{reg.session.name.replace("Творчески лагер — ", "")}</td>
                  <td className="px-4 py-3 text-white/60">{reg.children.length}</td>
                  <td className="px-4 py-3 text-[#f5a623] font-semibold">{reg.totalAmount ? formatPrice(reg.totalAmount) : "—"}</td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={statuses[reg.id]}
                      onChange={(e) => updateStatus(reg.id, e.target.value as RegistrationStatus)}
                      className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none ${STATUS_COLORS[statuses[reg.id]]}`}
                    >
                      {Object.entries(statusLabels).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-white/30 whitespace-nowrap">
                    {new Date(reg.createdAt).toLocaleDateString("bg-BG")}
                  </td>
                  <td className="px-4 py-3">
                    <ChevronDown className={`w-4 h-4 text-white/30 transition-transform ${expanded === reg.id ? "rotate-180" : ""}`} />
                  </td>
                </tr>
                {expanded === reg.id && (
                  <tr key={`${reg.id}-detail`} className="bg-[#1e3a52]/30 border-b border-white/5">
                    <td colSpan={8} className="px-4 py-4">
                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                        <div>
                          <p className="text-white/40 mb-1">Деца</p>
                          {reg.children.map((c) => (
                            <p key={c.id} className="text-white/70">
                              {c.firstName} {c.lastName} ({new Date(c.dateOfBirth).toLocaleDateString("bg-BG")})
                              {c.dietaryNotes && <span className="text-white/40"> · {c.dietaryNotes}</span>}
                            </p>
                          ))}
                        </div>
                        {reg.priceTier && (
                          <div>
                            <p className="text-white/40 mb-1">Ценова категория</p>
                            <p className="text-white/70">{reg.priceTier.label} — {formatPrice(reg.priceTier.price)}</p>
                          </div>
                        )}
                        {reg.notes && (
                          <div>
                            <p className="text-white/40 mb-1">Бележки</p>
                            <p className="text-white/70">{reg.notes}</p>
                          </div>
                        )}
                        {reg.attribution && (
                          <div>
                            <p className="text-white/40 mb-1">Откъде</p>
                            <p className="text-white/70">{reg.attribution}</p>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

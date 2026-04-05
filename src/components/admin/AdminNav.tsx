"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Users, Tent, Tag, FileText, Percent, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Табло", icon: LayoutDashboard, exact: true },
  { href: "/admin/camps", label: "Лагери", icon: Tent },
  { href: "/admin/clients", label: "Клиенти", icon: Users },
  { href: "/admin/pricing", label: "Ценообразуване", icon: Tag },
  { href: "/admin/promo-codes", label: "Промо кодове", icon: Percent },
  { href: "/admin/blog", label: "Блог", icon: FileText },
];

export default function AdminNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavContent = () => (
    <>
      <div className="p-4 border-b border-white/10 flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-[#f5a623] flex items-center justify-center text-[#0d1b2a] font-bold text-xs">М</div>
        <span className="text-white font-bold text-sm">Мечта в джоба</span>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-[#f5a623]/15 text-[#f5a623] border border-[#f5a623]/20"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
              onClick={() => setMobileOpen(false)}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-white/10">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all w-full"
        >
          <LogOut className="w-4 h-4" />
          Изход
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 fixed left-0 top-0 bottom-0 bg-[#0d1b2a] border-r border-white/10 z-30">
        <NavContent />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-[#0d1b2a]/95 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#f5a623] flex items-center justify-center text-[#0d1b2a] font-bold text-xs">М</div>
          <span className="text-white font-bold text-sm">Admin</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white p-1">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-20 pt-14">
          <div className="absolute inset-0 bg-[#0d1b2a]/90 backdrop-blur-md" onClick={() => setMobileOpen(false)} />
          <div className="relative w-56 h-full bg-[#0d1b2a] border-r border-white/10 flex flex-col">
            <NavContent />
          </div>
        </div>
      )}
    </>
  );
}

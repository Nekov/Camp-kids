import type { Metadata } from "next";
import AdminNav from "@/components/admin/AdminNav";

export const metadata: Metadata = {
  title: "Admin | Мечта в джоба",
  robots: { index: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a1628] flex">
      <AdminNav />
      <div className="flex-1 flex flex-col min-h-screen ml-0 lg:ml-56">
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

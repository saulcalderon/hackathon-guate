import DashboardAuthGuard from '@/components/auth/DashboardAuthGuard';
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardAuthGuard>
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col md:ml-64">
          <Header />
          <main className="flex-1 p-6 z-0">
            {children}
          </main>
        </div>
      </div>
    </DashboardAuthGuard>
  );
}

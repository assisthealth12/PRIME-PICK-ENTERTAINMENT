"use client";

import { AuthProvider } from "@/components/admin/AuthProvider";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return (
    <AuthProvider>
      <div className="min-h-screen bg-white text-black font-body">
        {isLoginPage ? (
          children
        ) : (
          <div className="flex h-screen overflow-hidden">
            <aside className="w-64 bg-white border-r-2 border-black p-6 flex flex-col">
              <div className="mb-10">
                <h1 className="font-heading font-black text-black text-2xl tracking-widest uppercase">Admin</h1>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 font-bold">Prime Pick CMS</p>
              </div>
              
              <nav className="flex-1 flex flex-col gap-6 mt-8">
                <a href="/admin" className="text-xs font-bold text-black uppercase tracking-widest hover:text-gray-500 transition-colors">Dashboard</a>
                <a href="/admin/films" className="text-xs font-bold text-black uppercase tracking-widest hover:text-gray-500 transition-colors">Films</a>
                <a href="/admin/directors" className="text-xs font-bold text-black uppercase tracking-widest hover:text-gray-500 transition-colors">Directors</a>
                <a href="/admin/challenges" className="text-xs font-bold text-black uppercase tracking-widest hover:text-gray-500 transition-colors">Challenges</a>
                <a href="/admin/journals" className="text-xs font-bold text-black uppercase tracking-widest hover:text-gray-500 transition-colors">Journals</a>
                <a href="/admin/settings" className="text-xs font-bold text-black uppercase tracking-widest hover:text-gray-500 transition-colors">Settings</a>
              </nav>
              
              <div className="border-t-2 border-black pt-6">
                <a href="/" className="text-xs font-bold text-black uppercase tracking-widest hover:text-gray-500 transition-colors">← Back to Site</a>
              </div>
            </aside>
            
            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-8">
              {children}
            </main>
          </div>
        )}
      </div>
    </AuthProvider>
  );
}

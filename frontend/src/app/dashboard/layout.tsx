'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import { Users, ShieldCheck, Banknote, CreditCard, LayoutDashboard } from 'lucide-react';

const NAV_ITEMS = [
  {
    href: '/dashboard/sales',
    label: 'Sales Overview',
    icon: Users,
    roles: ['sales', 'admin'],
  },
  {
    href: '/dashboard/sanction',
    label: 'Loan Sanction',
    icon: ShieldCheck,
    roles: ['sanction', 'admin'],
  },
  {
    href: '/dashboard/disbursement',
    label: 'Disbursement',
    icon: Banknote,
    roles: ['disbursement', 'admin'],
  },
  {
    href: '/dashboard/collection',
    label: 'Collection',
    icon: CreditCard,
    roles: ['collection', 'admin'],
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (user.role === 'borrower') {
      router.replace('/borrower/status');
    }
  }, [user, loading, router]);

  if (loading) return null; // Using null instead of PageLoader to avoid white flash
  if (!user || user.role === 'borrower') return null;

  const visibleItems = NAV_ITEMS.filter(item => item.roles.includes(user.role));

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-indigo-500/30">
      <Navbar />
      
      {/* Background Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none"></div>
      
      <div className="flex max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 gap-8 relative z-10">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 hidden md:block">
          <div className="bg-[#0b0e14]/80 backdrop-blur-2xl rounded-[2rem] border border-white/5 shadow-2xl p-5 sticky top-28">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-4">
              Dashboard Modules
            </p>
            <nav className="space-y-2">
              {pathname === '/dashboard' && (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-400 border border-indigo-500/20 font-bold text-sm shadow-[0_0_15px_rgba(99,102,241,0.1)]"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Overview
                </Link>
              )}
              {visibleItems.map(item => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300
                      ${active
                        ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]'
                        : 'text-slate-400 border border-transparent hover:bg-white/5 hover:text-slate-200'
                      }`}
                  >
                    <item.icon className={`w-4 h-4 ${active ? 'text-indigo-400' : 'text-slate-500'}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            
            {/* Quick Stats Widget inside Sidebar */}
            <div className="mt-8 p-4 bg-[#13161c] rounded-2xl border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 blur-[15px] rounded-full"></div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">System Status</p>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-sm text-emerald-400 font-bold">All Systems Operational</span>
              </div>
            </div>

          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          <div className="animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import Navbar from '@/components/Navbar';

export default function BorrowerLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (user.role !== 'borrower') {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) return null;
  if (!user || user.role !== 'borrower') return null;

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-indigo-500/30">
      <Navbar />
      {/* Background Orbs */}
      <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none z-0"></div>
      
      {/* Main content wrapper */}
      <main className="pt-28 pb-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-[#0b0e14]/80 backdrop-blur-2xl rounded-[2rem] border border-white/5 shadow-2xl p-6 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[60px] rounded-full pointer-events-none"></div>
          {children}
        </div>
      </main>
    </div>
  );
}

'use client';

import { useRouter, usePathname } from 'next/navigation';
import { LogOut, User, Bell } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // If we are on the landing page or login/register, we might not want this exact navbar style, 
  // but since we already have a custom header in the landing page, and login doesn't use Navbar,
  // we can safely assume this is the Dashboard/Borrower Navbar.

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const roleColors: Record<string, string> = {
    borrower: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    admin: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    sales: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
    sanction: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    disbursement: 'bg-green-500/10 text-green-400 border border-green-500/20',
    collection: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
  };

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)] overflow-hidden">
            <span className="text-white font-bold text-xl">$</span>
          </div>
          <span className="font-bold text-white tracking-tight text-xl hidden sm:block">
            LendFlow
          </span>
        </Link>

        <div className="flex items-center gap-5">
          <button className="text-slate-400 hover:text-white transition-colors relative p-2 rounded-full hover:bg-white/5">
             <Bell className="w-5 h-5" />
             <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.8)]"></span>
          </button>

          {user ? (
            <div className="flex items-center gap-5 pl-2 border-l border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#13161c] border border-white/10 rounded-full flex items-center justify-center overflow-hidden">
                  <User className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-bold text-white leading-none tracking-tight">{user.name}</p>
                  <span
                    className={`text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded mt-1.5 inline-block ${
                      roleColors[user.role] || 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center w-10 h-10 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-full transition-all"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => router.push('/login')}
              className="bg-white/10 text-white px-5 py-2.5 text-sm font-bold hover:bg-white/20 rounded-full transition-all backdrop-blur-md"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuth } from '@/lib/auth';
import { Button, Input, Card } from '@/components/ui';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success("Account created! Let's get started.");
      router.push('/borrower/details');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* ── Left side: Form ── */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 lg:p-14 overflow-y-auto relative">
        {/* subtle bg orbs */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-100/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative py-8 animate-fade-in-up">
          {/* Logo */}
          <div className="mb-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-white text-xl font-black">$</span>
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">LendFlow</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Create your Account</h1>
            <p className="text-slate-500">Welcome! Select method to sign up.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <Input
              label="Full Name"
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Ramesh Kumar"
              required
            />

            <Input
              label="Email address"
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="you@example.com"
              required
            />

            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="Min. 6 characters"
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              value={form.confirmPassword}
              onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
              placeholder="Repeat your password"
              required
            />

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 text-base font-semibold shadow-lg shadow-blue-500/25 transition-all mt-2"
              size="lg"
              loading={loading}
            >
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-7">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* ── Right side: Blue visual panel ── */}
      <div className="hidden md:flex w-1/2 bg-blue-600 relative overflow-hidden items-center justify-center flex-col">
        {/* Decorative blobs */}
        <div className="absolute -top-[15%] -right-[10%] w-[55%] h-[55%] rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute top-[25%] -left-[12%] w-[45%] h-[45%] rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-[15%] right-[5%] w-[65%] h-[65%] rounded-full bg-white/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-sm px-10 flex flex-col items-center">
          {/* Graphic widget */}
          <div className="relative w-full mb-12">
            {/* Circle backdrop */}
            <div className="w-64 h-64 mx-auto rounded-full bg-blue-500/30 border border-white/10 flex items-center justify-center relative">
              {/* Mock dashboard card */}
              <div className="absolute right-[-40%] top-1/2 -translate-y-1/2 w-52 bg-white/95 rounded-2xl shadow-2xl p-4 border border-white/20">
                <div className="flex gap-1.5 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <div className="space-y-3">
                  <div className="h-1.5 w-1/3 bg-slate-200 rounded-full" />
                  <div className="h-1.5 w-1/2 bg-slate-100 rounded-full" />
                  {[['bg-blue-100', '3/4', '1/2'], ['bg-purple-100', '2/3', '1/3'], ['bg-green-100', '4/5', '1/2']].map(([bg, w1, w2], i) => (
                    <div key={i} className="flex items-center gap-2 mt-3">
                      <div className={`w-7 h-7 rounded-full ${bg} flex-shrink-0`} />
                      <div className="space-y-1.5 flex-1">
                        <div className={`h-1.5 w-${w1} bg-slate-200 rounded-full`} />
                        <div className={`h-1.5 w-${w2} bg-slate-100 rounded-full`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating nodes */}
              <div className="absolute -left-6 top-[22%] w-11 h-11 bg-white rounded-full shadow-xl flex items-center justify-center">
                <div className="w-5 h-5 bg-red-200 rounded-md" />
              </div>
              <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-full shadow-xl flex items-center justify-center z-10">
                <div className="w-7 h-7 bg-blue-600 rounded-xl" />
              </div>
              <div className="absolute -left-6 top-[75%] w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center">
                <div className="w-6 h-6 bg-green-500 rounded-full" />
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-3">Connect with every application.</h2>
            <p className="text-blue-100/80 text-base leading-relaxed">
              Everything you need in an easily customizable dashboard.
            </p>
            {/* Dots */}
            <div className="flex gap-2 justify-center mt-8">
              <div className="w-2 h-2 rounded-full bg-white" />
              <div className="w-2 h-2 rounded-full bg-white/30" />
              <div className="w-2 h-2 rounded-full bg-white/30" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

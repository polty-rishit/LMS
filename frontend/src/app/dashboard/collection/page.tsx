'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CreditCard, Plus, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

interface Payment { utrNumber: string; amount: number; date: string; }
interface Application {
  _id: string;
  borrower: { name: string; email: string };
  fullName: string;
  loanAmount: number;
  tenure: number;
  totalRepayment: number;
  totalPaid: number;
  status: string;
  disbursedAt: string;
  payments: Payment[];
}

export default function CollectionPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [paymentForm, setPaymentForm] = useState<Record<string, { utrNumber: string; amount: string; date: string }>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);

  const fetchData = () => {
    setLoading(true);
    api.get('/applications/disbursed')
      .then(res => setApplications(res.data.applications))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const getForm = (id: string) =>
    paymentForm[id] || { utrNumber: '', amount: '', date: new Date().toISOString().split('T')[0] };

  const setForm = (id: string, field: string, value: string) => {
    setPaymentForm(prev => ({ ...prev, [id]: { ...getForm(id), [field]: value } }));
  };

  const handlePayment = async (app: Application) => {
    const form = getForm(app._id);
    if (!form.utrNumber || !form.amount || !form.date) {
      toast.error('All payment fields are required');
      return;
    }
    setSubmitting(app._id);
    try {
      const res = await api.post(`/applications/${app._id}/payment`, {
        utrNumber: form.utrNumber,
        amount: Number(form.amount),
        date: form.date,
      });
      toast.success(res.data.message);
      setPaymentForm(prev => ({ ...prev, [app._id]: { utrNumber: '', amount: '', date: new Date().toISOString().split('T')[0] } }));
      fetchData();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Payment failed');
    } finally {
      setSubmitting(null);
    }
  };

  if (loading) return null;

  const active = applications.filter(a => a.status === 'disbursed');
  const closed = applications.filter(a => a.status === 'closed');

  return (
    <div className="space-y-8 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Loan Collection</h1>
          <p className="text-slate-400 text-sm">Monitor outstanding balances and record incoming payments.</p>
        </div>
      </div>

      {/* Active Loans */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Active Facilities ({active.length})
          </h2>
        </div>
        
        {active.length === 0 ? (
          <div className="bg-[#0b0e14]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-20 text-center shadow-lg">
            <div className="w-20 h-20 bg-[#13161c] rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              <CreditCard className="w-8 h-8 text-indigo-500" />
            </div>
            <p className="text-xl text-white font-bold mb-2">No active loans</p>
            <p className="text-slate-400 text-sm">Active repayment tracking will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {active.map(app => {
              const outstanding = app.totalRepayment - app.totalPaid;
              const progress = Math.min(100, (app.totalPaid / app.totalRepayment) * 100);
              const isExpanded = expanded === app._id;
              const form = getForm(app._id);

              return (
                <div key={app._id} className="bg-[#0b0e14]/80 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl transition-all relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[40px] rounded-full pointer-events-none"></div>

                  <div className="p-6 relative">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#13161c] border border-white/5 flex items-center justify-center text-lg font-bold text-indigo-400 shadow-inner">
                          {app.fullName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-lg">{app.fullName}</h3>
                          <p className="text-sm text-slate-400">{app.borrower?.email}</p>
                        </div>
                      </div>
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                        Active
                      </span>
                    </div>

                    {/* Progress */}
                    <div className="mb-6 bg-[#13161c] border border-white/5 p-5 rounded-2xl">
                      <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                        <span>Paid: <span className="text-white">{formatCurrency(app.totalPaid)}</span></span>
                        <span>{Math.round(progress)}%</span>
                        <span>Left: <span className="text-rose-400">{formatCurrency(outstanding)}</span></span>
                      </div>
                      <div className="w-full bg-[#050505] rounded-full h-2 border border-white/5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <InfoItem label="Capital Issued" value={formatCurrency(app.loanAmount)} />
                      <InfoItem label="Total Target" value={formatCurrency(app.totalRepayment)} />
                      <InfoItem label="Disbursed On" value={formatDate(app.disbursedAt)} />
                    </div>

                    {/* Record Payment */}
                    <div className="border-t border-white/10 pt-5 mt-2">
                      <button
                        onClick={() => setExpanded(isExpanded ? null : app._id)}
                        className="flex items-center justify-between w-full text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Plus className="w-4 h-4" /> Record New Payment
                        </span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      {isExpanded && (
                        <div className="mt-5 space-y-4 animate-fade-in">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">UTR Number</label>
                            <input
                              value={form.utrNumber}
                              onChange={e => setForm(app._id, 'utrNumber', e.target.value)}
                              placeholder="Unique Transaction Ref"
                              className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-indigo-500 outline-none transition-colors"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Amount (₹)</label>
                              <input
                                type="number"
                                value={form.amount}
                                onChange={e => setForm(app._id, 'amount', e.target.value)}
                                placeholder={`Max: ${outstanding}`}
                                max={outstanding}
                                className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-indigo-500 outline-none transition-colors"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Date</label>
                              <input
                                type="date"
                                value={form.date}
                                onChange={e => setForm(app._id, 'date', e.target.value)}
                                className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-indigo-500 outline-none transition-colors"
                              />
                            </div>
                          </div>
                          <button
                            onClick={() => handlePayment(app)}
                            disabled={submitting === app._id}
                            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:from-indigo-400 hover:to-purple-500 transition-all disabled:opacity-50 mt-2 flex items-center justify-center"
                          >
                            {submitting === app._id ? (
                               <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                            ) : "Submit Payment"}
                          </button>
                        </div>
                      )}

                      {/* Payment history */}
                      {app.payments?.length > 0 && (
                        <div className="mt-5 space-y-2">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Recent Receipts</p>
                          {app.payments.map((p, i) => (
                            <div key={i} className="flex justify-between items-center bg-[#13161c] border border-white/5 rounded-xl px-4 py-3 hover:bg-white/5 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                </div>
                                <div>
                                  <span className="text-sm font-bold text-white">{formatCurrency(p.amount)}</span>
                                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">UTR: {p.utrNumber}</div>
                                </div>
                              </div>
                              <span className="text-xs font-semibold text-slate-400">{formatDate(p.date)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Closed Loans */}
      {closed.length > 0 && (
        <div className="pt-8 border-t border-white/5">
          <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-6">
            Settled Facilities ({closed.length})
          </h2>
          <div className="space-y-4">
            {closed.map(app => (
              <div key={app._id} className="bg-[#13161c] border border-white/5 p-6 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{app.fullName}</h3>
                    <p className="text-sm text-emerald-400 font-semibold mt-0.5">
                      {formatCurrency(app.totalRepayment)} fully repaid
                    </p>
                  </div>
                </div>
                <span className="bg-white/5 text-slate-400 border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  Closed
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">{label}</p>
      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Banknote, SendHorizonal } from 'lucide-react';

interface Application {
  _id: string;
  borrower: { name: string; email: string };
  fullName: string;
  loanAmount: number;
  tenure: number;
  totalRepayment: number;
  sanctionedAt: string;
  sanctionedBy: { name: string };
}

export default function DisbursementPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [disbursing, setDisbursing] = useState<string | null>(null);

  const fetchData = () => {
    setLoading(true);
    api.get('/applications/sanctioned')
      .then(res => setApplications(res.data.applications))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleDisburse = async (id: string) => {
    setDisbursing(id);
    try {
      await api.patch(`/applications/${id}/disburse`);
      toast.success('Loan disbursed! Funds released to borrower.');
      fetchData();
    } catch {
      toast.error('Failed to disburse loan');
    } finally {
      setDisbursing(null);
    }
  };

  if (loading) return null;

  return (
    <div className="space-y-8 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Loan Disbursement</h1>
          <p className="text-slate-400 text-sm">Release capital allocations securely to sanctioned borrowers.</p>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="bg-[#0b0e14]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-20 text-center shadow-lg">
          <div className="w-20 h-20 bg-[#13161c] rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <Banknote className="w-8 h-8 text-emerald-500" />
          </div>
          <p className="text-xl text-white font-bold mb-2">No pending disbursements</p>
          <p className="text-slate-400 text-sm">Sanctioned loans waiting for payout will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {applications.map(app => (
            <div key={app._id} className="bg-[#0b0e14]/80 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl hover:border-white/10 transition-all group relative">
              
              {/* Background gradient subtle glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[40px] rounded-full pointer-events-none"></div>

              <div className="p-6 relative">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#13161c] border border-white/5 flex items-center justify-center text-lg font-bold text-emerald-400 shadow-inner">
                      {app.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{app.fullName}</h3>
                      <p className="text-sm text-slate-400">{app.borrower?.email}</p>
                    </div>
                  </div>
                  <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    Sanctioned
                  </span>
                </div>

                <div className="bg-[#13161c] border border-white/5 rounded-2xl p-5 mb-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 bg-gradient-to-b from-emerald-500 to-teal-500 h-full"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <InfoItem label="Capital to Disburse" value={formatCurrency(app.loanAmount)} highlight />
                    <InfoItem label="Total Repayment" value={formatCurrency(app.totalRepayment)} />
                    <InfoItem label="Tenure" value={`${app.tenure} days`} />
                    <InfoItem label="Sanctioned Date" value={formatDate(app.sanctionedAt)} />
                  </div>
                </div>

                {app.sanctionedBy && (
                  <div className="flex items-center justify-between mb-5 px-2">
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Approved By</p>
                    <p className="text-sm text-slate-300 font-medium">{app.sanctionedBy.name}</p>
                  </div>
                )}

                <button
                  onClick={() => handleDisburse(app._id)}
                  disabled={disbursing === app._id}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-3.5 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all disabled:opacity-50"
                >
                  {disbursing === app._id ? (
                    <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  ) : (
                    <>
                      <SendHorizonal className="w-5 h-5" />
                      Issue Capital
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InfoItem({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">{label}</p>
      <p className={`text-sm ${highlight ? 'text-emerald-400 font-bold text-xl tracking-tight' : 'text-slate-200 font-semibold'}`}>
        {value}
      </p>
    </div>
  );
}

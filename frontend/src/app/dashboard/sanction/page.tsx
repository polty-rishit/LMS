'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ShieldCheck, ShieldX, X } from 'lucide-react';

interface Application {
  _id: string;
  borrower: { name: string; email: string };
  fullName: string;
  pan: string;
  monthlySalary: number;
  employmentMode: string;
  loanAmount: number;
  tenure: number;
  simpleInterest: number;
  totalRepayment: number;
  createdAt: string;
}

export default function SanctionPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [pendingRejectId, setPendingRejectId] = useState<string | null>(null);

  const fetchData = () => {
    setLoading(true);
    api.get('/applications/applied')
      .then(res => setApplications(res.data.applications))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleApprove = async (id: string) => {
    setActionLoading(true);
    try {
      await api.patch(`/applications/${id}/sanction`, { action: 'approve' });
      toast.success('Loan sanctioned!');
      fetchData();
    } catch {
      toast.error('Failed to sanction loan');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectSubmit = async () => {
    if (!pendingRejectId || !rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    setActionLoading(true);
    try {
      await api.patch(`/applications/${pendingRejectId}/sanction`, {
        action: 'reject',
        rejectionReason,
      });
      toast.success('Loan rejected');
      setShowRejectModal(false);
      setRejectionReason('');
      setPendingRejectId(null);
      fetchData();
    } catch {
      toast.error('Failed to reject loan');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return null;

  return (
    <div className="space-y-8 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Loan Sanction</h1>
          <p className="text-slate-400 text-sm">Review applications, evaluate risk, and approve or reject loans.</p>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="bg-[#0b0e14]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-20 text-center shadow-lg">
          <div className="w-20 h-20 bg-[#13161c] rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <ShieldCheck className="w-8 h-8 text-indigo-500" />
          </div>
          <p className="text-xl text-white font-bold mb-2">No pending applications</p>
          <p className="text-slate-400 text-sm">You're all caught up! New applications will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {applications.map(app => (
            <div key={app._id} className="bg-[#0b0e14]/80 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl hover:border-white/10 transition-all group">
              <div className="p-6 relative">
                {/* Background glow specific to card */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[40px] rounded-full pointer-events-none"></div>

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
                  <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    Applied
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <InfoItem label="PAN" value={app.pan} mono />
                  <InfoItem label="Employment" value={app.employmentMode} />
                  <InfoItem label="Salary" value={formatCurrency(app.monthlySalary)} />
                  <InfoItem label="Applied On" value={formatDate(app.createdAt)} />
                </div>

                <div className="bg-[#13161c] border border-white/5 rounded-2xl p-5 grid grid-cols-3 gap-4 mb-6 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 h-full"></div>
                  <InfoItem label="Requested Amount" value={formatCurrency(app.loanAmount)} highlight />
                  <InfoItem label="Term Length" value={`${app.tenure} days`} highlight />
                  <InfoItem label="Total Repayment" value={formatCurrency(app.totalRepayment)} highlight />
                </div>

                <div className="flex gap-4 mt-2">
                  <button
                    onClick={() => handleApprove(app._id)}
                    disabled={actionLoading}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold py-3 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all disabled:opacity-50"
                  >
                    <ShieldCheck className="w-5 h-5" />
                    Approve Loan
                  </button>
                  <button
                    onClick={() => {
                      setPendingRejectId(app._id);
                      setShowRejectModal(true);
                    }}
                    disabled={actionLoading}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#13161c] border border-white/10 hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400 text-slate-300 font-bold py-3 rounded-xl transition-all disabled:opacity-50"
                  >
                    <ShieldX className="w-5 h-5" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-[#030712]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b0e14] border border-white/10 w-full max-w-md rounded-[2rem] p-6 shadow-2xl relative animate-fade-in-up">
            <button 
              onClick={() => { setShowRejectModal(false); setRejectionReason(''); }}
              className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-white text-xl mb-2">Reject Application</h3>
            <p className="text-slate-400 text-sm mb-6">Please provide a reason for rejecting this loan. This will be recorded.</p>
            
            <textarea
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              rows={4}
              placeholder="e.g. Insufficient income documentation, poor credit history..."
              className="w-full px-4 py-3 rounded-xl bg-[#13161c] border border-white/10 text-sm text-slate-200 resize-none outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-all placeholder-slate-600 mb-6"
            />
            
            <div className="flex gap-4">
              <button
                onClick={() => { setShowRejectModal(false); setRejectionReason(''); }}
                className="flex-1 py-3 rounded-xl font-bold text-slate-300 bg-[#13161c] border border-white/5 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={actionLoading}
                className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all disabled:opacity-50"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoItem({ label, value, mono = false, highlight = false }: {
  label: string; value: string; mono?: boolean; highlight?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">{label}</p>
      <p className={`text-sm ${highlight ? 'text-indigo-400 font-bold text-lg' : 'text-slate-200 font-semibold'} ${mono ? 'font-mono' : ''}`}>
        {value}
      </p>
    </div>
  );
}

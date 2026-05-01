'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { STATUS_LABELS, formatDate } from '@/lib/utils';
import { Users, TrendingUp, UserCheck, UserX, Search, Filter } from 'lucide-react';

interface Lead {
  borrower: { _id: string; name: string; email: string; createdAt: string };
  application: { status: string; createdAt: string } | null;
  stage: string;
}

export default function SalesPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/applications/leads')
      .then(res => setLeads(res.data.leads))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  const stats = {
    total: leads.length,
    applied: leads.filter(l => l.stage !== 'no_application' && l.stage !== 'incomplete').length,
    noApp: leads.filter(l => l.stage === 'no_application').length,
    incomplete: leads.filter(l => l.stage === 'incomplete').length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Loan Portfolio</h1>
          <p className="text-slate-400 text-sm">Manage and monitor active credit facilities and leads.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#13161c] border border-white/5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-white/5 transition-colors shadow-sm">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-sm font-bold text-white hover:from-indigo-400 hover:to-purple-500 transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            Export Data
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={<Users className="w-5 h-5 text-indigo-400" />} label="Total Leads" value={stats.total} bg="bg-indigo-500/10" border="border-indigo-500/20" />
        <StatCard icon={<TrendingUp className="w-5 h-5 text-emerald-400" />} label="Applied" value={stats.applied} bg="bg-emerald-500/10" border="border-emerald-500/20" />
        <StatCard icon={<UserX className="w-5 h-5 text-rose-400" />} label="No Application" value={stats.noApp} bg="bg-rose-500/10" border="border-rose-500/20" />
        <StatCard icon={<UserCheck className="w-5 h-5 text-amber-400" />} label="Incomplete" value={stats.incomplete} bg="bg-amber-500/10" border="border-amber-500/20" />
      </div>

      {/* Table Section */}
      <div className="bg-[#0b0e14]/80 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="font-bold text-lg text-white">All Borrowers</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search borrowers..." 
              className="w-full sm:w-64 bg-[#13161c] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>
        </div>

        {leads.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-[#13161c] rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
               <Users className="w-6 h-6 text-slate-500" />
            </div>
            <p className="text-white font-semibold">No borrowers found</p>
            <p className="text-slate-500 text-sm mt-1">When leads register, they will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#13161c]/50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Borrower Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Registration Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pipeline Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leads.map((lead, i) => {
                  const statusInfo = STATUS_LABELS[lead.stage] || { label: 'No Application', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' };
                  
                  // Need to map the old light-mode colors from STATUS_LABELS to dark mode variants
                  // Since we can't easily modify STATUS_LABELS if it's shared, we'll map them here:
                  let darkColor = 'bg-slate-500/10 text-slate-400 border-slate-500/20';
                  if (statusInfo.color.includes('blue') || statusInfo.color.includes('indigo')) darkColor = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
                  if (statusInfo.color.includes('green')) darkColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                  if (statusInfo.color.includes('yellow') || statusInfo.color.includes('orange')) darkColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                  if (statusInfo.color.includes('red')) darkColor = 'bg-rose-500/10 text-rose-400 border-rose-500/20';

                  return (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#13161c] border border-white/5 flex items-center justify-center text-xs font-bold text-indigo-400">
                            {lead.borrower.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors">
                            {lead.borrower.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">{lead.borrower.email}</td>
                      <td className="px-6 py-4 text-sm text-slate-400">{formatDate(lead.borrower.createdAt)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${darkColor}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, bg, border }: { icon: React.ReactNode; label: string; value: number; bg: string; border: string }) {
  return (
    <div className="bg-[#0b0e14]/80 backdrop-blur-xl p-6 rounded-3xl border border-white/5 shadow-lg relative overflow-hidden group hover:border-white/10 transition-colors">
      <div className={`absolute top-0 right-0 w-24 h-24 ${bg} blur-[30px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:opacity-100 opacity-50 transition-opacity`}></div>
      <div className={`inline-flex p-3 rounded-2xl ${bg} border ${border} mb-4 relative z-10`}>
        {icon}
      </div>
      <p className="text-3xl font-bold text-white mb-1 relative z-10">{value}</p>
      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider relative z-10">{label}</p>
    </div>
  );
}

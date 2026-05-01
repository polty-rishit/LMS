'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Card, Badge, PageLoader } from '@/components/ui';
import { formatCurrency, formatDate, STATUS_LABELS } from '@/lib/utils';
import { CheckCircle, Clock, XCircle, Banknote, FileText, ArrowRight } from 'lucide-react';

interface Application {
  _id: string;
  status: string;
  fullName: string;
  loanAmount: number;
  tenure: number;
  simpleInterest: number;
  totalRepayment: number;
  totalPaid: number;
  rejectionReason?: string;
  sanctionedAt?: string;
  disbursedAt?: string;
  payments: { utrNumber: string; amount: number; date: string }[];
  createdAt: string;
}

const STATUS_ICONS: Record<string, React.ReactNode> = {
  incomplete: <Clock className="w-6 h-6 text-yellow-500" />,
  applied: <Clock className="w-6 h-6 text-blue-500" />,
  sanctioned: <CheckCircle className="w-6 h-6 text-purple-500" />,
  rejected: <XCircle className="w-6 h-6 text-red-500" />,
  disbursed: <Banknote className="w-6 h-6 text-green-500" />,
  closed: <CheckCircle className="w-6 h-6 text-gray-500" />,
};

export default function StatusPage() {
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/applications/my')
      .then(res => setApplication(res.data.application))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  // No application at all
  if (!application) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-2xl mb-6">
          <FileText className="w-10 h-10 text-primary-600" />
        </div>
        <h1 className="text-3xl font-display font-bold text-slate-900 mb-3">
          No Application Yet
        </h1>
        <p className="text-slate-500 mb-8">
          Ready to get started? Apply for a loan in just a few steps.
        </p>
        <Link
          href="/borrower/details"
          className="inline-flex items-center gap-2 bg-primary-600 text-slate-900 font-semibold px-8 py-3 rounded-xl hover:bg-primary-700 transition-colors shadow-md"
        >
          Start Application <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const status = application.status;
  const statusInfo = STATUS_LABELS[status] || { label: status, color: 'bg-gray-100 text-gray-700' };
  const outstanding = (application.totalRepayment || 0) - (application.totalPaid || 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <div className="animate-fade-in-up">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-white">My Application</h1>
            <p className="text-slate-300 mt-1">Track your loan application status</p>
          </div>
          <Badge label={statusInfo.label} color={statusInfo.color} />
        </div>

        {/* Status Banner */}
        <Card className="p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="mt-0.5">{STATUS_ICONS[status]}</div>
            <div className="flex-1">
              <h2 className="font-display font-bold text-slate-800 text-lg">
                {status === 'incomplete' && 'Application Incomplete'}
                {status === 'applied' && 'Application Under Review'}
                {status === 'sanctioned' && 'Loan Sanctioned!'}
                {status === 'rejected' && 'Application Rejected'}
                {status === 'disbursed' && 'Loan Disbursed — Active'}
                {status === 'closed' && 'Loan Fully Repaid — Closed'}
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                {status === 'incomplete' && 'Please complete your application.'}
                {status === 'applied' && 'Our team is reviewing your application. You\'ll be notified soon.'}
                {status === 'sanctioned' && 'Your loan has been approved and will be disbursed shortly.'}
                {status === 'rejected' && (application.rejectionReason || 'Your application was not approved.')}
                {status === 'disbursed' && `Outstanding: ${formatCurrency(outstanding)}`}
                {status === 'closed' && 'Congratulations! Your loan has been fully repaid.'}
              </p>
              {status === 'incomplete' && (
                <Link
                  href="/borrower/details"
                  className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-primary-600 hover:text-primary-800"
                >
                  Continue Application <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Loan Details */}
      {application.loanAmount && (
        <Card className="animate-fade-in-up delay-100">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="font-display font-bold text-slate-800">Loan Details</h3>
          </div>
          <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Detail label="Loan Amount" value={formatCurrency(application.loanAmount)} />
            <Detail label="Tenure" value={`${application.tenure} days`} />
            <Detail label="Interest Rate" value="12% p.a." />
            <Detail label="Interest (SI)" value={formatCurrency(application.simpleInterest)} />
            <Detail label="Total Repayment" value={formatCurrency(application.totalRepayment)} highlight />
            <Detail label="Total Paid" value={formatCurrency(application.totalPaid || 0)} />
          </div>
          {status === 'disbursed' && (
            <div className="px-6 pb-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600 font-medium">Repayment Progress</span>
                  <span className="font-semibold text-slate-800">
                    {Math.round(((application.totalPaid || 0) / application.totalRepayment) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-50 rounded-full h-2.5">
                  <div
                    className="bg-accent-500 h-2.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, ((application.totalPaid || 0) / application.totalRepayment) * 100)}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>Paid: {formatCurrency(application.totalPaid || 0)}</span>
                  <span>Remaining: {formatCurrency(outstanding)}</span>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Payment History */}
      {application.payments?.length > 0 && (
        <Card className="animate-fade-in-up delay-200">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="font-display font-bold text-slate-800">Payment History</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {application.payments.map((p, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {formatCurrency(p.amount)}
                  </p>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">UTR: {p.utrNumber}</p>
                </div>
                <span className="text-sm text-slate-500">{formatDate(p.date)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Timeline */}
      <Card className="p-6 animate-fade-in-up delay-300">
        <h3 className="font-display font-bold text-slate-800 mb-4">Application Timeline</h3>
        <div className="space-y-3">
          <TimelineItem
            done
            label="Application Created"
            date={formatDate(application.createdAt)}
          />
          <TimelineItem
            done={['applied','sanctioned','rejected','disbursed','closed'].includes(status)}
            label="Loan Applied"
          />
          <TimelineItem
            done={['sanctioned','disbursed','closed'].includes(status)}
            label="Sanctioned"
            date={application.sanctionedAt ? formatDate(application.sanctionedAt) : undefined}
          />
          <TimelineItem
            done={['disbursed','closed'].includes(status)}
            label="Disbursed"
            date={application.disbursedAt ? formatDate(application.disbursedAt) : undefined}
          />
          <TimelineItem
            done={status === 'closed'}
            label="Closed / Fully Repaid"
          />
        </div>
      </Card>
    </div>
  );
}

function Detail({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-3 ${highlight ? 'bg-primary-50' : 'bg-slate-50'}`}>
      <p className="text-xs text-slate-500 mb-0.5">{label}</p>
      <p className={`font-semibold text-sm ${highlight ? 'text-primary-700' : 'text-slate-800'}`}>{value}</p>
    </div>
  );
}

function TimelineItem({ done, label, date }: { done: boolean; label: string; date?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-4 h-4 rounded-full flex-shrink-0 ${done ? 'bg-accent-500' : 'bg-slate-50'}`} />
      <div className="flex-1 flex items-center justify-between">
        <span className={`text-sm font-medium ${done ? 'text-slate-800' : 'text-slate-500'}`}>{label}</span>
        {date && <span className="text-xs text-slate-500">{date}</span>}
      </div>
    </div>
  );
}

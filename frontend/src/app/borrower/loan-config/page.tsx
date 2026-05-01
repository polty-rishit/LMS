'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { Button, Card, StepIndicator } from '@/components/ui';
import { calculateLoan, formatCurrency } from '@/lib/utils';

const STEPS = ['Personal Details', 'Salary Slip', 'Loan Config'];

export default function LoanConfigPage() {
  const router = useRouter();
  const [loanAmount, setLoanAmount] = useState(150000);
  const [tenure, setTenure] = useState(180);
  const [loading, setLoading] = useState(false);

  const { simpleInterest, totalRepayment } = calculateLoan(loanAmount, tenure);

  const handleApply = async () => {
    setLoading(true);
    try {
      await api.post('/applications/apply', { loanAmount, tenure });
      toast.success('Loan application submitted successfully!');
      router.push('/borrower/status');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Application failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-display font-bold text-slate-900">Loan Application</h1>
        <p className="text-slate-500 mt-2">Complete all steps to apply for your loan</p>
      </div>

      <div className="flex justify-center mb-10 animate-fade-in-up delay-100">
        <StepIndicator steps={STEPS} currentStep={2} />
      </div>

      <div className="space-y-6 animate-fade-in-up delay-200">
        <Card className="p-8">
          <div className="mb-6">
            <h2 className="text-xl font-display font-bold text-slate-800">Configure Your Loan</h2>
            <p className="text-sm text-slate-500 mt-1">
              Adjust the sliders to find the right loan for you
            </p>
          </div>

          {/* Loan Amount Slider */}
          <div className="space-y-3 mb-8">
            <div className="flex justify-between items-baseline">
              <label className="text-sm font-semibold text-slate-700">Loan Amount</label>
              <span className="text-2xl font-display font-bold text-primary-700">
                {formatCurrency(loanAmount)}
              </span>
            </div>
            <input
              type="range"
              min={50000}
              max={500000}
              step={5000}
              value={loanAmount}
              onChange={e => setLoanAmount(Number(e.target.value))}
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>₹50,000</span>
              <span>₹5,00,000</span>
            </div>
          </div>

          {/* Tenure Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <label className="text-sm font-semibold text-slate-700">Loan Tenure</label>
              <span className="text-2xl font-display font-bold text-primary-700">
                {tenure} days
              </span>
            </div>
            <input
              type="range"
              min={30}
              max={365}
              step={5}
              value={tenure}
              onChange={e => setTenure(Number(e.target.value))}
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>30 days</span>
              <span>365 days</span>
            </div>
          </div>
        </Card>

        {/* Live Calculation Panel */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
            <h3 className="text-slate-900 font-display font-bold text-lg">Loan Summary</h3>
            <p className="text-primary-200 text-sm">Interest rate: 12% p.a. (Simple Interest)</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <SummaryItem
                label="Principal Amount"
                value={formatCurrency(loanAmount)}
                sub="Loan amount"
              />
              <SummaryItem
                label="Tenure"
                value={`${tenure} days`}
                sub="Repayment period"
              />
              <SummaryItem
                label="Interest (SI)"
                value={formatCurrency(simpleInterest)}
                sub={`P×R×T / (365×100)`}
              />
              <SummaryItem
                label="Total Repayment"
                value={formatCurrency(totalRepayment)}
                sub="Principal + Interest"
                highlight
              />
            </div>

            <div className="bg-slate-50 rounded-xl p-4 mt-2">
              <p className="text-xs text-slate-500 font-mono">
                SI = ({formatCurrency(loanAmount)} × 12 × {tenure}) / (365 × 100) = {formatCurrency(simpleInterest)}
              </p>
            </div>
          </div>
        </Card>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => router.push('/borrower/upload')}
            className="flex-1"
          >
            ← Back
          </Button>
          <Button onClick={handleApply} loading={loading} className="flex-1" size="lg">
            Submit Application ✓
          </Button>
        </div>
      </div>
    </div>
  );
}

function SummaryItem({
  label,
  value,
  sub,
  highlight = false,
}: {
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-xl p-4 ${highlight ? 'bg-primary-50 border border-primary-200' : 'bg-slate-50'}`}>
      <p className="text-xs font-medium text-slate-500 mb-1">{label}</p>
      <p className={`text-lg font-display font-bold ${highlight ? 'text-primary-700' : 'text-slate-800'}`}>
        {value}
      </p>
      <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
    </div>
  );
}

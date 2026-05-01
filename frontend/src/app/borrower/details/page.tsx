'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { Button, Input, Select, Card, Alert, StepIndicator } from '@/components/ui';

const STEPS = ['Personal Details', 'Salary Slip', 'Loan Config'];

export default function PersonalDetailsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [breErrors, setBreErrors] = useState<string[]>([]);

  const [form, setForm] = useState({
    fullName: '',
    pan: '',
    dateOfBirth: '',
    monthlySalary: '',
    employmentMode: 'salaried',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBreErrors([]);
    setLoading(true);

    try {
      await api.post('/applications/personal-details', {
        ...form,
        pan: form.pan.toUpperCase(),
        monthlySalary: Number(form.monthlySalary),
      });
      toast.success('Personal details saved!');
      router.push('/borrower/upload');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string; errors?: string[] } } };
      if (error.response?.data?.errors) {
        setBreErrors(error.response.data.errors);
      } else {
        toast.error(error.response?.data?.message || 'Failed to save details');
      }
    } finally {
      setLoading(false);
    }
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-display font-bold text-slate-900">Loan Application</h1>
        <p className="text-slate-500 mt-2">Complete all steps to apply for your loan</p>
      </div>

      {/* Step Indicator */}
      <div className="flex justify-center mb-10 animate-fade-in-up delay-100">
        <StepIndicator steps={STEPS} currentStep={0} />
      </div>

      <Card className="p-8 animate-fade-in-up delay-200">
        <div className="mb-6">
          <h2 className="text-xl font-display font-bold text-slate-800">Personal Details</h2>
          <p className="text-sm text-slate-500 mt-1">
            We'll verify your eligibility based on this information
          </p>
        </div>

        {breErrors.length > 0 && (
          <div className="mb-6">
            <Alert
              type="error"
              title="Eligibility Check Failed"
              messages={breErrors}
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Full Name"
            type="text"
            value={form.fullName}
            onChange={set('fullName')}
            placeholder="As on your PAN card"
            required
          />

          <Input
            label="PAN Number"
            type="text"
            value={form.pan}
            onChange={e => setForm(f => ({ ...f, pan: e.target.value.toUpperCase() }))}
            placeholder="ABCDE1234F"
            maxLength={10}
            hint="Format: 5 letters + 4 digits + 1 letter (e.g. ABCDE1234F)"
            required
          />

          <Input
            label="Date of Birth"
            type="date"
            value={form.dateOfBirth}
            onChange={set('dateOfBirth')}
            hint="You must be between 23 and 50 years old"
            required
          />

          <Input
            label="Monthly Salary (₹)"
            type="number"
            value={form.monthlySalary}
            onChange={set('monthlySalary')}
            placeholder="e.g. 50000"
            min={0}
            hint="Must be at least ₹25,000/month"
            required
          />

          <Select
            label="Employment Mode"
            value={form.employmentMode}
            onChange={set('employmentMode')}
            options={[
              { value: 'salaried', label: 'Salaried' },
              { value: 'self-employed', label: 'Self-Employed' },
              { value: 'unemployed', label: 'Unemployed' },
            ]}
          />

          <div className="pt-2">
            <Button type="submit" size="lg" className="w-full" loading={loading}>
              Check Eligibility & Continue →
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

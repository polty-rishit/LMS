'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { UploadCloud, FileCheck, X } from 'lucide-react';
import api from '@/lib/api';
import { Button, Card, StepIndicator } from '@/components/ui';

const STEPS = ['Personal Details', 'Salary Slip', 'Loan Config'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

export default function UploadPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState('');

  const handleFile = (f: File) => {
    setFileError('');
    if (!ALLOWED_TYPES.includes(f.type)) {
      setFileError('Only PDF, JPG, and PNG files are allowed');
      return;
    }
    if (f.size > MAX_SIZE) {
      setFileError('File size must not exceed 5 MB');
      return;
    }
    setFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('salarySlip', file);
      await api.post('/applications/upload-salary-slip', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Salary slip uploaded!');
      router.push('/borrower/loan-config');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Upload failed');
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
        <StepIndicator steps={STEPS} currentStep={1} />
      </div>

      <Card className="p-8 animate-fade-in-up delay-200">
        <div className="mb-6">
          <h2 className="text-xl font-display font-bold text-slate-800">Upload Salary Slip</h2>
          <p className="text-sm text-slate-500 mt-1">
            Upload your latest salary slip as proof of income
          </p>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200
            ${dragOver
              ? 'border-primary-500 bg-primary-50'
              : file
              ? 'border-accent-500 bg-green-50'
              : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50'
            }`}
        >
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
          />

          {file ? (
            <div className="flex flex-col items-center gap-3">
              <FileCheck className="w-12 h-12 text-accent-500" />
              <div>
                <p className="font-semibold text-slate-800">{file.name}</p>
                <p className="text-sm text-slate-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                type="button"
                onClick={e => { e.stopPropagation(); setFile(null); }}
                className="flex items-center gap-1 text-sm text-danger-500 hover:text-danger-700 font-medium"
              >
                <X className="w-4 h-4" /> Remove
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <UploadCloud className="w-12 h-12 text-slate-500" />
              <div>
                <p className="font-semibold text-slate-700">
                  Drop your file here, or{' '}
                  <span className="text-primary-600">browse</span>
                </p>
                <p className="text-sm text-slate-500 mt-1">PDF, JPG, PNG — max 5 MB</p>
              </div>
            </div>
          )}
        </div>

        {fileError && (
          <p className="mt-3 text-sm text-danger-600 font-medium">{fileError}</p>
        )}

        <div className="flex gap-3 mt-8">
          <Button
            variant="secondary"
            onClick={() => router.push('/borrower/details')}
            className="flex-1"
          >
            ← Back
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!file}
            loading={loading}
            className="flex-1"
          >
            Upload & Continue →
          </Button>
        </div>
      </Card>
    </div>
  );
}

'use client';

import { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes } from 'react';

// ── Button ──────────────────────────────────────────────────────────
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold tracking-tight rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none active:scale-[0.98]';
  const variants = {
    primary:
      'bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-md hover:-translate-y-px focus:ring-primary-500',
    secondary:
      'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-sm focus:ring-slate-400',
    danger:
      'bg-danger-500 text-white hover:bg-danger-600 shadow-sm hover:shadow-md hover:-translate-y-px focus:ring-danger-500',
    ghost:
      'bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-400',
    success:
      'bg-accent-500 text-white hover:bg-accent-600 shadow-sm hover:shadow-md hover:-translate-y-px focus:ring-accent-500',
  };
  const sizes = { sm: 'px-3.5 py-1.5 text-xs', md: 'px-5 py-2.5 text-sm', lg: 'px-6 py-3 text-sm' };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}

// ── Input ──────────────────────────────────────────────────────────
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, className = '', id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-4 py-3 rounded-xl border text-sm bg-white text-slate-800 placeholder-slate-300
          transition-all duration-200 outline-none font-medium
          focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500
          ${error ? 'border-danger-500 focus:ring-danger-500/40' : 'border-slate-200 hover:border-slate-300'}
          ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-danger-600 font-medium tracking-tight">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

// ── Select ──────────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, className = '', id, ...props }: SelectProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={`w-full px-5 py-3.5 rounded-2xl border text-sm bg-white text-slate-800
          transition-all duration-300 outline-none
          focus:ring-2 focus:ring-primary-500 focus:border-primary-500
          ${error ? 'border-danger-500' : 'border-slate-200 hover:border-slate-300'}
          ${className}`}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-danger-600 font-medium">{error}</p>}
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

// ── Badge ──────────────────────────────────────────────────────────
export function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold tracking-wide uppercase ${color}`}>
      {label}
    </span>
  );
}

// ── Spinner ──────────────────────────────────────────────────────────
export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div
      className={`${sizes[size]} border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin`}
      style={{ borderWidth: '3px' }}
    />
  );
}

// ── PageLoader ──────────────────────────────────────────────────────
export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

// ── Alert ──────────────────────────────────────────────────────────
export function Alert({
  type,
  title,
  messages,
}: {
  type: 'error' | 'success' | 'info' | 'warning';
  title?: string;
  messages: string[];
}) {
  const styles = {
    error: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  };
  return (
    <div className={`rounded-xl border p-4 ${styles[type]}`}>
      {title && <p className="font-semibold text-sm mb-1">{title}</p>}
      <ul className="space-y-1">
        {messages.map((m, i) => (
          <li key={i} className="text-sm">
            {messages.length > 1 ? `• ${m}` : m}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── StepIndicator ──────────────────────────────────────────────────
export function StepIndicator({
  steps,
  currentStep,
}: {
  steps: string[];
  currentStep: number;
}) {
  return (
    <div className="flex items-center gap-0">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                ${index < currentStep
                  ? 'bg-primary-600 text-slate-900'
                  : index === currentStep
                  ? 'bg-primary-600 text-slate-900 ring-4 ring-primary-100'
                  : 'bg-slate-100 text-slate-500'}`}
            >
              {index < currentStep ? '✓' : index + 1}
            </div>
            <span
              className={`text-xs font-medium whitespace-nowrap ${
                index <= currentStep ? 'text-primary-700' : 'text-slate-500'
              }`}
            >
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`h-0.5 w-16 mx-1 mb-5 transition-all duration-300 ${
                index < currentStep ? 'bg-primary-600' : 'bg-slate-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

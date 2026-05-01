export function calculateLoan(principal: number, tenureDays: number, ratePercent = 12) {
  const si = (principal * ratePercent * tenureDays) / (365 * 100);
  const totalRepayment = principal + si;
  return {
    simpleInterest: Math.round(si * 100) / 100,
    totalRepayment: Math.round(totalRepayment * 100) / 100,
  };
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

export const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  incomplete: { label: 'Incomplete', color: 'bg-yellow-100 text-yellow-800' },
  applied: { label: 'Applied', color: 'bg-blue-100 text-blue-800' },
  sanctioned: { label: 'Sanctioned', color: 'bg-purple-100 text-purple-800' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800' },
  disbursed: { label: 'Disbursed', color: 'bg-green-100 text-green-800' },
  closed: { label: 'Closed', color: 'bg-gray-100 text-gray-800' },
};

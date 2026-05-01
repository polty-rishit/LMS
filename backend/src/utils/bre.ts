export interface BREInput {
  dateOfBirth: Date;
  monthlySalary: number;
  pan: string;
  employmentMode: string;
}

export interface BREResult {
  passed: boolean;
  errors: string[];
}

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

function getAge(dob: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

export function runBRE(input: BREInput): BREResult {
  const errors: string[] = [];

  const age = getAge(new Date(input.dateOfBirth));
  if (age < 23 || age > 50) {
    errors.push(`Age must be between 23 and 50 years. Your age: ${age}`);
  }

  if (input.monthlySalary < 25000) {
    errors.push(`Monthly salary must be at least ₹25,000. Your salary: ₹${input.monthlySalary.toLocaleString()}`);
  }

  if (!PAN_REGEX.test(input.pan.toUpperCase())) {
    errors.push('PAN format is invalid. Valid format: ABCDE1234F (5 letters, 4 digits, 1 letter)');
  }

  if (input.employmentMode === 'unemployed') {
    errors.push('Unemployed applicants are not eligible for a loan');
  }

  return {
    passed: errors.length === 0,
    errors,
  };
}

export function calculateLoan(principal: number, tenureDays: number, ratePercent = 12) {
  const si = (principal * ratePercent * tenureDays) / (365 * 100);
  const totalRepayment = principal + si;
  return {
    simpleInterest: Math.round(si * 100) / 100,
    totalRepayment: Math.round(totalRepayment * 100) / 100,
  };
}

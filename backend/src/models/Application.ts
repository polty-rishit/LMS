import mongoose, { Document, Schema } from 'mongoose';

export type EmploymentMode = 'salaried' | 'self-employed' | 'unemployed';
export type LoanStatus =
  | 'incomplete'      // personal details saved but not applied
  | 'applied'         // loan applied, awaiting sanction
  | 'sanctioned'      // approved by sanction executive
  | 'rejected'        // rejected by sanction executive
  | 'disbursed'       // funds disbursed
  | 'closed';         // fully repaid

export interface IPayment {
  _id?: mongoose.Types.ObjectId;
  utrNumber: string;
  amount: number;
  date: Date;
  recordedBy: mongoose.Types.ObjectId;
}

export interface IApplication extends Document {
  _id: mongoose.Types.ObjectId;
  borrower: mongoose.Types.ObjectId;

  // Personal Details
  fullName: string;
  pan: string;
  dateOfBirth: Date;
  monthlySalary: number;
  employmentMode: EmploymentMode;

  // Salary Slip
  salarySlipPath?: string;
  salarySlipOriginalName?: string;

  // Loan Config
  loanAmount?: number;
  tenure?: number; // days
  interestRate: number; // fixed 12% p.a.
  totalRepayment?: number;
  simpleInterest?: number;

  // Status
  status: LoanStatus;
  rejectionReason?: string;

  // Payments
  payments: IPayment[];
  totalPaid: number;

  // Executive actions
  sanctionedBy?: mongoose.Types.ObjectId;
  sanctionedAt?: Date;
  disbursedBy?: mongoose.Types.ObjectId;
  disbursedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>({
  utrNumber: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  recordedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

const applicationSchema = new Schema<IApplication>(
  {
    borrower: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    fullName: { type: String, required: true, trim: true },
    pan: { type: String, required: true, trim: true, uppercase: true },
    dateOfBirth: { type: Date, required: true },
    monthlySalary: { type: Number, required: true },
    employmentMode: {
      type: String,
      enum: ['salaried', 'self-employed', 'unemployed'],
      required: true,
    },

    salarySlipPath: { type: String },
    salarySlipOriginalName: { type: String },

    loanAmount: { type: Number },
    tenure: { type: Number },
    interestRate: { type: Number, default: 12 },
    totalRepayment: { type: Number },
    simpleInterest: { type: Number },

    status: {
      type: String,
      enum: ['incomplete', 'applied', 'sanctioned', 'rejected', 'disbursed', 'closed'],
      default: 'incomplete',
    },
    rejectionReason: { type: String },

    payments: [paymentSchema],
    totalPaid: { type: Number, default: 0 },

    sanctionedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    sanctionedAt: { type: Date },
    disbursedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    disbursedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<IApplication>('Application', applicationSchema);

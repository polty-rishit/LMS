import { Response } from 'express';
import path from 'path';
import Application from '../models/Application';
import { AuthRequest } from '../middleware/auth';
import { runBRE, calculateLoan } from '../utils/bre';

// BORROWER: Save personal details + run BRE
export const savePersonalDetails = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { fullName, pan, dateOfBirth, monthlySalary, employmentMode } = req.body;

    if (!fullName || !pan || !dateOfBirth || !monthlySalary || !employmentMode) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    const breResult = runBRE({
      dateOfBirth: new Date(dateOfBirth),
      monthlySalary: Number(monthlySalary),
      pan: pan.toUpperCase(),
      employmentMode,
    });

    if (!breResult.passed) {
      res.status(422).json({ message: 'BRE check failed', errors: breResult.errors });
      return;
    }

    // Upsert: one application per borrower in incomplete state
    let application = await Application.findOne({
      borrower: req.user!.id,
      status: 'incomplete',
    });

    if (application) {
      application.fullName = fullName;
      application.pan = pan.toUpperCase();
      application.dateOfBirth = new Date(dateOfBirth);
      application.monthlySalary = Number(monthlySalary);
      application.employmentMode = employmentMode;
      await application.save();
    } else {
      application = await Application.create({
        borrower: req.user!.id,
        fullName,
        pan: pan.toUpperCase(),
        dateOfBirth: new Date(dateOfBirth),
        monthlySalary: Number(monthlySalary),
        employmentMode,
        status: 'incomplete',
      });
    }

    res.json({ message: 'Personal details saved', application });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// BORROWER: Upload salary slip
export const uploadSalarySlip = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const application = await Application.findOne({
      borrower: req.user!.id,
      status: 'incomplete',
    });

    if (!application) {
      res.status(404).json({ message: 'No pending application found. Please complete personal details first.' });
      return;
    }

    application.salarySlipPath = req.file.path;
    application.salarySlipOriginalName = req.file.originalname;
    await application.save();

    res.json({ message: 'Salary slip uploaded', filePath: req.file.path });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// BORROWER: Configure loan and apply
export const applyLoan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { loanAmount, tenure } = req.body;

    if (!loanAmount || !tenure) {
      res.status(400).json({ message: 'Loan amount and tenure are required' });
      return;
    }

    const amount = Number(loanAmount);
    const days = Number(tenure);

    if (amount < 50000 || amount > 500000) {
      res.status(400).json({ message: 'Loan amount must be between ₹50,000 and ₹5,00,000' });
      return;
    }
    if (days < 30 || days > 365) {
      res.status(400).json({ message: 'Tenure must be between 30 and 365 days' });
      return;
    }

    const application = await Application.findOne({
      borrower: req.user!.id,
      status: 'incomplete',
    });

    if (!application) {
      res.status(404).json({ message: 'No pending application found' });
      return;
    }

    if (!application.salarySlipPath) {
      res.status(400).json({ message: 'Please upload salary slip before applying' });
      return;
    }

    const { simpleInterest, totalRepayment } = calculateLoan(amount, days);

    application.loanAmount = amount;
    application.tenure = days;
    application.simpleInterest = simpleInterest;
    application.totalRepayment = totalRepayment;
    application.status = 'applied';
    await application.save();

    res.json({ message: 'Loan application submitted', application });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// BORROWER: Get own application status
export const getMyApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const application = await Application.findOne({ borrower: req.user!.id })
      .sort({ createdAt: -1 })
      .populate('borrower', 'name email');

    if (!application) {
      res.json({ application: null });
      return;
    }

    res.json({ application });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// SALES: Get leads (users with no application or incomplete application)
export const getLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const User = (await import('../models/User')).default;
    const borrowers = await User.find({ role: 'borrower' }).select('-password');

    const leads = await Promise.all(
      borrowers.map(async (borrower) => {
        const app = await Application.findOne({ borrower: borrower._id }).sort({ createdAt: -1 });
        return {
          borrower,
          application: app,
          stage: app ? app.status : 'no_application',
        };
      })
    );

    res.json({ leads });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// SANCTION: Get applied loans
export const getAppliedLoans = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const applications = await Application.find({ status: 'applied' })
      .populate('borrower', 'name email')
      .sort({ createdAt: -1 });

    res.json({ applications });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// SANCTION: Approve or reject
export const sanctionLoan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { action, rejectionReason } = req.body;

    if (!['approve', 'reject'].includes(action)) {
      res.status(400).json({ message: 'Action must be approve or reject' });
      return;
    }

    const application = await Application.findById(id);
    if (!application) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }

    if (application.status !== 'applied') {
      res.status(400).json({ message: 'Application is not in applied state' });
      return;
    }

    if (action === 'approve') {
      application.status = 'sanctioned';
      application.sanctionedBy = req.user!.id as unknown as import('mongoose').Types.ObjectId;
      application.sanctionedAt = new Date();
    } else {
      if (!rejectionReason) {
        res.status(400).json({ message: 'Rejection reason is required' });
        return;
      }
      application.status = 'rejected';
      application.rejectionReason = rejectionReason;
    }

    await application.save();
    res.json({ message: `Loan ${action === 'approve' ? 'sanctioned' : 'rejected'}`, application });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// DISBURSEMENT: Get sanctioned loans
export const getSanctionedLoans = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const applications = await Application.find({ status: 'sanctioned' })
      .populate('borrower', 'name email')
      .populate('sanctionedBy', 'name')
      .sort({ sanctionedAt: -1 });

    res.json({ applications });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// DISBURSEMENT: Disburse loan
export const disburseLoan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const application = await Application.findById(id);
    if (!application) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }

    if (application.status !== 'sanctioned') {
      res.status(400).json({ message: 'Loan must be sanctioned before disbursement' });
      return;
    }

    application.status = 'disbursed';
    application.disbursedBy = req.user!.id as unknown as import('mongoose').Types.ObjectId;
    application.disbursedAt = new Date();
    await application.save();

    res.json({ message: 'Loan disbursed', application });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// COLLECTION: Get disbursed loans
export const getDisbursedLoans = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const applications = await Application.find({ status: { $in: ['disbursed', 'closed'] } })
      .populate('borrower', 'name email')
      .sort({ disbursedAt: -1 });

    res.json({ applications });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// COLLECTION: Record payment
export const recordPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { utrNumber, amount, date } = req.body;

    if (!utrNumber || !amount || !date) {
      res.status(400).json({ message: 'UTR number, amount, and date are required' });
      return;
    }

    // Check UTR uniqueness globally
    const existingUTR = await Application.findOne({ 'payments.utrNumber': utrNumber });
    if (existingUTR) {
      res.status(409).json({ message: 'UTR number already used. Each payment must have a unique UTR.' });
      return;
    }

    const application = await Application.findById(id);
    if (!application) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }

    if (application.status !== 'disbursed') {
      res.status(400).json({ message: 'Payments can only be recorded for disbursed loans' });
      return;
    }

    const paymentAmount = Number(amount);
    const outstanding = (application.totalRepayment || 0) - application.totalPaid;

    if (paymentAmount <= 0) {
      res.status(400).json({ message: 'Payment amount must be greater than 0' });
      return;
    }

    if (paymentAmount > outstanding) {
      res.status(400).json({
        message: `Payment amount ₹${paymentAmount.toLocaleString()} exceeds outstanding balance ₹${outstanding.toLocaleString()}`,
      });
      return;
    }

    application.payments.push({
      utrNumber,
      amount: paymentAmount,
      date: new Date(date),
      recordedBy: req.user!.id as unknown as import('mongoose').Types.ObjectId,
    });

    application.totalPaid += paymentAmount;

    // Auto-close if fully paid
    if (application.totalPaid >= (application.totalRepayment || 0)) {
      application.status = 'closed';
    }

    await application.save();

    res.json({
      message: application.status === 'closed' ? 'Payment recorded. Loan is now CLOSED!' : 'Payment recorded',
      application,
      outstanding: (application.totalRepayment || 0) - application.totalPaid,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// ADMIN: Get all applications
export const getAllApplications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const applications = await Application.find()
      .populate('borrower', 'name email')
      .sort({ createdAt: -1 });

    res.json({ applications });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// Get a single application by ID
export const getApplicationById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('borrower', 'name email')
      .populate('sanctionedBy', 'name')
      .populate('disbursedBy', 'name');

    if (!application) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }

    res.json({ application });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

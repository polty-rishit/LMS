import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate, authorize } from '../middleware/auth';
import {
  savePersonalDetails,
  uploadSalarySlip,
  applyLoan,
  getMyApplication,
  getLeads,
  getAppliedLoans,
  sanctionLoan,
  getSanctionedLoans,
  disburseLoan,
  getDisbursedLoans,
  recordPayment,
  getAllApplications,
  getApplicationById,
} from '../controllers/applicationController';

const router = Router();

// Multer config
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, JPG, and PNG files are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// BORROWER routes
router.post('/personal-details', authenticate, authorize('borrower'), savePersonalDetails);
router.post('/upload-salary-slip', authenticate, authorize('borrower'), upload.single('salarySlip'), uploadSalarySlip);
router.post('/apply', authenticate, authorize('borrower'), applyLoan);
router.get('/my', authenticate, authorize('borrower'), getMyApplication);

// SALES routes
router.get('/leads', authenticate, authorize('sales', 'admin'), getLeads);

// SANCTION routes
router.get('/applied', authenticate, authorize('sanction', 'admin'), getAppliedLoans);
router.patch('/:id/sanction', authenticate, authorize('sanction', 'admin'), sanctionLoan);

// DISBURSEMENT routes
router.get('/sanctioned', authenticate, authorize('disbursement', 'admin'), getSanctionedLoans);
router.patch('/:id/disburse', authenticate, authorize('disbursement', 'admin'), disburseLoan);

// COLLECTION routes
router.get('/disbursed', authenticate, authorize('collection', 'admin'), getDisbursedLoans);
router.post('/:id/payment', authenticate, authorize('collection', 'admin'), recordPayment);

// ADMIN routes
router.get('/all', authenticate, authorize('admin'), getAllApplications);
router.get('/:id', authenticate, authorize('admin', 'sanction', 'disbursement', 'collection', 'sales'), getApplicationById);

export default router;

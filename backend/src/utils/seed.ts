import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from '../models/User';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lms';

const seedUsers = [
  { name: 'Admin User', email: 'admin@lms.com', password: 'Admin@123', role: 'admin' },
  { name: 'Sales Executive', email: 'sales@lms.com', password: 'Sales@123', role: 'sales' },
  { name: 'Sanction Executive', email: 'sanction@lms.com', password: 'Sanction@123', role: 'sanction' },
  { name: 'Disbursement Executive', email: 'disbursement@lms.com', password: 'Disburse@123', role: 'disbursement' },
  { name: 'Collection Executive', email: 'collection@lms.com', password: 'Collect@123', role: 'collection' },
  { name: 'Test Borrower', email: 'borrower@lms.com', password: 'Borrower@123', role: 'borrower' },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  for (const userData of seedUsers) {
    const existing = await User.findOne({ email: userData.email });
    if (existing) {
      console.log(`User ${userData.email} already exists, skipping...`);
      continue;
    }
    await User.create(userData);
    console.log(`Created user: ${userData.email} (${userData.role})`);
  }

  console.log('\n✅ Seed complete! Login credentials:');
  console.log('─────────────────────────────────────────');
  seedUsers.forEach(u => {
    console.log(`${u.role.toUpperCase().padEnd(14)} | ${u.email.padEnd(28)} | ${u.password}`);
  });
  console.log('─────────────────────────────────────────');

  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});

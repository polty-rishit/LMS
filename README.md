# 🏦 LendFlow: End-to-End Loan Management Platform

Welcome to LendFlow, a robust, full-stack digital lending application. This platform enables consumers to seamlessly apply for credit while providing internal banking staff with a sophisticated dashboard to process, approve, disburse, and collect payments throughout the credit lifecycle.

Powered by a modern **MERN architecture combined with Next.js and TypeScript**, the system guarantees type safety and high performance.

---

## Content Overview

- [Technology Architecture](#technology-architecture)
- [Directory Layout](#directory-layout)
- [System Requirements](#system-requirements)
- [Deployment Guide](#deployment-guide)
- [Configuration Secrets](#configuration-secrets)
- [Demo Accounts](#demo-accounts)
- [REST API Schema](#rest-api-schema)
- [Risk & Eligibility Engine (BRE)](#risk--eligibility-engine-bre)
- [Interest Mathematics](#interest-mathematics)
- [Credit Lifecycle](#credit-lifecycle)
- [Authorization & Security](#authorization--security)

---

## Technology Architecture

| Component         | Implementation Detail                                   |
|-------------------|---------------------------------------------------------|
| **Client-Side**   | Next.js 14 (App Router methodology), TypeScript, Tailwind CSS |
| **Server Engine** | Node.js executing Express.js with TypeScript            |
| **Data Storage**  | MongoDB managed via Mongoose ODM                        |
| **Security**      | JSON Web Tokens (JWT) & bcrypt hashing                  |
| **Media Handling**| Multer integration (Supports PDF/JPG/PNG up to 5MB)     |

---

## Directory Layout

```text
lendflow-workspace/
├── backend/
│   └── src/
│       ├── config/
│       │   └── database.ts               # Database integration logic
│       ├── controllers/
│       │   ├── authController.ts         # User registration & authentication
│       │   └── applicationController.ts  # Handlers for the loan lifecycle
│       ├── middleware/
│       │   └── auth.ts                   # Token validation and RBAC guards
│       ├── models/
│       │   ├── User.ts                   # Identity and role schemas
│       │   └── Application.ts            # Credit application data models
│       ├── routes/
│       │   ├── auth.ts
│       │   └── applications.ts
│       ├── utils/
│       │   ├── bre.ts                    # Server-side Business Rules Engine
│       │   └── seed.ts                   # Automated demo data generation
│       └── index.ts                      # Core Express server configuration
│
└── frontend/
    └── src/
        ├── app/
        │   ├── login/                    # Authentication interface
        │   ├── register/                 # New consumer onboarding
        │   ├── borrower/
        │   │   ├── details/              # Phase 1: Identity & Eligibility
        │   │   ├── upload/               # Phase 2: Document verification
        │   │   ├── loan-config/          # Phase 3: Interactive loan sizing
        │   │   └── status/               # Real-time application tracking
        │   └── dashboard/
        │       ├── sales/                # Customer pipeline monitoring
        │       ├── sanction/             # Underwriting and approvals
        │       ├── disbursement/         # Capital release management
        │       └── collection/           # Repayment and ledger tracking
        ├── components/
        │   ├── Navbar.tsx                # Global navigation module
        │   └── ui/                       # Shared interface elements
        └── lib/
            ├── api.ts                    # Configured Axios client
            ├── auth.tsx                  # Global authentication state provider
            └── utils.ts                  # Financial math and formatting tools
```

---

## System Requirements

Before beginning, ensure your local environment contains:

- **Node.js** (Version 18 or newer) — [Get Node](https://nodejs.org)
- **MongoDB Atlas** (A free cluster is sufficient) — [Get MongoDB](https://www.mongodb.com/cloud/atlas)
- **Git** version control — [Get Git](https://git-scm.com)

---

## Deployment Guide

### Phase 1: Fetch the Codebase

Retrieve the source code to your local machine:

```bash
git clone <repository-url-here>
cd lms
```

---

### Phase 2: Server Initialization

Navigate into the server directory:

```bash
cd backend
```

**Establish environment configurations:**

```bash
cp .env.example .env
```
*(Populate the `.env` file according to the Configuration Secrets section below.)*

**Download dependencies:**

```bash
npm install
```

**Generate demo data** (this provisions the database with standard role-based accounts):

```bash
npm run seed
```

When successful, your console will output:
```text
Connected to MongoDB
Created user: admin@lms.com (admin)
Created user: sales@lms.com (sales)
Created user: sanction@lms.com (sanction)
Created user: disbursement@lms.com (disbursement)
Created user: collection@lms.com (collection)
Created user: borrower@lms.com (borrower)
✅ Seed complete!
```

**Launch the development server:**

```bash
npm run dev
```
The REST API will now listen on `http://localhost:5000`. You can confirm its status by visiting `http://localhost:5000/api/health`, which should return: `{ "status": "ok", "message": "LMS API is running" }`.

---

### Phase 3: Client Interface Setup

Launch a **second terminal window** and navigate to the client folder:

```bash
cd frontend
cp .env.example .env.local
```

Ensure your `frontend/.env.local` accurately points to your local API. 

**Start the web application:**

```bash
npm install
npm run dev
```

The graphical interface is now accessible at `http://localhost:3000`.

---

### Phase 4: Accessing LendFlow

Navigate to `http://localhost:3000` via your web browser. You can utilize the built-in quick-login buttons on the authentication page to instantly assume different system roles.

---

## Configuration Secrets

### Backend Configuration (`backend/.env`)

```env
# Port allocation for the Node server
PORT=5000

# MongoDB cluster URI
# CRITICAL NOTE: You must append `/lms` directly before the query parameters
# Example: mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/lms?appName=Cluster0
MONGODB_URI=mongodb+srv://your_user:your_password@cluster0.xxxxx.mongodb.net/lms?appName=Cluster0

# Cryptographic key for token signing (Use a secure string in production environments)
JWT_SECRET=replace_this_with_a_long_random_secret

# Lifespan of authentication tokens
JWT_EXPIRES_IN=7d

# Local storage path for uploaded documents
UPLOAD_DIR=uploads
```

> ⚠️ **Common Pitfall**: Failing to include `/lms` within the MongoDB connection string will route your data to a default database, causing all login attempts to silently fail.

---

### Frontend Configuration (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

> ⚠️ **Important**: Always utilize `.env.local` for Next.js environments rather than a standard `.env` file. Any modifications to this file require a complete restart of the `npm run dev` process.

---

## Demo Accounts

The following credentials are automatically generated when executing the `npm run seed` command:

| Assigned Role | Login Email            | Account Password |
|---------------|------------------------|------------------|
| Admin         | admin@lms.com          | Admin@123        |
| Sales         | sales@lms.com          | Sales@123        |
| Sanction      | sanction@lms.com       | Sanction@123     |
| Disbursement  | disbursement@lms.com   | Disburse@123     |
| Collection    | collection@lms.com     | Collect@123      |
| Borrower      | borrower@lms.com       | Borrower@123     |

---

## REST API Schema

### Authentication Endpoints

| HTTP Method | Route path           | Clearance Level | Action Description          |
|-------------|----------------------|-----------------|-----------------------------|
| POST        | /api/auth/register   | Open            | Creates a consumer profile  |
| POST        | /api/auth/login      | Open            | Authenticates any user      |
| GET         | /api/auth/me         | Secured         | Retrieves active session    |

### Core Application Endpoints

| HTTP Method | Route path                            | Clearance Level     | Action Description                           |
|-------------|---------------------------------------|---------------------|----------------------------------------------|
| POST        | /api/applications/personal-details    | Borrower            | Stores data & triggers BRE validation        |
| POST        | /api/applications/upload-salary-slip  | Borrower            | Attaches income verification document        |
| POST        | /api/applications/apply               | Borrower            | Finalizes requested capital and timeline     |
| GET         | /api/applications/my                  | Borrower            | Fetches personal credit application          |
| GET         | /api/applications/leads               | Sales, Admin        | Retrieves all registered prospects           |
| GET         | /api/applications/applied             | Sanction, Admin     | Lists applications awaiting underwriting     |
| PATCH       | /api/applications/:id/sanction        | Sanction, Admin     | Submits approval or documented rejection     |
| GET         | /api/applications/sanctioned          | Disbursement, Admin | Lists approved files ready for funding       |
| PATCH       | /api/applications/:id/disburse        | Disbursement, Admin | Triggers funds release                       |
| GET         | /api/applications/disbursed           | Collection, Admin   | Lists active and finalized loans             |
| POST        | /api/applications/:id/payment         | Collection, Admin   | Logs incoming payments (requires UTR code)   |
| GET         | /api/applications/all                 | Admin exclusively   | God-mode view of all system applications     |

---

## Risk & Eligibility Engine (BRE)

A strict server-side ruleset is enforced via the `/api/applications/personal-details` endpoint before any application data is persisted.

| Evaluation Criterion | Requirement Parameter                            |
|----------------------|--------------------------------------------------|
| Age Bracket          | Applicant must be between **23 and 50** years    |
| Income Floor         | Proven monthly salary must exceed **₹24,999**    |
| Tax ID Format (PAN)  | Must strictly follow: `^[A-Z]{5}[0-9]{4}[A-Z]{1}$`|
| Occupational Status  | Applicant **cannot** be marked as Unemployed     |

If an applicant fails even a single parameter, the system immediately halts the process and returns specific feedback. 

**Why enforce this strictly on the backend?** Client-side validation is inherently insecure and easily bypassed via browser developer tools or direct HTTP requests. The backend serves as the ultimate source of truth.

---

## Interest Mathematics

The platform utilizes a Simple Interest model for calculating financial obligations:

```text
SI = (Principal × Rate × Time) / (365 × 100)
Total Financial Obligation = Principal + SI

Where:
Principal = Requested capital (in ₹)
Rate = Fixed at 12% annually
Time = Duration of loan in days
```

**Practical Application:** Borrowing ₹1,50,000 across a 180-day timeline
```text
SI = (150000 × 12 × 180) / (36500) = ₹8,876.71
Total Financial Obligation = ₹1,58,876.71
```

The frontend loan configuration interface recalculates these exact metrics dynamically as the user interacts with the sliders.

---

## Credit Lifecycle

Every loan navigates a structured progression path:

```text
[Initial Data Entry]       →  incomplete
           ↓
[Finalized Request]        →  applied
           ↓
   [Underwriting Review]
       ↓           ↓
  sanctioned    rejected
       ↓
[Capital Distributed]      →  disbursed
       ↓
[Ledger Management]
       ↓
[Debt Fully Settled]       →  closed  (system automated)
```

| State Identifier | Action Trigger                                |
|------------------|-----------------------------------------------|
| `incomplete`     | Initiated when basic details are stored       |
| `applied`        | Triggered upon finalizing the credit limits   |
| `sanctioned`     | Set when the Sanction department approves     |
| `rejected`       | Set when underwriting declines the file       |
| `disbursed`      | Updated when finance releases the capital     |
| `closed`         | Automatically triggered upon 100% repayment   |

---

## Authorization & Security

System access is strictly compartmentalized. Merely hiding a button on the UI is insufficient; the backend API explicitly guards resources and will throw a `403 Forbidden` error if an unauthorized token attempts access.

| Designated Role | Permitted Interface Zones                 |
|-----------------|-------------------------------------------|
| Borrower        | Restricted strictly to `/borrower/*`      |
| Sales           | Restricted strictly to `/dashboard/sales` |
| Sanction        | Restricted strictly to `/dashboard/sanction`|
| Disbursement    | Restricted strictly to `/dashboard/disbursement`|
| Collection      | Restricted strictly to `/dashboard/collection`|
| Admin           | Unrestricted access across all dashboards |

**Implementation:**
- **Server:** Every restricted endpoint is wrapped in the `authorize(...roles)` middleware.
- **Client:** The React layout wrappers evaluate the active `user.role` payload and enforce hard redirects for unauthorized navigation attempts.

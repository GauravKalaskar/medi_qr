# MedSecure QR - Digital Medical Information & Emergency Access System

> **“One QR. Critical Medical Information When It Matters Most.”**

MedSecure QR is a digital medical information management platform that enables patients to create a secure, tokenized medical profile and generate a unique QR code. When scanned by first responders, emergency medical technicians (EMTs), or hospital staff, the QR code resolves to an emergency-optimized view displaying vital life-saving details—blood group, drug allergies, chronic conditions, and emergency contact numbers—without exposing account passwords, database IDs, or sensitive authentication credentials.

---

## 🌟 Key Features

### 👤 Patient Portal
- **Secure Authentication**: Email/password registration, password hashing (bcrypt), JWT session management.
- **Multi-Section Medical Profile**:
  - Personal details & In Case of Emergency (ICE) contact.
  - Blood group (A+, A-, B+, B-, AB+, AB-, O+, O-) & Rh Factor.
  - Severe drug/food allergies, chronic conditions, surgeries, active prescriptions, disability info.
  - Preferred hospital trauma center, primary physician details.
  - Physical stats, organ donor status, insurance provider/policy number.
- **Privacy & Consent Notice**: Clear terms acknowledgement before QR token activation.
- **Cryptographic QR System**: Tokenized QR URLs (`/medical/{secure-token}`) preventing database ID guessing.
- **Printable Wallet ID Card**: Credit-card sized emergency wallet badge layout for physical printing.
- **QR Management**: Download PNG, copy link, instant status toggle (Active/Deactivated), and token regeneration.
- **Scan Audit Log History**: Patient access history showing timestamps, user-agent device info, and IP metadata.

### 🛡️ Administrator Suite (`/admin/login`)
- **Separate Admin Portal**: Role-based access control (RBAC) blocking normal patient users from admin endpoints.
- **Metrics Dashboard**: Live counters for total registered users, active/inactive patients, QR tokens, and total scan events.
- **User Directory**: Table view with real-time search, status filter (Active/Inactive), status toggling, detail inspection, and account deletion.
- **Global Audit Trail**: Platform-wide scan log viewer for compliance monitoring.
- **Medical Profile Review**: Admin access to inspect emergency patient records.

### 📷 Emergency QR Scanner (`/scan`)
- **Live Camera Scanner**: Browser/device camera scanning using `html5-qrcode`.
- **Manual Fallback Input**: Option to paste or type QR URLs/tokens if camera access is restricted.
- **Emergency View (`/medical/{secure-token}`)**: Prominent red emergency hero section for instant first-responder triage with a 1-click **"CALL EMERGENCY CONTACT"** phone button.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, React Router v6, Tailwind CSS, Lucide Icons, `qrcode.react`, `html5-qrcode`.
- **Backend**: Node.js, Express.js, JWT, bcryptjs, Zod Validation, Helmet, Morgan, Express Rate Limit.
- **Database & ORM**: Prisma ORM with SQLite (`dev.db`) for zero-config local setup (PostgreSQL compatible).
- **Testing**: Jest & Supertest integration suite.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 1. Installation

Install all root, backend, and frontend dependencies with a single command:

```bash
npm run install:all
```

*(Or run `npm install` inside root, `backend/`, and `frontend/` manually)*

### 2. Environment Configuration

Check `backend/.env` (pre-created) or copy from `backend/.env.example`:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
JWT_SECRET=medsecure_qr_super_secret_jwt_key_2026_x89a
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=admin@medsecure.com
ADMIN_PASSWORD=Admin@123456
```

### 3. Database Migration & Seeding

Initialize the SQLite database schema and seed default Admin & Demo Patient accounts:

```bash
npm run seed
```

### 4. Running the Full Stack Application

Launch both the Express backend API (Port 5000) and Vite React frontend (Port 5173) concurrently:

```bash
npm run dev
```

- **Frontend URL**: `http://localhost:5173`
- **Backend API Health**: `http://localhost:5000/api/health`

---

## 🔐 Default Demo Accounts

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@medsecure.com` | `Admin@123456` | Full admin dashboard & user management |
| **Demo Patient 1** | `john.doe@example.com` | `Patient@123456` | Blood: O+, Severe Penicillin Allergy (QR Token: `token_demo_john_doe_99812`) |
| **Demo Patient 2** | `jane.smith@example.com` | `Patient@123456` | Blood: AB-, Latex Allergy (QR Token: `token_demo_jane_smith_44312`) |

---

## 🧪 Running Automated Tests

Run backend integration test suite verifying authentication, medical profile CRUD, public token resolution, and role separation:

```bash
npm test
```

---

## 📑 API Architecture Summary

### Authentication
- `POST /api/auth/register` - Patient Registration
- `POST /api/auth/login` - Patient Login
- `POST /api/auth/admin/login` - Admin Login
- `GET /api/auth/me` - Get current session user

### Medical Profile
- `GET /api/medical-profile` - Fetch patient medical details
- `POST /api/medical-profile` - Create / Update medical details + privacy consent

### QR Code
- `GET /api/qr` - Get active QR profile & token URL
- `POST /api/qr/generate` - Generate new QR token
- `POST /api/qr/regenerate` - Revoke old token and generate fresh QR code
- `PATCH /api/qr/toggle` - Activate/Deactivate QR code

### Public Scan Endpoint
- `GET /api/public/medical/:token` - Returns sanitized emergency profile & logs scan event

### Admin Routes (`/api/admin/*`)
- `GET /api/admin/dashboard` - Platform statistics & recent logs
- `GET /api/admin/users` - Paginated user directory with search/filters
- `PATCH /api/admin/users/:id/status` - Activate / Deactivate user
- `DELETE /api/admin/users/:id` - Delete patient user account
- `GET /api/admin/access-logs` - Platform scan audit logs

---

## 🔒 Security & Privacy Commitments

1. **No Sensitive Data in QR Codes**: The QR code encodes only a non-guessable URL token (`/medical/med_qr_...`). Passwords, authentication JWTs, and internal database IDs are never stored inside the QR code.
2. **Access Audit Logs**: Every public scan lookup automatically records the timestamp, user-agent device info, and IP address for patient security review.
3. **Instant Revocation**: Patients can deactivate their profile or regenerate their token at any moment.

---

## 📄 License

MedSecure QR is distributed under the MIT License.

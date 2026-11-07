# StudySpace — Smart Campus Study Space Discovery & Booking Platform

StudySpace is a full-stack academic workspace management and desk reservation platform designed to eliminate study space competition during peak examination periods. It provides real-time room availability, interactive seat selection, physical occupancy verification, and full-stack campus administration.

---

## 🎨 Visual Identity & Design System

The application has been completely redesigned with a **Swiss Grid + Neo-Brutalist Dashboard** aesthetic:

- **Typography:** Space Grotesk (bold display titles & headings) and Inter (body copy, tables, metadata).
- **Color Palette:**
  - **Primary Black (`#171717`):** Sidebars, navigation bars, top-level headings, primary buttons.
  - **Background (`#F4F3ED`):** Off-white base canvas.
  - **Primary Orange (`#F15A24`):** Active navigation tabs, selected seat states, call-to-actions, highlights.
  - **Secondary Grey (`#777777`):** Metadata, sub-labels, borders.
  - **Border (`#BDBDBD`):** Structured gridlines, minimal corner radiuses.
  - **Soft Orange (`#FFE1D5`):** Selected seat banners, status chips.
  - **Success Green (`#477A55`):** Available desks, confirmed status badges.
  - **Error Red (`#C43C32`):** Booked desks, cancellation triggers.
- **Image Policy:** Exactly one photograph is used across the entire application — displayed on the split-screen login page. All other pages utilize typography, geometric CSS grids, tables, and SVG icons.

---

## 🚀 Key Modules & Capabilities

### 1. Discovery & Filtering (Module 1)
- Search across campus buildings, floors, zones, facilities, and study styles.
- Filter by study type: **Silent Study**, **Individual Study**, **Group Study**, and **Discussion Room**.
- Filter by availability status (**Available**, **Limited**, **Full**) and minimum capacity.
- Real-time seat availability calculation based on live database reservations.

### 2. Interactive Seat & Room Booking (Module 2)
- Visual seat selection grid with real-time status indicators (Available: Green, Selected: Orange, Booked: Red, Unavailable: Grey).
- Time slot window picker (2-hour study blocks).
- Group room reservation mode (locks the entire room unit to avoid conflicts).
- Student dashboard with attendance metrics, focus hour tracking, and upcoming booking countdown.
- Digital reservation pass with QR verification code and campus guidelines.
- Self-service booking cancellation with immediate seat release.

### 3. Campus Space Administration (Module 3)
- Comprehensive admin console with campus occupancy load tracking.
- Study space CRUD (create, configure, edit, deactivate).
- Seat allocation management (add seats, update physical status, configure power sockets / features).
- Physical occupancy verification (front-desk check-in, mark occupied, release desk).
- Data-driven utilization reports with building breakdowns and peak hour distribution charts.
- CSV export for both student bookings and space directories.

### 4. Authentication & Security
- **Email & Password Authentication:** Standard university credentials with bcrypt password hashing.
- **Google OAuth 2.0 / OpenID Connect:** Server-side token exchange and verification via Google's tokeninfo API.
- **Account Linking:** Matches incoming Google accounts with existing email records to avoid duplicates.
- **Role-Based Authorization:** Strict separation between `STUDENT` and `ADMIN` roles. Google OAuth is restricted to student accounts to prevent administrative privilege escalation.
- **Session Architecture:** Signed JWT stored in secure `HttpOnly` cookies (`SameSite: Lax`, 7-day expiration).

---

## 🛠 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** JavaScript (ES Modules)
- **Styling:** Tailwind CSS (Custom Neo-Brutalist Theme)
- **Database:** MongoDB & Mongoose
- **Validation:** Zod schemas
- **Auth:** JWT (`jsonwebtoken`), `bcryptjs`, Google OAuth 2.0 API

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory (refer to `.env.example`):

```bash
# MongoDB Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority

# JWT Signing Secret
JWT_SECRET=your_secure_random_jwt_secret_key_here

# Google OAuth 2.0 Credentials (Google Cloud Console)
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

# Environment
NODE_ENV=development
```

---

## 🔑 Setting Up Google OAuth in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create or select a project (e.g. `studyspace-booking`).
3. Configure the **OAuth consent screen** (User Type: External, Scopes: `openid`, `email`, `profile`).
4. Navigate to **APIs & Services > Credentials** > **Create Credentials > OAuth client ID**.
5. Select **Web application**.
6. Set **Authorized JavaScript origins**:
   - `http://localhost:3000`
7. Set **Authorized redirect URIs** (must match exactly):
   - `http://localhost:3000/api/auth/google/callback`
8. Copy the **Client ID** and **Client Secret** into your `.env.local`.

---

## 💻 Getting Started Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Populate Campus Seed Data (Optional)
To seed initial study spaces, buildings, and seat configurations:
```bash
npm run seed
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 🎓 Evaluator Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Student** | `student@studyspace.edu` | `Student@123` |
| **Admin** | `admin@studyspace.edu` | `Admin@123` |

*One-click demo login buttons are also available directly on the login page.*

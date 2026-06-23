<div align="center">

# 🚀 StartupForge

### *Build Your Co-founding Dream Team*

**A next-generation startup talent matchmaking platform for founders and builders.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-startupforge--next.vercel.app-6366f1?style=for-the-badge&logo=vercel&logoColor=white)](https://startupforge-next.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend%20API-startup--forge--backend.vercel.app-22c55e?style=for-the-badge&logo=node.js&logoColor=white)](https://startup-forge-backend.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.x-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

---

## 📌 Overview

**StartupForge** is a full-stack startup team builder platform that bridges the gap between ambitious founders and skilled collaborators. Founders can publish their startups, post co-founding opportunities, and recruit talented builders — while collaborators can discover cutting-edge startups, apply to open roles, and join founding teams.

The platform is built on a **Next.js App Router** architecture, backed by an **Express.js + MongoDB** REST API, and includes a premium subscription tier powered by **Stripe** for enhanced visibility and recruitment capabilities.

---

## 🌐 Live Links

| Service | URL |
|---|---|
| 🖥️ **Frontend (Vercel)** | [https://startupforge-next.vercel.app](https://startupforge-next.vercel.app) |
| ⚙️ **Backend API (Vercel)** | [https://startup-forge-backend.vercel.app](https://startup-forge-backend.vercel.app) |
| 📦 **GitHub Repository** | [github.com/syfulsharif/startupforge_next](https://github.com/syfulsharif/startupforge_next) |

---

## ✨ Features

### 👤 Authentication & Accounts
- **JWT-based auth** with `better-auth` — secure login, registration, and session persistence
- **Google OAuth Integration** — direct single sign-on (SSO) prompt with official Google Identity SDK
- **Two distinct user roles**: `Founder` and `Collaborator` with role-specific dashboards
- Session auto-recovery on page refresh via `/auth/me` endpoint
- Redirect-aware login flows (`?from=` query param support)

### 🏢 Startup Management (Founder)
- Create, edit, and showcase a startup profile with name, description, industry tags, and team size
- Upload a custom startup logo via **ImgBB CDN**
- Control startup visibility (active / inactive listing toggle)
- View and manage all applicants who applied to your open roles

### 💼 Opportunity Board
- Post co-founding role opportunities with title, skill requirements, work type, commitment level, deadline, salary range, and detailed description
- Browse the live opportunity board — filterable by skills, work type, and commitment level
- View full opportunity detail pages with company context

### 🔍 Browse & Discover
- **Browse Startups**: Search and filter all active startups by name or industry
- **Browse Opportunities**: Filter roles by skill stack, remote/onsite, and commitment level
- Dynamic pagination for all listings

### 📋 Applications System
- Collaborators can apply to any open role with a custom message
- Founders can review all incoming applicants for their roles and accept or reject them
- Full application status tracking per user

### 💳 Premium Subscription (Founders Only)
- Upgrade via **Stripe Checkout** for a one-time $49 lifetime unlock
- Already-premium founders see their active privileges and benefits dashboard instead of the payment form
- Premium perks include: 1st-tier candidate listing priority, unlimited opportunity posts, automated skill-match alerts, direct messaging integrations, legal cofounder agreement templates, and more

### 📊 Founder Dashboard
- Unified workspace showing startup overview, active opportunities, incoming applications, and account settings
- Edit profile details including name, bio, avatar, and role information
- Recharts-powered analytics (application trends, opportunity stats)

### 🌗 Dark / Light Mode
- System-aware theme toggle with localStorage persistence
- SSR-safe: Deferred client-only render of the theme toggle prevents hydration mismatch

### 🔔 Notifications
- Real-time in-app notification dropdown in the Navbar
- Contextual alerts for new applications, approvals, and system updates

---

## 🛠️ Technology Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16.x | App Router, SSR/SSG, file-system routing |
| **React** | 19.x | UI component model |
| **TailwindCSS** | v4 | Utility-first styling with dark mode |
| **Framer Motion** (`motion`) | 12.x | Animations and micro-interactions |
| **Lucide React** | 0.546.x | Icon library |
| **Recharts** | 3.x | Dashboard analytics charts |
| **better-auth** | 1.6.x | Client-side auth session management |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Node.js + Express** | 4.x | REST API server |
| **MongoDB + Mongoose** | 8.x | Database & ODM |
| **JWT** (`jsonwebtoken`) | 9.x | Stateless authentication tokens |
| **Stripe** | 17.x | Payment checkout and session management |
| **Bcryptjs** | 2.x | Password hashing |
| **Helmet + CORS** | — | Security headers and cross-origin policy |
| **express-rate-limit** | 7.x | API rate limiting |
| **Multer** | 1.x | File upload handling |

### Infrastructure & Deployment
| Service | Purpose |
|---|---|
| **Vercel** | Frontend and Backend serverless deployment |
| **MongoDB Atlas** | Cloud-hosted database |
| **ImgBB** | Image CDN for user-uploaded assets |
| **GitHub** | Source version control |

---

## 🗂️ Project Structure

```
starupforge_frontend/
├── public/                         # Static assets
│   └── 404_illustration.png
│
├── src/
│   ├── app/                        # Next.js App Router pages
│   │   ├── layout.jsx              # Root layout (HTML, metadata, Providers)
│   │   ├── page.jsx                # Home → /
│   │   ├── not-found.jsx           # 404 page
│   │   ├── login/page.jsx          # Login → /login
│   │   ├── register/page.jsx       # Register → /register
│   │   ├── dashboard/page.jsx      # Founder dashboard → /dashboard
│   │   ├── profile/page.jsx        # User profile → /profile
│   │   ├── payment/page.jsx        # Premium upgrade → /payment
│   │   ├── startups/
│   │   │   ├── page.jsx            # Browse startups → /startups
│   │   │   └── [id]/page.jsx       # Startup detail → /startups/:id
│   │   └── opportunities/
│   │       ├── page.jsx            # Browse opportunities → /opportunities
│   │       └── [id]/page.jsx       # Opportunity detail → /opportunities/:id
│   │
│   ├── views/                      # Full page view components (imported by app/ pages)
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Profile.jsx
│   │   ├── Payment.jsx
│   │   ├── BrowseStartups.jsx
│   │   ├── StartupDetails.jsx
│   │   ├── BrowseOpportunities.jsx
│   │   ├── OpportunityDetails.jsx
│   │   └── NotFound.jsx
│   │
│   ├── layouts/                    # Shared layout components
│   │   ├── Navbar.jsx              # Top navigation bar
│   │   ├── Footer.jsx              # Site footer
│   │   └── GlobalLoader.jsx        # Auth loading overlay
│   │
│   ├── components/
│   │   └── Providers.jsx           # App-wide context + layout provider (client)
│   │
│   ├── context/
│   │   └── AppContext.jsx          # Global state: auth, startups, opportunities, payments
│   │
│   ├── lib/
│   │   └── authClient.js           # better-auth client configuration
│   │
│   └── index.css                   # Global styles + Tailwind directives
│
├── .env                            # Local dev environment variables
├── .env.production                 # Production environment variables (Vercel)
├── next.config.js                  # Next.js configuration (env aliasing, image config)
├── postcss.config.js               # PostCSS configuration
└── package.json
```

---

## ⚙️ Getting Started (Local Development)

### Prerequisites
- Node.js `>= 18.x`
- npm `>= 9.x`
- A running instance of the [StartupForge Backend](https://startup-forge-backend.vercel.app) or a local backend on port `5000`

### 1. Clone the Repository
```bash
git clone https://github.com/syfulsharif/startupforge_next.git
cd startupforge_next
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Backend API base URL
VITE_API_URL="http://localhost:5000/api"
NEXT_PUBLIC_API_URL="http://localhost:5000/api"

# ImgBB API key for image uploads
VITE_IMGBB_API_KEY="your_imgbb_api_key"
NEXT_PUBLIC_IMGBB_API_KEY="your_imgbb_api_key"
```

> **Tip:** For production builds, these values are automatically set in `.env.production` to point to the deployed backend at `https://startup-forge-backend.vercel.app/api`.

### 4. Start the Development Server
```bash
npm run dev
```

The app will be available at **[http://localhost:3000](http://localhost:3000)**.

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## 🚀 Deployment (Vercel)

This project is pre-configured for zero-config Vercel deployment using the **Next.js framework preset**.

### Steps
1. Push your code to a GitHub repository.
2. Import the repository into your [Vercel dashboard](https://vercel.com/new).
3. Vercel auto-detects the Next.js framework.
4. Add the following **Environment Variables** in the Vercel project settings:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://startup-forge-backend.vercel.app/api` |
| `NEXT_PUBLIC_IMGBB_API_KEY` | `your_imgbb_api_key` |

5. Deploy. ✅

> **Note:** No `vercel.json` rewrite rules are needed. Next.js App Router dynamic routes (`/startups/[id]`, `/opportunities/[id]`) are handled natively by Vercel.

---

## 🔑 Environment Variables Reference

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend REST API base URL | `http://localhost:5000/api` |
| `VITE_API_URL` | Alias for legacy VITE compatibility | `http://localhost:5000/api` |
| `NEXT_PUBLIC_IMGBB_API_KEY` | ImgBB API key for image uploads | — |
| `VITE_IMGBB_API_KEY` | Alias for legacy VITE compatibility | — |

---

## 📸 Key Pages

| Route | Description |
|---|---|
| `/` | Landing page — hero, features, CTA |
| `/login` | Login with email & password |
| `/register` | Register as Founder or Collaborator |
| `/startups` | Browse all active startup listings |
| `/startups/:id` | Individual startup detail + open roles |
| `/opportunities` | Browse all open co-founding roles |
| `/opportunities/:id` | Opportunity detail + apply form |
| `/dashboard` | Founder workspace — manage startup & opportunities |
| `/profile` | Edit user profile, avatar, and bio |
| `/payment` | Premium upgrade via Stripe (or view premium perks if already upgraded) |

---

## 👥 User Roles

| Role | Capabilities |
|---|---|
| **Founder** | Create startup, post opportunities, manage applicants, upgrade to Premium |
| **Collaborator** | Browse startups & opportunities, apply to roles, manage applications |

---

## 🛡️ Security

- All API routes are protected by **JWT Bearer token** authentication
- Passwords are hashed with **bcryptjs** before storage
- HTTP security headers enforced with **Helmet.js**
- CORS policy restricts cross-origin requests to whitelisted frontend origins
- API rate limiting prevents abuse (200 requests per 15-minute window)

---



<div align="center">

Built with ❤️ by **Syful Sharif** — powered by Next.js & Vercel

</div>

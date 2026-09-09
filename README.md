# SkillMatch Cloud

A cloud-native platform that intelligently matches students with academic projects and teammates using a weighted skill-gap matching engine.

## Features

- **Smart Project Discovery** — 4-factor weighted matching algorithm (skill overlap, domain synergy, preferences, experience level)
- **Skill Gap Analyzer** — what-if simulation that shows how adding a skill changes your match scores
- **Teammate Finder** — find compatible teammates for any project by compatibility percentage
- **Team Management** — create teams, send join requests, accept/reject with real-time notifications
- **Cloud Architecture Visualizer** — interactive 4-tier cloud topology diagrams
- **Admin Console** — manage projects, students, skills, categories, teams, and analytics
- **Real-time Cloud Sync** — Firebase Firestore `onSnapshot` keeps all clients in sync

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 6, Tailwind CSS 3 |
| Backend | Firebase Firestore (NoSQL) |
| Auth | Firebase Anonymous Auth + JWT |
| Storage | Firebase Cloud Storage |
| Charts | Recharts, Canvas Confetti |
| Icons | Lucide React |
| Hosting | Vercel / Firebase Hosting |

## Firebase Collections

- `users` — students & admins with skill profiles
- `projects` — academic project listings
- `skills` — skills taxonomy
- `categories` — project categories
- `teams` — teams with members and progress
- `joinRequests` — pending/accepted/rejected requests
- `bookmarks` — per-user saved projects
- `notifications` — per-user inbox

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Harishragavender/skillmatch-cloud.git
cd skillmatch-cloud

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env
# Then fill in your Firebase credentials

# 4. Start the dev server
npm run dev
```

Open http://localhost:5173

### Firebase Setup (one-time)

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication → Anonymous sign-in**
3. Create a **Firestore database** (start in test mode)
4. Create a **Storage bucket** (start in test mode)
5. Copy your web-app config into `.env`

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

## Build & Deploy

```bash
npm run build      # outputs to dist/
```

Deploy to **Vercel**: connect the GitHub repo, add the 6 `VITE_FIREBASE_*` env vars, done.

## Demo Accounts

| Role | Email |
|------|-------|
| Student | `alex.chen@university.edu` |
| Admin | `admin@skillmatch.cloud` |

The app falls back to localStorage demo mode when Firebase credentials are absent, so it works offline for quick demos.

## License

MIT
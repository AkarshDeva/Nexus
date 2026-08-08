# NexusAI — AI-Powered Career Intelligence Platform

NexusAI is a full-stack career and professional networking platform that brings students, alumni, mentors, recruiters, and startups together in one ecosystem — with an AI layer that gives personalized career guidance.

**Live demo:** https://nexus-swart-xi.vercel.app

## Features

- **Role-based experience** for Students, Mentors, Recruiters, Alumni, and Startups — each sees a tailored dashboard, navigation, and Discover page
- **Authentication** — JWT-based signup/login
- **Profiles** — bio, skills, GitHub, resume link, location
- **Discover & Connections** — find people, send/accept/decline connection requests
- **Real-time-style Messaging** — conversations with unread indicators
- **Opportunities Board** — post and browse internships, jobs, and bounties
- **Notifications** — live badge for unread messages and pending connection requests

### AI Features (powered by Mistral)
- **Profile Feedback** — AI reviews your profile and suggests improvements
- **Fit Check** — see how well you match a specific opportunity
- **Learning Roadmap** — personalized skill-building path toward a target role
- **Interview Prep** — practice questions tailored to a target role
- **Mentor Matching** — AI recommends the best-fit mentors from the platform
- **Project Ideas** — portfolio project suggestions based on your skills

## Tech Stack

**Frontend:** React (Vite), React Router, Axios
**Backend:** Node.js, Express, PostgreSQL, Prisma ORM
**AI:** Mistral API
**Auth:** JWT, bcrypt

**Deployment:** Vercel (frontend), Render (backend), Neon (database)

## Project Structure
nexus/
├── backend/
│ ├── src/
│ │ ├── config/ # Prisma client setup
│ │ ├── controllers/ # Route logic
│ │ ├── middleware/ # Auth middleware
│ │ ├── routes/ # API routes
│ │ ├── services/ # AI service (Mistral integration)
│ │ └── server.js
│ ├── prisma/
│ │ └── schema.prisma # Database schema
│ └── package.json
└── frontend/
└── src/
├── api/ # API client functions
├── components/ # Shared components (Navbar)
├── pages/ # Page components
└── App.jsx # Routing


## Running Locally

### Prerequisites
- Node.js
- PostgreSQL
- A free [Mistral API key](https://console.mistral.ai/)

### Backend
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=5001
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/nexusai?schema=public"
JWT_SECRET=your_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
MISTRAL_API_KEY=your_mistral_key
```

Run migrations and start the server:
```bash
npx prisma migrate dev
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`.

## Database Schema

- **User** — account with role (STUDENT, ALUMNI, MENTOR, RECRUITER, STARTUP)
- **Profile** — bio, skills, GitHub, resume, location
- **Connection** — networking requests between users
- **Message** — direct messages between users
- **Opportunity** — internships, jobs, and bounties

## API Overview

| Route | Description |
|---|---|
| `/api/auth` | Signup, login |
| `/api/profile` | View/update own profile |
| `/api/connections` | Send/respond to requests, list connections |
| `/api/messages` | Send messages, view conversations |
| `/api/opportunities` | Post/browse/delete opportunities |
| `/api/users` | Browse other users |
| `/api/ai` | Profile feedback, fit check, roadmap, interview prep, mentor match, project ideas |

## License

This project is for educational/portfolio purposes.


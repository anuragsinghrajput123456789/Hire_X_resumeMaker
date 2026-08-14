# Hire-X — AI-Powered Career Platform

Hire-X is a full-stack AI-powered career platform that helps job seekers with resume creation, ATS optimization, cover letter generation, cold email drafting, interview preparation, and career intelligence — all powered by AI.

## Features

- **AI Resume Generator** — Generate professional resumes with AI-powered content suggestions
- **ATS Resume Analyzer** — Score your resume against ATS systems and get actionable improvements
- **Job Description Analyzer** — Match your resume against specific job descriptions
- **Cover Letter Generator** — Generate tailored cover letters for any job posting
- **Cold Email Generator** — Draft professional cold outreach emails
- **AI Career Chat** — Interactive AI assistant for career questions
- **Interview Workspace** — Full interview preparation with AI-generated questions, roadmaps, study plans, and performance feedback
- **RAG Document System** — Upload study materials for context-aware interview preparation
- **Job Match Suggestions** — AI-powered job role recommendations
- **Career Intelligence** — Skill gap analysis, salary insights, and career growth advice
- **AI Usage Tracking** — Per-user daily quotas and usage monitoring

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Framer Motion |
| Backend | Node.js, Express 5, Mongoose |
| Database | MongoDB (local) / MongoDB Atlas (production) |
| AI | OpenRouter API, Gemini API (via OpenAI-compatible SDK) |
| State | React Query, React Context |
| Auth | JWT (bcrypt password hashing) |
| Deployment | Vercel (frontend), Render (backend) |

## Architecture

```
Frontend (Vercel)          Backend (Render)            External Services
┌─────────────────┐        ┌─────────────────────┐     ┌──────────────┐
│  React/Vite SPA │───────>│  Express API Server │────>│  MongoDB     │
│  apiClient.ts   │  CORS  │  ├── Auth Middleware │     │  Atlas       │
│  services/*.ts  │<───────│  ├── Rate Limiter    │     └──────────────┘
└─────────────────┘        │  ├── Bot Protection  │     ┌──────────────┐
                           │  ├── Input Sanitizer │────>│  OpenRouter  │
                           │  └── Routes          │     │  / Gemini    │
                           │      └── Controllers │     └──────────────┘
                           │          └── Services│
                           │              └── AI  │
                           │  ┌───────────────────┤
                           │  │ AIManager         │
                           │  │ ├── AIRequestQueue│
                           │  │ ├── QueueWorker   │
                           │  │ ├── QuotaManager  │
                           │  │ ├── ResponseParser│
                           │  │ ├── SchemaValid.  │
                           │  │ ├── RetryManager  │
                           │  │ ├── AICache       │
                           │  │ └── Providers     │
                           │  │     ├── OpenRouter │
                           │  │     └── Gemini    │
                           │  └───────────────────┤
                           └─────────────────────┘
```

## Project Structure

```
Hire-XfinalVerdict/
├── frontend/
│   ├── src/
│   │   ├── animations/       # Framer Motion animation configs
│   │   ├── components/       # UI components (Navbar, Footer, ResumeGenerator, etc.)
│   │   ├── config/           # App constants
│   │   ├── context/          # React contexts (AuthContext)
│   │   ├── features/         # Feature-specific components (coldEmail, coverLetter)
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utility libraries
│   │   ├── pages/            # Route pages
│   │   ├── services/         # API service layer (apiClient, aiService, authService, etc.)
│   │   └── types/            # TypeScript type definitions
│   ├── vercel.json           # Vercel SPA routing & headers
│   ├── vite.config.mjs       # Vite build configuration
│   └── .env.example          # Frontend env template
│
├── backend/
│   ├── config/               # Database & environment configuration
│   ├── controllers/          # Route controller re-exports (backward compat)
│   ├── middleware/            # Auth, error, rate limiting, bot protection, sanitizer
│   ├── models/               # Mongoose schemas (User, Resume, InterviewSession, etc.)
│   ├── routes/               # Express route re-exports
│   ├── src/
│   │   ├── ai/               # AI pipeline (AIManager, Queue, Providers, Prompts, Schemas)
│   │   ├── features/         # Feature modules (ai, auth, resume, interview, etc.)
│   │   └── utils/            # Security logger
│   ├── server.js             # Express app entry point
│   └── .env.example          # Backend env template
│
└── README.md
```

## Local Development Setup

### Prerequisites

- Node.js >= 18.0.0
- MongoDB (local instance or Atlas)
- OpenRouter API key (get one at https://openrouter.ai)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Hire-XfinalVerdict
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your actual values (see Environment Variables below)
npm install
npm run dev    # Starts with nodemon on port 5000
```

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env
# Edit .env — for local dev: VITE_API_URL=http://localhost:5000/api
npm install
npm run dev    # Starts Vite dev server on port 8080
```

### 4. Verify

- Frontend: http://localhost:8080
- Backend health: http://localhost:5000/api/health
- Backend readiness: http://localhost:5000/api/ready

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | No | `development` or `production` (default: `development`) |
| `PORT` | No | Server port (default: `5000`, Render supplies this automatically) |
| `MONGO_URI` | **Yes** | MongoDB connection string |
| `JWT_SECRET` | **Yes** | JWT signing secret (minimum 32 characters) |
| `AI_PROVIDER` | No | `openrouter` or `gemini` (default: auto-detect from keys) |
| `OPENROUTER_API_KEY` | **Yes*** | OpenRouter API key |
| `OPENROUTER_MODEL` | No | Default model (default: `inclusionai/ling-3.0-flash:free`) |
| `GEMINI_API_KEY` | No | Native Gemini API key (if not using OpenRouter) |
| `GEMINI_MODEL` | No | Gemini model (default: `gemini-2.5-flash`) |
| `CLIENT_URL` | **Yes** | Frontend origin for CORS (e.g., `https://your-app.vercel.app`) |
| `AI_USAGE_LIMIT` | No | Global AI usage limit per user (default: `500`) |
| `AI_MAX_CONCURRENCY` | No | Max concurrent AI requests (default: `3`) |
| `AI_USAGE_WHITELIST` | No | Comma-separated admin emails (bypass AI limits) |
| `ADMIN_EMAIL` | No | Admin email for admin-only routes |
| `OPENROUTER_REFERER` | No | HTTP Referer for OpenRouter tracking |
| `TURNSTILE_SECRET_KEY` | No | Cloudflare Turnstile bot protection secret |

*At least one of `OPENROUTER_API_KEY`, `GEMINI_API_KEY` is required for AI features.

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | **Yes** | Backend API URL (e.g., `http://localhost:5000/api`) |

> **Security**: Never place API keys, database credentials, or JWT secrets in the frontend `.env`. Only `VITE_`-prefixed variables are exposed to the browser.

## MongoDB Atlas Setup

1. Create a free cluster at https://cloud.mongodb.com
2. Create a database user with read/write access
3. Whitelist your IP (or `0.0.0.0/0` for Render)
4. Get the connection string and set `MONGO_URI` in your backend `.env`
5. Replace `<password>` with your database user's password

## OpenRouter Setup

1. Sign up at https://openrouter.ai
2. Add credits or use free-tier models
3. Generate an API key at https://openrouter.ai/settings/keys
4. Set `OPENROUTER_API_KEY` in your backend `.env`
5. Optionally set `OPENROUTER_MODEL` (default uses free models with fallback chain)

## Gemini Setup (Optional)

If you want to use Google Gemini directly (not via OpenRouter):

1. Get an API key at https://aistudio.google.com/apikey
2. Set `GEMINI_API_KEY` in your backend `.env`
3. Set `AI_PROVIDER=gemini`

## Vercel Deployment (Frontend)

1. Push your repository to GitHub
2. Import the project in Vercel (https://vercel.com)
3. Set the **Root Directory** to `frontend`
4. Set **Framework Preset** to `Vite`
5. Add environment variable:
   - `VITE_API_URL` = `https://your-render-backend.onrender.com/api`
6. Deploy

The `vercel.json` file handles SPA routing (all routes → `index.html`) and security headers automatically.

## Render Deployment (Backend)

1. Create a new **Web Service** on Render (https://render.com)
2. Connect your GitHub repository
3. Set the **Root Directory** to `backend`
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `npm start`
6. Add environment variables:
   - `NODE_ENV` = `production`
   - `MONGO_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET` = a secure 32+ character secret
   - `OPENROUTER_API_KEY` = your OpenRouter key
   - `CLIENT_URL` = `https://your-app.vercel.app`
   - (Optional) `OPENROUTER_MODEL`, `AI_PROVIDER`, etc.
7. Deploy

> **Note**: Render automatically provides `PORT` — do not set it manually.

## API Overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | Public | Health check |
| GET | `/api/ready` | Public | Readiness probe (DB check) |
| POST | `/api/auth/register` | Public | User registration |
| POST | `/api/auth/login` | Public | User login |
| GET | `/api/auth/me` | Protected | Get current user |
| POST | `/api/ai/analyze-resume` | Optional | ATS resume analysis |
| POST | `/api/ai/analyze-resume-realtime` | Optional | Real-time resume analysis |
| POST | `/api/ai/analyze-job` | Optional | Job description analysis |
| POST | `/api/ai/generate-resume` | Optional | AI resume generation |
| POST | `/api/ai/generate-content` | Optional | General AI content |
| POST | `/api/ai/chat` | Optional | AI career chat |
| POST | `/api/ai/cold-email` | Optional | Cold email generation |
| POST | `/api/ai/cover-letter` | Optional | Cover letter generation |
| POST | `/api/ai/job-suggestions` | Optional | Job role suggestions |
| GET | `/api/ai/usage` | Optional | AI usage statistics |
| POST | `/api/resumes` | Protected | Save resume |
| GET | `/api/resumes` | Protected | List user resumes |
| DELETE | `/api/resumes/:id` | Protected | Delete resume |
| POST | `/api/interviews/session/start` | Protected | Start interview session |
| POST | `/api/interviews/session/answer` | Protected | Submit interview answer |
| POST | `/api/interviews/session/finalize` | Protected | Finalize interview |
| POST | `/api/interviews/documents/upload` | Protected | Upload study document |
| GET | `/api/interviews/documents` | Protected | List documents |

## Security

- **Authentication**: JWT-based with bcrypt password hashing (salt rounds: 10)
- **CORS**: Strict origin checking — production only allows `CLIENT_URL`
- **Rate Limiting**: Per-endpoint rate limits (login: 5/15min, AI: 20/hr, general: 200/15min)
- **Input Sanitization**: XSS/prototype pollution protection
- **Bot Protection**: Honeypot fields, user-agent screening, optional Turnstile CAPTCHA
- **Headers**: Helmet security headers (HSTS, CSP, X-Frame-Options, etc.)
- **MongoDB Sanitization**: NoSQL injection protection via express-mongo-sanitize
- **Error Handling**: Stack traces hidden in production responses
- **Secrets**: All API keys and credentials via environment variables only

## AI Request Protection

- **Per-user daily quotas** — Feature-specific daily limits (e.g., 10 resume optimizations, 20 ATS analyses)
- **Request queue** — Concurrency-limited (default: 3 concurrent requests)
- **Request deduplication** — Identical in-flight requests are collapsed
- **Response caching** — Successful AI responses are cached to reduce API costs
- **Retry with backoff** — Transient failures (429, 5xx, JSON parse) are retried with exponential backoff
- **Timeout enforcement** — 45s execution timeout per request
- **429 cooldown** — Queue pauses on rate limit hits to prevent thundering herd
- **Schema validation** — Structured AI responses are validated before returning to the client
- **Cancellation** — Requests can be cancelled via API

## Troubleshooting

### Frontend shows "Cannot connect to the server"
- Verify `VITE_API_URL` is set correctly in your `.env`
- Check if the backend is running (`/api/health`)
- Check browser console for CORS errors

### CORS errors in production
- Ensure `CLIENT_URL` in backend env matches your exact Vercel domain
- Include the protocol (`https://your-app.vercel.app`, not just `your-app.vercel.app`)
- Do NOT include a trailing slash

### AI features return errors
- Verify `OPENROUTER_API_KEY` is set and valid
- Check the AI health endpoint: `GET /api/health/ai`
- Check OpenRouter dashboard for credits/rate limits
- Review backend logs for specific provider errors

### MongoDB connection fails
- Verify `MONGO_URI` is correct
- For Atlas: whitelist your server IP (or `0.0.0.0/0`)
- Check the readiness probe: `GET /api/ready`

### Build fails on Vercel
- Ensure root directory is set to `frontend`
- Check that all TypeScript errors are resolved
- Verify `VITE_API_URL` is set in Vercel environment variables

### 429 Too Many Requests
- AI features have per-user daily quotas
- Rate limiting applies per IP/user
- Wait for the cooldown period shown in the error message

## License

ISC

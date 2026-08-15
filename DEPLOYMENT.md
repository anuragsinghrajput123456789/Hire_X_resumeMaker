# Hire-X — Deployment Guide

## Architecture

```
Vercel (Frontend)
  ↓ HTTPS
Render (Backend — Express/Node.js)
  ↓
MongoDB Atlas (Database)

AI Pipeline:
  Express Backend → AIRequestQueue → AIManager → OpenRouterProvider → OpenRouter API
```

---

## Prerequisites

- **Node.js** ≥ 18
- **npm** (comes with Node.js)
- **MongoDB Atlas** account with a cluster
- **OpenRouter** account with an API key
- **Vercel** account (free tier works)
- **Render** account (free tier works)
- **Git** repository (GitHub recommended)

---

## 1. MongoDB Atlas Setup

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) and create a free cluster
2. Create a database user with a strong password
3. Add `0.0.0.0/0` to the IP Access List (allows Render to connect)
4. Get the connection string: **Connect → Drivers → Node.js**
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `hirex`

Example:
```
mongodb+srv://hirexuser:YOUR_PASSWORD@cluster0.abc123.mongodb.net/hirex?retryWrites=true&w=majority
```

---

## 2. Backend Deployment (Render)

### Option A: Using render.yaml Blueprint

1. Push the repository to GitHub
2. Go to [dashboard.render.com](https://dashboard.render.com)
3. Click **New → Blueprint**
4. Connect your GitHub repository
5. Render will detect `render.yaml` and create the service
6. Set the following **secret** environment variables in Render Dashboard:

| Variable | Value |
|----------|-------|
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Random 64+ character string (generate with `openssl rand -base64 48`) |
| `OPENROUTER_API_KEY` | Your OpenRouter API key (starts with `sk-or-v1-`) |
| `CLIENT_URL` | Your Vercel frontend URL (e.g. `https://hire-x.vercel.app`) |
| `OPENROUTER_REFERER` | Same as `CLIENT_URL` |

### Option B: Manual Setup

1. Go to Render Dashboard → **New → Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `hirex-backend`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/health`
4. Add all environment variables listed above
5. Deploy

### Verify Backend

After deployment, visit:
```
https://your-hirex-backend.onrender.com/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "hirex-backend",
  "dbState": "connected"
}
```

---

## 3. Frontend Deployment (Vercel)

1. Go to [vercel.com](https://vercel.com) and import your GitHub repository
2. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add environment variable:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://your-hirex-backend.onrender.com/api` |

4. Deploy

### Verify Frontend

Visit your Vercel URL and confirm:
- Landing page loads
- Login/Register works
- AI features connect to the backend

---

## 4. CORS Configuration

The backend uses the `CLIENT_URL` environment variable for CORS. In production:

- Only the exact origin(s) in `CLIENT_URL` are allowed
- Multiple origins can be comma-separated: `https://hire-x.vercel.app,https://custom-domain.com`
- `localhost` origins are automatically allowed in development but **blocked in production**
- `origin: *` is never used for authenticated routes

---

## 5. Local Development

### Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your local values
npm install
npm run dev
```

### Frontend
```bash
cd frontend
cp .env.example .env
# VITE_API_URL should point to http://localhost:5000/api
npm install
npm run dev
```

---

## 6. Environment Variables Reference

### Backend (Render)

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | ✅ | `production` |
| `PORT` | Auto | Render assigns this (typically 10000) |
| `MONGO_URI` | ✅ | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ | Random 64+ char string |
| `CLIENT_URL` | ✅ | Vercel frontend origin |
| `OPENROUTER_API_KEY` | ✅ | OpenRouter API key |
| `AI_PROVIDER` | ✅ | `openrouter` |
| `OPENROUTER_MODEL` | No | Default: `inclusionai/ling-3.0-flash:free` |
| `OPENROUTER_REFERER` | Rec | Production frontend URL |
| `GEMINI_API_KEY` | No | Only if using native Gemini |
| `AI_USAGE_LIMIT` | No | Default: 500 |
| `AI_MAX_CONCURRENCY` | No | Default: 3 |
| `ADMIN_EMAIL` | No | Admin user email |

### Frontend (Vercel)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | ✅ | Backend API URL (e.g. `https://x.onrender.com/api`) |

---

## 7. Health Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /health` | Render health check probe |
| `GET /api/health` | Detailed API health status |
| `GET /api/ready` | Database readiness probe |
| `GET /api/health/ai` | AI provider health & metrics |

---

## 8. Troubleshooting

### "Failed to fetch" in frontend
- Check that `VITE_API_URL` is set correctly in Vercel
- Check that `CLIENT_URL` in Render matches your Vercel URL exactly
- Check browser console for CORS errors

### AI features return errors
- Verify `OPENROUTER_API_KEY` is set in Render
- Check `/api/health/ai` endpoint for provider status
- Check Render logs for `[OpenRouterProvider]` messages

### Database connection fails
- Verify `MONGO_URI` in Render
- Check MongoDB Atlas IP Access List includes `0.0.0.0/0`
- Check `/health` endpoint for `dbState` field

### 401 Unauthorized errors
- JWT token may be expired (30-day expiry)
- Clear localStorage and log in again
- Verify `JWT_SECRET` hasn't changed between deployments

# 🚀 Hire-X Production Deployment Guide

Comprehensive step-by-step production deployment guide for deploying **Hire-X**:
- **Frontend**: [Vercel](https://vercel.com) (React 18 + Vite SPA)
- **Backend API**: [Netlify Functions](https://netlify.com) (Serverless Express API) / [Render](https://render.com) (Alternative Node Service)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **AI Gateway**: [OpenRouter](https://openrouter.ai) / [Google Gemini](https://aistudio.google.com)

---

## 🏗️ Production System Architecture

```mermaid
graph TD
    Client[Client Web Browser] -->|HTTPS / CDN| Vercel[Vercel Frontend - React SPA]
    Vercel -->|REST API Requests| Netlify[Netlify Functions - Express Serverless API]
    Netlify -->|Mongoose ODM| Atlas[(MongoDB Atlas Cluster)]
    Netlify -->|Priority AI Queue| OpenRouter[OpenRouter AI Gateway]
    OpenRouter -->|Model Fallback Loop| Models[Google Gemini / Meta LLaMA / Qwen]
```

---

## 📋 Environment Variables Reference

### Frontend (`frontend/.env`)
| Variable | Description | Example Value |
|---|---|---|
| `VITE_API_URL` | Production Netlify Backend API URL | `https://hire-x-backend.netlify.app/api` |

### Backend (`backend/.env`)
| Variable | Description | Example Value |
|---|---|---|
| `NODE_ENV` | Production Mode | `production` |
| `MONGO_URI` | MongoDB Atlas Connection String | `mongodb+srv://user:pass@cluster.mongodb.net/hirex?retryWrites=true&w=majority` |
| `JWT_SECRET` | Secret Key for JWT Signatures (32+ chars) | `your_long_32_character_minimum_random_secret` |
| `OPENROUTER_API_KEY` | OpenRouter API Key | `sk-or-v1-your-openrouter-key` |
| `OPENROUTER_MODEL` | Primary AI LLM Model | `google/gemini-2.0-flash-001` |
| `OPENROUTER_REFERER` | Public App URL for OpenRouter Telemetry | `https://hire-x.vercel.app` |
| `CLIENT_URL` | CORS Allowed Vercel Domain | `https://hire-x.vercel.app` |
| `AI_USAGE_LIMIT` | Per-user non-whitelisted AI attempt ceiling | `500` |
| `AI_MAX_CONCURRENCY` | Maximum concurrent LLM generation workers | `3` |

---

## ⚡ Part 1: Deploying Frontend to Vercel

### Step 1: Import Project into Vercel
1. Go to the [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New...** → **Project**.
2. Select your Hire-X GitHub repository.

### Step 2: Configure Vercel Project
- **Root Directory**: Click Edit and select `frontend`.
- **Framework Preset**: `Vite` (auto-detected).
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Step 3: Set Environment Variable
Add the following environment variable:
- `VITE_API_URL` = `https://<your-netlify-app-name>.netlify.app/api`

### Step 4: Deploy & Verify
Click **Deploy**. Vercel will compile the React app and deploy it across its global edge network.

The included `frontend/vercel.json` automatically handles SPA routing (`/(.*)` → `/index.html`) so refreshing pages like `/generator`, `/cover-letter`, or `/interview` will never return 404.

---

## 🌐 Part 2: Deploying Backend to Netlify

### Step 1: Netlify Site Creation
1. Go to the [Netlify Dashboard](https://app.netlify.com) and click **Add new site** → **Import an existing project**.
2. Connect your GitHub repository containing Hire-X.

### Step 2: Configure Netlify Build Settings
- **Base directory**: `backend`
- **Build command**: `npm install`
- **Publish directory**: `public`
- **Functions directory**: `functions`

> 💡 *Note*: Netlify will automatically detect `backend/netlify.toml` which rewrites `/api/*` requests to the serverless function in `backend/functions/api.js`.

### Step 3: Add Backend Environment Variables
In Netlify site settings under **Site configuration** → **Environment variables**, add:
- `NODE_ENV` = `production`
- `MONGO_URI` = `mongodb+srv://user:pass@cluster.mongodb.net/hirex?retryWrites=true&w=majority`
- `JWT_SECRET` = `your_secure_32_character_jwt_secret`
- `OPENROUTER_API_KEY` = `sk-or-v1-your-openrouter-key`
- `CLIENT_URL` = `https://<your-vercel-app-name>.vercel.app` *(Must match your Vercel URL without trailing slash)*

### Step 4: Deploy & Verify
Click **Deploy hire-x-backend**. Once deployed, verify in browser:
```bash
https://<your-netlify-app-name>.netlify.app/api/health
```
Expected response:
```json
{
  "status": "ok",
  "service": "hire-x-api",
  "environment": "production",
  "dbState": "connected"
}
```

---

## 🔄 Alternative: Deploying Backend to Render

If you prefer a long-running Node.js process instead of serverless functions:

1. Log in to [Render Dashboard](https://dashboard.render.com/) → **New +** → **Web Service**.
2. Connect repo, set **Root Directory** to `backend`.
3. Build Command: `npm install`, Start Command: `npm start`.
4. Add environment variables (`NODE_ENV`, `MONGO_URI`, `JWT_SECRET`, `OPENROUTER_API_KEY`, `CLIENT_URL`).
5. Update Vercel `VITE_API_URL` to `https://<your-render-app>.onrender.com/api`.

---

## 🔍 Troubleshooting & Verification

### Health Probe Verification
```bash
curl https://<your-netlify-app-name>.netlify.app/api/health
curl https://<your-netlify-app-name>.netlify.app/api/ready
```

### CORS Errors
If browser network requests fail with CORS errors:
1. Double-check `CLIENT_URL` in your Netlify Environment Variables.
2. It must match your exact Vercel origin (e.g. `https://hire-x.vercel.app`).
3. Ensure there is **no trailing slash** in `CLIENT_URL`.

### Database Connection Issues
If `/api/ready` returns 503:
1. Verify `MONGO_URI` connection string in Netlify settings.
2. In MongoDB Atlas **Network Access**, ensure IP whitelist includes `0.0.0.0/0` to allow Netlify serverless connections.

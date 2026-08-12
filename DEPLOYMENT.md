# 🚀 Hire-X SaaS Deployment Guide

Comprehensive step-by-step production deployment guide for deploying **Hire-X**:
- **Frontend**: [Vercel](https://vercel.com)
- **Backend API**: [Render](https://render.com)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **AI Gateway**: [OpenRouter](https://openrouter.ai)

---

## 🏗️ Production System Architecture

```mermaid
graph TD
    Client[Client Web Browser] -->|HTTPS / CDN| Vercel[Vercel Frontend - React SPA]
    Vercel -->|REST API Requests| Render[Render Backend - Node.js Service]
    Render -->|Mongoose ODM| Atlas[(MongoDB Atlas Cluster)]
    Render -->|Priority AI Queue| OpenRouter[OpenRouter AI Gateway]
    OpenRouter -->|Model Fallback Loop| Models[Google Gemini / Meta LLaMA / Qwen]
```

---

## 📋 Environment Variables Reference

### Frontend (`frontend/.env`)
| Variable | Description | Example Value |
|---|---|---|
| `VITE_API_URL` | Production Render Backend API URL | `https://hire-x-backend.onrender.com/api` |

### Backend (`backend/.env`)
| Variable | Description | Example Value |
|---|---|---|
| `NODE_ENV` | Production Mode | `production` |
| `PORT` | HTTP Server Listener Port | `5000` |
| `MONGO_URI` | MongoDB Atlas Connection String | `mongodb+srv://user:pass@cluster.mongodb.net/hirex?retryWrites=true&w=majority` |
| `JWT_SECRET` | Secret Key for JWT Signatures (32+ chars) | `your_long_32_character_minimum_random_secret` |
| `OPENROUTER_API_KEY` | OpenRouter API Key | `sk-or-v1-your-openrouter-key` |
| `OPENROUTER_MODEL` | Primary AI LLM Model | `google/gemini-2.0-flash-001` |
| `OPENROUTER_REFERER` | Public App URL for OpenRouter Telemetry | `https://hire-x.vercel.app` |
| `CLIENT_URL` | CORS Allowed Vercel Domain | `https://hire-x.vercel.app` |
| `AI_USAGE_LIMIT` | Per-user non-whitelisted AI attempt ceiling | `500` |
| `AI_MAX_CONCURRENCY` | Maximum concurrent LLM generation workers | `3` |

---

## 🌐 Part 1: Deploying Backend to Render

### 1. Create Web Service
1. Go to the [Render Dashboard](https://dashboard.render.com/) and click **New +** → **Web Service**.
2. Connect your Git repository containing Hire-X.

### 2. Configure Service Properties
- **Name**: `hire-x-backend`
- **Root Directory**: `backend`
- **Environment**: `Node`
- **Region**: Choose your closest region (e.g. Oregon, Frankfurt, Singapore).
- **Branch**: `main`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 3. Add Environment Variables
In the **Environment Variables** section on Render, add:
- `NODE_ENV` = `production`
- `PORT` = `5000`
- `MONGO_URI` = `your_mongodb_atlas_connection_string`
- `JWT_SECRET` = `your_secure_32_character_jwt_secret`
- `OPENROUTER_API_KEY` = `sk-or-v1-your-key`
- `CLIENT_URL` = `https://your-app-name.vercel.app`

### 4. Health & Readiness Check Paths
In **Advanced Settings**:
- **Health Check Path**: `/api/health`

### 5. Deploy & Verify
Click **Create Web Service**. Once deployed, verify in browser:
```bash
https://hire-x-backend.onrender.com/api/health
```
Expected response:
```json
{
  "status": "ok",
  "uptime": 12.4,
  "environment": "production",
  "dbState": "connected",
  "timestamp": "2026-07-29T16:00:00.000Z"
}
```

---

## ⚡ Part 2: Deploying Frontend to Vercel

### 1. Import Project into Vercel
1. Go to the [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New...** → **Project**.
2. Select your Hire-X GitHub repository.

### 2. Configure Vercel Project
- **Root Directory**: Click Edit and select `frontend`.
- **Framework Preset**: `Vite` (auto-detected).
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 3. Set Environment Variable
Add the environment variable:
- `VITE_API_URL` = `https://hire-x-backend.onrender.com/api`

### 4. Deploy & Verify
Click **Deploy**. Vercel will compile the React app and deploy it on global edge servers.

The included `vercel.json` automatically configures SPA rewrite rules:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
This ensures refreshing pages like `/generator`, `/cover-letter`, or `/interview` will never return 404.

---

## 🔍 Troubleshooting & Operational Verification

### Health Probe Verification
```bash
curl https://hire-x-backend.onrender.com/api/health
curl https://hire-x-backend.onrender.com/api/ready
```

### CORS Verification
If browser network requests fail with CORS errors, verify that `CLIENT_URL` in your Render environment variables matches your exact Vercel URL (e.g. `https://hire-x.vercel.app`).

# Deploying Hire-X Backend to Render

## Overview
This guide covers deploying the Hire-X Node.js & Express API to Render Web Services with MongoDB Atlas database integration.

---

## Step-by-Step Deployment Instructions

### 1. Create Render Web Service
1. Log in to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository.

### 2. Service Settings
- **Name**: `hire-x-backend`
- **Root Directory**: `backend`
- **Environment**: `Node`
- **Region**: Choose the region closest to your users.
- **Branch**: `main`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 3. Environment Variables
In the Render **Environment** section, configure the following variables:

| Variable | Description / Recommended Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGO_URI` | `mongodb+srv://user:pass@cluster0.mongodb.net/hirex?retryWrites=true&w=majority` |
| `JWT_SECRET` | Secret key (minimum 32 random characters) |
| `OPENROUTER_API_KEY` | `sk-or-v1-...` |
| `OPENROUTER_MODEL` | `google/gemini-2.0-flash-001` |
| `CLIENT_URL` | `https://your-project-name.vercel.app` |
| `AI_USAGE_LIMIT` | `500` |
| `AI_MAX_CONCURRENCY` | `3` |

### 4. Health Check Path Configuration
In the **Advanced** settings on Render:
- **Health Check Path**: `/api/health`

### 5. Deploy
1. Click **Create Web Service**.
2. Render will build and launch your container.
3. Verify your deployment by opening `https://<your-render-url>.onrender.com/api/health`.

# Hire-X Production Deployment Guide

This guide provides end-to-end instructions for deploying the **Hire-X** AI-Powered Career Platform to production.

---

## Architecture Overview

```
Frontend (Vercel)                 Backend (Render)              Databases & AI
┌─────────────────────┐          ┌──────────────────────┐      ┌─────────────────┐
│ React 18 + Vite SPA │  HTTPS   │ Express API Server   │ ───> │ MongoDB Atlas   │
│ Tailwind + shadcn/ui│ ───────> │ Dynamic PORT Binding │      └─────────────────┘
│ VITE_API_URL        │   CORS   │ Helmet + Sanitizers  │      ┌─────────────────┐
│                     │ <─────── │ AI Request Queue     │ ───> │ OpenRouter /    │
└─────────────────────┘          └──────────────────────┘      │ Gemini API      │
                                                               └─────────────────┘
```

---

## 1. Database Setup: MongoDB Atlas

1. **Create an Account / Cluster**:
   - Sign in at [MongoDB Atlas](https://www.mongodb.com/atlas).
   - Create a free **M0 Shared Cluster** or a dedicated cluster in your preferred region.

2. **Configure Database User**:
   - Go to **Security > Database Access**.
   - Click **Add New Database User**.
   - Choose **Password Authentication**, create a username (e.g. `hirex_admin`) and a strong password.
   - Set Database User Privileges to **Read and write to any database**.

3. **Configure Network Access**:
   - Go to **Security > Network Access**.
   - Click **Add IP Address**.
   - Choose **Allow Access from Anywhere (`0.0.0.0/0`)** so Render backend instances can connect.

4. **Get Connection String**:
   - Go to **Deployments > Database**.
   - Click **Connect** > **Drivers** > **Node.js**.
   - Copy the URI:
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/hirex?retryWrites=true&w=majority
     ```

---

## 2. AI Provider Setup: OpenRouter

1. **Create OpenRouter Account**:
   - Sign up at [OpenRouter](https://openrouter.ai/).
2. **Generate API Key**:
   - Go to **Keys** > **Create Key**.
   - Name your key (e.g. `hirex-production`).
   - Copy the key: `sk-or-v1-...`.
3. **Credit Balance**:
   - Top up credits or use OpenRouter free-tier models (e.g., `inclusionai/ling-3.0-flash:free`, `google/gemini-2.0-flash-001`, `meta-llama/llama-3.3-70b-instruct:free`).

---

## 3. Backend Deployment: Render

1. **Create Web Service on Render**:
   - Sign in to [Render](https://render.com/).
   - Click **New +** > **Web Service**.
   - Connect your GitHub / GitLab repository containing the Hire-X codebase.

2. **Configure Service Settings**:
   - **Name**: `hirex-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Region**: Choose the closest region to your users / Atlas cluster.
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/health`

3. **Set Environment Variables in Render Dashboard**:
   Go to **Environment** tab and add the following variables:

   | Variable Name | Value | Description |
   |---|---|---|
   | `NODE_ENV` | `production` | Production mode |
   | `PORT` | `10000` | Port assigned by Render |
   | `MONGODB_URI` | `mongodb+srv://<user>:<password>@...` | Atlas connection string (or `MONGO_URI`) |
   | `JWT_SECRET` | *(64+ character random string)* | Used for signing tokens (`openssl rand -hex 32`) |
   | `CLIENT_URL` | `https://your-hirex-frontend.vercel.app` | Vercel frontend URL (comma-separated for multiples) |
   | `AI_PROVIDER` | `openrouter` | AI Engine provider (`openrouter` or `gemini`) |
   | `OPENROUTER_API_KEY` | `sk-or-v1-...` | Your OpenRouter API key |
   | `OPENROUTER_MODEL` | `inclusionai/ling-3.0-flash:free` | Default model (or `google/gemini-2.0-flash-001`) |
   | `OPENROUTER_REFERER` | `https://your-hirex-frontend.vercel.app` | Frontend origin for tracking |
   | `AI_USAGE_LIMIT` | `500` | Maximum daily requests per user |
   | `AI_MAX_CONCURRENCY` | `3` | Max simultaneous AI requests worker handles |
   | `ADMIN_EMAIL` | `admin@yourdomain.com` | (Optional) Admin dashboard access email |
   | `GEMINI_API_KEY` | *(optional)* | Native Gemini key if using `AI_PROVIDER=gemini` |

4. **Deploy**:
   - Click **Create Web Service**.
   - Monitor deploy logs. Once live, verify `https://your-backend.onrender.com/health` returns HTTP 200:
     ```json
     {
       "status": "ok",
       "service": "hirex-backend",
       "dbState": "connected",
       "configValid": true
     }
     ```

---

## 4. Frontend Deployment: Vercel

1. **Import Project into Vercel**:
   - Sign in to [Vercel](https://vercel.com/).
   - Click **Add New...** > **Project**.
   - Select your Hire-X repository.

2. **Configure Build Settings**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Configure Environment Variables**:
   Add the following environment variable in the Vercel project configuration:

   | Variable Name | Value |
   |---|---|
   | `VITE_API_URL` | `https://your-hirex-backend.onrender.com/api` |

   > **Security Note**: Never add `OPENROUTER_API_KEY`, `JWT_SECRET`, or `MONGODB_URI` to Vercel. All AI calls and database interactions occur exclusively on the backend.

4. **Deploy**:
   - Click **Deploy**.
   - Once deployed, copy your production Vercel URL (e.g., `https://hire-x.vercel.app`).

5. **Update Backend CORS (`CLIENT_URL`)**:
   - Go back to Render > `hirex-backend` > **Environment**.
   - Ensure `CLIENT_URL` matches your exact Vercel URL (without trailing slash):
     ```
     CLIENT_URL=https://hire-x.vercel.app
     ```
   - Render will auto-redeploy with the updated CORS whitelist.

---

## 5. Verification & Health Monitoring

### Health Probes
- **Backend Service Health**:
  ```bash
  curl https://your-hirex-backend.onrender.com/health
  ```
- **API Readiness**:
  ```bash
  curl https://your-hirex-backend.onrender.com/api/ready
  ```
- **AI Engine Health & Metrics**:
  ```bash
  curl https://your-hirex-backend.onrender.com/api/health/ai
  ```

### Smoke Test Checklist
1. **User Authentication**: Register a new user, log in, verify JWT cookie/header retention.
2. **Resume Generator**: Create, edit, and export a resume to PDF.
3. **ATS Scoring & Job Match**: Analyze resume content against sample job description.
4. **Interview Simulation & RAG**: Upload study notes, initiate an interview session, submit answers, check AI evaluation.
5. **Cold Email & Cover Letter**: Generate drafts, test clipboard copy, verify database history saving.

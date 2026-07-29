# Deploying Hire-X Frontend to Vercel

## Overview
This guide walks through deploying the Hire-X React (Vite + TypeScript) frontend application to Vercel.

---

## Step-by-Step Deployment Instructions

### 1. Import Repository
1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** → **Project**.
3. Select your GitHub / Git repository containing `Hire-XfinalVerdict`.

### 2. Project Configuration
- **Root Directory**: Select `frontend`.
- **Framework Preset**: `Vite` (Vercel automatically detects Vite).
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 3. Environment Variables
Add the following variable in the Vercel **Environment Variables** section:

| Variable | Recommended Value |
|---|---|
| `VITE_API_URL` | `https://your-render-backend.onrender.com/api` |

*(Replace with your actual deployed Render backend URL).*

### 4. Deploy
1. Click **Deploy**.
2. Vercel will run `npm run build` and provision your edge static assets.
3. Once completed, your app will be live at `https://<your-project-name>.vercel.app`.

---

## Routing & Security Features
- **SPA Client Routing**: The included `vercel.json` provides rewrite rules (`/(.*)` → `/index.html`) so refreshing routes like `/generator`, `/analyzer`, or `/cover-letter` never returns 404.
- **Security Headers**: Includes `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and `X-XSS-Protection`.
- **Asset Caching**: Immutable cache control (`max-age=31536000`) for static `/assets/` bundles.

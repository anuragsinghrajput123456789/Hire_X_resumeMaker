# Hire-X Deployment Guide

## Frontend: Vercel

- Project root: `frontend`
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`
- Required environment variable:
  - `VITE_API_URL=https://your-render-backend.onrender.com/api`

## Backend: Render

- Project root: `backend`
- Runtime: Node
- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/api/health`
- Required environment variables:
  - `NODE_ENV=production`
  - `PORT=5000`
  - `MONGO_URI`
  - `JWT_SECRET`
  - `OPENROUTER_API_KEY`
  - `CLIENT_URL=https://your-vercel-app.vercel.app`
  - `OPENROUTER_REFERER=https://your-vercel-app.vercel.app`

## Local Verification

From `frontend`:

```bash
npm run build
```

From `backend`:

```bash
npm start
```

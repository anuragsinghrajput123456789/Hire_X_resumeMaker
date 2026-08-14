# 🌐 Deploying Hire-X Backend to Netlify

This guide details how to deploy the Hire-X Node.js & Express API backend as a **Serverless Function** on **Netlify Functions** using `serverless-http`.

---

## 🏗️ Architecture on Netlify

```
Client Browser / Vercel Frontend
           │
           │ REST API Requests (HTTPS / CORS)
           ▼
Netlify Functions (AWS Lambda Edge)
 ├── Redirect: /api/* ──► /.netlify/functions/api
 └── Handler: functions/api.js (serverless-http + Express 5)
           │
           ├── MongoDB Atlas (Database Connection)
           └── OpenRouter / Gemini API (AI Gateway)
```

---

## 📋 Required Environment Variables

Configure these environment variables in your Netlify site settings (**Site configuration** → **Environment variables**):

| Variable Name | Required | Description / Example |
|---|---|---|
| `NODE_ENV` | Yes | Set to `production` |
| `MONGO_URI` | **Yes** | `mongodb+srv://<user>:<password>@cluster0.mongodb.net/hirex?retryWrites=true&w=majority` |
| `JWT_SECRET` | **Yes** | High-entropy secret key (minimum 32 random characters) |
| `OPENROUTER_API_KEY` | **Yes** | `sk-or-v1-your-openrouter-api-key` |
| `OPENROUTER_MODEL` | No | `google/gemini-2.0-flash-001` (or leave empty for fallback chain) |
| `CLIENT_URL` | **Yes** | Your production Vercel frontend URL, e.g. `https://hire-x.vercel.app` (No trailing slash) |
| `AI_USAGE_LIMIT` | No | Per-user daily AI quota limit (default: `500`) |
| `AI_MAX_CONCURRENCY` | No | Max concurrent AI worker requests (default: `3`) |

> ⚠️ **Critical CORS Requirement**: `CLIENT_URL` must match your Vercel URL *exactly* (including `https://`, no trailing slash).

---

## 🚀 Deployment Methods

### Method 1: Netlify Web Dashboard (Recommended)

1. Log in to the [Netlify Dashboard](https://app.netlify.com).
2. Click **Add new site** → **Import an existing project**.
3. Authorize and select your Git provider (GitHub, GitLab, Bitbucket).
4. Select your **Hire-X** repository.
5. Configure Site Build Settings:
   - **Base directory**: `backend`
   - **Build command**: `npm install`
   - **Publish directory**: `public`
   - **Functions directory**: `functions`
6. Click **Environment variables** and add all variables listed in the reference table above.
7. Click **Deploy hire-x-backend**.

---

### Method 2: Netlify CLI Deployment

1. Install Netlify CLI globally:
   ```bash
   npm install -g netlify-cli
   ```
2. Log in to your Netlify account:
   ```bash
   netlify login
   ```
3. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
4. Initialize and link site:
   ```bash
   netlify init
   ```
5. Set environment variables via CLI:
   ```bash
   netlify env:set MONGO_URI "mongodb+srv://user:pass@cluster.mongodb.net/hirex"
   netlify env:set JWT_SECRET "your_secure_32_character_jwt_secret"
   netlify env:set OPENROUTER_API_KEY "sk-or-v1-key"
   netlify env:set CLIENT_URL "https://hire-x.vercel.app"
   netlify env:set NODE_ENV "production"
   ```
6. Deploy directly to production:
   ```bash
   netlify deploy --build --prod
   ```

---

## 🔍 Verification & Health Checks

Once Netlify finishes deploying your function, test your endpoint in browser or terminal:

### 1. Health Probe
```bash
curl https://<your-netlify-site-name>.netlify.app/api/health
```
**Expected Response:**
```json
{
  "status": "ok",
  "service": "hire-x-api",
  "environment": "production",
  "dbState": "connected"
}
```

### 2. Database Readiness Check
```bash
curl https://<your-netlify-site-name>.netlify.app/api/ready
```
**Expected Response:**
```json
{
  "status": "ready"
}
```

---

## 🛠️ Netlify Netlify Serverless Configuration Reference

The project includes `netlify.toml` which automatically handles routing API traffic to the serverless function handler:

```toml
[build]
  base = "backend"
  functions = "functions"
  publish = "public"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/.netlify/functions/api"
  status = 200
```

---

## ❓ Troubleshooting Netlify Deployments

| Problem | Cause | Solution |
|---|---|---|
| `CORS Error` in browser console | `CLIENT_URL` missing or mismatched in Netlify env settings | Ensure `CLIENT_URL` equals `https://<your-app>.vercel.app` without trailing slash |
| `500 Internal Server Error` | Database connection error or missing `JWT_SECRET` | Check Netlify Functions log tab under **Functions** → **api** |
| `504 Gateway Timeout` | AI request took longer than 10s (Netlify free function limit) | Make sure `OPENROUTER_MODEL` uses fast models like `google/gemini-2.0-flash-001` |
| `Function NotFound` | Wrong functions build path | Ensure Base Directory is `backend` and Functions Directory is `functions` |

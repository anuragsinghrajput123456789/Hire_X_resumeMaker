# Hire-X — Detailed Deployment Steps

> See [DEPLOYMENT.md](../DEPLOYMENT.md) for the overview and environment variable reference.

## Step-by-Step: First Deployment

### 1. Prepare MongoDB Atlas

```
1. Sign up at https://cloud.mongodb.com
2. Create a free M0 cluster (any region close to your Render region)
3. Security → Database Access → Add New Database User
   - Username: hirexuser
   - Password: (generate a strong one, copy it)
   - Role: Atlas Admin
4. Security → Network Access → Add IP Address → 0.0.0.0/0
   (This allows Render's dynamic IPs to connect)
5. Database → Connect → Drivers → Node.js
   Copy the connection string
6. Replace <password> with your DB user password
7. Replace <dbname> with: hirex
```

### 2. Deploy Backend to Render

```
1. Push your code to GitHub
2. Go to https://dashboard.render.com
3. New → Web Service
4. Connect your GitHub repo
5. Settings:
   - Name: hirex-backend
   - Root Directory: backend
   - Runtime: Node
   - Build Command: npm install
   - Start Command: npm start
   - Plan: Free (or Starter for always-on)
6. Environment → Add environment variables:
   NODE_ENV=production
   MONGO_URI=<your MongoDB Atlas connection string>
   JWT_SECRET=<random 64+ character string>
   OPENROUTER_API_KEY=<your OpenRouter API key>
   AI_PROVIDER=openrouter
   CLIENT_URL=<your Vercel URL — add after step 3>
   OPENROUTER_REFERER=<same as CLIENT_URL>
7. Advanced → Health Check Path: /health
8. Deploy
```

### 3. Deploy Frontend to Vercel

```
1. Go to https://vercel.com → New Project
2. Import your GitHub repo
3. Settings:
   - Framework Preset: Vite
   - Root Directory: frontend
   - Build Command: npm run build
   - Output Directory: dist
4. Environment Variables:
   VITE_API_URL=https://hirex-backend.onrender.com/api
   (Use your actual Render URL)
5. Deploy
6. Copy the Vercel URL (e.g. https://hire-x.vercel.app)
```

### 4. Complete CORS Setup

```
1. Go back to Render Dashboard → hirex-backend → Environment
2. Set CLIENT_URL to your Vercel URL:
   CLIENT_URL=https://hire-x.vercel.app
3. Set OPENROUTER_REFERER to the same:
   OPENROUTER_REFERER=https://hire-x.vercel.app
4. Render will auto-redeploy with the new config
```

### 5. Verify Deployment

```bash
# Backend health
curl https://hirex-backend.onrender.com/health

# API health
curl https://hirex-backend.onrender.com/api/health

# AI health
curl https://hirex-backend.onrender.com/api/health/ai

# Frontend
Open https://hire-x.vercel.app in browser
```

### 6. Smoke Test Checklist

- [ ] Landing page loads
- [ ] Register a new user
- [ ] Login with the new user
- [ ] Generate/optimize a resume (tests OpenRouter)
- [ ] Analyze resume ATS score
- [ ] Generate a cover letter
- [ ] Generate a cold email
- [ ] Start an interview session
- [ ] Chat with the AI assistant
- [ ] Save and retrieve history (tests MongoDB)
- [ ] Logout and verify protected routes redirect

---

## Updating After Deployment

### Frontend Changes
Push to GitHub → Vercel auto-deploys from the connected branch.

### Backend Changes
Push to GitHub → Render auto-deploys from the connected branch.

### Environment Variable Changes
- **Vercel**: Project Settings → Environment Variables → Update → **Redeploy** (required)
- **Render**: Environment → Update → auto-redeploys

---

## Generate a Secure JWT Secret

```bash
# Linux/Mac
openssl rand -base64 48

# Node.js
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"

# PowerShell
[Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
```

---

## Custom Domain Setup

### Vercel
Project Settings → Domains → Add your custom domain

### Render
Settings → Custom Domains → Add your API domain

After adding custom domains, update:
- `CLIENT_URL` in Render to include the custom frontend domain
- `VITE_API_URL` in Vercel to point to the custom backend domain

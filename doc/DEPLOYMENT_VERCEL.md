# ⚡ Deploying Hire-X Frontend to Vercel

This guide provides step-by-step instructions for deploying the **Hire-X** React (Vite + TypeScript) frontend application to **Vercel Global Edge Network**.

---

## 🏗️ System Architecture

```
User Browser
    │
    ├───────────────► Vercel CDN Edge Network (React SPA)
    │                  - Static Asset Distribution
    │                  - SPA Client Routing (vercel.json)
    │
    └───────────────► Netlify Backend API (Express Serverless Functions)
                       - REST API: https://your-backend.netlify.app/api
                       - Database: MongoDB Atlas
```

---

## 📋 Required Environment Variables

Configure environment variables in Vercel (**Project Settings** → **Environment Variables**):

| Variable Name | Required | Description / Recommended Value |
|---|---|---|
| `VITE_API_URL` | **Yes** | Netlify backend URL: `https://your-backend-name.netlify.app/api` (or Render API: `https://your-backend.onrender.com/api`) |

> 🔒 **Security Notice**: Do NOT store API keys, JWT secrets, or DB strings in frontend environment variables. Only `VITE_`-prefixed variables are bundled into browser Javascript assets.

---

## 🚀 Deployment Methods

### Method 1: Vercel Web Dashboard (Recommended)

1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** → **Project**.
3. Import your GitHub repository (`Hire-XfinalVerdict`).
4. Configure Framework & Directory Settings:
   - **Root Directory**: Select `frontend`
   - **Framework Preset**: `Vite` (Auto-detected)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Expand **Environment Variables**:
   - Add Key: `VITE_API_URL`
   - Value: `https://your-backend-name.netlify.app/api`
6. Click **Deploy**.

---

### Method 2: Vercel CLI Deployment

1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```
2. Log in to Vercel:
   ```bash
   vercel login
   ```
3. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
4. Deploy to preview / production:
   ```bash
   # Deploy Preview
   vercel

   # Set production environment variable
   vercel env add VITE_API_URL production

   # Deploy Production
   vercel --prod
   ```

---

## 🛠️ Vercel Routing Configuration (`vercel.json`)

The `frontend/vercel.json` file ensures complete Single Page Application (SPA) compatibility and applies security headers across all edge responses:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

---

## 🌐 Custom Domain Setup

1. In Vercel, navigate to **Project Settings** → **Domains**.
2. Enter your domain name (e.g., `hirex.yourdomain.com` or `yourdomain.com`).
3. Add the displayed DNS records to your domain provider (CNAME / A Records).
4. SSL/TLS certificates will be generated automatically by Vercel.
5. **Important**: Update the `CLIENT_URL` environment variable on Netlify backend to match your new custom domain!

---

## ❓ Troubleshooting Vercel Deployments

| Problem | Cause | Solution |
|---|---|---|
| `Page Not Found (404)` on refresh | SPA rewrite rules missing | Ensure `frontend/vercel.json` contains the rewrite configuration for `/index.html` |
| `Network Error / Failed to Fetch` | `VITE_API_URL` misconfigured or missing | Verify `VITE_API_URL` in Vercel settings has `/api` suffix and HTTPS scheme |
| `CORS Error` | Backend `CLIENT_URL` doesn't match Vercel URL | Update `CLIENT_URL` in Netlify backend settings to match exact Vercel URL |
| TypeScript compile errors during build | Mismatched TS types or strict rules | Run `npm run build` locally inside `frontend` to inspect build logs |

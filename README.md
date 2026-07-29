# 🚀 Hire-X — Enterprise AI Career Intelligence Suite

<div align="center">

  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js 18" />
  <img src="https://img.shields.io/badge/Express-5.2-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express 5" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB Atlas" />
  <img src="https://img.shields.io/badge/OpenRouter-AI-FF6F61?style=for-the-badge&logo=openai&logoColor=white" alt="OpenRouter AI" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/Render-Deployed-46E3B7?style=for-the-badge&logo=render&logoColor=black" alt="Render" />

  <br /><br />

  <p align="center">
    <strong>Hire-X is an enterprise-grade, full-stack AI Career Intelligence Platform designed to transform modern job search workflows. Build high-fidelity ATS-optimized resumes with real-time responsive scaling, generate tailored recruiter cover letters and cold outreach emails, conduct interactive AI interview preparation sessions with RAG document knowledge retrieval, and manage job applications via a unified Kanban tracker.</strong>
  </p>

</div>

---

## 🌟 Key Features & Modules

### 📄 1. Live Interactive Resume Builder & PDF Engine
* **A4 Canvas Live Preview**: Split-workspace interface featuring live template previews powered by high-performance `ResizeObserver` layout scaling.
* **4 Professionally Styled Templates**: Modern, Classic, Creative, and Professional structures crafted with custom typography and grid layouts.
* **Instant PDF Export**: Generates high-resolution, print-ready A4 PDFs matching the live canvas identically via `html2pdf.js`.
* **Smart Data Sanitization**: Gracefully suppresses empty bullet points or unfilled experience blocks without ugly whitespace defects.

### ✉️ 2. Tailored AI Cover Letter Generator
* **Role & Company Alignment**: Generates highly targeted, compelling cover letters by matching candidate resumes directly against target job descriptions.
* **Tone & Experience Controls**: Customizable tone (Professional, Confident, Executive, Creative) and length controls (Short, Medium, Detailed).
* **PDF Export & Persistent History**: Download tailored letters as clean PDFs and manage saved history items directly in your dashboard.

### 🎯 3. ATS & Resume Compatibility Analyzer
* **Real-time Keyword Matcher**: Analyzes candidate resume text against job descriptions, identifying missing skills and recommended insertions.
* **ATS Compatibility Scoring**: Generates overall ATS readability scores, formatting issue breakdowns, and actionable feedback.

### 📩 4. AI Cold Email Outreach Engine
* **High-Converting Outreach**: Crafts personalized cold emails for recruiters, engineering managers, and founders based on personal notes and key tech stack experience.
* **One-Click Clipboard & History**: Save outreach drafts and copy formatted body copy in one click.

### 🎙️ 5. Interview Intelligence & RAG Knowledge Hub
* **AI Interview Roadmaps**: Compiles custom preparation roadmaps based on company, role, and difficulty level.
* **Question Stepping & Real-Time Answer Evaluation**: Generates adaptive questions and evaluates candidate answers with detailed feedback and model answers.
* **RAG Document Knowledge Base**: Upload custom study notes and PDFs for vector-retrieved semantic context during mock interviews.
* **Final Performance Analytics**: Detailed score breakdowns (Technical, Communication, System Design, Problem Solving) with custom study plans and career intelligence insights.

### 📊 6. Job Application Kanban Tracker
* **Pipeline Management**: Save, edit, and organize job applications across stages (`Applied`, `Interview`, `Offer`, `Rejected`).
* **Detailed Records**: Track target roles, companies, dates applied, compensation ranges, links, and notes.

---

## 🏗️ Architecture & Technology Stack

```mermaid
graph TD
    Client[React + TypeScript + Vite Client] <--> |Centralized apiFetch Client| API[Express 5 + Node.js Backend API]
    API <--> |Mongoose ODM (Indexed User Fields)| DB[(MongoDB Atlas Database)]
    API <--> |Priority Queue + Fallbacks| OpenRouter[OpenRouter AI Gateway]
    OpenRouter <--> |Resilient Model Chain| Models[Gemini 2.0 Flash / LLaMA 3.3 70B / Qwen 2.5 72B]
```

### System Architecture Highlights
* **Centralized API Client (`apiClient.ts`)**: Implements 30s/60s request timeouts, 1 automatic retry on network drops or 5xx failures, 401 token auto-clear, and normalized error messages.
* **Feature-Based Modular Architecture (`src/features/`)**: Self-contained domain modules for Auth, Resume, Cover Letter, Cold Email, Interview, Application, Chat, and AI workflows.
* **Resilient AI Pipeline**: Priority queueing (`AIRequestQueue`), request deduplication (`RequestDeduplicator`), pre-flight injection protection (`RequestValidator`), automatic model fallback switching, and character-by-character JSON healing (`JsonExtractor`).

---

## 📁 Directory Structure

```
Hire-XfinalVerdict/
├── DEPLOYMENT.md              # Production Deployment Guide (Vercel & Render)
├── README.md                  # Main Repository Guide
├── backend/                   # Node.js & Express API Server
│   ├── config/                # Environment validation & DB connection setup
│   ├── middleware/            # Auth protection & error handlers
│   ├── models/                # Mongoose Schemas (Indexed User Fields)
│   ├── routes/                # Express API Route Wrappers
│   └── src/
│       ├── ai/                # AI Request Engine (Queue, Prompts, Parsers)
│       └── features/          # Feature Modules (Auth, CoverLetter, ColdEmail, Interview, etc.)
├── frontend/                  # Vite + React Client App
│   ├── vercel.json            # Vercel SPA routing rewrite rules & security headers
│   └── src/
│       ├── config/            # Centralized application constants
│       ├── features/          # Feature UI Subcomponents
│       ├── hooks/             # Custom Hooks (useCoverLetter, useColdEmail, etc.)
│       ├── pages/             # Lazy-loaded page routes
│       ├── services/          # Centralized apiFetch HTTP client & services
│       └── types/             # Reusable TypeScript type definitions
└── doc/                       # System Architecture & Production Operations Docs
```

---

## ⚡ Quick Start & Local Setup

### Prerequisites
- **Node.js** (v18.x or higher)
- **MongoDB** (Local instance or MongoDB Atlas Connection string)
- **OpenRouter API Key** (For powering AI features)

---

### 1. Setup Backend Server

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment configuration
cp .env.example .env
```

Configure **`backend/.env`**:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/hirex
JWT_SECRET=your_secure_random_jwt_secret_key_at_least_32_chars
OPENROUTER_API_KEY=sk-or-v1-your-openrouter-key
OPENROUTER_MODEL=google/gemini-2.0-flash-001
CLIENT_URL=http://localhost:5173
```

Start the backend development server:
```bash
npm run dev
```
The server will run at **`http://localhost:5000`**. You can verify health via `http://localhost:5000/api/health`.

---

### 2. Setup Frontend Client

```bash
# Open a new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment configuration
cp .env.example .env
```

Configure **`frontend/.env`**:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the Vite development client:
```bash
npm run dev
```
The client app will launch at **`http://localhost:5173`** or **`http://localhost:8080`**.

---

## 🌐 Production Deployment

Hire-X is fully prepared for SaaS production deployment:

- **Frontend Deployment (Vercel)**: Detailed step-by-step instructions in [DEPLOYMENT.md](DEPLOYMENT.md#%-part-2-deploying-frontend-to-vercel).
- **Backend Deployment (Render)**: Detailed step-by-step instructions in [DEPLOYMENT.md](DEPLOYMENT.md#%-part-1-deploying-backend-to-render).
- **SRE & Production Readiness**: Operations guide in [doc/PRODUCTION_READINESS.md](doc/PRODUCTION_READINESS.md).

```bash
# Verify Frontend Production Build locally
cd frontend && npm run build

# Verify Backend Engine locally
cd backend && npm start
```

---

## 📄 Documentation Index
- 📘 [DEPLOYMENT.md](DEPLOYMENT.md) — Comprehensive Cloud Deployment Guide
- 📙 [doc/ARCHITECTURE.md](doc/ARCHITECTURE.md) — Enterprise Architecture & AI Pipeline Overview
- 📗 [doc/PRODUCTION_READINESS.md](doc/PRODUCTION_READINESS.md) — SRE Operations, Monitoring & Health Probes

---

## 📜 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

# Hire-X System Architecture & Developer Guide

## Overview

Hire-X is a full-stack AI career intelligence platform built with React, TypeScript, Node.js, Express, MongoDB, and OpenRouter AI.

---

## Directory Structure

```
Hire-XfinalVerdict/
├── backend/
│   ├── config/              # Environment & DB connection validation
│   ├── middleware/          # JWT protection & centralized error handler
│   ├── models/              # Mongoose schemas with indexed user fields
│   ├── routes/              # Express API route wrappers (backward compatible)
│   ├── controllers/         # Controller backward-compatibility delegation wrappers
│   └── src/
│       ├── ai/              # AI Core (Queue, Manager, Prompting, Parsers, Schema Validation)
│       └── features/        # Feature-based modular architecture
│           ├── ai/
│           ├── application/
│           ├── auth/
│           ├── coldEmail/
│           ├── coverLetter/
│           ├── interview/
│           └── resume/
└── frontend/
    ├── src/
    │   ├── components/      # UI components and feature views
    │   ├── context/         # AuthContext
    │   ├── hooks/           # Extracted custom hooks (useCoverLetter, useColdEmail, etc.)
    │   ├── pages/           # Lazy-loaded page routes
    │   ├── services/        # Centralized apiFetch HTTP client & feature services
    │   └── types/           # TypeScript interface definitions
```

---

## Architecture Principles

### 1. Centralized Resilience & Request Pipeline (`apiClient.ts`)
All frontend HTTP communication routes through `apiFetch()`:
- **Timeout**: 30s default (60s for AI workloads).
- **Auto Retry**: 1 automatic retry on network failure or 5xx server responses.
- **Unified Error Handling**: Extracts JSON/text error payloads and normalizes network drops to user-friendly messages.
- **Auth Interception**: Automatically clears stale token storage on 401 response status.

### 2. Priority-Queued AI Orchestration (`src/ai/`)
Every AI feature request flows through the AI Request Engine:
1. **Pre-flight Input Validation** (`RequestValidator.js`) — screens payload size and prompt injection risks.
2. **Request Deduplication** (`RequestDeduplicator.js`) — prevents duplicate concurrent AI calls.
3. **Priority Queueing** (`QueueManager.js`) — assigns priority weights (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`).
4. **Resilient Provider Execution** (`OpenRouterProvider.js` & `GeminiProvider.js`) — automatically handles model fallbacks, exponential backoff retries, and rate-limit cooldowns.
5. **JSON Healing & Validation** (`ResponseParser.js` & `SchemaValidator.js`) — auto-repairs missing quotes/brackets and validates schemas before responding.

### 3. Backend Feature Modules (`src/features/`)
Backend features are self-contained:
- **Routes**: Expose HTTP endpoints.
- **Controllers**: Thin interface handlers for validating input and delegating to services.
- **Services**: Pure business logic and database persistence handlers.

---

## Deployment Setup

### Frontend (Vercel)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variable**: `VITE_API_URL=https://your-render-backend.onrender.com/api`

### Backend (Render)
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Health Probe**: `/api/health`
- **Readiness Probe**: `/api/ready`
- **Environment Variables**:
  - `NODE_ENV=production`
  - `PORT=5000`
  - `MONGO_URI=mongodb+srv://...`
  - `JWT_SECRET=...`
  - `OPENROUTER_API_KEY=...`
  - `CLIENT_URL=https://your-vercel-app.vercel.app`

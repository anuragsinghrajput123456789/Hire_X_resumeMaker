# Hire-X Production Readiness & SRE Operations Guide

## Overview

This guide documents SRE monitoring, rate-limiting, error isolation, database performance, and disaster recovery strategies for Hire-X.

---

## Observability & Monitoring Architecture

### 1. Health & Readiness Probes
- **`/api/health`**: Returns application uptime, environment mode (`production`), and MongoDB connectivity status.
- **`/api/ready`**: Returns HTTP `200 OK` when MongoDB Mongoose driver is active (used by load balancers / cloud orchestrators). Returns HTTP `503` if DB connection drops.

### 2. Request Logging & Traceability
Every incoming API request is tagged with a unique `requestId` (`[REQ-timestamp-hash]`). Log entries output:
- `requestId`
- HTTP Method & Path
- Status Code
- Duration (ms)
- Authenticated `userId` (when available)

---

## Security & Resilience

### 1. Protection Mechanisms
- **Helmet HTTP Headers**: Enforces Content Security Policy, frameguard, and XSS protection.
- **Mongo Sanitization**: Removes MongoDB query selector injection attempts (`$where`, `$gt`, etc.).
- **Pre-flight AI Prompt Injection Filter**: Blocks prompt override commands in user input.
- **Rate Limiting**:
  - General API: 200 requests per 15 minutes per IP.
  - AI Generation API: 50 requests per hour per IP.

### 2. Failure Recovery & Circuit Breaking
- **429 Cooldown**: When OpenRouter returns a 429 rate limit error, `QueueWorker` pauses queue processing for 3 seconds to permit provider recovery.
- **Retry Mechanism**:
  - Frontend: `apiFetch()` retries network drops and 5xx responses once.
  - AI Engine: `OpenRouterProvider` retries with fallback models (`llama-3.3-70b`, `qwen-2.5-72b`).

---

## Database Indexing Matrix

| Model | Indexed Fields | Purpose |
|---|---|---|
| `User` | `email` (unique) | Fast login lookup |
| `Resume` | `userId` | User dashboard queries |
| `CoverLetter` | `userId`, `resumeId` | User cover letter history |
| `ColdEmail` | `userId` | User outreach email history |
| `InterviewSession` | `userId` | Interview workspace session retrieval |
| `InterviewDocument` | `userId` | RAG study guide material search |
| `DocumentChunk` | `userId`, `documentId` | Fast vector & similarity chunk lookup |
| `JobApplication` | `userId` | Job tracker board queries |

---

## Disaster Recovery Recommendations

1. **Database Backups**: Enable MongoDB Atlas Automated Continuous Point-in-Time Restores (PITR).
2. **AI Provider Fallbacks**: Configure fallback OpenRouter model endpoints in `ModelConfig.js`.
3. **Secret Rotation**: Rotate `JWT_SECRET` and `OPENROUTER_API_KEY` periodically via Render environment dashboard.

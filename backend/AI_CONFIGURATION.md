# Hire-X AI Layer Configuration & Deployment Guide

This document provides a comprehensive operational guide for the refactored, production-ready AI layer of the **Hire-X** application.

---

## 📐 AI Pipeline Architecture

The Hire-X AI layer is designed with standard architectural separation, ensuring that no controller or route interacts directly with LLMs. All calls flow through a unified pipeline:

```
                  ┌──────────────────────┐
                  │    HTTP Client       │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │   Route Handler      │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │   aiController.js    │
                  └──────────┬───────────┘
                             │ (Centralized validation, usage checks)
                             ▼
                  ┌──────────────────────┐
                  │    AIManager.js      │
                  └──────────┬───────────┘
                             ├──────────────────────────────────────┐
                             ▼ (Collapse identical concurrent promises)
                  ┌──────────────────────┐                                  │
                  │  Request Collapsing  │                                  │
                  └──────────┬───────────┘                                  │
                             │ (New unique request)                         │
                             ▼                                              ▼
                  ┌──────────────────────┐                      ┌──────────────────────┐
                  │ RequestValidator.js  │                      │ executeAIStream      │
                  └──────────┬───────────┘                      └──────────┬───────────┘
                             │ (Pre-flight safety & size)                  │
                             ▼                                             │
                  ┌──────────────────────┐                                 │ (Unified provider stream)
                  │   PromptManager.js   │                                 ▼
                  └──────────┬───────────┘                      ┌──────────────────────┐
                             │ (Version registry lookup)        │  Provider.stream()   │
                             ▼                                  └──────────┬───────────┘
                  ┌──────────────────────┐                                 │ (SSE chunks)
                  │  RetryManager.js     │                                 ▼
                  └──────────┬───────────┘                         ┌──────────────┐
                             │ (Backoff + Jitter)                  │ Client Stream│
                             ▼                                     └──────────────┘
                  ┌──────────────────────┐
                  │  Provider.generate() │
                  └──────────┬───────────┘
                             │ (Fallback model cascade, abort control)
                             ▼
                  ┌──────────────────────┐
                  │  ResponseParser.js   │
                  └──────────┬───────────┘
                             │ (Quotes fixing, balance healing)
                             ▼
                  ┌──────────────────────┐
                  │ SchemaValidator.js   │
                  └──────────┬───────────┘
                             │ (Validate types & apply defaults)
                             ▼
                  ┌──────────────────────┐
                  │   PromptLogger.js    │
                  └──────────────────────┘
                             │ (Structured JSON in Prod, pretty logs in Dev)
                             ▼
                    [Output Result]
```

---

## ⚙️ Environment Variables Configuration

To run the AI layer in production, configure the following variables in your `.env` file:

```bash
# Core execution setting
NODE_ENV=production

# Selected Provider ('openrouter' or 'gemini')
AI_PROVIDER=openrouter

# OpenRouter Configuration
OPENROUTER_API_KEY=sk-or-v1-...       # OpenRouter Key
OPENROUTER_REFERER=https://hire-x.com # Referral domain for analytics
OPENROUTER_MODEL=google/gemini-2.0-flash-001 # Primary Model

# Direct Google Gemini Fallback Route (Optional)
GEMINI_API_KEY=AIzaSy...              # Gemini native Key
GEMINI_MODEL=google/gemini-flash-1.5  # Native Gemini Model

# User Usage Control Limits
AI_USAGE_LIMIT=500                    # Maximum request count per user
AI_USAGE_WHITELIST=admin@hire-x.com   # Whitelisted users bypass quota limits
```

---

## 🛠️ Key Architectural Enhancements

### 1. Robust JSON Healing
If the model response is truncated or format-corrupted:
- Converts outer single quotes to double quotes, leaving internal apostrophes (e.g., `'Bachelor's Degree'` -> `"Bachelor's Degree"`) intact.
- Enforces double-quoting on raw unquoted object keys (e.g., `{ atsScore: 85 }` -> `{"atsScore": 85}`).
- Implements a stack-based structural balancer to cleanly close incomplete brackets and braces in truncated streams.

### 2. Request Deduplication (Promise Collapsing)
If identical workflows are triggered concurrently (e.g., double-clicks on resume scans or study plans), the `AIManager.js` collapses duplicate requests, executing a single OpenRouter request and distributing the resolved response to all waiters, saving tokens and rate-limiting limits.

### 3. Model Fallbacks & Retry Assistance
- Generates fallback cascades for standard generation and streaming initiation.
- On retry attempts, shifts the model temperature slightly and appends strict schema adherence warnings to prevent deterministic response corruption.

### 4. Structured Production Audits
Logs are output as single-line JSON format strings in `production` to simplify aggregation via AWS CloudWatch, Datadog, or Logstash.

---

## 🩺 Monitoring & Health Checks
Verify AI provider connectivity via the public health endpoint:
- **URL**: `GET /api/ai/health`
- **Output (UP)**:
  ```json
  {
    "status": "UP",
    "provider": "openrouter",
    "model": "google/gemini-2.0-flash-001",
    "timestamp": "2026-07-27T17:47:33.229Z"
  }
  ```

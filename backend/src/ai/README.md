# Hire-X AI Layer Documentation

This directory houses the unified, highly reliable, and production-ready AI orchestration layer for the Hire-X application.

## Directory Structure
* **`AIManager.js`**: Core entry point that coordinates request validation, prompt resolution, provider delegation, error retry logic, and auditing.
* **`ModelConfig.js`**: Centralized model list configurations, temperature, topP settings, and per-feature request timeouts.
* **`providers/`**: Implementations for API providers:
  * `OpenRouterProvider.js` (queries OpenRouter/OpenAI engines with fallbacks).
  * `GeminiProvider.js` (queries Google Gemini engines directly or through OpenRouter).
* **`prompts/`**: Strongly typed, versioned template compilers. Includes new `interviewEvaluation.prompt.js` for evaluation.
* **`schemas/`**: Structural filters that validate and standardize JSON responses.
* **`utils/`**: Helper utilities:
  * `RequestValidator.js`: Screens parameters, size boundaries, and prompt injection signatures.
  * `JsonExtractor.js`: High-performance character-by-character JSON repair engine.
  * `PromptLogger.js`: Centralized audit logger tracking RequestId, execution time, validation passes, and UserId.
  * `PromptVersioning.js`: Metadata tracking for prompt lifecycle version histories.

---

## Technical Features

### 1. Robust JSON Healing
If the model output is truncated due to token limit cutoffs or formats keys incorrectly, the `JsonExtractor.js` runs a character-by-character correction pass that:
* Balances and appends missing closing braces (`}`) and brackets (`]`).
* Standardizes single quotes around keys/values to double quotes.
* Resolves unquoted keys (`{ score: 85 }` -> `{"score": 85}`).
* Resolves trailing colons (`{"review": ` -> `{"review": null}`).

### 2. Validation & Retries
Both JSON parsing and schema validation happen *inside* the retry block. If validation fails, `RetryManager` catches the exception and schedules another LLM call (up to 3 attempts) using backoff delays.

### 3. Request Security & Sanity
The pre-flight `RequestValidator` intercepts bad queries before triggering LLM requests:
* **Missing values**: Triggers validation exceptions on empty strings or missing required structures.
* **Oversized requests**: Blocks requests whose aggregate content length exceeds 60,000 characters.
* **Prompt Injection**: Blocks instructions matching malicious pattern patterns (e.g. `ignore previous instructions`).

### 4. Streaming Support
Streaming is fully supported via `AIManager.executeAIStreamWorkflow` and routes in `aiController.js` (via Server-Sent Events). Provide `stream: true` in the HTTP JSON body of:
* `/api/ai/chat`
* `/api/ai/cover-letter`
* `/api/ai/generate-content`

---

## Environment Configuration

Define these variables in your `.env`:
* `AI_PROVIDER`: Set to `openrouter` (primary) or `gemini`.
* `OPENROUTER_API_KEY`: OpenRouter bearer key (starts with `sk-or-`).
* `OPENROUTER_REFERER`: Dynamic referer header for OpenRouter analytics.
* `AI_USAGE_LIMIT`: Rate-limiting database threshold for AI request counts.
* `AI_USAGE_WHITELIST`: Comma-separated email addresses exempted from usage limitations.

For local development or backup plans, Gemini requests can be routed natively via `GEMINI_API_KEY`.

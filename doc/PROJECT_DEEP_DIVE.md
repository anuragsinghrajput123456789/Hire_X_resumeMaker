# Hire-X Deep Dive Guide

This document explores advanced codebase components, prompt engineering layouts, security mechanics, UI motion engineering, and template sanitization rules implemented in **Hire-X**.

---

## 🎨 UI Motion System & Micro-Interactions Architecture

Hire-X implements a centralized Framer Motion animation framework in [`frontend/src/lib/animations.ts`](file:///c:/Users/91836/Downloads/Mern-Ai-Projects/Hire-XfinalVerdict/frontend/src/lib/animations.ts) designed for zero layout jank and high perceived performance.

### 1. Motion Physics & Easing System
All component transitions utilize standardized spring physics and exponential easing tokens:
*   **`springSmooth`**: `{ type: "spring", stiffness: 350, damping: 30 }` — Used for card hover, modal entry, and interactive popups.
*   **`springBouncy`**: `{ type: "spring", stiffness: 450, damping: 25 }` — Used for floating toggle triggers and action buttons.
*   **`springSnappy`**: `{ type: "spring", stiffness: 500, damping: 35 }` — Used for quick button presses (`whileTap: { scale: 0.97 }`).
*   **`easeOutExpo`**: `[0.16, 1, 0.3, 1]` — Natural exponential deceleration curve for page fade-ups and route transitions.

### 2. Interactive Card Component (`<InteractiveCard>`)
Wrapped around feature cards across the application ([`frontend/src/components/InteractiveCard.tsx`](file:///c:/Users/91836/Downloads/Mern-Ai-Projects/Hire-XfinalVerdict/frontend/src/components/InteractiveCard.tsx)):
*   **Desktop Mouse Spotlight**: Calculates local mouse coordinates `(x, y)` relative to card bounds and renders a radial cursor-following spotlight glow (`glowColor`).
*   **3D Subtle Micro-Tilt**: Rotates `rotateX` and `rotateY` up to 3° on desktop hover without causing reflows.
*   **Mobile Safety**: Automatically detects touch pointers (`pointer: coarse`) or reduced motion preferences to disable tilt physics for smooth mobile scrolling.

### 3. AI Streaming & Thinking Micro-Interactions
*   **`<AITypingIndicator>`**: Replaces static spinners with a staggered 3-dot bouncing gradient animation during AI inference.
*   **Streaming Reveals**: Chat messages animate into view using scale-fade entries (`aiMessageVariants`).

---

## 🧠 AI Prompt Engineering & JSON Formatting

To obtain structured, machine-parsable JSON outputs from LLMs, the AI module enforces strict formatting prompts.

### 1. Resume Optimization Prompt
When optimizing a user's resume, the prompt mandates returning ONLY a single valid JSON block that matches the Resume Schema structure. It guides the model to restructure descriptions using the **STAR Method (Situation, Task, Action, Result)** and include quantitative metrics (e.g. percentages, dollars, or hours saved):

```
Rewrite the bullet points using the STAR method (Situation, Task, Action, Result). Make sure to include hard metrics (e.g. percentages, money saved, hours saved). Separate bullets with newlines.
```

### 2. Job Description Keyword Insertion Prompt
When analyzing compatibility against a targeted Job Description, the model evaluates required keywords and returns a structured mapping indicating which keywords are missing and recommended insertion sites:

```json
{
  "requiredKeywords": [],
  "missingFromResume": [],
  "recommendedSkills": [],
  "keywordInsertions": [{"keyword":"", "suggestion":"", "section":""}]
}
```

---

## 🛡️ Security Implementation Details

Hire-X implements security at three key layers:

### 1. Database Hashing
User passwords are encrypted before they are stored in the database. Inside the User Model [User.js](file:///c:/Users/91836/Downloads/Mern-Ai-Projects/Hire-XfinalVerdict/backend/models/User.js), a Mongoose pre-save hook intercepts password updates:
*   Checks if the password field has been modified.
*   Generates a secure salt with `bcrypt.genSalt(10)`.
*   Replaces the plain text password with a bcrypt hash.
*   Exposes a schema method `matchPassword` to compare login inputs with the hashed value.

### 2. JSON Web Token (JWT) Route Shields
Endpoints labeled 🔒 (Private) require a Bearer token in the request headers:
*   The [authMiddleware.js](file:///c:/Users/91836/Downloads/Mern-Ai-Projects/Hire-XfinalVerdict/backend/middleware/authMiddleware.js) extracts the header token.
*   Decodes the token using the secret key (`JWT_SECRET`).
*   Queries MongoDB to locate the active user record and appends it to `req.user` (excluding the password hash).
*   Enforces environment validation requiring `JWT_SECRET` to be at least 32 characters long.

### 3. Dynamic CORS Origin Mapping
To prevent unauthorized API access, the CORS configuration in [server.js](file:///c:/Users/91836/Downloads/Mern-Ai-Projects/Hire-XfinalVerdict/backend/server.js) dynamically validates origin domains:
*   Imports local dev origins (e.g. ports `5173`, `3000`, `8080`).
*   Parses comma-separated production origins defined in the `CLIENT_URL` env variable.
*   Blocks request processing if the client origin is not explicitly whitelisted.

---

## 🧹 Data Sanitization & Template Rendering

To prevent empty bullet points, dangling headers, or uneven margins, Hire-X implements sanitization and parsing utilities in [resumeHelper.ts](file:///c:/Users/91836/Downloads/Mern-Ai-Projects/Hire-XfinalVerdict/frontend/src/lib/resumeHelper.ts):

### 1. Smart Bullet Point Parser
The `parseBulletPoints` function standardizes raw user text blocks into arrays of clean bullet points:
*   **Newline splits**: Separates items by newline characters.
*   **Symbol Stripping**: Automatically removes unicode markers (`•`, `▪`, `◦`, `▪`, `*`, `+`, `-`).
*   **Number Truncation**: Strips out leading numbers and list enumerations (e.g., `1. `, `a) `).
*   **Sentence Parsing Fallback**: If a block of text is entered without newlines, it splits the text at sentence boundaries (using lookaheads to identify periods followed by capitalized words) to format a structured list.

### 2. URL Domain Trimming
To maximize printable space in resumes, social links are cleaned before rendering:
*   **LinkedIn**: `linkedin.com/in/username/` -> `username`
*   **GitHub**: `github.com/username` -> `username`
*   **Portfolio**: `https://www.portfolio.com` -> `portfolio.com`

### 3. Empty Object Suppressors
Functions like `filterExperience`, `filterEducation`, and `filterProjects` filter out empty user entries, ensuring that templates only render populated sections.

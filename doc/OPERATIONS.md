# Hire-X Operations and Deployment Guide

This document outlines deployment operations, environment settings, local installations, and runtime validations for **Hire-X**.

---

## 🛠️ Prerequisites & Local Setup

### System Prerequisites
*   **Node.js**: Version `18.x` or higher.
*   **MongoDB**: An active local instance (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas URI.
*   **AI API Key**: Access token from OpenRouter or OpenAI.

### Initial Installation

1.  **Clone the workspace** and navigate to the project directory.
2.  **Backend Setup**:
    ```bash
    cd backend
    npm install
    cp .env.example .env
    ```
3.  **Frontend Setup**:
    ```bash
    cd ../frontend
    npm install
    # Define the VITE_API_URL environment variable
    echo "VITE_API_URL=http://localhost:5000/api" > .env
    ```

---

## ⚙️ Environment Configurations

### Backend Environment Variables (`backend/.env`)

| Variable Name | Description | Default / Requirement |
| :--- | :--- | :--- |
| `PORT` | Listening port for the Express REST server. | `5000` |
| `MONGO_URI` | MongoDB connection URI. | **Required** |
| `JWT_SECRET` | Secret key used to sign JSON Web Tokens. | **Required** (Minimum 32 characters) |
| `CLIENT_URL` | Comma-separated list of allowed client CORS origins. | Optional (local addresses allowed by default) |
| `OPENROUTER_API_KEY` | API Key for OpenRouter integration. | **Required** (or `OPENAI_API_KEY`) |
| `OPENROUTER_MODEL` | Preferred AI model identifier. | `meta-llama/llama-3.2-3b-instruct:free` |
| `AI_USAGE_LIMIT` | Hard request threshold for non-whitelisted users. | `500` |
| `AI_USAGE_WHITELIST` | Comma-separated emails that bypass usage checks. | `anuragsinghj678@gmail.com` |

---

## 🛡️ Built-in Environment Validation

Hire-X implements strict pre-flight environment checks during server initialization in [backend/config/env.js](file:///c:/Users/91836/Downloads/Mern-Ai-Projects/Hire-XfinalVerdict/backend/config/env.js):
*   **Missing Variables**: If either `MONGO_URI` or `JWT_SECRET` is not set, the server throws an error immediately and exits, preventing runtime crashes.
*   **JWT Secret Strength**: The server enforces a security policy checking that `JWT_SECRET` is **at least 32 characters long**. Any shorter key configuration prevents the server from binding to its port.

---

## 🚀 Running the Application

### 1. Development Mode

Start both services concurrently during development.

*   **Backend Server**:
    ```bash
    cd backend
    npm run dev
    ```
    *Starts the Express server with `nodemon` at `http://localhost:5000` and watches for backend changes.*

*   **Frontend Client**:
    ```bash
    cd frontend
    npm run dev
    ```
    *Starts the Vite dev server at `http://localhost:5173` (or port configured dynamically) with Hot Module Replacement (HMR).*

### 2. Production Mode

Build and deploy production-ready artifacts for optimized performance.

*   **Build the Frontend Client**:
    ```bash
    cd frontend
    npm run build
    ```
    *Compiles optimized static bundles (HTML, JS, CSS) into the `frontend/dist` directory.*

*   **Run the Production Server**:
    ```bash
    cd backend
    NODE_ENV=production npm start
    ```
    *Binds Express with standard runtime logs and disables development error stacks on client JSON outputs.*

---

## 🔍 Troubleshooting & Verification

### Database Connection Failure
*   **Symptoms**: Terminal prints `MongoDB connection error: connect ECONNREFUSED`.
*   **Resolution**: Verify that the local MongoDB database service is running:
    *   **Windows**: Run `Get-Service -Name MongoDB` in PowerShell to verify state.
    *   **Linux/macOS**: Run `sudo systemctl status mongod`.

### CORS Blocks
*   **Symptoms**: Web browser console prints `Access to fetch at ... has been blocked by CORS policy`.
*   **Resolution**: Verify the `CLIENT_URL` in `backend/.env` contains your exact client address, e.g. `CLIENT_URL=https://my-production-deployment.com`. Ensure no trailing slashes exist.

### AI Limit Block
*   **Symptoms**: AI actions respond with `403 Forbidden` and message `AI usage limit reached`.
*   **Resolution**: The user's registered email must be added to the `AI_USAGE_WHITELIST` list in the backend environment file, or `aiUsage` inside the database User document must be reset:
    ```javascript
    await User.updateOne({ email: "target-user@domain.com" }, { aiUsage: 0 });
    ```

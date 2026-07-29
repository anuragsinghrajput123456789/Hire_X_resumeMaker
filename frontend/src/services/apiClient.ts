const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const defaultApiUrl = 'http://localhost:5000/api';

export const API_BASE_URL = trimTrailingSlash(
  import.meta.env.VITE_API_URL || defaultApiUrl
);

export const apiUrl = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

export const getStoredToken = () => {
  const storedUser = localStorage.getItem('user');

  if (storedUser) {
    try {
      const user = JSON.parse(storedUser) as { token?: string };
      if (user.token) return user.token;
    } catch {
      localStorage.removeItem('user');
    }
  }

  return localStorage.getItem('userToken') || localStorage.getItem('token');
};

export const authHeaders = (includeJson = true): HeadersInit => {
  const token = getStoredToken();

  return {
    ...(includeJson ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const clearAuthStorage = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('userToken');
  localStorage.removeItem('token');
};

// ---------------------------------------------------------------------------
// Centralized fetch wrapper — timeout, retry, error normalization
// ---------------------------------------------------------------------------

interface ApiFetchOptions extends RequestInit {
  /** Request timeout in milliseconds (default: 30 000) */
  timeoutMs?: number;
  /** Number of automatic retries on network failure or 5xx (default: 1) */
  retries?: number;
  /** If true, skip the automatic 401 → clear-auth-and-redirect behaviour */
  skipAuthRedirect?: boolean;
}

/**
 * Extracts a human-readable error message from a failed Response.
 */
const extractErrorMessage = async (
  response: Response,
  fallback: string,
): Promise<string> => {
  try {
    const text = await response.text();
    try {
      const json = JSON.parse(text);
      // Backend may use `error`, `message`, or both
      return json.error || json.message || fallback;
    } catch {
      return text.length > 0 && text.length < 300 ? text : fallback;
    }
  } catch {
    return fallback;
  }
};

/**
 * Classifies a raw error into a user-friendly message.
 */
const classifyNetworkError = (error: unknown): string => {
  if (error instanceof DOMException && error.name === 'AbortError') {
    return 'Request timed out. Please try again.';
  }
  if (error instanceof TypeError) {
    // "Failed to fetch" — server unreachable, DNS failure, CORS pre-flight failure
    return 'Cannot connect to the server. Please check your internet connection and try again.';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected network error occurred.';
};

/**
 * Production-grade fetch wrapper used by every service.
 *
 * Features:
 *  - Configurable timeout via AbortController (default 30s)
 *  - 1 automatic retry on network failure or 5xx response
 *  - Consistent JSON error body extraction
 *  - 401 detection → clears auth storage
 */
export const apiFetch = async (
  url: string,
  options: ApiFetchOptions = {},
): Promise<Response> => {
  const {
    timeoutMs = 30_000,
    retries = 1,
    skipAuthRedirect = false,
    signal: externalSignal,
    ...fetchOptions
  } = options;

  let lastError: Error | null = null;
  const maxAttempts = 1 + Math.max(0, retries);

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const controller = new AbortController();

    // Link external signal (if provided) to our controller
    if (externalSignal) {
      if (externalSignal.aborted) {
        controller.abort(externalSignal.reason);
      } else {
        externalSignal.addEventListener('abort', () => controller.abort(externalSignal.reason), { once: true });
      }
    }

    const timer = setTimeout(() => controller.abort('timeout'), timeoutMs);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timer);

      // 401 — token expired or invalid
      if (response.status === 401 && !skipAuthRedirect) {
        clearAuthStorage();
        const msg = await extractErrorMessage(response, 'Session expired. Please log in again.');
        throw new Error(msg);
      }

      // 5xx — retryable server errors
      if (response.status >= 500 && attempt < maxAttempts - 1) {
        const msg = await extractErrorMessage(response, `Server error (${response.status})`);
        lastError = new Error(msg);
        // Brief backoff before retry
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        continue;
      }

      // For non-ok responses, extract the error body and throw
      if (!response.ok) {
        const msg = await extractErrorMessage(
          response,
          `Request failed (${response.status})`,
        );
        throw new Error(msg);
      }

      return response;
    } catch (error: unknown) {
      clearTimeout(timer);

      // If it's an error we already constructed (from !response.ok), re-throw as-is
      if (error instanceof Error && !isNetworkLevelError(error)) {
        throw error;
      }

      // Network-level failure (TypeError: Failed to fetch, AbortError, etc.)
      lastError = new Error(classifyNetworkError(error));

      // Only retry on network-level failures, not on abort-by-user
      if (error instanceof DOMException && error.name === 'AbortError' && externalSignal?.aborted) {
        throw lastError; // User-initiated abort — don't retry
      }

      if (attempt < maxAttempts - 1) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        continue;
      }
    }
  }

  throw lastError || new Error('Request failed after retries');
};

/**
 * Checks whether an error is a raw network-level failure vs a constructed app error.
 */
const isNetworkLevelError = (error: Error): boolean => {
  return (
    error instanceof TypeError ||
    (error instanceof DOMException && error.name === 'AbortError')
  );
};

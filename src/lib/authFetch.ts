/**
 * authFetch — A smart fetch wrapper that handles JWT access token expiration
 * by silently refreshing via the HttpOnly refresh_token cookie.
 *
 * Features:
 * - Automatically attaches the Bearer access_token from localStorage
 * - On 401, calls POST /auth/refresh to get a new access_token
 * - Queues concurrent requests while a refresh is in-flight (prevents stampede)
 * - Retries the original request once with the new token
 * - If refresh fails, clears auth state and redirects to /login
 */

import { getToken, setToken, removeToken, removeUserInfo, setUserInfo } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// ── Refresh lock to prevent concurrent refresh calls ──────────────────────
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

/**
 * Attempts to refresh the access token using the HttpOnly refresh_token cookie.
 * Returns the new access_token on success, or null on failure.
 */
async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include", // sends the HttpOnly refresh_token cookie
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return null;
    }

    const json = await res.json();
    const newToken = json.data?.access_token || json.access_token;

    if (newToken) {
      setToken(newToken);

      // Also refresh user info since we have a valid session
      try {
        const meRes = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${newToken}`,
            "Content-Type": "application/json",
          },
        });
        if (meRes.ok) {
          const meJson = await meRes.json();
          const user = meJson.data?.user || meJson.user || meJson.data;
          if (user) {
            setUserInfo(user);
          }
        }
      } catch {
        // Non-critical — user info will still work from existing localStorage
      }

      return newToken;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Coordinates refresh attempts — ensures only one refresh request is in-flight
 * at a time. All concurrent callers wait on the same promise.
 */
function getRefreshedToken(): Promise<string | null> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = refreshAccessToken().finally(() => {
    isRefreshing = false;
    refreshPromise = null;
  });

  return refreshPromise;
}

/**
 * Clears all auth state and redirects to the login page.
 */
function forceLogout() {
  removeToken();
  removeUserInfo();
  if (typeof window !== "undefined") {
    const currentPath = window.location.pathname;
    // Avoid redirect loop if already on login
    if (currentPath !== "/login") {
      window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
    }
  }
}

// ── Type for authFetch options ────────────────────────────────────────────
interface AuthFetchOptions extends Omit<RequestInit, "headers"> {
  headers?: Record<string, string>;
  /** If true, skip attaching the Authorization header (for public endpoints) */
  skipAuth?: boolean;
}

/**
 * Drop-in replacement for `fetch()` that handles authentication automatically.
 *
 * Usage:
 *   const res = await authFetch("/students/profile");
 *   const json = await res.json();
 *
 * @param endpoint - The API endpoint path (e.g. "/students/profile") or full URL
 * @param options - Standard fetch options + optional `skipAuth`
 * @returns The fetch Response object
 */
export async function authFetch(
  endpoint: string,
  options: AuthFetchOptions = {}
): Promise<Response> {
  const { skipAuth, headers: customHeaders, ...fetchOptions } = options;

  const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`;

  // Build headers with auth token
  const headers: Record<string, string> = {
    ...customHeaders,
  };

  if (!skipAuth) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  // First attempt
  let res = await fetch(url, {
    ...fetchOptions,
    headers,
    credentials: "include", // always include cookies for refresh_token
  });

  // If 401, try to refresh and retry once
  if (res.status === 401 && !skipAuth) {
    const newToken = await getRefreshedToken();

    if (newToken) {
      // Retry with the new token
      headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(url, {
        ...fetchOptions,
        headers,
        credentials: "include",
      });

      // If still 401 after refresh, the session is truly expired
      if (res.status === 401) {
        forceLogout();
      }
    } else {
      // Refresh failed — session is gone
      forceLogout();
    }
  }

  return res;
}

/**
 * Convenience wrapper: makes an authFetch call and parses the JSON response.
 * Throws on non-OK responses with the server's error message.
 */
export async function authFetchJson<T = any>(
  endpoint: string,
  options: AuthFetchOptions = {}
): Promise<T> {
  const res = await authFetch(endpoint, options);
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || `Request failed with status ${res.status}`);
  }

  return json.data ?? json;
}

const TOKEN_KEY = "access_token";
const USER_INFO_KEY = "user_info";

export interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "mentor" | "student" | "admin";
  profileImage?: string | null;
  onboardingCompleted?: boolean;
}

export function setToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
    document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=604800; SameSite=Lax`;
    window.dispatchEvent(new Event("agaaw-auth-change"));
  }
}

export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

export function removeToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    window.dispatchEvent(new Event("agaaw-auth-change"));
  }
}

export function setUserInfo(user: UserInfo) {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event("agaaw-auth-change"));
  }
}

let cachedUserInfo: UserInfo | null = null;
let lastRawUserInfo: string | null = null;

export function getUserInfo(): UserInfo | null {
  if (typeof window !== "undefined") {
    const rawUser = localStorage.getItem(USER_INFO_KEY);
    
    if (rawUser === lastRawUserInfo) {
      return cachedUserInfo;
    }
    
    lastRawUserInfo = rawUser;
    cachedUserInfo = rawUser ? JSON.parse(rawUser) : null;
    return cachedUserInfo;
  }
  return null;
}

export function removeUserInfo() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_INFO_KEY);
    window.dispatchEvent(new Event("agaaw-auth-change"));
  }
}

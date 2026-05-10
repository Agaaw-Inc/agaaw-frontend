const TOKEN_KEY = "access_token";
const USER_INFO_KEY = "user_info";

export interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "mentor" | "student";
}

export function setToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
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
  }
}

export function setUserInfo(user: UserInfo) {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(user));
  }
}

export function getUserInfo(): UserInfo | null {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem(USER_INFO_KEY);
    return user ? JSON.parse(user) : null;
  }
  return null;
}

export function removeUserInfo() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_INFO_KEY);
  }
}

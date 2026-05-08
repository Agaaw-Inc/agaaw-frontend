const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function registerUser(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "mentor" | "student";
}) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();
 
  if (!res.ok) {
    throw new Error(json.message || "Failed to register");
  }

  return json.data || json;
}

export async function loginUser(data: { email: string; password: string }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to login");
  }

  return json.data || json;
}

export async function verifyEmail(token: string) {
  const res = await fetch(`${API_URL}/auth/verify-email`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to verify email");
  }

  return json.data || json;
}

export async function resendVerification(email: string) {
  const res = await fetch(`${API_URL}/auth/resend-verification`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to resend verification code");
  }

  return json.data || json;
}

export async function forgotPassword(email: string) {
  const res = await fetch(`${API_URL}/auth/forgot-password`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to send reset link");
  }

  return json.data || json;
}

export async function resetPassword(data: { token: string; password: string }) {
  const res = await fetch(`${API_URL}/auth/reset-password`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to reset password");
  }

  return json.data || json;
}


const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  role: "mentor" | "student";
}) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
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


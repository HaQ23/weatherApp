// src/api/auth.ts

export interface AuthResponse {
  message: string;
}

export async function login(
  email: string,
  password: string
): Promise<{ message: string }> {
  const response = await fetch("http://127.0.0.1:8000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response.json();
}
export async function register(
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await fetch("http://127.0.0.1:8000/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Registration failed");
  }

  return await response.json();
}

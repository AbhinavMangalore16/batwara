const API = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

export function buildApiUrl(path: string) {
  if (!path) return API;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API}${path.startsWith("/") ? path : `/${path}`}`;
}

async function getAuthToken(): Promise<string> {
  if (typeof window === "undefined") return "";

  try {
    // Clerk session token check
    const clerk = (window as any).Clerk;
    if (clerk && clerk.session) {
      const clerkToken = await clerk.session.getToken();
      if (clerkToken) return clerkToken;
    }
  } catch (e) {
    console.error("Clerk token retrieval error:", e);
  }

  return (
    localStorage.getItem("auth_token") ||
    sessionStorage.getItem("auth_token") ||
    localStorage.getItem("better-auth.session_token") ||
    sessionStorage.getItem("better-auth.session_token") ||
    ""
  );
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const authToken = await getAuthToken();

  const res = await fetch(buildApiUrl(path), {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { auth_token: authToken, authorization: `Bearer ${authToken}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error(`API request failed with status ${res.status}`);
  }

  return res.json();
}
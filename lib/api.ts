const API = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

export function buildApiUrl(path: string) {
  if (!path) return API;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API}${path.startsWith("/") ? path : `/${path}`}`;
}

function getAuthToken() {
  if (typeof window === "undefined") return "";
  return (
    localStorage.getItem("auth_token") ||
    sessionStorage.getItem("auth_token") ||
    ""
  );
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const authToken = getAuthToken();

  const res = await fetch(buildApiUrl(path), {
    ...options, // ✅ FIRST

    credentials: "include",

    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { auth_token: authToken } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error(`API request failed with status ${res.status}`);
  }

  return res.json();
}
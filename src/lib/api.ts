export const XANO_BASE = "https://x8ki-letl-twmt.n7.xano.io/api:3qxYwR_i";

export async function apiRequest(
  path: string,
  method: string = "GET",
  body: any = null,
  auth: boolean = false
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${XANO_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  if (!res.ok) {
    const error = await res.json();
    console.error("API Error:", error);
    return null;
  }

  return res.json();
}

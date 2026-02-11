export const XANO_BASE = "https://x8ki-letl-twmt.n7.xano.io/api:3qxYwR_i";

export async function apiRequest(
  endpoint: string,
  method: string = "POST",
  body?: any,
  auth: boolean = false
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${XANO_BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data: any;
  try {
    data = await res.json();
  } catch (e) {
    data = null;
  }

  return { ok: res.ok, status: res.status, data };
}

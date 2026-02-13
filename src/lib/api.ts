export const XANO_BASE = "https://x8ki-letl-twmt.n7.xano.io/api:3qxYwR_i";

export async function apiRequest(
  endpoint: string,
  method: string = "POST",
  body?: any,
  auth: boolean = false
) {
  const headers: any = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token = localStorage.getItem("token");
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${XANO_BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  console.log("API STATUS:", res.status);
  console.log("API RESPONSE:", data);

  return data;
}

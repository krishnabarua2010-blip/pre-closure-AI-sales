import { XANO_BASE } from "@/lib/apiConfig";

export async function getHotLeads(limit = 10) {
  try {
    const res = await fetch(`${XANO_BASE}/api:leads/hot?limit=${limit}`);
    if (!res.ok) {
      throw new Error("Failed to fetch hot leads");
    }
    const data = await res.json();
    if (!Array.isArray(data)) {
      throw new Error("Hot leads response is not an array");
    }
    return data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

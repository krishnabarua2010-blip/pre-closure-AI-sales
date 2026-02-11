import { apiRequest } from "@/lib/api";

export async function getHotLeads(limit = 10) {
  try {
    const resp = await apiRequest(`/api:leads/hot?limit=${limit}`, "GET");
    if (!resp.ok) throw new Error("Failed to fetch hot leads");
    const data = resp.data;
    if (!Array.isArray(data)) throw new Error("Hot leads response is not an array");
    return data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

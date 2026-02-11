import { apiRequest } from "@/lib/api";

export async function sendMessageToAssistant({
  businessSlug,
  message,
}: {
  businessSlug: string;
  message: string;
}) {
  const resp = await apiRequest("/generate_reply", "POST", { business_slug: businessSlug, message }, true);
  if (!resp.ok) throw new Error("Assistant request failed");
  return resp.data;
}

export async function sendMessageToAssistant({
  businessSlug,
  message,
}: {
  businessSlug: string;
  message: string;
}) {
  const res = await fetch(
      `${XANO_BASE}/api:3qxYwR_i/generate_reply`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        business_slug: businessSlug,
        message,
      }),
    }
  );

  if (!res.ok) {
    throw new Error("Assistant request failed");
  }

  return res.json();
}

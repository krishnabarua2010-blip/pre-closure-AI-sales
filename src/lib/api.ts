export async function sendMessageToBackend(message: string): Promise<unknown> {
  const response = await fetch(
    "https://x8ki-letl-twmt.n7.xano.io/api:3qxYwR_i/generate_reply",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to get response from server");
  }

  return response.json();
}

export async function saveBusinessProfile(payload: Record<string, unknown>): Promise<unknown> {
  const response = await fetch(
    "https://x8ki-letl-twmt.n7.xano.io/api:4Brqmmks/business",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to save business profile");
  }

  return response.json();
}

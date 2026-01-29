// src/lib/paymentsApi.ts

export async function createSubscription(plan: string) {
  const res = await fetch("/payments/create-subscription", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ plan }),
  });
  if (!res.ok) {
    throw new Error("Failed to create subscription");
  }
  return res.json();
}

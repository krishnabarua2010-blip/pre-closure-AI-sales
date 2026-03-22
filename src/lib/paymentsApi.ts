// src/lib/paymentsApi.ts
// Stub for Razorpay integration (keys not yet configured)
// This will be implemented once Razorpay keys are available

export async function createSubscription(plan: string) {
  // TODO: Replace with Razorpay integration when keys are available
  // For now, throw a descriptive error
  throw new Error(
    "Payment integration is being set up. Razorpay will be configured soon. " +
    "Please contact support for manual activation."
  );
}

export async function createPreviewSession(data: {
  name: string;
  email: string;
  password: string;
  businessName?: string;
  businessInfo?: string;
}) {
  const res = await fetch("/api/preview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create preview session");
  }
  
  return res.json();
}

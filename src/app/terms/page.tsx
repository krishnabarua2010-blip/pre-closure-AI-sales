export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-2xl py-10">
      <h1 className="text-2xl font-bold mb-6">Terms of Service</h1>
      <div className="card p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-2">Service Description</h2>
        <p>Auto Closure provides AI-powered chat and lead management for your business.</p>
        <h2 className="text-xl font-semibold mb-2">No Guarantee Clause</h2>
        <p>We do our best to provide reliable service, but we do not guarantee uninterrupted or error-free operation. Use is at your own risk.</p>
        <h2 className="text-xl font-semibold mb-2">Usage Limits</h2>
        <p>Each plan has a monthly message limit as described on our pricing page. Exceeding your plan's limit may restrict access to chat features until the next billing cycle or plan upgrade.</p>
        <h2 className="text-xl font-semibold mb-2">Cancellation Clause</h2>
        <p>You may cancel your subscription at any time. Service will remain active until the end of your billing period. No refunds for partial months.</p>
      </div>
    </div>
  );
}

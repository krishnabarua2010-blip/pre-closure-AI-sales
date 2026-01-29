export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-2xl py-10">
      <h1 className="text-2xl font-bold mb-6">Privacy Policy</h1>
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Your Data & Privacy</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>We use your data only to provide and improve the Auto Closure service.</li>
          <li>Chat conversations are stored securely for your business use only.</li>
          <li>We do <span className="font-bold">not</span> sell your data to third parties.</li>
          <li>Contact us at <a href="mailto:support@autoclosure.ai" className="text-blue-600 underline">support@autoclosure.ai</a> for any privacy concerns.</li>
        </ul>
      </div>
    </div>
  );
}

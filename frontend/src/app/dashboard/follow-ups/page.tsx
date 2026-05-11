"use client";

export default function FollowUpsPage() {
  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-[#050505] text-white">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Follow-Ups</h1>
          <p className="text-gray-500 text-sm">Automated sequences and reminders</p>
        </div>
        <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-10 text-center">
          <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">⚡</span>
          </div>
          <h2 className="text-lg font-bold text-white mb-2">Multi-Channel Follow-Ups</h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">Create automated email and WhatsApp sequences to engage leads based on their qualification score.</p>
          <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all">
            Create Sequence
          </button>
        </div>
      </div>
    </div>
  );
}

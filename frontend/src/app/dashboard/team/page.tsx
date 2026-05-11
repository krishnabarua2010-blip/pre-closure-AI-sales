"use client";

export default function TeamPage() {
  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-[#050505] text-white">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Team Management</h1>
          <p className="text-gray-500 text-sm">Manage roles and permissions</p>
        </div>
        <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-10 text-center">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">👥</span>
          </div>
          <h2 className="text-lg font-bold text-white mb-2">Invite Your Team</h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">Bring your sales team into Pre Closer. Assign leads, track performance, and collaborate on deals.</p>
          <button className="bg-[#050505] border border-white/10 hover:bg-white/5 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all">
            Invite Member
          </button>
        </div>
      </div>
    </div>
  );
}

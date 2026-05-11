"use client";

export default function AnalyticsPage() {
  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-[#050505] text-white">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Conversion Analytics</h1>
          <p className="text-gray-500 text-sm">Track your pipeline velocity and ROI</p>
        </div>
        <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-10 text-center">
          <div className="w-16 h-16 bg-purple-500/10 rounded-2xl border border-purple-500/20 flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">📈</span>
          </div>
          <h2 className="text-lg font-bold text-white mb-2">Deep Funnel Visibility</h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">Upgrade to the Growth plan to unlock full conversion analytics, drop-off points, and revenue tracking.</p>
          <button className="bg-white text-black hover:bg-gray-100 px-6 py-3 rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all">
            Upgrade Plan
          </button>
        </div>
      </div>
    </div>
  );
}

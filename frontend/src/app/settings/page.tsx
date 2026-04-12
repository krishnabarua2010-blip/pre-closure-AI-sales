"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';

type QuestionType = 'text' | 'multiple_choice' | 'number' | 'dropdown';

interface CustomQuestion {
  id: string;
  question: string;
  type: QuestionType;
  options?: string[];
}

interface LeadFieldsConfig {
  name: boolean;
  email: boolean;
  phone: boolean;
  company: boolean;
}

const TABS = ['Business Context', 'Lead Fields', 'Chatbot Behavior', 'Widget Embed'] as const;
type Tab = typeof TABS[number];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Business Context');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState('');
  const [loading, setLoading] = useState(true);

  // Business Context
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [idealCustomer, setIdealCustomer] = useState('');
  const [servicesOffered, setServicesOffered] = useState('');
  const [pricingRange, setPricingRange] = useState('');
  const [commonObjections, setCommonObjections] = useState('');
  const [sellingPoints, setSellingPoints] = useState('');
  const [targetAudience, setTargetAudience] = useState('');

  // Chatbot config
  const [chatbotTone, setChatbotTone] = useState('professional');
  const [qualificationMode, setQualificationMode] = useState('balanced');

  // Lead fields
  const [leadFields, setLeadFields] = useState<LeadFieldsConfig>({
    name: true, email: true, phone: false, company: false
  });
  const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>([]);

  // Widget
  const [slug, setSlug] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const { data } = await api.get('/setup/config');
        if (data) {
          setCompanyName(data.company_name || '');
          setIndustry(data.industry || '');
          setBusinessDescription(data.business_description || '');
          setIdealCustomer(data.ideal_customer || '');
          setServicesOffered(data.services_offered || '');
          setPricingRange(data.pricing_range || '');
          setCommonObjections(data.common_objections || '');
          setSellingPoints(data.selling_points || '');
          setTargetAudience(data.target_audience || '');
          setChatbotTone(data.chatbot_tone || 'professional');
          setQualificationMode(data.qualification_mode || 'balanced');
          setSlug(data.slug || '');
          if (data.lead_fields_config) setLeadFields(data.lead_fields_config as LeadFieldsConfig);
          if (data.custom_questions && Array.isArray(data.custom_questions)) setCustomQuestions(data.custom_questions);
        }
      } catch {} finally { setLoading(false); }
    };
    loadConfig();
  }, []);

  const showSaved = (msg: string) => { setSaved(msg); setTimeout(() => setSaved(''), 2500); };

  const saveBusinessContext = async () => {
    setSaving(true);
    try {
      await api.put('/setup/business-context', {
        company_name: companyName, industry,
        business_description: businessDescription, ideal_customer: idealCustomer,
        services_offered: servicesOffered, pricing_range: pricingRange,
        common_objections: commonObjections, selling_points: sellingPoints,
        target_audience: targetAudience,
      });
      showSaved('Business context saved!');
    } catch {} finally { setSaving(false); }
  };

  const saveChatbotConfig = async () => {
    setSaving(true);
    try {
      await api.put('/setup/chatbot-config', {
        chatbot_tone: chatbotTone, qualification_mode: qualificationMode,
        lead_fields_config: leadFields, custom_questions: customQuestions,
      });
      showSaved('Configuration saved! Changes take effect immediately.');
    } catch {} finally { setSaving(false); }
  };

  const addQuestion = () => {
    setCustomQuestions([...customQuestions, {
      id: Date.now().toString(), question: '', type: 'text'
    }]);
  };

  const updateQuestion = (id: string, field: string, value: any) => {
    setCustomQuestions(customQuestions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const removeQuestion = (id: string) => {
    setCustomQuestions(customQuestions.filter(q => q.id !== id));
  };

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://pre-closure-ai-sales-1.onrender.com';
  const embedSnippet = `<script>\n  window.PreCloserConfig = {\n    slug: "${slug}",\n    apiUrl: "${apiUrl}"\n  };\n</script>\n<script src="${apiUrl}/static/widget.js" defer></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6 lg:p-8 overflow-y-auto h-full">
        <div className="h-7 w-40 shimmer rounded-lg" />
        <div className="h-4 w-64 shimmer rounded-lg" />
        <div className="h-64 shimmer rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 lg:p-8 overflow-y-auto h-full max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Settings</h1>
        <p className="text-gray-500 text-sm">Configure your AI assistant, lead capture, and business context.</p>
      </div>

      {saved && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-in fade-in duration-300">
          <span>✓</span> {saved}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-[#0B0F19] border border-[#1F2937] rounded-xl p-1">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === tab
                ? 'bg-[#6366F1] text-white shadow-lg shadow-[#6366F1]/20'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab: Business Context */}
      {activeTab === 'Business Context' && (
        <div className="space-y-5">
          <div className="bg-[#0B0F19] border border-[#1F2937] rounded-2xl p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Company Name" value={companyName} onChange={setCompanyName} placeholder="Acme Corp" />
              <Field label="Industry" value={industry} onChange={setIndustry} placeholder="SaaS, Real Estate, Marketing..." />
            </div>
            <Field label="What does your business do?" value={businessDescription} onChange={setBusinessDescription} textarea placeholder="We provide AI-powered sales tools that help businesses close more deals..." />
            <Field label="Who is your ideal customer?" value={idealCustomer} onChange={setIdealCustomer} textarea placeholder="B2B SaaS founders with 10-50 employees looking to scale..." />
            <Field label="Services / Products you offer" value={servicesOffered} onChange={setServicesOffered} textarea placeholder="Lead qualification AI, sales automation, CRM integration..." />
            <Field label="Pricing Range (optional)" value={pricingRange} onChange={setPricingRange} placeholder="$99/mo - $499/mo" />
            <Field label="Common objections from customers" value={commonObjections} onChange={setCommonObjections} textarea placeholder="Too expensive, already using another tool, need to talk to team..." />
            <Field label="Key selling points" value={sellingPoints} onChange={setSellingPoints} textarea placeholder="24/7 AI that never sleeps, 3x more qualified leads, 60% faster close..." />
            <Field label="Target audience" value={targetAudience} onChange={setTargetAudience} textarea placeholder="Small to medium businesses, startup founders, sales teams..." />
          </div>

          <button onClick={saveBusinessContext} disabled={saving}
            className="bg-[#6366F1] hover:bg-[#5558e3] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 shadow-lg shadow-[#6366F1]/20 w-full sm:w-auto"
          >
            {saving ? 'Saving...' : 'Save Business Context'}
          </button>
        </div>
      )}

      {/* Tab: Lead Fields */}
      {activeTab === 'Lead Fields' && (
        <div className="space-y-5">
          <div className="bg-[#0B0F19] border border-[#1F2937] rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Basic Lead Fields</h3>
            <p className="text-xs text-gray-500 mb-4">Toggle which information the AI should collect from visitors.</p>
            <div className="grid grid-cols-2 gap-3">
              {(['name', 'email', 'phone', 'company'] as const).map(field => (
                <label key={field} className="flex items-center gap-3 bg-[#111827] border border-[#1F2937] rounded-xl px-4 py-3 cursor-pointer hover:border-[#374151] transition-colors">
                  <input
                    type="checkbox"
                    checked={leadFields[field]}
                    onChange={() => setLeadFields({ ...leadFields, [field]: !leadFields[field] })}
                    className="w-4 h-4 rounded bg-[#0B0F19] border-[#374151] text-[#6366F1] focus:ring-[#6366F1] focus:ring-offset-0"
                  />
                  <span className="text-sm text-gray-300 capitalize font-medium">{field}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-[#0B0F19] border border-[#1F2937] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Custom Questions</h3>
                <p className="text-xs text-gray-500 mt-1">AI will weave these into the conversation naturally.</p>
              </div>
              <button onClick={addQuestion} className="text-xs font-semibold text-[#6366F1] hover:text-[#a5b4fc] transition-colors flex items-center gap-1">
                + Add Question
              </button>
            </div>

            {customQuestions.length === 0 && (
              <p className="text-xs text-gray-600 italic">No custom questions yet. Click "Add Question" to start.</p>
            )}

            <div className="space-y-3">
              {customQuestions.map((q) => (
                <div key={q.id} className="bg-[#111827] border border-[#1F2937] rounded-xl p-4 space-y-3">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={q.question}
                      onChange={e => updateQuestion(q.id, 'question', e.target.value)}
                      placeholder="e.g., What is your monthly budget for this solution?"
                      className="flex-1 bg-[#0B0F19] border border-[#1F2937] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#6366F1]"
                    />
                    <select
                      value={q.type}
                      onChange={e => updateQuestion(q.id, 'type', e.target.value)}
                      className="bg-[#0B0F19] border border-[#1F2937] rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-[#6366F1]"
                    >
                      <option value="text">Text</option>
                      <option value="multiple_choice">Multiple Choice</option>
                      <option value="number">Number</option>
                      <option value="dropdown">Dropdown</option>
                    </select>
                    <button onClick={() => removeQuestion(q.id)} className="text-red-400 hover:text-red-300 text-sm font-bold px-2">✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={saveChatbotConfig} disabled={saving}
            className="bg-[#6366F1] hover:bg-[#5558e3] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 shadow-lg shadow-[#6366F1]/20 w-full sm:w-auto"
          >
            {saving ? 'Saving...' : 'Save Lead Configuration'}
          </button>
        </div>
      )}

      {/* Tab: Chatbot Behavior */}
      {activeTab === 'Chatbot Behavior' && (
        <div className="space-y-5">
          <div className="bg-[#0B0F19] border border-[#1F2937] rounded-2xl p-6 space-y-5">
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Conversation Tone</h3>
              <p className="text-xs text-gray-500 mb-3">How should your AI assistant speak?</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { value: 'formal', label: 'Formal', desc: 'Polished & professional' },
                  { value: 'casual', label: 'Casual', desc: 'Friendly & approachable' },
                  { value: 'persuasive', label: 'Persuasive', desc: 'Confident & closing-focused' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setChatbotTone(opt.value)}
                    className={`border rounded-xl p-4 text-left transition-all ${
                      chatbotTone === opt.value
                        ? 'border-[#6366F1] bg-[#6366F1]/10 shadow-lg shadow-[#6366F1]/10'
                        : 'border-[#1F2937] bg-[#111827] hover:border-[#374151]'
                    }`}
                  >
                    <p className="text-sm font-semibold text-white">{opt.label}</p>
                    <p className="text-[11px] text-gray-500 mt-1">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Qualification Mode</h3>
              <p className="text-xs text-gray-500 mb-3">How aggressively should the AI qualify leads?</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { value: 'strict', label: 'Strict', desc: 'Only premium, high-intent leads' },
                  { value: 'balanced', label: 'Balanced', desc: 'Mix of quality and volume' },
                  { value: 'relaxed', label: 'Relaxed', desc: 'Maximum lead capture' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setQualificationMode(opt.value)}
                    className={`border rounded-xl p-4 text-left transition-all ${
                      qualificationMode === opt.value
                        ? 'border-[#6366F1] bg-[#6366F1]/10 shadow-lg shadow-[#6366F1]/10'
                        : 'border-[#1F2937] bg-[#111827] hover:border-[#374151]'
                    }`}
                  >
                    <p className="text-sm font-semibold text-white">{opt.label}</p>
                    <p className="text-[11px] text-gray-500 mt-1">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button onClick={saveChatbotConfig} disabled={saving}
            className="bg-[#6366F1] hover:bg-[#5558e3] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 shadow-lg shadow-[#6366F1]/20 w-full sm:w-auto"
          >
            {saving ? 'Saving...' : 'Save Chatbot Settings'}
          </button>
        </div>
      )}

      {/* Tab: Widget Embed */}
      {activeTab === 'Widget Embed' && (
        <div className="space-y-5">
          <div className="bg-[#0B0F19] border border-[#1F2937] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Embed Code</h3>
              <button onClick={handleCopy} className="text-xs font-medium text-[#6366F1] hover:text-[#a5b4fc] transition-colors">
                {copied ? '✓ Copied!' : '📋 Copy Code'}
              </button>
            </div>
            <pre className="bg-[#000000] border border-[#1F2937] p-4 rounded-xl text-xs text-gray-300 font-mono overflow-x-auto whitespace-pre-wrap">
              {embedSnippet}
            </pre>
            <p className="text-xs text-gray-500 mt-4">
              Paste this snippet into the <code className="text-gray-400 bg-[#111827] px-1 rounded">&lt;head&gt;</code> of your website. The chat widget will appear automatically.
            </p>
          </div>

          <div className="bg-[#0B0F19] border border-[#1F2937] rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white mb-2">Your Widget Slug</h3>
            <div className="flex items-center gap-3">
              <code className="bg-[#111827] border border-[#1F2937] rounded-lg px-4 py-2.5 text-sm text-[#a5b4fc] font-mono flex-1">{slug || 'Not set'}</code>
            </div>
            <p className="text-xs text-gray-500 mt-3">This is your unique business identifier. It connects the widget to your account.</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* Reusable field component */
function Field({ label, value, onChange, placeholder, textarea }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; textarea?: boolean;
}) {
  const cls = "w-full bg-[#111827] border border-[#1F2937] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#6366F1] transition-colors";
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">{label}</label>
      {textarea ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} className={cls + " resize-none"} />
      ) : (
        <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      )}
    </div>
  );
}

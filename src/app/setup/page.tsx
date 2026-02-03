"use client";

import { useState } from "react";
import { saveBusinessProfile } from "../../lib/api";

export default function SetupPage() {
  const [faqs, setFaqs] = useState([{ q: "", a: "" }]);
  const [services, setServices] = useState([{ name: "", price: "" }]);

  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  const [business_name, setBusinessName] = useState("");
  const [business_type, setBusinessType] = useState("");
  const [description, setDescription] = useState("");
  const [tone, setTone] = useState("Friendly");
  const [dos, setDos] = useState("");
  const [donts, setDonts] = useState("");
  const [hot_criteria, setHotCriteria] = useState("");
  const [cold_criteria, setColdCriteria] = useState("");

  async function handleSubmit() {
    try {
      const payload = {
        business_name,
        business_type,
        description,
        services,
        faqs,
        tone,
        dos,
        donts,
        hot_criteria,
        cold_criteria,
      };

      const res = await saveBusinessProfile(payload);

      const result = res as Record<string, unknown>;
      if (typeof result.slug === 'string') {
        setGeneratedLink(`/b/${result.slug}`);
      } else {
        setGeneratedLink(null);
      }
    } catch (e) {
      alert("Something went wrong. Please try again.");
    }
  }

  if (generatedLink) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border rounded-xl p-8 max-w-md w-full text-center space-y-4">
          <h1 className="text-xl font-semibold text-gray-900">🎉 Your Assistant Is Live</h1>

          <p className="text-sm text-gray-600">Share this link in your Instagram bio or website.</p>

          <div className="border rounded-lg p-3 text-sm bg-gray-50 break-all">{generatedLink}</div>

          <button
            onClick={() => navigator.clipboard.writeText(generatedLink)}
            className="w-full bg-gray-900 text-white py-2 rounded-lg text-sm"
          >
            Copy Link
          </button>

          <p className="text-xs text-gray-500">Customers who click this link will chat with your official assistant.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto bg-white border rounded-xl p-6 space-y-10">

        <header>
          <h1 className="text-xl font-semibold text-gray-900">
            Business Setup
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Set up how your official assistant talks to customers.
          </p>
        </header>

        {/* SECTION 1 */}
        <Section title="1. Business Identity">
          <Input label="Business Name" placeholder="Elite Fitness Gym" value={business_name} onChange={(e)=>setBusinessName(e.currentTarget.value)} />
          <Input label="Business Type" placeholder="Gym / Coach / Store" value={business_type} onChange={(e)=>setBusinessType(e.currentTarget.value)} />
          <Textarea
            label="Business Description"
            placeholder="We are a premium gym offering personal training and group classes."
            value={description}
            onChange={(e)=>setDescription(e.currentTarget.value)}
          />
        </Section>

        {/* SECTION 2 */}
        <Section title="2. Services & Pricing">
          {services.map((s, i) => (
            <div key={i} className="grid grid-cols-2 gap-3">
              <input
                placeholder="Service name"
                className="input"
              />
              <input
                placeholder="Price or range"
                className="input"
              />
            </div>
          ))}
          <button
            className="text-sm text-gray-700 underline"
            onClick={() =>
              setServices([...services, { name: "", price: "" }])
            }
          >
            + Add another service
          </button>
        </Section>

        {/* SECTION 3 */}
        <Section title="3. FAQs">
          {faqs.map((f, i) => (
            <div key={i} className="space-y-2">
              <input
                placeholder="Question"
                className="input"
              />
              <textarea
                placeholder="Answer"
                className="input"
              />
            </div>
          ))}
          <button
            className="text-sm text-gray-700 underline"
            onClick={() =>
              setFaqs([...faqs, { q: "", a: "" }])
            }
          >
            + Add another FAQ
          </button>
        </Section>

        {/* SECTION 4 */}
        <Section title="4. Assistant Tone & Rules">
          <Select
            label="Tone"
            options={["Friendly", "Professional", "Sales-focused"]}
            value={tone}
            onChange={(e)=>setTone(e.currentTarget.value)}
          />
          <Textarea
            label="Things the assistant SHOULD do"
            placeholder="Encourage booking, ask follow-up questions"
            value={dos}
            onChange={(e)=>setDos(e.currentTarget.value)}
          />
          <Textarea
            label="Things the assistant should NOT do"
            placeholder="Negotiate price, promise discounts"
            value={donts}
            onChange={(e)=>setDonts(e.currentTarget.value)}
          />
        </Section>

        {/* SECTION 5 */}
        <Section title="5. Lead Qualification">
          <Textarea
            label="What makes a lead HOT?"
            placeholder="Asking for price, booking, availability today"
            value={hot_criteria}
            onChange={(e:any)=>setHotCriteria(e.target.value)}
          />
          <Textarea
            label="What makes a lead COLD?"
            placeholder="Just browsing, general questions"
            value={cold_criteria}
            onChange={(e:any)=>setColdCriteria(e.target.value)}
          />
        </Section>

        {/* CTA */}
        <div className="pt-6 border-t">
          <button onClick={handleSubmit} className="w-full bg-gray-900 text-white py-3 rounded-lg text-sm">
            Generate My Assistant Link
          </button>
        </div>

      </div>
    </div>
  );
}

/* ---------- Components ---------- */

function Section({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
      {children}
    </section>
  );
}

function Input({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-600">{label}</label>
      <input {...props} className="input" />
    </div>
  );
}

function Textarea({ label, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-600">{label}</label>
      <textarea {...props} rows={3} className="input" />
    </div>
  );
}

function Select({ label, options, ...props }: { label: string; options: string[] } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-600">{label}</label>
      <select {...props} className="input">
        {options.map((o: string) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

const fs = require('fs');
require('dotenv').config();

const apiKey = process.env.NGC_API_KEY || process.env.MISTRAL_API_KEY;
if (!apiKey || !apiKey.startsWith('nvapi-')) {
  console.error("❌ Error: Valid Nvidia NGC_API_KEY (nvapi-...) not found in environment variables.");
  process.exit(1);
}

const bpContext = {
  company_name: "Pre-Closure AI",
  business_description: "An autonomous AI sales qualification and pre-closer SaaS that qualifies, nurtures, and prepares leads before human calls.",
  services_offered: "AI Pre-Closer engine, WhatsApp/SMS/Email follow-up sequences, AI CRM pipeline dashboards.",
  pricing_range: "Professional at $99/mo, Enterprise at $199/mo",
  industry: "Software / SaaS",
  target_audience: "Marketing agencies, sales agencies, B2B SaaS startups",
  ideal_customer: "Agencies generating 50+ leads a month looking to scale without hiring more reps"
};

// Mock Sales Conversation
const mockTranscript = `
Prospect: Hi, I saw your tool online. How does it work?
AI: Hey there! Pre-Closure AI qualifies and nurtures your leads 24/7 on autopilot. It scores their intent and books meetings so you only jump on calls with ready-to-buy prospects. What kind of business do you run?
Prospect: I run a digital marketing agency in London. We get about 80 leads a month but our reps spend too much time chasing bad ones.
AI: That's a classic bottleneck! Sifting through 80 leads manually is a massive drag on productivity. If you could filter out the low-intent leads, how much time would your team save?
Prospect: Probably 20 hours a week. We really need a solution fast. Our budget is around $150-$200 a month.
AI: That makes total sense, and you'd easily fit into our Enterprise tier at $199/mo which includes full integrations and calendar scheduling. Are you the owner or decision-maker for the agency?
Prospect: Yes, I'm the founder and CEO.
`;

const systemPrompt = `You are the Chief Revenue Intelligence Agent for ${bpContext.company_name} (${bpContext.industry}).
You act as a hybrid of Elite Sales Setter, Elite Sales Closer, Revenue Strategist, Lead Qualifier, and Business Analyst.

Business context: ${bpContext.business_description}.
Pricing: ${bpContext.pricing_range}.

Analyze the FULL conversation transcript below. Apply deep behavioral psychology and consultative closing principles.

Evaluate these dimensions:
1. Intent Level (0-100): How serious is the lead? Exploring vs ready to buy.
2. Budget Score (0-100): Inferred capability based on roles, sizing, or direct mention.
3. Urgency Score (0-100): Immediate need vs long-term explorer.
4. Authority Score (0-100): Decision maker capability.
5. Objection Score (0-100): Severity of unresolved objections.
6. Fit Score (0-100): Overall ICP fit.
7. Lead Category: COLD, WARM, or HOT.

Produce a JSON response with EXACTLY this structure:
{
  "intent_score": <0-100>,
  "budget_score": <0-100>,
  "urgency_score": <0-100>,
  "authority_score": <0-100>,
  "objection_score": <0-100>,
  "fit_score": <0-100>,
  "conversion_probability": <0-100>,
  "lead_value_estimate": <number representing revenue potential>,
  "qualification_level": "HOT" | "WARM" | "COLD",
  "summary": "<1-2 sentence lead summary in simple business language>",
  "explanation": "<2-3 sentence explanation of WHY this lead is categorized this way, in plain English>",
  "recommended_action": "follow_up_immediately" | "send_proposal" | "nurture_later" | "ignore",
  "behavioral_signals": {
    "hesitation": "low" | "medium" | "high",
    "confidence": "low" | "medium" | "high",
    "clarity": "low" | "medium" | "high",
    "tone": "positive" | "neutral" | "negative"
  },
  "buying_signals": ["<string>"]
}`;

const advisorSystemPrompt = `You are an elite AI Sales Operations Advisor. The user is the CEO of Pre-Closure AI.
Your tone should be authoritative, sharp, and growth-focused. Limit responses to 2-3 sentences max.
Analyze this mock pipeline summary and answer the CEO's query:
- Total Leads: 154
- Qualified/Hot Leads: 52
- Conversion Probability: 72%
- Primary Bottleneck: 42% objection rate on pricing ("Professional $99 is fine, Enterprise $199 is too high")`;

async function callNvidiaNIM(messages, temperature = 0.7, maxTokens = 1000) {
  const url = 'https://integrate.api.nvidia.com/v1/chat/completions';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  };
  const body = JSON.stringify({
    model: 'meta/llama-3.3-70b-instruct',
    messages,
    temperature,
    max_tokens: maxTokens
  });

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body,
    signal: AbortSignal.timeout(60000) // 60s timeout
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`NVIDIA NIM HTTP Error ${response.status}: ${errorText}`);
  }

  const json = await response.json();
  return json.choices[0].message.content;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function testLeadScoring() {
  console.log("🚀 Calling Llama 3.3-70b for Lead Scoring...");
  try {
    const content = await callNvidiaNIM([
      { role: "system", content: systemPrompt + "\n\nCRITICAL: Output raw JSON only. Do not enclose in markdown blocks. No other text." },
      { role: "user", content: `FULL TRANSCRIPT:\n${mockTranscript}\n\nLATEST MESSAGE: Yes, I'm the founder and CEO.` }
    ], 0.1);

    console.log("\n✅ Llama Lead Intelligence Response received:");
    let cleanContent = content.trim();
    if (cleanContent.startsWith("```")) {
      cleanContent = cleanContent.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    }
    console.log(cleanContent);
    const result = JSON.parse(cleanContent);

    // Assertions
    console.log("\n📊 Validating schema constraints...");
    const assertions = [
      result.intent_score !== undefined && result.intent_score >= 0 && result.intent_score <= 100,
      result.budget_score !== undefined && result.budget_score >= 0 && result.budget_score <= 100,
      result.urgency_score !== undefined && result.urgency_score >= 0 && result.urgency_score <= 100,
      result.authority_score !== undefined && result.authority_score >= 0 && result.authority_score <= 100,
      result.fit_score !== undefined && result.fit_score >= 0 && result.fit_score <= 100,
      ["HOT", "WARM", "COLD"].includes(result.qualification_level),
      result.summary && result.summary.length > 0,
      result.recommended_action !== undefined
    ];

    if (assertions.every(Boolean)) {
      console.log("✨ All Lead Scoring Assertions Passed successfully!");
    } else {
      console.warn("⚠️ Some assertions failed, check response structure above.");
    }
  } catch (error) {
    console.error("❌ Lead Scoring Test Failed:", error.message);
  }
}

async function testAdvisorCommands() {
  console.log("\n🚀 Testing AI Advisor Mode via Llama 3.3-70b (sequentially with 5s delay)...");
  const queries = [
    "What happened today?",
    "Show biggest opportunities",
    "Why are leads not converting?"
  ];

  for (let i = 0; i < queries.length; i++) {
    const query = queries[i];
    console.log(`\nCEO: "${query}"`);
    try {
      const content = await callNvidiaNIM([
        { role: "system", content: advisorSystemPrompt },
        { role: "user", content: query }
      ], 0.7, 150);
      console.log(`Advisor: "${content.trim()}"`);
    } catch (error) {
      console.error(`❌ Advisor command "${query}" failed:`, error.message);
    }
    if (i < queries.length - 1) {
      console.log("⏳ Sleeping for 5s to avoid rate limits...");
      await sleep(5000);
    }
  }
}

async function run() {
  await testLeadScoring();
  console.log("\n⏳ Sleeping for 5s to avoid rate limits...");
  await sleep(5000);
  await testAdvisorCommands();
  console.log("\n✨ Testing completed!");
}

run();

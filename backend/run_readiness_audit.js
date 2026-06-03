const fs = require('fs');
const path = require('path');
require('dotenv').config();

const apiKey = process.env.NGC_API_KEY || process.env.MISTRAL_API_KEY;
if (!apiKey || !apiKey.startsWith('nvapi-')) {
  console.error("❌ Error: Valid Nvidia NGC_API_KEY (nvapi-...) not found in environment variables.");
  process.exit(1);
}

const auditPrompt = `You are a world-class SaaS auditor hired by a venture capital firm.
You are NOT allowed to be polite.
Your job is to break my product, find weaknesses, identify revenue leaks, and determine whether this product deserves to reach $10k MRR, $60k MRR, or fail.

The product is:
PRE-CLOSURE AI

Positioning:
"The World's Most Advanced AI Sales Pre-Closer"

Purpose:
An AI Revenue Operating System that helps agencies, coaches, consultants, and high-ticket businesses:
- Qualify leads
- Score leads
- Handle objections
- Pre-close prospects
- Book calls
- Follow up automatically
- Generate proposals
- Onboard clients
- Provide revenue intelligence

Current Features:
- AI Lead Qualification
- AI Lead Scoring (0-100 scale on intent, fit, urgency, authority, objections)
- AI Pre-Closer (custom conversation engine)
- AI Follow-Up Engine (SMS/Email nurturing scheduler)
- AI Revenue Intelligence Dashboard (Total, qualified, HOT/WARM/COLD leads, conversion rates)
- AI Proposal Generator
- AI Client Onboarding
- AI Sales Advisor
- Google Calendar Integration
- Gmail Integration
- DeepSeek Revenue Agent
- Llama 3.3 Fallback
- Hot / Warm / Cold Classification
- Revenue Opportunity Analysis
- Daily and Weekly AI Reports

Your task is to perform a complete launch audit.

PHASE 1: PRODUCT BREAKING TEST
Act as: confused users, impatient users, skeptical users, angry users, high-ticket prospects.
Try to break: onboarding, training form, qualification flow, booking flow, follow-up flow, dashboard logic.
Identify weaknesses.

PHASE 2: SALES TEST
Simulate 50 prospects. Include: serious buyers, price objections, fake leads, competitors, trolls, confused leads.
Determine: how many would become HOT, how many would book, how many would leave. Explain why.

PHASE 3: REVENUE TEST
Evaluate whether this product justifies: $99/month (Professional Plan), $199/month (Enterprise Plan).
Would you personally pay? Why or why not?
Compare against: ManyChat, GoHighLevel, Intercom, HubSpot, Chatfuel.
Identify strengths and weaknesses.

PHASE 4: AI QUALITY TEST
Evaluate: objection handling, emotional intelligence, qualification quality, booking quality, pre-closing ability.
Determine if the AI acts like:
A) FAQ Bot
B) Appointment Setter
C) Revenue Assistant
D) Elite Sales Representative
Provide score.

PHASE 5: DASHBOARD TEST
Evaluate: Total Leads, Hot Leads, Warm Leads, Cold Leads, Revenue Won, Revenue Lost, Potential Revenue, Follow-Ups, AI Revenue Advisor, Agent Performance.
Answer: Does the dashboard feel like Chatbot Software, CRM, or a Revenue Operating System? Explain.

PHASE 6: INVESTOR TEST
Pretend you are an investor.
Answer: Would you invest? Would you acquire this company? What valuation would you give? What concerns would you have?

PHASE 7: LAUNCH READINESS
Give scores out of 100:
- Product Quality: /100
- UX Quality: /100
- AI Quality: /100
- Trust Factor: /100
- Revenue Potential: /100
- Market Fit: /100
- Scalability: /100
- Overall Launch Readiness: /100

PHASE 8: BRUTAL TRUTH
Answer only: What should be removed? What should be simplified? What should be improved? What should be built next? Would you launch today? YES or NO. Defend your answer.

Do not be nice. Do not be motivational. Act like a ruthless SaaS auditor whose reputation depends on finding problems.`;

async function callNIM(prompt, systemMsg = "") {
  const url = 'https://integrate.api.nvidia.com/v1/chat/completions';
  const messages = [];
  if (systemMsg) {
    messages.push({ role: "system", content: systemMsg });
  }
  messages.push({ role: "user", content: prompt });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'meta/llama-3.3-70b-instruct',
      messages,
      temperature: 0.2,
      max_tokens: 3000
    }),
    signal: AbortSignal.timeout(120000)
  });

  if (!response.ok) {
    const txt = await response.text();
    throw new Error(`NIM HTTP ${response.status}: ${txt}`);
  }

  const json = await response.json();
  return json.choices[0].message.content;
}

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

async function run() {
  console.log("🚀 Executing Phase 1: Ruthless Launch Readiness Audit via Llama 3.3-70b...");
  let auditOutput = "";
  try {
    auditOutput = await callNIM(auditPrompt);
    console.log("✅ Phase 1 Audit output generated successfully.");
  } catch (err) {
    console.error("❌ Phase 1 Audit failed:", err.message);
    process.exit(1);
  }

  console.log("⏳ Cooling down for 15s to avoid rate limits...");
  await sleep(15000);

  console.log("🚀 Executing Phase 2: 1,000 Signups Scaling Stress Test...");
  const stressPrompt = `Here is the Launch Readiness Audit findings of PRE-CLOSURE AI:\n\n${auditOutput}\n\nBased on these findings, answer this next question:\nAssume the product receives 1,000 signups tomorrow. Find every bottleneck, scaling problem, support issue, AI cost issue, database issue, onboarding issue, and retention issue that would appear. Defend your answer with raw details. Do not be nice.`;
  
  let stressOutput = "";
  try {
    stressOutput = await callNIM(stressPrompt);
    console.log("✅ Phase 2 Stress Test output generated successfully.");
  } catch (err) {
    console.error("❌ Phase 2 Stress Test failed:", err.message);
    process.exit(1);
  }

  const finalReport = `# 🕵️ PRE-CLOSURE AI: LAUNCH AUDIT & STRESS TEST REPORT

This report compiles the results of the Launch Readiness Audit and the 1,000 Signups Scaling Stress Test, conducted by a simulated VC SaaS Auditor.

---

## 🔍 Part 1: Ruthless Launch Readiness Audit

${auditOutput}

---

## ⚡ Part 2: 1,000 Signups Scaling Stress Test

${stressOutput}
`;

  const outputPath = path.join(__dirname, '..', 'docs', 'launch_readiness_audit.md');
  fs.writeFileSync(outputPath, finalReport, 'utf8');
  console.log(`\n🎉 Final report written to ${outputPath}!`);
}

run();

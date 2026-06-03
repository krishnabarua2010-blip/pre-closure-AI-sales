# 🚀 LAUNCH READINESS & REVENUE STRESS TEST PROMPTS (DeepSeek / Llama)

This document contains the copy-pasteable prompts to run through DeepSeek to perform a ruthless Launch Audit and Scaling Bottleneck Analysis.

---

## 📋 Prompt 1: The Ruthless Launch Readiness Audit

```text
You are a world-class SaaS auditor hired by a venture capital firm.
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
Act as:
- confused users
- impatient users
- skeptical users
- angry users
- high-ticket prospects
Try to break:
- onboarding
- training form
- qualification flow
- booking flow
- follow-up flow
- dashboard logic
Identify weaknesses.

PHASE 2: SALES TEST
Simulate 50 prospects.
Include:
- serious buyers
- price objections
- fake leads
- competitors
- trolls
- confused leads
Determine:
- how many would become HOT
- how many would book
- how many would leave
Explain why.

PHASE 3: REVENUE TEST
Evaluate whether this product justifies:
- $99/month (Professional Plan)
- $199/month (Enterprise Plan)
Would you personally pay? Why or why not?
Compare against:
- ManyChat
- GoHighLevel
- Intercom
- HubSpot
- Chatfuel
Identify strengths and weaknesses.

PHASE 4: AI QUALITY TEST
Evaluate:
- objection handling
- emotional intelligence
- qualification quality
- booking quality
- pre-closing ability
Determine if the AI acts like:
A) FAQ Bot
B) Appointment Setter
C) Revenue Assistant
D) Elite Sales Representative
Provide score.

PHASE 5: DASHBOARD TEST
Evaluate:
- Total Leads
- Hot Leads
- Warm Leads
- Cold Leads
- Revenue Won
- Revenue Lost
- Potential Revenue
- Follow-Ups
- AI Revenue Advisor
- Agent Performance
Answer:
Does the dashboard feel like:
- Chatbot Software
- CRM
- Revenue Operating System
Explain.

PHASE 6: INVESTOR TEST
Pretend you are an investor.
Answer:
- Would you invest?
- Would you acquire this company?
- What valuation would you give?
- What concerns would you have?

PHASE 7: LAUNCH READINESS
Give scores:
- Product Quality: /100
- UX Quality: /100
- AI Quality: /100
- Trust Factor: /100
- Revenue Potential: /100
- Market Fit: /100
- Scalability: /100
- Overall Launch Readiness: /100

PHASE 8: BRUTAL TRUTH
Answer only:
- What should be removed?
- What should be simplified?
- What should be improved?
- What should be built next?
- Would you launch today? YES or NO
Defend your answer.

Do not be nice.
Do not be motivational.
Act like a ruthless SaaS auditor whose reputation depends on finding problems.
```

---

## 📋 Prompt 2: The 1,000 Signups Scaling Stress Test

Run this prompt **immediately after** receiving the output from Prompt 1.

```text
Assume the product receives 1,000 signups tomorrow. 
Find every bottleneck, scaling problem, support issue, AI cost issue, database issue, onboarding issue, and retention issue that would appear.

Provide a breakdown of:
1. DB / Prisma connection limits & pooling bottlenecks.
2. API rate limiting & cost modeling (OpenAI vs. NVIDIA NIM vs. Gemini vs. Mistral token spend).
3. Onboarding friction points (how many of the 1,000 will actually set up their custom vector database).
4. CRM / Dashboard rendering bottlenecks with 10,000+ mock/real lead rows.
5. Retention leaks: Why would an agency unsubscribe after 30 days (e.g., lead exhaustion, billing issues, UI complexity)?

Provide actionable structural mitigations for each bottleneck.
```

# ⚙️ MASTER BACKEND PROMPT & SPECIFICATION (GLM 5.1)

This document contains the optimized master prompt for GLM 5.1 and the resulting backend database schemas, API routes, and webhook architectures for **Pre-Closure AI**.

---

## 📋 Copy-Pasteable LLM Prompt

```text
You are the Lead Backend Architect for Pre-Closure AI.
Backend Stack:
- Xano
- OpenAI API
- GLM 5.1
- DeepSeek
- Gmail Integration
- Google Calendar Integration

Goal: Design a scalable backend architecture.

USER FLOW:
1. User signs up.
2. User clicks "Start Free Enterprise Trial".
3. User enters: Name, Email, Password.
4. User enters AI Training Form.
5. Training Form collects Business Information:
   - Business name
   - Website
   - Industry
   - Services
   - Pricing
   - Target audience
   - Common objections
   - FAQs
   - Booking link
   - Sales process
6. AI creates custom business knowledge base.
7. AI generates:
   - Option A: Standalone Chat Link
   - Option B: Website Embedded Widget
8. If website URL is provided:
   - Analyze website structure.
   - Extract: business information, services, positioning.
   - Use extracted data to improve training.

Dashboard Requirements:
- Show: Total Leads, Qualified Leads, Hot Leads, Warm Leads, Cold Leads, Calls Booked, Potential Revenue, Revenue Won, Revenue Lost, Follow-up Status

Advisor Panel:
- Create AI Advisor section.
- Functions: Daily Report, Weekly Report, Revenue Suggestions, Objection Analysis, Lead Quality Analysis, Funnel Analysis
- User Commands:
  - "What happened today?"
  - "What happened this week?"
  - "Show biggest opportunities"
  - "Show biggest problems"

Integrations:
- Google Calendar: booking events, scheduled calls
- Gmail: hot lead notifications, reports

Enterprise Agent Functions:
- Summarize day
- Detect issues
- Recommend fixes
- Explain problems in simple language
- Create actionable tasks

Error Management:
- Detect: API failures, booking failures, integration failures
- Generate: explanation, severity, recommended action

Output: Complete Xano architecture. Database schema. API endpoints. User flow. Webhook architecture. Permission structure. Scaling recommendations.
```

---

## ⚙️ Backend Architecture & Schema Spec

### 1. Database Schema (Xano / Supabase Tables)
*   **Users Table**:
    *   `id` (Integer, Primary Key)
    *   `email` (String, Unique)
    *   `password_hash` (String)
    *   `plan` (Enum: FREE, GROWTH, ENTERPRISE)
    *   `created_at` (Timestamp)
*   **BusinessProfiles Table**:
    *   `id` (Integer, Primary Key)
    *   `user_id` (Integer, Foreign Key → Users)
    *   `company_name` (String)
    *   `slug` (String, Unique)
    *   `business_description` (Text)
    *   `services_offered` (Text)
    *   `pricing_range` (String)
    *   `target_audience` (Text)
    *   `common_objections` (Text)
    *   `booking_link` (String)
    *   `kb_embeddings` (Vector representation of FAQ/Knowledge Base)
*   **Leads Table**:
    *   `id` (Integer, Primary Key)
    *   `business_profile_id` (Integer, Foreign Key → BusinessProfiles)
    *   `name` (String)
    *   `email` (String)
    *   `phone` (String)
    *   `qualification_level` (Enum: COLD, WARM, HOT)
    *   `intent_score` (Integer, 0-100)
    *   `budget_score` (Integer, 0-100)
    *   `urgency_score` (Integer, 0-100)
    *   `conversion_probability` (Decimal)
    *   `lead_value_estimate` (Decimal)
    *   `ai_summary` (Text)
    *   `recommended_action` (String)
*   **Conversations Table**:
    *   `id` (Integer, Primary Key)
    *   `business_profile_id` (Integer, Foreign Key)
    *   `status` (Enum: ACTIVE, QUALIFIED, BOOKED, DROPPED)
    *   `created_at` (Timestamp)
*   **Messages Table**:
    *   `id` (Integer, Primary Key)
    *   `conversation_id` (Integer, Foreign Key → Conversations)
    *   `sender` (Enum: USER, AI, SYSTEM)
    *   `content` (Text)
    *   `created_at` (Timestamp)
*   **AdvisorActions Table**:
    *   `id` (Integer, Primary Key)
    *   `business_profile_id` (Integer, Foreign Key)
    *   `action_type` (String)
    *   `parameters` (JSON)
    *   `status` (Enum: PENDING, EXECUTED, REJECTED)

### 2. Core API Endpoints
*   `POST /auth/signup` and `/auth/login`: Handles registration, setup, and JWT token returns.
*   `POST /setup/profile`: Submits AI Training Form data, generates custom vector embeddings for the business knowledge base.
*   `POST /setup/scrape`: Receives website URL, extracts text parameters autonomously using crawler scripts, and updates embeddings.
*   `GET /analytics/dashboard`: Computes and aggregates total/qualified/categorized leads, booking rates, and potential revenue stats.
*   `POST /conversation/init/:slug`: Spawns a public chat session.
*   `POST /conversation/ai_message`: Ingests user messages, returns conversational replies, and triggers background lead scoring queues.
*   `POST /advisor/scan`: Scans recent lead scores, finds bottlenecks, and returns structured suggestions.
*   `POST /advisor/chat`: Processes commands ("What happened today?", etc.) and returns natural executive reports.

### 3. Webhook Architecture
*   **Google Calendar Webhook**: Listens for bookings (`events.watch`) on user links. When a lead books, update Lead state to `BOOKED` in the database.
*   **Gmail Notification System**: Dispatches SMTP payloads via Resend/SendGrid when a lead is promoted to `HOT` status or when daily reports compile.

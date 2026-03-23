# Phase 1-9 Backend-Frontend Integration Testing Plan

## Overview
Systematic validation of Xano backend API integration across all features. Each phase builds on previous phases.

**Backend API**: https://x8ki-letl-twmt.n7.xano.io/api:lpS_skXG

---

## Phase 1: Authentication Flow ✅ FIXES APPLIED

### Objectives
- Fix signup endpoint from `/signup_custom` to `/auth/signup` ✅
- Add error message display to both forms ✅
- Add loading states with visual feedback ✅
- Validate token storage and retrieval

### Files Modified
- `src/app/signup/page.tsx` - Updated to call `/auth/signup` endpoint
- `src/app/login/page.tsx` - Added error display, loading states, visual feedback

### Test Cases

#### 1.1: User Signup
**Endpoint**: POST `/auth/signup`
**Request**:
```json
{
  "email": "test@example.com",
  "password": "TestPass123!",
  "business_name": "Test Company"
}
```

**Expected Response**:
```json
{
  "authToken": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "test@example.com",
    "business_name": "Test Company"
  }
}
```

**Validation**:
- [ ] Form submits without errors
- [ ] Loading spinner shows "Creating account..."
- [ ] Token stored in localStorage under key "token"
- [ ] Redirects to `/dashboard` on success
- [ ] Error message displays on API failure

#### 1.2: User Login
**Endpoint**: POST `/auth/login`
**Request**:
```json
{
  "email": "test@example.com",
  "password": "TestPass123!"
}
```

**Expected Response**:
```json
{
  "authToken": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "test@example.com"
  }
}
```

**Validation**:
- [ ] Form submits without errors
- [ ] Loading spinner shows "Signing In..."
- [ ] Token stored in localStorage under key "token"
- [ ] Redirects to `/dashboard` on success
- [ ] Error message displays for invalid credentials
- [ ] Api includes Bearer token in subsequent requests

#### 1.3: Protected Routes
**Test**: Navigate to `/dashboard` without token
**Validation**:
- [ ] Route checks localStorage.getItem("token")
- [ ] Redirects to `/login` if no token exists

#### 1.4: Logout
**Test**: Click logout in navbar/settings
**Validation**:
- [ ] Token removed from localStorage
- [ ] Redirects to `/login`
- [ ] Navbar shows Login/Signup buttons

---

## Phase 2: Public AI Chat System

### Objectives
- Validate three-step public chat flow
- Ensure conversation initialization works
- Verify AI message sending and response

### Files
- `src/app/c/[slug]/page.tsx` - Public chat page

### Test Cases

#### 2.1: Get Public Business Profile
**Endpoint**: GET `/get_public_business_profile?slug=YOUR_SLUG`
**Example**: `GET /get_public_business_profile?slug=auto-closure`

**Expected Response**:
```json
{
  "business_name": "Auto Closure Inc",
  "greeting": "Hi! I'm Auto Closure's AI. Ready to discuss your sales challenges?",
  "greeting_subtitle": "Chat with our AI advisor",
  "slug": "auto-closure"
}
```

**Validation**:
- [ ] Route `/c/{slug}` displays business name in header
- [ ] Greeting message from API shows in welcome message
- [ ] Business logo/branding displays if provided

#### 2.2: Initialize Public Conversation
**Endpoint**: POST `/init_public_conversation`
**Request**:
```json
{
  "slug": "auto-closure"
}
```

**Expected Response**:
```json
{
  "conversation_id": "conv_123abc",
  "public_token": "pub_token_xyz"
}
```

**Validation**:
- [ ] Conversation ID and public token received
- [ ] Conversation ID stored in component state
- [ ] Public token used in subsequent messages

#### 2.3: Send Message to AI
**Endpoint**: POST `/ai_message`
**Request**:
```json
{
  "conversation_id": "conv_123abc",
  "message": "How can you help our sales team?",
  "public_token": "pub_token_xyz"
}
```

**Expected Response**:
```json
{
  "response": "Great question! I can help you with lead qualification, sales forecasting, and call analysis...",
  "conversation_id": "conv_123abc"
}
```

**Validation**:
- [ ] User message appears in chat (right, blue)
- [ ] Typing indicator shows while waiting
- [ ] AI response appears in chat (left, gray)
- [ ] Messages preserve chronological order
- [ ] Timestamps display correctly
- [ ] Can send multiple messages in sequence
- [ ] Error handling if public_token is invalid

#### 2.4: Multi-turn Conversation
**Test**: Send 3-5 messages back and forth
**Validation**:
- [ ] Conversation maintains context
- [ ] No conversation_id changes between messages
- [ ] All messages persist in chat history
- [ ] Scroll auto-focuses to latest message

---

## Phase 3: Dashboard Data Validation

### Objectives
- Fetch and display funnel health metrics
- Fetch and display revenue metrics
- Validate real data in charts/cards

### Files
- `src/app/dashboard/page.tsx`

### Test Cases

#### 3.1: Get Funnel Health
**Endpoint**: GET `/funnel_health`
**Auth**: Required (Bearer token in header)

**Expected Response**:
```json
{
  "health_score": 82,
  "total_leads": 247,
  "win_rate": 0.42,
  "rps": 12500
}
```
Where:
- `health_score`: 0-100 percentage
- `total_leads`: Number of qualified leads
- `win_rate`: 0-1 decimal (displayed as percentage)
- `rps`: Revenue per sale in dollars

**Validation**:
- [ ] Dashboard loads without errors
- [ ] Health score displays correctly (0-100%)
- [ ] Total leads count shows accurate number
- [ ] Win rate displays as percentage (e.g., "42%")
- [ ] RPS shows in currency format (e.g., "$12,500")

#### 3.2: Get Revenue Metrics
**Endpoint**: GET `/revenue_metrics`
**Auth**: Required (Bearer token in header)

**Expected Response**:
```json
{
  "mrr": 45000,
  "arr": 540000,
  "growth_rate": 0.23,
  "churn_rate": 0.08
}
```
Where:
- `mrr`: Monthly recurring revenue
- `arr`: Annual recurring revenue
- `growth_rate`: 0-1 decimal
- `churn_rate`: 0-1 decimal

**Validation**:
- [ ] MRR displays in currency format
- [ ] ARR displays in currency format
- [ ] Growth rate shows as percentage (e.g., "23%")
- [ ] Churn rate shows as percentage (e.g., "8%")
- [ ] All metrics update when page reloads

#### 3.3: Error Handling
**Test**: Disconnect network and reload dashboard
**Validation**:
- [ ] Graceful error message displays
- [ ] Retry button allows reload
- [ ] No blank/broken UI elements

---

## Phase 4: Leads Page Integration

### Objectives
- Fetch lead list from API
- Validate sorting by score
- Verify status badge display
- Test lead detail navigation

### Files
- `src/app/leads/page.tsx`

### Test Cases

#### 4.1: Get Leads List
**Endpoint**: GET `/get_leads`
**Auth**: Required (Bearer token in header)

**Expected Response**:
```json
{
  "leads": [
    {
      "id": "lead_001",
      "name": "John Smith",
      "email": "john@company.com",
      "phone": "+1-555-0123",
      "company": "TechCorp Inc",
      "score": 85,
      "status": "qualified",
      "last_interaction": "2024-01-15T10:30:00Z"
    },
    {
      "id": "lead_002",
      "name": "Jane Doe",
      "email": "jane@startup.com",
      "phone": "+1-555-0456",
      "company": "StartupXYZ",
      "score": 62,
      "status": "interested",
      "last_interaction": "2024-01-14T14:20:00Z"
    },
    {
      "id": "lead_003",
      "name": "Bob Johnson",
      "email": "bob@corp.com",
      "phone": "+1-555-0789",
      "company": "CorporateInc",
      "score": 45,
      "status": "new",
      "last_interaction": "2024-01-13T09:15:00Z"
    }
  ]
}
```

**Validation**:
- [ ] All leads display in table
- [ ] Leads sorted by score (highest first)
- [ ] Score indicator colors correctly:
  - [ ] Green (≥70)
  - [ ] Yellow (40-69)
  - [ ] Red (<40)
- [ ] Status badges show: "new", "interested", "qualified"
- [ ] Last interaction date shows relative time (e.g., "2 days ago")

#### 4.2: Lead Navigation
**Test**: Click on a lead row
**Validation**:
- [ ] Routes to `/conversation/{lead.id}`
- [ ] Lead name/email passes to conversation page

---

## Phase 5: Conversation Brief Viewer

### Objectives
- Fetch conversation transcripts
- Display call briefs with metadata
- Show interest signals

### Files
- `src/app/conversation/[id]/page.tsx`

### Test Cases

#### 5.1: Get Call Brief
**Endpoint**: GET `/get_call_brief?id={lead_id}`
**Auth**: Required (Bearer token in header)

**Expected Response**:
```json
{
  "brief": "Customer asked about pricing for enterprise plan. Expressed interest in 2024 rollout. Budget allocated for Q1.",
  "summary_points": [
    "Interested in enterprise features",
    "Timeline: Q1 2024",
    "Budget: Approved"
  ],
  "signals": {
    "interest_level": "high",
    "budget_qualified": true,
    "timeline": "Q1 2024",
    "decision_maker": true
  }
}
```

**Validation**:
- [ ] Brief summary displays
- [ ] Summary points list shows
- [ ] Interest level shows badge (high/medium/low)
- [ ] Budget qualified displays checkbox/icon
- [ ] Timeline displays
- [ ] Decision maker status shows

#### 5.2: Get Conversation
**Endpoint**: GET `/get_conversation?id={lead_id}`
**Auth**: Required (Bearer token in header)

**Expected Response**:
```json
{
  "conversation_id": "conv_123",
  "messages": [
    {
      "role": "user",
      "content": "Hi, I'm interested in your platform",
      "timestamp": "2024-01-15T10:00:00Z"
    },
    {
      "role": "assistant",
      "content": "Great! I'd love to help. What are your main sales challenges?",
      "timestamp": "2024-01-15T10:01:30Z"
    }
  ]
}
```

**Validation**:
- [ ] User messages appear right-aligned, blue
- [ ] Assistant messages appear left-aligned, gray
- [ ] Timestamps display correctly
- [ ] Messages in correct order (chronological)
- [ ] Complete conversation loads without truncation

---

## Phase 6: Advisor Analysis Page

### Objectives
- Fetch AI advisor recommendations
- Display bottleneck analysis
- Show revenue opportunity metrics

### Files
- `src/app/advisor/page.tsx`

### Test Cases

#### 6.1: Get Advisor Analysis
**Endpoint**: POST `/advisor_analysis`
**Auth**: Required (Bearer token in header)
**Request**:
```json
{
  // No required body params
}
```

**Expected Response**:
```json
{
  "funnel_summary": {
    "v2l_conversion": 0.35,
    "l2s_conversion": 0.42
  },
  "bottlenecks": [
    {
      "stage": "lead_qualification",
      "severity": "high",
      "description": "Only 35% of visitors convert to leads. Consider improving landing page copy."
    },
    {
      "stage": "discovery_call",
      "severity": "medium",
      "description": "Discovery calls closing rate dropped 5% this month."
    }
  ],
  "actions": [
    "Test new CTA button colors on homepage",
    "Schedule discovery call training for sales team",
    "Implement automated lead scoring qualification",
    "Review and optimize email nurture sequences",
    "A/B test landing page headlines"
  ],
  "projected_revenue": 125000
}
```

**Validation**:
- [ ] Funnel summary displays (V2L and L2S percentages)
- [ ] Bottlenecks list shows with severity badges (High/Medium)
- [ ] Each bottleneck shows description
- [ ] Recommended actions display as numbered list
- [ ] Projected revenue shows in currency format (e.g., "$125,000")

#### 6.2: Real-time Analysis
**Test**: Run advisor analysis multiple times
**Validation**:
- [ ] Results may vary based on actual data
- [ ] No hardcoded values, all from API

---

## Phase 7: Visual Polish & Animations

### Objectives
- Verify all Framer Motion animations work
- Test page transitions
- Validate responsive design

### Test Cases

#### 7.1: Landing Page Animations
**File**: `src/app/page.tsx`
**Validation**:
- [ ] Hero text fades in on load (1s delay)
- [ ] Testimonials stagger in (0.1s between each)
- [ ] Pricing cards have hover scale effect
- [ ] Smooth scroll transitions work
- [ ] No animation jank or performance issues

#### 7.2: Dashboard Transitions
**Test**: Navigate between pages
**Validation**:
- [ ] Page content fades in smoothly
- [ ] Cards animate on mount
- [ ] No sudden layout shifts (CLS < 0.1)

#### 7.3: Responsive Design
**Test on devices**:
- [ ] Mobile (375px - iPhone)
- [ ] Tablet (768px - iPad)
- [ ] Desktop (1440px+)

**Validation**:
- [ ] No horizontal scroll
- [ ] Navigation menu collapses on mobile
- [ ] Card layouts stack properly
- [ ] Text readable at all sizes
- [ ] Buttons/inputs have proper touch targets (44px min)

---

## Phase 8: Payment Integration

### Objectives
- Integrate Stripe checkout using hosted Checkout sessions
- Allow users to purchase subscription plans
- Verify environment variables and backend route

### Files
- `src/app/pricing/page.tsx` — now triggers checkout session
- `src/app/api/create-checkout-session/route.ts` — server API creates Stripe session

### Environment
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_PRICE_STARTER
STRIPE_PRICE_PRO
STRIPE_PRICE_BUSINESS
NEXT_PUBLIC_BASE_URL
```

### Test Cases

#### 8.1: Stripe Checkout Flow
**Frontend**:
1. Log in or sign up if not authenticated.
2. Visit `/pricing`.
3. Click "Choose Starter/Pro/Business".
4. Verify network call to `/api/create-checkout-session` with JSON body `{ planId: "starter" }`.
5. Ensure response contains `{ id: "cs_test_..." }`.
6. Stripe JS should redirect user to hosted Checkout page.
   - When testing locally you'll see Stripe test UI.
7. Complete the payment with a test card (e.g., `4242 4242 4242 4242`).
8. After successful payment you should be redirected to `/dashboard?session_id=...`.
9. Verify subscription status in your backend (Xano or Stripe dashboard).

#### 8.2: Cancel / Failure
- If user cancels on Checkout, they should return to `/pricing`.
- If an error occurs creating session, an alert with the error message should appear.

### Notes
- Payment processing requires valid Stripe keys and price IDs.
- In production, set keys in Vercel environment secrets.
- The backend route uses `stripe.checkout.sessions.create` to make a subscription session.
- No Razorpay integration included currently; consider alternative if needed.

---

## Phase 9: Deployment to Vercel

### Objectives
- Deploy frontend to Vercel
- Enable GitHub auto-deployments
- Configure environment variables
- Validate production build

### Deployment Steps

#### 9.1: Vercel Setup
- [ ] Connect repository to Vercel
- [ ] Set environment variables:
  - NEXT_PUBLIC_API_URL
  - VERCEL_URL
  - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  - STRIPE_SECRET_KEY
  - STRIPE_PRICE_STARTER
  - STRIPE_PRICE_PRO
  - STRIPE_PRICE_BUSINESS
  - NEXT_PUBLIC_BASE_URL (usually your Vercel domain)
- [ ] Enable auto-deployments on push to main

#### 9.2: GitHub Integration
- [ ] Add GitHub token to Vercel settings
- [ ] Configure auto-deploy on PR
- [ ] Add deployment preview comments

#### 9.3: Production Validation
- [ ] All routes accessible
- [ ] API calls use correct base URL
- [ ] Animations perform well
- [ ] Mobile responsive
- [ ] Core workflows tested (signup, login, chat)

---

## Quick Reference: API Endpoints

| Phase | Endpoint | Method | Purpose |
|-------|----------|--------|---------|
| 1 | `/auth/signup` | POST | Create account |
| 1 | `/auth/login` | POST | Login user |
| 2 | `/get_public_business_profile` | GET | Get public profile |
| 2 | `/init_public_conversation` | POST | Start chat |
| 2 | `/ai_message` | POST | Send message |
| 3 | `/funnel_health` | GET | Dashboard metrics |
| 3 | `/revenue_metrics` | GET | Revenue data |
| 4 | `/get_leads` | GET | Lead list |
| 5 | `/get_call_brief` | GET | Lead brief |
| 5 | `/get_conversation` | GET | Conversation transcript |
| 6 | `/advisor_analysis` | POST | AI recommendations |

---

## Testing Checklist Format

For each phase, use this format:

```
# Phase X Testing Results

Date: YYYY-MM-DD
Tester: [Your Name]
Status: [PASS / FAIL / PARTIAL]

## Test Case X.Y: [Test Name]
- [ ] Validation 1
- [ ] Validation 2
- [ ] Validation 3

### Issues Found
- Issue #1: [Description]
- Issue #2: [Description]

### Notes
[Any additional observations]
```

---

## Success Criteria

All phases must achieve:
- ✅ 100% of validation checkboxes pass
- ✅ No API errors in browser console
- ✅ No TypeScript errors
- ✅ All routes accessible
- ✅ Responsive design on mobile/tablet/desktop
- ✅ Animations smooth (60fps)
- ✅ Performance Lighthouse score >80

---

**Status**: ✅ Phase 1 Complete, Ready for Phase 2

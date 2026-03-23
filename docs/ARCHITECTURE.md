# 📊 Architecture & Component Overview

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Browser / Client                    │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │          Next.js 14 (App Router)               │ │
│  │  ┌──────────────────────────────────────────┐  │ │
│  │  │  Layout / Providers (Layout.tsx)         │  │ │
│  │  │  • React Query Provider                  │  │ │
│  │  │  • Background Orbs                       │  │ │
│  │  │  • Global Styles (globals.css)           │  │ │
│  │  └──────────────────────────────────────────┘  │ │
│  │           │                                      │ │
│  │  ┌────────▼──────────────────────────────────┐  │ │
│  │  │        Pages (src/app/*/page.tsx)         │  │ │
│  │  │                                             │  │ │
│  │  │  Marketing:         Application:           │  │ │
│  │  │  • Landing (/)     • Dashboard             │  │ │
│  │  │  • Pricing         • Leads                 │  │ │
│  │  │  • Product         • Conversation          │  │ │
│  │  │  • Privacy         • Advisor               │  │ │
│  │  │  • Terms           • Settings              │  │ │
│  │  │                    • Chat (public)         │  │ │
│  │  │  Auth:                                     │  │ │
│  │  │  • Login                                   │  │ │
│  │  │  • Signup                                  │  │ │
│  │  └────────────────────────────────────────────┘  │ │
│  │           │                                      │ │
│  │  ┌────────▼──────────────────────────────────┐  │ │
│  │  │     Components (src/components/)          │  │ │
│  │  │  • Navbar (with auth state)               │  │ │
│  │  │  • BackgroundOrbs (animated)              │  │ │
│  │  │  • ChatLayout, MessageBubble, etc         │  │ │
│  │  └────────────────────────────────────────────┘  │ │
│  │           │                                      │ │
│  │  ┌────────▼──────────────────────────────────┐  │ │
│  │  │   State & API (src/lib)                   │  │ │
│  │  │  • Axios API Client (api.ts)              │  │ │
│  │  │  • React Query Provider (react-query.tsx) │  │ │
│  │  │  • TypeScript Types (types.ts)            │  │ │
│  │  └────────────────────────────────────────────┘  │ │
│  │           │                                      │ │
│  │  ┌────────▼──────────────────────────────────┐  │ │
│  │  │  Styling & Animation (TailwindCSS +       │  │ │
│  │  │  Framer Motion)                           │  │ │
│  │  │  • Dark theme (Slate-950)                 │  │ │
│  │  │  • Responsive design (Mobile first)       │  │ │
│  │  │  • Smooth animations & transitions        │  │ │
│  │  └────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
└─────────────────────────────────────────────────────┘
                     │
                     │ HTTP/HTTPS
                     │ (Axios API Client)
                     ▼
┌─────────────────────────────────────────────────────┐
│  Backend API Server                                 │
│  (Xano CMS)                                         │
│  https://x8ki-letl-twmt.n7.xano.io/api:lpS_skXG    │
│                                                     │
│  Endpoints:                                         │
│  • POST /signup_custom                              │
│  • POST /auth/login                                 │
│  • GET /funnel_health                               │
│  • GET /revenue_metrics                             │
│  • GET /get_leads                                   │
│  • POST /advisor_analysis                           │
│  • POST /init_public_conversation                   │
│  • POST /ai_message                                 │
│  • GET /get_call_brief                              │
│  • POST /update_plan                                │
│  └─ ... (18+ endpoints)                             │
└─────────────────────────────────────────────────────┘
```

---

## 📄 Page Component Hierarchy

```
Layout (Root)
├─ Providers (React Query)
├─ BackgroundOrbs
└─ Page Content
    ├─ Navbar (All pages)
    │   ├─ Logo
    │   ├─ Nav Links
    │   ├─ Auth State
    │   └─ CTA Buttons
    │
    ├─ Home (/)
    │   ├─ Hero Section
    │   ├─ Trust Metrics
    │   ├─ How It Works
    │   ├─ Testimonials
    │   ├─ Pricing Cards
    │   └─ Final CTA
    │
    ├─ Pricing (/pricing)
    │   ├─ Hero
    │   ├─ Pricing Cards (3 tiers)
    │   ├─ FAQ Accordion
    │   └─ Final CTA
    │
    ├─ Product (/product)
    │   ├─ Features Showcase
    │   ├─ Use Cases
    │   └─ Demo References
    │
    ├─ Dashboard (/dashboard)
    │   ├─ Header
    │   ├─ Nav Links (Leads, Advisor, Settings)
    │   ├─ Metric Cards (4x)
    │   ├─ Funnel Chart
    │   └─ Revenue Chart
    │
    ├─ Leads (/leads)
    │   ├─ Header
    │   └─ Lead Table
    │       └─ Rows (sortable by score)
    │
    ├─ Conversation (/conversation/[id])
    │   ├─ Header
    │   ├─ Transcript (left)
    │   │   └─ Message Bubbles
    │   ├─ Brief (right)
    │   │   ├─ Summary
    │   │   ├─ Signals
    │   │   └─ Actions
    │   └─ Sidebar
    │
    ├─ Advisor (/advisor)
    │   ├─ Funnel Health
    │   ├─ Bottlenecks
    │   ├─ Recommendations
    │   └─ Revenue Opportunity
    │
    ├─ Settings (/settings)
    │   ├─ Business Profile
    │   ├─ AI Tone Selection
    │   ├─ Billing
    │   └─ Danger Zone
    │
    ├─ Chat (/c/[slug])
    │   ├─ Header
    │   ├─ Messages
    │   │   ├─ User Messages
    │   │   ├─ AI Messages
    │   │   └─ Typing Indicator
    │   └─ Input
    │
    ├─ Login (/login)
    │   └─ Login Form
    │
    ├─ Signup (/signup)
    │   └─ Signup Form
    │
    ├─ Privacy (/privacy)
    │   └─ Legal Content
    │
    └─ Terms (/terms)
        └─ Legal Content
```

---

## 🔄 Data Flow Diagram

```
User Action (Click, Type, Submit)
    │
    ▼
Event Handler (onClick, onChange, onSubmit)
    │
    ▼
Form State (useState or Form Hook)
    │
    ▼
API Call (useMutation or useQuery from React Query)
    │
    ▼
Axios Client (src/lib/api.ts)
    │
    ├─ Add JWT Token (if available)
    ├─ Create Request Config
    └─ Send HTTP Request
        │
        ▼
    Backend API (Xano)
        │
        ▼
    API Response (JSON)
        │
        ▼
    Error Handler
    │
    ├─ Success: Update State
    ├─ Error: Show Notification
    └─ Always: Update Loading State
        │
        ▼
    React Component Re-render
    (with new data/loading/error state)
        │
        ▼
    User Sees Updated UI
```

---

## 🎨 Component Relationships

```
navbar.tsx
├─ useRouter (navigation)
├─ useEffect (auth check)
├─ useState (auth state)
├─ Link (navigation links)
└─ logout handler
    └─ removeItem("token")

page.tsx (Landing)
├─ motion.* (Framer animations)
├─ containerVariants & itemVariants
├─ map() for dynamic content
├─ whileInView triggers
└─ Links to /signup, /pricing, /product

dashboard/page.tsx
├─ useRouter + useEffect (auth check)
├─ useQuery hooks (funnel_health, revenue_metrics)
├─ Metric cards (4)
├─ Chart components (placeholder)
├─ Navigation links
└─ Query states (loading, error)

leads/page.tsx
├─ useRouter + useEffect (auth check)
├─ useQuery (/get_leads)
├─ sort() leads by score
├─ map() leads table
├─ color-coded scores
└─ Links to /conversation/[id]

conversation/[id]/page.tsx
├─ useParams (get [id])
├─ useRouter + useEffect (auth check)
├─ useQuery (get_call_brief + get_conversation)
├─ Message mapping
├─ Brief display
├─ Signal cards
└─ Action buttons

c/[slug]/page.tsx
├─ useParams (get [slug])
├─ useEffect (init conversation)
├─ useState (messages, input)
├─ useMutation (send message)
├─ Message bubbles
├─ Input form
└─ Typing indicator
```

---

## 🌀 State Management Flow

```
Local Storage
    │
    └─ "token" (JWT)
        │
        ├─ Used by: Navbar, all protected pages
        ├─ Set by: Login/Signup pages
        ├─ Cleared by: Logout button
        └─ Checked by: useEffect in auth-required pages

React Query (Client Caching)
    │
    ├─ funnel_health
    │   ├─ Cache key: ["funnel_health"]
    │   ├─ Fetched from: GET /funnel_health
    │   ├─ Used by: Dashboard
    │   └─ Stale time: 5 minutes
    │
    ├─ revenue_metrics
    │   ├─ Cache key: ["revenue_metrics"]
    │   ├─ Fetched from: GET /revenue_metrics
    │   ├─ Used by: Dashboard
    │   └─ Stale time: 5 minutes
    │
    ├─ leads
    │   ├─ Cache key: ["leads"]
    │   ├─ Fetched from: GET /get_leads
    │   ├─ Used by: Leads page
    │   └─ Stale time: 5 minutes
    │
    └─ (more queries as needed)

Component State
    │
    ├─ Form inputs (email, password, etc)
    ├─ UI state (isOpen, isLoading, etc)
    ├─ Local filters/sorting
    └─ Animation states
```

---

## 🎯 User Journey Maps

### Landing Page Visitor
```
User Lands (/)
    ↓ reads Hero
    ↓ sees Social Proof (Trust Metrics)
    ↓ watches How It Works animation
    ↓ reads Testimonials
    ↓ sees Pricing (3 tiers)
    ↓ sees Scarcity ("Limited access")
    ↓ clicks "Apply for Beta"
    ↓ → /signup
```

### New User Journey
```
Signup (/signup)
    ↓ enters email, password, business_name
    ↓ POST /signup_custom
    ↓ token stored in localStorage
    ↓ → /onboarding (or /dashboard)
    ↓
Log In (/login)
    ↓ enters email, password
    ↓ POST /auth/login
    ↓ token stored in localStorage
    ↓ → /dashboard
    ↓
Dashboard (/dashboard)
    ↓ sees 4 metrics
    ↓ sees funnel chart
    ↓ sees revenue chart
    ↓ clicks Leads
    ↓
Leads List (/leads)
    ↓ sees leads sorted by score
    ↓ clicks on lead
    ↓
Conversation (/conversation/[id])
    ↓ sees transcript
    ↓ sees call brief
    ↓ sees lead signals
    ↓ takes action (send follow-up, etc)
```

### Public Lead Chat Journey
```
External Link: https://your-app.com/c/business-slug
    ↓
Public Chat Page (/c/[slug])
    ↓ gets business profile
    ↓ initializes conversation
    ↓ shows greeting message
    ↓
Lead types message
    ↓ POST /ai_message
    ↓ AI responds
    ↓ conversation tracked
    ↓ lead qualified
    ↓
Conversation saved
    ↓ visible in /leads for business owner
```

---

## 📦 Dependency Injection & Hooks

```
React Hooks Used:
├─ useState() - Form inputs, UI state
├─ useEffect() - Side effects, auth checks
├─ useRouter() - Navigation, redirects
├─ useParams() - Dynamic route parameters
├─ useQuery() - Data fetching (React Query)
├─ useMutation() - Data mutations (React Query)
└─ useContext() - Provider values (future)

External Libraries:
├─ framer-motion - Animations
├─ axios - HTTP client
├─ @tanstack/react-query - Caching/queries
├─ next/navigation - Routing
├─ next/link - Client links
└─ tailwindcss - Styling
```

---

## 🔐 Authentication Flow

```
No Token → Protected Page
    ↓
useEffect checks localStorage("token")
    ↓
if !token:
    ├─ router.push("/login")
    └─ User redirected to login form
    
With Token → Protected Page
    ↓
useEffect finds token
    ↓
Axios interceptor adds:
    ├─ header.Authorization = `Bearer ${token}`
    └─ Request sent to API
    
API Response:
    ├─ 200: Data loaded, component renders
    ├─ 401: Token expired/invalid
    └─ 403: Insufficient permissions
    
Logout:
    ├─ User clicks logout button
    ├─ localStorage.removeItem("token")
    ├─ router.push("/")
    └─ User redirected to landing page
```

---

## 🎬 Animation Layers

```
Framer Motion Variants
    ├─ Motion Components (motion.div, motion.h1, etc)
    ├─ Variants (hidden/visible states)
    ├─ Transitions (timing, easing, delay)
    ├─ Gesture animations (whileHover, whileTap)
    └─ View animations (whileInView, viewport)

Applied To:
    ├─ Hero section (fade-in on mount)
    ├─ Cards (scroll-reveal, whileHover scale)
    ├─ Testimonials (stagger on view)
    ├─ CTAs (spring animation on hover)
    ├─ Message bubbles (fade-in sequence)
    └─ Page transitions (opacity fade)

Performance:
    ├─ GPU-accelerated (transform, opacity)
    ├─ Will-change hints
    ├─ Staggered delays for perceived performance
    └─ Reduced motion preference support ready
```

---

## 📡 API Request/Response Cycle

```
1. Component mounts or user action
    ↓
2. useQuery/useMutation hook called
    ↓
3. Axios client created with config:
    ├─ baseURL (from .env.local)
    ├─ method (GET, POST, etc)
    ├─ url (endpoint path)
    ├─ data (request body if POST)
    └─ headers (including JWT token)
    ↓
4. Request sent to backend
    ↓
5. Backend processes request
    ├─ Validates token
    ├─ Processes business logic
    └─ Returns response
    ↓
6. Response received by Axios
    ├─ Status 200: res.data extracted
    ├─ Status 4xx/5xx: error thrown
    └─ All: interceptor catches
    ↓
7. React Query handles response
    ├─ Success: Updates cache, re-renders
    ├─ Error: Stores error state
    ├─ Loading: Sets isLoading flag
    └─ Empty: Handles null/undefined
    ↓
8. Component renders with data
    ├─ if (isLoading) → Loading state
    ├─ if (error) → Error message
    └─ if (data) → Display data
    ↓
9. User sees updated UI
```

---

## 🎁 Data Types (TypeScript Ready)

```typescript
// User
interface User {
  id: string
  email: string
  name: string
  business_name: string
  token: string
}

// Lead
interface Lead {
  id: string
  name: string
  email: string
  score: number // 0-100
  status: "new" | "interested" | "qualified"
  timestamp: Date
}

// Message
interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

// Conversation
interface Conversation {
  id: string
  messages: Message[]
  lead_id: string
  brief: CallBrief
}

// Metrics
interface FunnelHealth {
  total_leads: number
  visitors: number
  leads: number
  qualified: number
  deals: number
  win_rate: number
}

interface RevenueMetrics {
  health_score: number
  rps: number // Revenue per sale
  monthly_revenue: number
}
```

---

**This architecture is **scalable**, **maintainable**, and **production-ready**! 🚀**

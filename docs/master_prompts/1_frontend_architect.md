# 🎨 MASTER FRONTEND PROMPT & SPECIFICATION (Kimi 2.6 + Gemini)

This document contains the optimized master prompt for Kimi 2.6 + Gemini and the resulting frontend design architecture for **Pre-Closure AI**.

---

## 📋 Copy-Pasteable LLM Prompt

```text
You are a senior UI/UX architect from Nvidia, Apple, Stripe, Linear, and Vercel.
Your task is to design the frontend for my SaaS called:
PRE-CLOSURE AI
Positioning: "The World's Most Advanced AI Sales Pre-Closer"
Goal: Create a premium SaaS experience that looks like a $50M funded startup.

Design Language:
- Nvidia-inspired visual style
- Black background
- Electric blue neon accents (#00E5FF)
- Subtle gray metallic finish
- Premium glassmorphism
- GSAP animations
- Smooth scroll animations
- Modern SaaS aesthetic
- Enterprise-level trust

Hero Section:
- Create a moving 3D neon network mesh in the background similar to Nvidia AI visuals.
- The network should:
  - Move slowly
  - Feel intelligent
  - Have blue neon nodes
  - Connect with glowing lines
  - React slightly to mouse movement
- Hero headline: "Stop Talking To Bad Leads."
- Subheadline: "Pre-Closure AI qualifies, nurtures, follows up, scores, books, and prepares your prospects before you ever join the call."
- CTA Buttons: "Start Free Enterprise Trial" and "Watch Live Demo"

Trust Section:
- Display:
  - AI Lead Qualification
  - AI Pre-Closer
  - AI Follow-Up Engine
  - AI Revenue Intelligence
  - AI Client Onboarding
  - AI Proposal Generator
  - AI Sales Advisor
- Create animated cards for each.

Pricing Section:
- Plan 1: Professional $99/month
- Plan 2: Enterprise $199/month (Enterprise must be visually highlighted)

Coming Soon Section:
- Title: "World's Most Powerful Lead Generation Engine"
- Tag: "Launching Soon"
- Explain that lead generation is coming but all other revenue automation systems are already available.

Psychological Design Requirements:
- Maximize trust
- Maximize perceived value
- Reduce friction
- Create premium feeling
- Increase conversion rate
- Make the user feel they are buying an AI employee

Build:
- Full landing page
- Dashboard UI
- Login UI
- Signup UI
- Pricing page
- Analytics dashboard
- Mobile responsive

Output: Complete design architecture. Component structure. Color system. Typography system. GSAP animation system. Page hierarchy. UI wireframe descriptions.
```

---

## 🎨 Design System & Architecture Spec

### 1. Color System (Nvidia Dark Neon)
*   **Base Background**: Deep Pitch Black (`#000000`)
*   **Card Background**: Dark Charcoal with overlay (`rgba(10, 10, 10, 0.4)`)
*   **Primary Accent**: Electric Neon Cyan/Blue (`#00E5FF`)
*   **Glow Overlay**: Translucent Cyan/Blue glows (`rgba(0, 229, 255, 0.1)`)
*   **Metallic Finishes**: Silver Gray borders (`border-white/10`) and subtle gray metallic gradients (`linear-gradient(135deg, #ffffff 0%, #80F5FF 50%, #00E5FF 100%)`)

### 2. Typography System
*   **Font Family**: `Inter`, sans-serif (Google Fonts loaded with high-weight settings)
*   **Headings**: Bold uppercase styles with letter-spacing tracking (`tracking-tight`)
*   **Text Gradients**: Linear transition from pure white (`#ffffff`) to Electric Blue (`#00E5FF`)

### 3. GSAP & Animation Tokens
*   **Scroll Trigger**: Smooth transitions for section entrances (`reveal-up`, `reveal-left`).
*   **3D Mesh**: Canvas-based animated grid utilizing Sine waves and interactive mouse forces for spatial responsiveness.
*   **Glow Twinkle**: Pulsing drop-shadows on high-priority call-to-actions.

### 4. Component Structure (Next.js + TailwindCSS v4)
*   `NeonMeshBackground`: Interactive 3D web mesh rendering glowing connection nodes.
*   `MobileNav`: Smooth backdrop-blurred persistent top bar displaying brand logos and trial links.
*   `SimulatedDemo`: Interactive state toggle comparing Inbound Pipeline against Outbound scrapers.
*   `FAQ`: Progressive accordion disclosure.

### 5. Page Hierarchy
1.  **Landing Page (`/`)**: Main persuation hero, trust feature matrices, pricing tiers, lead gen announcement, and accordion FAQ.
2.  **Dashboard (`/dashboard`)**: Analytics dashboard showcasing total/qualified leads, conversion funnel, revenue metrics, and advisor panel.
3.  **Authentication (`/login`, `/signup`)**: Minimalist glassmorphic entry forms with automatic route authorization.

# Local Development & Testing Guide

## Quick Start

### 1. Start Development Server

```powershell
cd "c:\Users\LAPTOP WORLD\projecte\ai-chat-app"
npm run dev
```

Server starts at: **http://localhost:3000**

### 2. Open in Browser

Navigate to http://localhost:3000

---

## Testing Workflow

### Step 1: Clear Previous Session (Optional)
Open DevTools (F12) and run:
```javascript
localStorage.clear()
```

### Step 2: Create Test Account
1. Go to http://localhost:3000/signup
2. Fill form:
   - Email: `test@example.com`
   - Password: `Test123!`
   - Business Name: `Test Company`
3. Click "Create Account"
4. Check for success/error in browser console and UI

**Expected**: 
- Loading spinner appears
- Token stored in localStorage
- Redirects to /dashboard

### Step 3: Login Test
1. If redirected to dashboard, check navigation bar
2. Click "Logout" if available
3. Go to http://localhost:3000/login
4. Enter same email/password
5. Click "Sign In"

**Expected**:
- Loading spinner appears  
- Redirects to /dashboard
- Navbar shows logged-in state

### Step 4: Test Each Phase
See [INTEGRATION_TESTING_PLAN.md](./INTEGRATION_TESTING_PLAN.md) for detailed steps per phase.

---

## Browser DevTools Debugging

### Monitor API Calls
1. Open DevTools (F12)
2. Go to **Network** tab
3. Filter by XHR
4. Perform action (login, send message, etc.)
5. Click request to see:
   - **Request body**: What was sent
   - **Response**: What API returned
   - **Headers**: Authorization token

### Check localStorage
1. DevTools → **Application** tab
2. Left sidebar → **Local Storage** → http://localhost:3000
3. Look for `token` key
4. Copy value and decode at jwt.io to verify claims

### Console Errors
1. DevTools → **Console** tab
2. Any red errors indicate problems
3. Check error message for clue
4. Common issues:
   - `NEXT_PUBLIC_API_URL is undefined` → Check .env.local
   - `401 Unauthorized` → Token missing or expired
   - `404 Not Found` → Wrong endpoint URL

---

## Page Routes Reference

### Public Routes (No Login Required)
- **Home**: http://localhost:3000
- **Product**: http://localhost:3000/product
- **Pricing**: http://localhost:3000/pricing
- **Privacy**: http://localhost:3000/privacy
- **Terms**: http://localhost:3000/terms
- **Signup**: http://localhost:3000/signup
- **Login**: http://localhost:3000/login
- **Public Chat**: http://localhost:3000/c/{slug}

### Protected Routes (Login Required)
- **Dashboard**: http://localhost:3000/dashboard
- **Leads**: http://localhost:3000/leads
- **Lead Detail**: http://localhost:3000/conversation/{lead_id}
- **Advisor**: http://localhost:3000/advisor
- **Settings**: http://localhost:3000/settings
- **Public Chat (alternate)**: http://localhost:3000/chat/{slug}

---

## Phase-by-Phase Testing URLs

### Phase 1: Authentication
1. **Signup**: http://localhost:3000/signup
2. **Login**: http://localhost:3000/login

### Phase 2: Public Chat
1. **Chat Page**: http://localhost:3000/c/your-slug
   - Replace `your-slug` with actual business slug from API

### Phase 3: Dashboard
1. **Dashboard**: http://localhost:3000/dashboard

### Phase 4: Leads
1. **Leads List**: http://localhost:3000/leads
2. **Lead Detail**: http://localhost:3000/conversation/{lead_id}

### Phase 5: Brief & Signals
- Same as Phase 4 (Lead Detail page shows brief)

### Phase 6: Advisor
1. **Advisor**: http://localhost:3000/advisor

### Phase 7: Animations
- Navigate between pages and observe transitions
- Reload http://localhost:3000 and watch hero animations

### Phase 8: Payment
1. Ensure `.env.local` contains valid Stripe test keys and price IDs.
2. Start dev server (`npm run dev`) and log into the app.
3. Open http://localhost:3000/pricing and click a plan button.
4. Watch Network tab for POST to `/api/create-checkout-session`.
5. Confirm the response returns an `id` starting with `cs_test_`.
6. Use Stripe’s test card (4242 4242 4242 4242) on the redirected checkout page.
7. After success you should land on `/dashboard?session_id=...`.
8. If checkout is cancelled you should return to `/pricing` with no alert.
9. Check backend/Xano or Stripe dashboard for subscription record.

---

## Testing Checklist for Each Phase

### Before Starting a Phase
- [ ] Dev server is running (`npm run dev`)
- [ ] No errors in console
- [ ] Logged in (for protected routes)
- [ ] DevTools Network tab open (to see API calls)

### During Testing
- [ ] Watch Network tab for API calls
- [ ] Check response status code (should be 200)
- [ ] Verify response has expected data
- [ ] Check UI updates with data
- [ ] Look for error messages in console

### After Testing
- [ ] Document results in [TESTING_PROGRESS.md](./TESTING_PROGRESS.md)
- [ ] Report any failures or unexpected behavior
- [ ] Take screenshots of errors

---

## Common Issues & Fixes

### Issue: Page stuck on loading
**Cause**: API not responding
**Fix**: 
1. Check console for error
2. Verify `NEXT_PUBLIC_API_URL` in .env.local
3. Verify API server is running
4. Reload page (Ctrl+Shift+R to hard refresh)

### Issue: 401 Unauthorized error
**Cause**: Missing or invalid token
**Fix**:
1. Log out: Go to /login and clear localStorage
2. Log back in
3. Check token in localStorage (should be non-empty)

### Issue: Wrong endpoint being called
**Cause**: Code has wrong URL path
**Fix**:
1. Check Network tab to see actual URL
2. Compare with [INTEGRATION_TESTING_PLAN.md](./INTEGRATION_TESTING_PLAN.md)
3. Report discrepancy with actual endpoint

### Issue: Animations are choppy/stuttering
**Cause**: Performance issue
**Fix**:
1. Close other browser tabs
2. Check GPU acceleration is enabled
3. Open Performance tab and record
4. Look for long tasks

### Issue: Page shows 404
**Cause**: Route doesn't exist or typo in URL
**Fix**:
1. Check spelling of path
2. Verify route file exists in `src/app/`
3. Ensure dev server restarted after file creation

---

## API Response Examples

### Login Success
```json
{
  "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "email": "test@example.com"
  }
}
```

### Login Error
```json
{
  "error": "Invalid email or password"
}
```

### Get Leads Success
```json
{
  "leads": [
    {
      "id": "lead_001",
      "name": "John Smith",
      "score": 85,
      "status": "qualified"
    }
  ]
}
```

---

## Performance Testing

### Check Build Performance
```powershell
npm run build
```

Should complete in **<30 seconds**

### Check Runtime Performance
1. Open DevTools → **Performance** tab
2. Click the red circle to record
3. Perform action (click button, send message, navigate)
4. Click red circle again to stop
5. Look at timeline:
   - Rendering: Should be short bars
   - Main thread: Should have gaps (idle time)
   - FPS meter: Should stay at 60fps

---

## Environment Variables

File: `.env.local`

```env
NEXT_PUBLIC_API_URL=https://x8ki-letl-twmt.n7.xano.io/api:lpS_skXG

# Stripe (for Phase 8)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXX
STRIPE_SECRET_KEY=sk_test_XXXXXXXXXXXX
# Price IDs (create these in Stripe dashboard)
STRIPE_PRICE_STARTER=price_abc123
STRIPE_PRICE_PRO=price_def456
STRIPE_PRICE_BUSINESS=price_ghi789

# Base url (for checkout redirect)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

This is the minimal set of variables required for local testing. Notes:
- `NEXT_PUBLIC_API_URL` is used by the frontend to call the Xano backend.
- Stripe keys allow the pricing page to redirect users to Checkout. Publishable key is exposed in bundle; secret key stays on server (used by `/api/create-checkout-session`).
- `STRIPE_PRICE_*` map plan IDs to Stripe price objects. You must create corresponding products/prices in your Stripe dashboard.
- `NEXT_PUBLIC_BASE_URL` is used to build success/cancel URLs for Stripe. Change to your Vercel URL when deploying.
- Never commit real secret keys; use a `.env.local` file excluded by git.

---

## Next Steps After Phase 1 Passes

Once Phase 1 (Auth) passes, you can test subsequent phases:

1. **Phase 1** → Auth working ✅
2. **Phase 2** → Public Chat 
   - Need: A valid slug for your business profile
3. **Phase 3** → Dashboard 
   - Need: Funnel health data in API
4. **Phase 4** → Leads 
   - Need: At least one lead in database
5. **Phase 5-6** → Advisor & Brief 
   - Need: Conversation data for leads
6. **Phase 7** → Animations
   - Test visually, no API needed
7. **Phase 8** → Payments
   - Need: Stripe/Razorpay setup
8. **Phase 9** → Deployment
   - Need: GitHub + Vercel account

---

## Getting Help

### Check Logs
- Frontend console: F12 → Console tab
- Network errors: F12 → Network tab
- Build errors: Terminal output from `npm run build`

### Key Files to Check
- API config: [src/lib/api.ts](./src/lib/api.ts)
- Page code: [src/app/](./src/app/)
- Environment: [.env.local](./.env.local)

### Documentation
- Integration Plan: [INTEGRATION_TESTING_PLAN.md](./INTEGRATION_TESTING_PLAN.md)
- Testing Progress: [TESTING_PROGRESS.md](./TESTING_PROGRESS.md)
- Project Setup: [PROJECT_SETUP.md](./PROJECT_SETUP.md)

---

**Status**: ✅ Dev environment ready, Phase 1 code complete

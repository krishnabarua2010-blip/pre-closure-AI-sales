# 🚀 Quick Start Guide

## 5-Minute Setup

### 1. **Install Dependencies** (Already Done ✅)
```bash
npm install
```

### 2. **Start Development Server**
```bash
npm run dev
```
Visit: `http://localhost:3000`

### 3. **Test the App**
- Click through all pages
- Test responsive design (F12 → Mobile)
- Check navbar auth state

### 4. **Deploy to Vercel** (When Ready)
```bash
# Push to GitHub
git push origin main

# Go to vercel.com
# Import repo
# Set environment variable: NEXT_PUBLIC_API_URL
# Deploy!
```

---

## 📁 Key Files to Know

| File | Purpose |
|------|---------|
| `.env.local` | API configuration |
| `src/app/page.tsx` | Landing page (most animated) |
| `src/app/dashboard/page.tsx` | Main app dashboard |
| `src/lib/api.ts` | API client configuration |
| `src/app/layout.tsx` | Root layout with providers |
| `src/components/navbar.tsx` | Navigation component |

---

## 🎨 Customization (Most Common)

### Change App Name
Search & replace "Auto Closure" with your brand name:
- `src/app/page.tsx`
- `src/components/navbar.tsx`
- `src/app/pricing/page.tsx`

### Change Primary Color
Find `bg-blue-600` and replace with your color:
- `text-blue-400` → `text-[your-color]-400`
- `border-blue-500` → `border-[your-color]-500`

### Update Logo
Replace emoji (⚡) in navbar:
```typescript
<span className="text-blue-500">⚡</span> → <img src="/logo.png" />
```

### Modify Pricing
Edit `src/app/pricing/page.tsx`:
- Change prices in plansData array
- Modify features list
- Update plan names

---

## 🔄 Build Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Run production build
npm run lint     # Check code quality
```

---

## 📱 Test Checklist

- [ ] Landing page loads with animations
- [ ] Pricing page displays correctly
- [ ] Login/Signup pages functional
- [ ] Dashboard shows mock data
- [ ] Leads page renders table
- [ ] Navbar shows correct links
- [ ] Mobile responsive (test on iPhone)
- [ ] No console errors (F12)

---

## 🔐 Authentication Testing

### Test Login Flow
```typescript
// Open DevTools Console
localStorage.setItem("token", "test-token")
// Refresh page - should show dashboard

// To logout
localStorage.removeItem("token")
```

---

## 🎯 Next Steps (Priority Order)

1. **✅ Test locally** - `npm run dev` and click around
2. **✅ Customize branding** - Change app name and colors
3. **✅ Deploy to Vercel** - Zero-config deployment
4. **✅ Connect backend** - Update API endpoints
5. **✅ Add real data** - Replace mock metrics
6. **✅ Setup analytics** - Segment or Mixpanel
7. **✅ Configure email** - Transactional emails

---

## 🎓 Where to Find Things

**Want to add a page?**
→ Create file in `src/app/`

**Want to add a component?**
→ Create file in `src/components/`

**Want to fix an animation?**
→ Edit `motion.*` properties (duration, delay, etc)

**Want to change styling?**
→ Edit Tailwind classes (className prop)

**Want to change API?**
→ Edit `src/lib/api.ts` baseURL

---

## 🐛 Common Issues & Fixes

**"Cannot find module" error**
```bash
rm -rf .next node_modules
npm install
npm run build
```

**Animations not smooth**
- Check Framer Motion is imported
- Ensure viewport={{ once: true }} on scroll animations

**API not connecting**
- Verify `.env.local` has correct URL
- Check API endpoint exists
- Test in Postman first

**Build fails**
```bash
npm run lint
npm run build --verbose
```

---

## 💡 Pro Tips

1. **Use React Query DevTools** - Install chrome extension for API debugging
2. **Use Vercel Preview URLs** - Test branches before main
3. **Monitor bundle size** - `npm run build` shows size
4. **Test on mobile first** - Add `?device=iphone` to dev URL
5. **Use TypeScript** - Catch errors before runtime

---

## 📞 Quick Reference

**Development:**
- `localhost:3000` - Dev server
- `localhost:3000/__nextauth` - Auth debug
- Network tab - API calls

**Production:**
- `vercel.com` - Dashboard
- GitHub - Source control
- `.env.local` - Secrets (never commit)

**Documentation:**
- `PROJECT_SETUP.md` - Full architecture
- `COMPLETION_SUMMARY.md` - What's included
- `FILES_CREATED.md` - File structure

---

## ✨ You're All Set!

Your SaaS frontend is ready. Start with `npm run dev` and explore! 🚀

**Questions?** Check the docs or DevTools Network tab!

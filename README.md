# 🍲 Pakka Local (పక్కా లోకల్)
### Premium Swiggy & Zomato Style Food Delivery Platform for Andhra & Telangana

A real-world, production-ready food delivery web application built with **Next.js 16 (Turbopack)**, **TypeScript**, **Tailwind CSS**, and modern reactive architecture.

---

## 🌟 Key Application Roles & URLs

| Role | Route | Key Features |
| :--- | :--- | :--- |
| **🛍️ Customer Portal** | `/app` | Location picker, Swiggy food mood circular carousels, cuisine filters, dish search, customizable cart, doorstep COD & UPI payment, live order tracking with animated route radar. |
| **🏪 Restaurant Partner** | `/restaurant` | Kitchen order accept/reject, 15/25/40m prep times, 4-digit handover PIN generator, menu dish CRUD, stock toggles, live customer notice banner, emergency kitchen pause toggle, settlement bank & UPI editor. |
| **🛵 Delivery Pilot** | `/rider` | Duty status toggle, active trip radar, one-tap navigation simulation, restaurant pickup code verification, customer doorstep cash float collection, delivery completion OTP check. |
| **👑 Super Admin Operations** | `/admin` | Live fleet pilot manager, cash float reset, super admin direct menu editor for any restaurant, customer support address/instructions editor, delivery zones, promo coupons, global platform fee/GST/surge/city announcement controls. |
| **🌐 Landing / Role Switcher** | `/` | Instant one-tap navigation to launch any of the 4 roles. |

---

## ⚡ Quick Start for Local Demo

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Open in browser
http://localhost:3000
```

---

## 🚀 Deploying to Vercel (Demo Mode)

The project has been built and tested with zero build errors (`npm run build` passes 17/17 routes). **No external environment variables are required** to run the complete interactive demo on Vercel.

### Method 1: Deploy with GitHub (Recommended)

1. **Create a new repository on GitHub**:
   - Go to [github.com/new](https://github.com/new) and name it `pakka-local`.
2. **Push your code from terminal**:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/pakka-local.git
   git push -u origin main
   ```
3. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com) and log in.
   - Click **"Add New..."** -> **"Project"**.
   - Select your `pakka-local` repository.
   - Framework preset will automatically be **Next.js**.
   - Click **"Deploy"**.
   - Your live site will be ready in under 60 seconds!

---

### Method 2: Deploy directly via Vercel CLI

If you have a terminal open inside the project directory:

```bash
# Run Vercel CLI deploy
npx vercel
```

- Answer `Y` to `Set up and deploy?`
- Select your Vercel account/team.
- Name your project `pakka-local`.
- Keep `./` as the project root directory.
- Once preview is ready, deploy to production with:
  ```bash
  npx vercel --prod
  ```

---

## ⚙️ Architecture & Demo Highlights
- **Pay on Delivery:** Real-world payment options tailored for local delivery: Cash on Delivery & Doorstep UPI QR.
- **Custom Route Radar:** Animated live pilot trajectory and dispatch tracking without requiring paid Google Maps API billing.
- **Bi-lingual Telugu & English:** Instant one-tap toggle for English and Telugu (తెలుగు) across all pages.
- **Zero-Config Fallbacks:** Ready for Vercel deployment out of the box with `localStorage` state persistence.

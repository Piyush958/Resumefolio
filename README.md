# ResumeLink (Zero-Cost Launch)

ResumeLink is a drag-and-drop Resume + Portfolio builder built with:

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui + Radix
- `@dnd-kit` (sortable editor)
- Supabase (Auth + Postgres + Storage)
- Razorpay (one-time INR 99 upgrade)
- `html2canvas` + `jsPDF` (PDF export)
- Zustand stores

This project is optimized for **free-tier launch first**:

- Start with Google login (no SMTP cost)
- Free Vercel + Free Supabase
- Add Razorpay only when you are ready to monetize

---

## 1) Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open: `http://localhost:3000`

---

## 2) Required Env Variables

Add these in `.env.local`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Optional at start (required only for upgrade checkout)
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
```

---

## 3) Supabase Full Setup (Step-by-step)

1. Create project in Supabase Dashboard.
2. Copy `Project URL` and `anon key` into env.
3. Copy `service_role key` into env.
4. Open SQL Editor and run: `supabase/schema.sql`.
5. In Authentication -> Providers, enable **Google**.
6. In Google Cloud Console:
   - Create OAuth client (Web application)
   - Authorized redirect URI:
     - `http://localhost:3000/auth/callback` (dev)
     - `https://<your-domain>/auth/callback` (prod)
7. Put Google client ID/secret into Supabase Google provider settings.
8. In Auth URL config, set:
   - Site URL: your app URL
   - Additional Redirect URLs: include local + production callback URLs

---

## 4) Free Launch Mode (No Cost)

Use this config for zero spend:

- Supabase Free tier
- Vercel Hobby
- Google OAuth only
- Keep Razorpay keys empty until monetization

Notes:

- Email/password login is present but real-world delivery needs custom SMTP.
- Supabase default email sender is not enough for production user traffic.

---

## 5) Monetization Setup (When Ready)

1. Create Razorpay account and get Test keys.
2. Add keys in env.
3. Enable checkout from editor toolbar (`Upgrade Pro`).
4. Verification is done in `app/api/payments/verify/route.ts`.
5. On success:
   - `profiles.is_pro = true`
   - all user resumes marked `is_pro = true`

---

## 6) Main Routes

- `/` -> landing page
- `/login` -> auth page
- `/dashboard` -> resume list/create/delete
- `/editor/[id]` -> drag-and-drop editor
- `/preview/[id]` -> private full preview
- `/share/[id]` -> share link + QR
- `/r/[username]/[slug]` -> public resume page

---

## 7) Folder Architecture

- `app/` -> routes + API routes
- `components/` -> reusable UI/editor/preview/layout components
- `lib/` -> utilities, auth helpers, supabase clients, razorpay helper
- `hooks/` -> autosave/debounce
- `store/` -> Zustand stores (`editorStore`, `userStore`)
- `types/` -> TypeScript interfaces
- `templates/` -> 7 predefined templates
- `supabase/` -> SQL schema and RLS policies

---

## 8) Key Features Implemented

- Supabase auth (Google + email/password)
- Protected dashboard/editor flows
- Resume CRUD
- Drag/drop section management
- Real-time visual preview
- 7 templates (free + pro locking)
- Style customization panel
- Share URL + QR code
- PDF download
- Razorpay order + signature verification flow
- Photo upload to Supabase Storage

---

## 9) Deploy on Vercel

1. Push repo to GitHub
2. Import project in Vercel
3. Add env variables in Vercel Project Settings
4. Deploy
5. Add production callback URL in Supabase Auth settings

---

## 10) Important Security Notes

- Never expose `SUPABASE_SERVICE_ROLE_KEY` on client.
- Never expose `RAZORPAY_KEY_SECRET` on client.
- Keep payment verification server-side only.
- RLS policies are required; do not skip `schema.sql`.

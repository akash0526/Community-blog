# Apex Community Platform — Open Global Blogging

**Apex Community Platform** (live at [apex-nepal.com](https://www.apex-nepal.com)) is a high-performance open-publishing platform where *anyone* can visit, draft a story, run it through a real-time SEO checklist, and publish it to the internet with fully automated server-side Open Graph metadata.

Built with **Next.js (App Router)**, **Tailwind CSS v4**, **Supabase (PostgreSQL and Authentication)**, and **ImageKit (image uploads, transformations, and CDN delivery)**. Content spans personal essays, Qatar expat guides, remittance comparisons, tech, food, travel, and culture — in English and Nepali.

---

## ⚡ What Makes This Platform Spectacular

1. **True Server-Side Rendering (SSR) & Dynamic Open Graph:** Every dispatch published by your community gets its own canonical URL (`/blog/[slug]`). Next.js executes `generateMetadata` on the server before page load, ensuring perfect unfurling with custom images and titles on X, LinkedIn, Discord, and complete crawling by SearchGPT, ClaudeBot, and Googlebot.
2. **Interactive 100-Point Real-Time SEO Engine:** As authors type in the Writing Studio (`/studio`), our cognitive logic continuously parses their exact markdown tags, semantic H2 nested headings, optimal SERP snippet lengths, and mathematical keyword density, instantly updating an interactive visual dial.
3. **Open Community Navigation & Gamified Ledger:** Visitors can search articles instantly, filter across tech niches, and track live organic Pageview hits across all creators.
4. **Author Dashboard & Telemetry Hub:** Authenticated creators can access their personal vault (`/dashboard`) to track aggregate traffic hits, monitor their average technical SEO rankings, and manage their live posts.
5. **Workflow Kanban Board:** An interactive multi-phase pipeline planner (`/kanban`) to organize keyword clusters.
6. **Zero-Friction One-Click Demo Auth:** To provide absolute instant testing for developers viewing the project without email SMTP configured, the Auth Modal includes an instant **One-Click Sandboxed Demo Login**!

---

## 🚀 Quick Setup & Production Deployment

### 1. Supabase Cloud Setup
1. Create a brand new project on [Supabase.com](https://supabase.com/).
2. Open the **SQL Editor** in your Supabase Dashboard and paste the entire contents of `supabase_schema.sql` (found at the root of this repo) and hit **Run**.
3. This SQL script creates your `profiles` and `articles` tables and configures **Row Level Security (RLS)**. It also creates the legacy `article_images` bucket for older media; new writing-studio uploads go directly to ImageKit, so new image files do not use Supabase Storage.

### 2. Environment Configuration
Create a `.env.local` file at the root of your project:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-new-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# ImageKit — get these from ImageKit Dashboard → Developer options → API keys
IMAGEKIT_PUBLIC_KEY=your-imagekit-public-key
IMAGEKIT_PRIVATE_KEY=your-imagekit-private-key
# Optional: use your account's ImageKit URL endpoint (also enables custom CDN hosts)
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-imagekit-id
```

Keep `IMAGEKIT_PRIVATE_KEY` server-side: do not prefix it with `NEXT_PUBLIC_` or commit it. The app signs short-lived upload requests on the server and sends image bytes from the browser straight to ImageKit. Supabase stores just the article text and image URLs. Existing Supabase-hosted images continue to work and are not migrated or deleted automatically; migrate and remove old bucket objects separately if you also need to reclaim existing storage.

In `/studio`, the featured-image uploader sets the social/cover image. To put photos in the body, place the Markdown cursor at the desired location and click **Upload & insert photos**. You can select up to 10 photos at once; each is inserted at that cursor position, and a single photo can have custom alt text and a caption. Article-body photos use ImageKit's automatic format conversion and high-quality 1600px delivery; featured covers use Next.js responsive image optimization.

### 3. Local Development
Run the high-speed Next.js Turbopack development server:
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to explore your open developer community!

### 4. Deploy to Vercel
Push your repository to GitHub, import it into Vercel, and add the Supabase variables plus `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, and (optionally) `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` in **Project Settings → Environment Variables**. Redeploy after saving them so the upload signer and image host configuration are available.

---

## 🛠️ Project File Anatomy

```
community-platform/
├── app/
│   ├── api/imagekit/auth/route.ts # Short-lived ImageKit upload signatures
│   ├── blog/
│   │   └── [slug]/page.jsx   # Dynamic server-rendered article prose view
│   ├── dashboard/page.jsx    # Author specific live telemetry dashboard
│   ├── kanban/page.jsx       # Long-tail keyword cluster pipeline planner
│   ├── studio/page.jsx       # Multi-user author studio & real-time live audit
│   ├── layout.tsx            # Master Layout with Inter/Geist fonts
│   ├── globals.css           # Premium custom Tailwind design system & variables
│   └── page.jsx              # Homepage Community Hub & multi-user feed explorer
├── components/
│   ├── AuthModal.jsx         # Supabase Auth Login/Signup + One-click demo failsafe
│   └── Navbar.jsx            # Sticky responsive top navigation deck
├── lib/
│   ├── seoEngine.js          # The 100-point real-time algorithmic evaluator
│   ├── imagekitUpload.js      # Direct browser uploads to ImageKit
│   ├── markdownImages.js      # Safe image Markdown + cursor-position insertion
│   ├── imagekitUrl.js         # High-quality ImageKit CDN transformations
│   └── supabase.js           # Supabase REST cloud helper
├── supabase_schema.sql       # Master PostgreSQL production schema & RLS policies
└── package.json
```

---

## 🛡️ Cyber-Security Failsafes Enabled
* **Row Level Security (RLS):** Authenticated users can only publish under their own verified Supabase `auth.uid()`.
* **Sanitization:** All raw Markdown submitted in the Writer Studio is scrubbed using `isomorphic-dompurify` before reaching your PostgreSQL tables to block Cross-Site Scripting (XSS).
* **Graceful Empty-State UX:** If there are no published articles yet, the homepage and feed now render clean empty states instead of showing seeded demo blogs.

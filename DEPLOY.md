# How to Put The Architects Codex on the Internet

A step-by-step guide for someone who has never deployed a website before.

You're about to put The Architects Codex on the open internet so anyone can visit it. This will take ~2-3 hours total, mostly waiting for things to load.

**You'll need:** A laptop or desktop computer, ~$15 for a domain (optional, can wait), and patience.

---

## What you're going to do (overview)

1. Make a free GitHub account (where the code lives)
2. Upload this folder to GitHub
3. Make a free Vercel account (the hosting)
4. Connect Vercel to GitHub
5. Click "deploy"
6. You're live on the internet

---

## STEP 1 — Make a GitHub account (5 minutes)

1. Go to [github.com](https://github.com)
2. Click "Sign up"
3. Use your real email (you'll need to verify it)
4. Pick a username (this becomes part of your code's URL — choose something professional like `ascension-architect` or your name)
5. Verify your email when GitHub asks

You're done with GitHub for now.

---

## STEP 2 — Upload this folder to GitHub (15 minutes)

The easiest way without using terminal commands:

1. After signing into GitHub, click the green **"New"** button (top left, "New repository")
2. Name the repository: `architects-codex`
3. Make it **Public** (Vercel free tier requires public repos — don't worry, no one can edit it but you)
4. **Do NOT** check "Initialize with README" — we already have one
5. Click **"Create repository"**

You'll see a page with instructions. We'll use the easiest path:

6. Click **"uploading an existing file"** (a link in the middle of the page)
7. Open the `architects-codex` folder on your computer
8. Select **all files and folders inside** (not the architects-codex folder itself, but everything inside it)
9. Drag them into the GitHub upload area
10. Wait for upload to finish (could be 1-3 minutes)
11. Scroll to bottom, click **"Commit changes"**

**Important:** Make sure these things uploaded:
- `package.json`
- `next.config.js`
- `README.md`
- `src/` folder (with `app/` and `components/` inside)
- `public/` folder (with `favicon.svg`)
- `.gitignore`

If anything is missing, drag and drop those individually.

---

## STEP 3 — Make a Vercel account (3 minutes)

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"** (this links your accounts automatically)
4. Authorize Vercel to access your GitHub
5. Pick the **Hobby (free)** plan when asked

---

## STEP 4 — Deploy The Codex (5 minutes)

1. On Vercel's dashboard, click **"Add New..."** → **"Project"**
2. You'll see your GitHub repositories. Find `architects-codex` and click **"Import"**
3. On the configuration page:
   - **Project Name:** Leave as is, or change to `architects-codex`
   - **Framework Preset:** Should auto-detect "Next.js" — leave it
   - **Root Directory:** Leave as `./`
   - **Environment Variables:** Skip (none needed yet)
4. Click **"Deploy"**
5. Wait 2-4 minutes while Vercel builds your site
6. When you see confetti and "Congratulations" — **you're live**

Vercel gives you a URL like `architects-codex.vercel.app`. Click it. Your Codex is on the internet.

---

## STEP 5 — Test it (5 minutes)

Open your new URL and:
- Walk through the onboarding
- Trigger the morning ritual
- Pull a synchronicity entry
- Try the inquiry engine
- Click into the Sanctuary

**Note:** Browser storage means each device has its own data. If you log a synchronicity on your phone, it won't show on your laptop. We'll fix this later when you add a real database.

---

## STEP 6 — Connect a custom domain (Optional, 10 minutes + DNS wait)

Right now your URL is `architects-codex.vercel.app`. You probably want `architectscodex.com` or similar.

### A. Buy a domain

1. Go to [namecheap.com](https://namecheap.com) or [porkbun.com](https://porkbun.com) (Porkbun is cheaper)
2. Search for the domain you want
3. Suggestions:
   - `architectscodex.com`
   - `thearchitectscodex.com`
   - `codex.app` (if available, premium)
   - `architectscodex.io`
4. Buy it. Decline all add-ons (no privacy upsell needed — they include it free).
5. Cost: ~$10-15/year

### B. Connect to Vercel

1. In Vercel, go to your project → **Settings** → **Domains**
2. Type your domain (e.g., `architectscodex.com`) and click **"Add"**
3. Vercel will show you DNS records to add at your domain registrar
4. Go back to Namecheap/Porkbun → find DNS settings for your domain
5. Add the records Vercel showed you (usually 1-2 records)
6. Wait. DNS propagation takes anywhere from 5 minutes to 24 hours.
7. Once propagated, your custom domain works automatically with HTTPS.

---

## Things you might want to change

### Your Discord invite

If your Discord invite link ever changes:

1. In your GitHub repo, navigate to `src/components/ArchitectsCodex.jsx`
2. Click the pencil icon to edit
3. Use Find & Replace (Ctrl+F or Cmd+F) to find `5qZf8V8ms`
4. Replace with your new invite code (just the part after `discord.gg/`)
5. Scroll down, commit changes
6. Vercel auto-redeploys in ~2 minutes

### Buy Me a Coffee link

Same process, find `https://buymeacoffee.com/` and replace with your full URL.

---

## What this costs you

- **GitHub:** Free forever for public repos
- **Vercel:** Free for personal projects with reasonable traffic (you can serve thousands of visitors per month free)
- **Domain (optional):** $10-15/year
- **Total:** $0 if you use the `vercel.app` URL, ~$15/year for a custom domain

---

## When you grow

If The Codex starts getting heavy traffic and you want to add features:

### When you have $5-30/month to spare:
- Add the AI Guide back (Anthropic API)
- Add Stripe to sell products without Gumroad fees
- Set up Supabase for cross-device data sync

### When you're ready for the team option:
- Hire a developer to maintain and add features
- They can pick up exactly where this codebase left off
- The code is documented and clean

---

## Help, something broke

### "Build failed" on Vercel

- Click into the build log
- Look for the red error message
- Most common cause: a missing file from upload. Re-upload anything that's missing.

### Site loads but looks broken

- Check browser console (right-click → Inspect → Console)
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### My data disappeared

- Browser storage is per-device and per-browser
- Clearing browser data clears the Codex
- This is by design for privacy. Cross-device sync requires a backend (Supabase) — future feature.

### Custom domain not working after 24 hours

- Check Vercel → Settings → Domains for any errors shown
- Verify DNS records match what Vercel asked for
- Contact your domain registrar's support if records look right but it's not working

---

## You did it

When you visit your URL and the Codex loads:

You own this. It runs without you, without me, without anyone. It's yours forever.

Now go do the work.

🜂

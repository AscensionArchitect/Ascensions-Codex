# Ascension Architect — The Codex

The official site for [@ascension_architect](https://www.instagram.com/ascension_architect). Built to replace Beacons / Linktree as the single link in all socials.

## Site structure

Two routes, one experience:

- **`/`** — **The Hub.** Bio, products, socials, Discord, support. The link-in-bio replacement.
- **`/codex`** — **The Sanctuary.** Full Codex experience: synchronicity tracking, 13 Moon calendar, 7 Pillars, dreams archive, self-inquiry engine, and more.

The Hub is the front door. The Codex is the inner chamber. Users discover the Codex through a prominent CTA on the Hub. Power users can bookmark `/codex` directly.

## What's inside the Codex

- **Galactic Signature** — today's universal Kin (13 Moon / Tzolkin)
- **Synchronicity Engine** — log patterns and meaningful coincidences
- **Living Constellation** — synchronicities visualized as a star map
- **Dreams Archive** — dreams with symbolic tagging
- **Seven Pillars** — interactive integration framework
- **Symptom Decoder** — diagnostic mapping users to a primary pillar
- **T × E Alignment** — daily coherence calibration
- **Self-Inquiry Engine** — 80+ hand-written questions, smart-routed
- **Architect's Mirror** — personal stats and patterns
- **The Sanctuary** — Discord community integration with live presence
- **Morning Ritual** — threshold-crossing arrival sequence (once per day)
- **Community Field** — anonymous shared reflections per Kin day

All Codex data persists in browser localStorage. No login. Zero ongoing cost.

## Tech stack

- **Framework:** Next.js 14 (App Router)
- **UI:** React 18, inline styles
- **Storage:** Browser localStorage
- **External APIs:** Discord widget API (optional, for live online count)
- **Hosting:** Designed for Vercel (free tier handles this scale easily)

## Local development

Requires Node.js 18+.

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` for the Hub. `http://localhost:3000/codex` for the Codex.

## Deployment

See `DEPLOY.md` for a step-by-step guide.

The short version:

1. Push this folder to a new GitHub repo (public)
2. Import the repo at vercel.com
3. Click Deploy
4. (Optional) Connect a custom domain in Vercel project settings

## Customizing

### Products

Edit the `PRODUCTS` array near the top of `src/app/page.js`. Add or reorder products. Each entry needs a title, description, URL, format, and label.

### Socials

Edit the `SOCIALS` array in the same file.

### Discord

Update `DISCORD_INVITE` (just the code, not the full URL) and `DISCORD_TOTAL` in `src/app/page.js`.

For live online count to work, enable the widget in your Discord server: Server Settings → Widget → Enable Server Widget.

### Bio / tagline

Update the hero section in `src/app/page.js` — search for "In 2019 I died" to find the bio text.

### Self-Inquiry questions

Edit the `INQUIRY_QUESTIONS` array near the top of `src/components/ArchitectsCodex.jsx`. Each entry needs an id, pillar (0 for universal, 1-7 for specific), and text.

### Pillar content

Edit the `PILLARS` array in the same file.

## Future additions (when revenue allows)

- **AI Guide** — bring back the conversational AI guide via the Anthropic API. Cost: ~$0.01 per message.
- **Cross-device sync** — replace localStorage with Supabase. Free tier handles thousands of users.
- **Stripe Checkout** — sell digital products without Gumroad's 10% fees. 2.9% + 30¢ per transaction.
- **PWA installation** — installable as a phone app.

## License

All rights reserved. © Donald (Ascension Architect).

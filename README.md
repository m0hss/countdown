# Countdown

A public, dark-only launch-week template built with Next.js 16 App Router, Tailwind CSS v4, shadcn/ui primitives, Motion, and strict TypeScript. COUNTDOWN, the event, products, and all 20 seeded people are fictional. The presentation follows the supplied Stitch designs, with original local illustrations.

## Run locally

Use Node.js 20.9 or newer and pnpm 10.

```sh
pnpm install
pnpm dev
```

Open http://localhost:3000. **No environment variables, accounts, database, or Vercel linking are required.** Geist and Space Mono fonts ship locally with the installed packages; no font download is required during the build.

```sh
pnpm build
pnpm start
```

## Features

- Rolling countdown, five-day reveal timeline, and accessible FAQ.
- Personalized tickets with pointer tilt, holographic foil, and a gold finish every hundredth number.
- X, Bluesky, LinkedIn, and clipboard sharing, real portable-link QR codes, SVG downloads, and 1200 × 630 PNG exports.
- Calendar downloads, local session RSVPs, release bookmarks, and scripted keynote/stream previews.
- Interactive terminal and benchmark demos, ranking search, daily movers, and personal-rank navigation.
- Portable public ticket links, browser-local referrals, and a seeded leaderboard.
- MDX day articles, touch-friendly layouts down to 375px, and reduced-motion support.
- Friendly fallback states for missing tickets, failed GitHub avatars, unavailable storage, and clipboard failures.

## Customize

**`launch.config.ts`** owns the brand, site copy, event settings, FAQ, form messages, and accessibility labels. **`app/theme.css`** owns every color and visual token. Keep component copy and raw color values out of components.

The explicit content exceptions are `content/days/1.mdx` through `5.mdx` (reveal articles and their frontmatter) and `lib/fixtures.ts` (fictional registrations, authors, sessions, benchmark data, and scripted events). MDX is trusted repository content, not user-submitted content. Frontmatter requires `title`, `shortTitle`, `teaser`, `version`, `category`, `authorIds` (matching fictional author IDs), an ISO `revealAt` string, and a `media` artwork key: `orbit`, `layers`, `terminal`, `network`, or `spark`. These keys select local SVG artwork using theme colors.

### Dates

The default `timing: "evergreen"` opens on `previewDay: 3` at the browser's first visit: days 1–2 are revealed, day 3 is highlighted, and days 4–5 are locked. The other reveals retain their offsets from configured `startsAt`. The countdown targets the next reveal and reaches zero after the last one. The footer's **Reset demo** returns to day 3 and clears the local ticket, credits, timestamps, RSVPs, bookmarks, foil preference, and banner dismissal.

Set `timing: "fixed"` to follow `startsAt` and every MDX `revealAt` exactly. Update both together for a new event. Use explicit UTC ISO timestamps; display dates use the configured IANA timezone. Demo reveal locks are presentation, not access control: all bundled MDX is public.

## How the demo works

The server renders deterministic fixture content. After hydration, the browser restores the `countdown-demo-v1` storage record. Its internal schema is now version 2; legacy state migrates once to day 3 while retaining existing tickets, their original dates, and referral totals. New interaction fields are initialized safely. Unavailable storage falls back to in-memory state. A first claim creates the next local ticket number after the seeded tickets. Repeated claims reuse that ticket. Numbers are demo-local, not globally unique. The claim form validates email but never sends or stores it.

Personal tickets use `/t/local-…#ticket=…` URLs. Their versioned fragment contains the public name, optional GitHub username, ticket number, ID, and event start date. Email is excluded. Recipients can open the full link without storage or a backend. Fragments are public to anyone with the link and are not signed. Social link previews cannot read fragments; personalized details appear after the recipient opens the page. A seeded ticket such as `/t/demo-1` works without a fragment and demonstrates the gold variant.

Use **Join me. Get your ticket** on a ticket page to attribute a claim. Home-page `?ref=demo-1` links also work. The first successful claim credits the referrer once in the recipient's current browser. The leaderboard combines fixtures with those local credits; it does not synchronize across visitors or devices. The demo does not verify identities, prevent tampering, send email, or grant event access.

Fictional fixtures always use initials. Only a user-entered GitHub username requests `https://github.com/<username>.png`; initials remain visible if the image fails.

## Downloads and demo interactions

Ticket QR codes encode the full portable URL, including its public fragment. The Standard/Gold controls open seeded samples without changing issued tickets. PNG and SVG exports use locally bundled fonts and initials rather than remote avatars. QR generation (`qrcode`) and image export (`html-to-image`) are lazy-loaded. SVG exports embed HTML using `foreignObject`; use the PNG download for image editors that do not support it.

**Wallet preview** is a local preview with image and calendar downloads; it does not issue a signed Apple Wallet pass. Event and session `.ics` files use effective preview dates. RSVP, bookmarks, and foil preferences persist only in this browser. Keynote and stream controls play scripted local scenes; terminal and benchmark values are illustrative. Milestones at 5, 15, and 50 referrals are configurable reward previews with no physical fulfillment. Today's Movers combines fixture daily deltas with timestamped local credits for the configured timezone.

Configure optional GitHub, documentation, and community URLs in `launch.config.ts` under `destinations`. They are unset by default and open useful local information dialogs. Customize `previewDay`, event duration, release UI copy, and milestone definitions in the same file; edit sample session offsets and durations in `lib/fixtures.ts`. The Stitch source folder is reference material and is excluded from formatting.

## Optional environment variables

`lib/env.ts` reads environment variables on the server and exports `hasDb`, `hasRedis`, and `hasAI`. Zod validation never throws at import time. Blank strings count as absent. Canonical names take precedence over their aliases. Redis requires a valid HTTP(S) URL and nonempty token.

| Variable                   | Required? | Meaning                                                     |
| -------------------------- | --------- | ----------------------------------------------------------- |
| `DATABASE_URL`             | No        | PostgreSQL URL; falls back to `POSTGRES_URL`                |
| `POSTGRES_URL`             | No        | Database alias                                              |
| `KV_REST_API_URL`          | No        | Redis HTTP endpoint; falls back to `UPSTASH_REDIS_REST_URL` |
| `KV_REST_API_TOKEN`        | No        | Redis token; falls back to `UPSTASH_REDIS_REST_TOKEN`       |
| `UPSTASH_REDIS_REST_URL`   | No        | Redis URL alias                                             |
| `UPSTASH_REDIS_REST_TOKEN` | No        | Redis token alias                                           |
| `OPENAI_API_KEY`           | No        | Optional AI capability flag                                 |

**These are readiness flags, not service integrations.** Supplying credentials does not enable persistence, rate limits, or AI. The dismissible fixture-mode banner stays honest about that. A production service adapter, shared registration/referral storage, and server-side validation would be separate work. No admin password is required. No services are automatically provisioned.

## Deploy

Fork the repository and import the fork into Vercel (or another host with Next.js 16 support). Use the Next.js preset, `pnpm install --frozen-lockfile`, and `pnpm build`. Leave environment variables empty. Deploy as a Next.js application, not a static export: the routes render through the server. Vercel account access is needed only to deploy, not for local development.

## Verification

```sh
pnpm format:check
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
```

Browser tests start an isolated production server on port 3100. They cover 375px, 768px, 1024px, and 1440px layouts, accessibility, sharing into a clean browser, referrals, reveal timing, migration, reduced motion, unavailable browser APIs, calendars, local interactions, QR decoding, and exported files. Build before running browser tests.

## License

MIT. See [LICENSE](LICENSE).

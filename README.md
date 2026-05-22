# narrativo

An audiobook platform with synchronized text — think Audible meets Spotify lyrics. Browse, play, and follow along with narrated content word-by-word.
Built from the ground up: mobile app (Expo/React Native), web frontend (Astro), and serverless API (SST on AWS).

---
## Architecture
```
narrativo/                  # (booktube repo — original architecture)
├── phoneApp/               # Expo/React Native mobile app
│   ├── Audio player        # expo-av, background playback
│   ├── Stripe payments     # In-app purchases
│   ├── tRPC client         # Type-safe API communication
│   └── Carousel UI         # Browse & discover
├── web-astro/              # Astro + Tailwind marketing/web app
├── packages/
│   ├── core/               # Shared types, DB schema (Drizzle), business logic
│   └── functions/          # AWS Lambda functions (tRPC routers)
├── stacks/                 # SST infrastructure (AWS CDK)
└── sst.config.ts           # Serverless Stack config
```
| Layer | Stack |
|-------|-------|
| Mobile | Expo, React Native, expo-av, Stripe SDK, tRPC, React Query |
| Web | Astro, Tailwind CSS |
| API | SST (Serverless Stack), AWS Lambda, tRPC |
| Database | Drizzle ORM, PostgreSQL (via SST) |
| Infrastructure | AWS CDK, S3 (audio storage), Cognito (auth) |
---
## Features
- **Audiobook playback** — play, pause, seek, background audio
- **Synchronized text** — follow along with highlighted text as the narrator reads (Spotify-lyrics style)
- **Browse & discover** — carousel-based UI for browsing content
- **Payments** — Stripe in-app purchases for premium content
- **Ratings & reviews** — star rating widget
- **Cross-platform** — mobile (Expo) + web (Astro)
---
## Quick Start
### Prerequisites
- Node.js 18+
- AWS account (for SST deployment)
- Expo CLI
### Development
```bash
# Install dependencies
pnpm install
# Start SST dev environment (deploys to AWS live)
pnpm dev
# Start mobile app
cd phoneApp && npx expo start
# Start web app
cd web-astro && npm run dev
```
---
## Status
Audiobook platform with synchronized-text playback. Full-stack implementation with Expo mobile app, serverless backend, and Stripe integration. This is the original architecture — the `booktube` repo.
---
## License
MIT

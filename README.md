# OnboardBuddy

OnboardBuddy is a React/Next.js character-guided onboarding tour system.

It lets product teams guide users through an app with a cartoon-style character that points at real UI elements, supports configurable overlays, animations, first-time completion tracking, and future SaaS-powered remote configuration.

## Workspace

```txt
apps/demo        Next.js seller marketplace demo
apps/dashboard   Future SaaS dashboard placeholder
packages/react   Reusable React package
docs             Architecture, API, and roadmap notes
```

## Commands

```bash
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm build
```

`pnpm lint` currently runs TypeScript validation in each workspace. Full ESLint rules can be added once the project chooses a stable Next/ESLint configuration.

## MVP status

The first MVP focuses on local React configuration, a realistic seller dashboard demo, and an editor-like JSON/form preview. SaaS publishing, auth, billing, and hosted analytics are planned for later.

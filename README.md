# Sipariş Copilot Demo

Small frontend prototype for one operational workflow:

**incoming order message → structured order → human review of exceptions → ERP-ready JSON**

## Design direction

- Dense but clear operational UI
- Color is used to separate workflow states, not as decoration
- Familiar controls and predictable information hierarchy
- No AI gradients, magic labels, fake agents or filler copy
- Functional before decorative

## Run

```bash
npm install
npm run dev
```

## Current scope

- Example incoming order messages
- Local deterministic parsing and catalog matching
- Customer-specific pricing
- Stock and pack-size exceptions
- Inline operator editing
- ERP-ready JSON output

## Deliberately not included

- LLM/API calls
- WhatsApp or email integration
- ERP API integration
- Authentication/backend
- Analytics dashboard
- Autonomous agent behavior

The parser is intentionally replaceable. Once real customer messages arrive, plug an extraction model into `src/lib/parser.ts` without changing the operator workflow.

## GitHub Pages

The repository includes a GitHub Actions workflow that builds the Vite app and deploys `dist/` to GitHub Pages. In repository settings, set **Pages → Source → GitHub Actions** once if GitHub has not already enabled it.

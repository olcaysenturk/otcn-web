# OTCN – Architecture & Usage Guide

This project delivers a single-page OTC (Over-the-Counter) experience built on Next.js App Router with Tailwind CSS, Zustand, React Hook Form, and other modern tooling. Below is a concise guide to the architecture, component relationships, and day-to-day workflow.

## Tech Stack
- **Next.js 16 / React 19** – App Router, server components, `next/font`.
- **TypeScript** – Strict typing (`strict: true`).
- **Tailwind CSS v4 + @tailwindcss/postcss** – Themed, utility-first styling.
- **Zustand** – Lightweight store for sharing form data on the client.
- **react-hook-form + zod** – Form state and validation.
- **Radix UI + lucide-react** – Accessible UI primitives and icons.

## Folder Structure (quick view)
```
src/
├─ app/                         # App Router
│  ├─ layout.tsx, page.tsx      # Global shell + / → /tr redirect
│  ├─ globals.css               # Tailwind entry
│  └─ [locale]/                 # Locale segment
│     ├─ layout.tsx             # Locale shell (AppShell, i18n)
│     ├─ (site)/layout.tsx      # Site pages layout
│     ├─ (site)/page.tsx        # Homepage (Hero, 3 steps, testimonials, FAQ)
│     └─ auth/...               # Auth flow (login, activation, etc.)
├─ components/
│  ├─ home/                     # Hero, 3-step, Testimonials, FAQ
│  ├─ auth/                     # AuthLayout, LoginForm, LoginShowcase, step UIs
│  ├─ application-form/         # Application form UI + validation hooks
│  ├─ application/              # Application tabs
│  ├─ layout/                   # AppShell, TopBar, Footer, locale switcher
│  └─ ui/                       # Button, Input, Select, Accordion, and other atoms
├─ config/                      # Static menu configs
├─ data/                        # View data (e.g., tab configs)
├─ lib/
│  ├─ api/serverFetch.ts        # Server-side fetch wrapper
│  ├─ hooks/                    # Shared React hooks
│  ├─ i18n/                     # Locale config and message loader
│  ├─ theme/                    # Theme helpers and effects
│  ├─ utils/                    # Helpers (cn, currency)
│  └─ validation/               # zod schemas
└─ stores/                      # Zustand stores (e.g., useApplicationStore)
```

## API Access
- `serverFetch(path, opts)` standardizes server-side `fetch`:
  - Reads `access_token` from `cookies()` and sets the `Authorization` header.
  - Adds `Content-Type: application/json` by default (override via `opts.headers` if needed).
  - Uses `cache: "no-store"` and returns the raw `Response` for non-JSON bodies.
- Use it with any HTTP verb, e.g. `serverFetch("/endpoint", { method: "POST", body: JSON.stringify(...) })`.

## Decimal Formatting (Binance style)
We format coin values using `decimal.ts` with Binance-like rules:
- Thousands separator is `,` and decimal separator is `.`
- Trailing zeros are trimmed
- Minimum decimals: `0.00`
- Maximum decimals: from API precision (`displayPrecision` or `precision`)

Helpers:
- `formatDecimalValue(decimalValue, { minDecimals: 2 })`
- `formatDecimalFromString(raw, precision, { minDecimals: 2 })`

Example usage:
```ts
import { D } from "@/lib/math/decimal";
import { formatDecimalFromString, formatDecimalValue } from "@/lib/math/formatDecimal";

const precision = asset.displayPrecision ?? asset.precision ?? 0;
const formattedAmount = formatDecimalFromString(asset.amount, precision, { minDecimals: 2 });

const sum = D.add(D.parse("1.5", precision), D.parse("0.25", precision), precision);
const formattedSum = formatDecimalValue(sum, { minDecimals: 2 });
```

## Development & Commands
```bash
npm install        # Install dependencies
npm run dev        # Start dev server at http://localhost:3000
npm run build      # Production build
npm run start      # Run the built output
npm run lint       # ESLint
```

### Environment Variables
- Define at least `API_BASE_URL` in `.env.local`; `serverFetch` targets this base for all requests.

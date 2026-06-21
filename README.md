# Asfar Trip ✈️🏨🛡️

Online travel platform for booking flights, hotels, and travel insurance — built with **Next.js 15.5.7** (App Router) and plain **JavaScript** (no TypeScript).

## Tech Stack

- **Framework:** Next.js 15.5.7 (App Router, Turbopack)
- **UI:** Radix UI + Shadcn components, Tailwind CSS 4, Framer Motion
- **Auth:** NextAuth.js v5 (Google OAuth + OTP)
- **i18n:** next-intl (Arabic & English)
- **State:** Zustand
- **Payment:** Telr gateway integration

## Requirements

- **Node.js** ≥ 18
- **npm** (comes with Node.js)

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Copy the environment template and fill in your values
cp .env.example .env.local

# 3. Start the dev server
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
├── [locale]/            # i18n routing (ar/en)
├── api/                 # 45 API route handlers
├── _modules/            # Feature modules:
│   ├── flight/          # ✈️ Search, booking, results, status
│   ├── hotels/          # 🏨 Search, details, booking, status
│   ├── insurance/       # 🛡️ Quotes, purchase, documents
│   ├── payment/         # 💳 Telr payment flow & status check
│   ├── loyalty/         # ⭐ Points balance, tiers, config
│   ├── profile/         # 👤 User profile & saved travellers
│   ├── auth/            # 🔐 OTP & Google OAuth
│   ├── config/          # ⚙️ App-wide configuration
│   ├── currency/        # 💱 Currency switching
│   ├── language/        # 🌐 Language switcher
│   ├── offers/          # 🎁 Special offers
│   └── theme/           # 🎨 Dark/light mode
├── _components/         # Shared UI components
├── _libs/               # Core: auth, SEO, token manager, fonts
├── _hooks/              # Global React hooks
├── _services/           # API service layers
└── _helpers/            # Utility helpers
components/ui/           # Shadcn UI primitives
i18n/                    # next-intl routing & config
middleware.js            # Locale routing middleware
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

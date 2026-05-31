# SlotSync

Smart Booking for Modern Businesses. The all-in-one platform that helps service businesses manage appointments, payments, and client relationships effortlessly.

## 🚀 Tech Stack

- **Monorepo:** [Turborepo](https://turbo.build/repo)
- **Frontend (Web):** [Next.js 14](https://nextjs.org/) (App Router), React, Tailwind CSS, shadcn/ui
- **Backend (API):** [Hono](https://hono.dev/)
- **Database:** PostgreSQL + [Prisma](https://www.prisma.io/)
- **Authentication:** [Supabase Auth](https://supabase.com/auth)
- **Payments:** [Stripe Connect](https://stripe.com/connect)
- **Background Jobs:** [Inngest](https://www.inngest.com/)
- **Email/SMS:** [Resend](https://resend.com/) / [Twilio](https://www.twilio.com/)
- **Analytics & Logging:** [PostHog](https://posthog.com/) / [Axiom](https://axiom.co/)

## 🏗️ Project Structure

This is a Turborepo monorepo with the following structure:

```
slotsync/
├── apps/
│   ├── web/          # Next.js 14 frontend + dashboard
│   └── api/          # Hono backend API
└── packages/
    ├── database/     # Prisma schema, migrations, and client
    ├── ui/           # Shared shadcn/ui components
    ├── config/       # Shared eslint, typescript, tailwind configs
    └── types/        # Shared TypeScript types
```

## ⚙️ Local Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd slotsync
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   - Copy `.env.example` to `.env.local` in `apps/web/`
   - Copy `.env.example` to `.env` in `apps/api/`
   - Fill in all the required environment variables (Supabase, Stripe, etc.)

4. **Database Setup**
   ```bash
   npm run db:generate
   npm run db:push
   # Or using migrations:
   # npm run db:migrate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   This command uses Turborepo to start both applications simultaneously:
   - Web App runs on: `http://localhost:3000`
   - API runs on: `http://localhost:3001`

## 🚀 Deployment

- **Web App (Next.js):** Recommended to deploy on [Vercel](https://vercel.com). Just connect the repository, set the root directory to `apps/web` (or let Vercel auto-detect Turborepo), and add the environment variables.
- **API (Hono):** Recommended to deploy on [Railway](https://railway.app), Fly.io, or any Node.js compatible hosting. Ensure the `Start Command` is set to `npm run start` and the database URL is correctly configured.

## 🗄️ Database Management

Run these commands from the root directory:

- `npm run db:migrate` - Run Prisma migrations
- `npm run db:generate` - Generate Prisma Client
- `npm run db:studio` - Open Prisma Studio to view and edit data

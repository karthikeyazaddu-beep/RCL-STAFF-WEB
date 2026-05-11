# RCL Staff Portal

A full-stack staff management portal for the RCL Discord moderation team, featuring Discord OAuth login, application review, staff profiles, file library, and an AI chatbot.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/rcl-portal run dev` — run the frontend (dynamic port)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run typecheck:libs` — rebuild shared lib type declarations
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Required secrets: `DISCORD_CLIENT_SECRET`, `SESSION_SECRET`, `OPENROUTER_API_KEY`
- Required env vars: `DISCORD_CLIENT_ID=1503024519034568876`, `OWNER_DISCORD_ID=1437416199603621998`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS v4, shadcn/ui, wouter, framer-motion, TanStack Query
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec → React Query hooks + Zod schemas)
- Build: esbuild (CJS bundle)
- AI: OpenRouter via OpenAI SDK (`openai/gpt-4o-mini`)

## Where things live

- `lib/api-spec/openapi.yaml` — source of truth for all API contracts
- `lib/db/src/schema/` — Drizzle ORM table definitions (users, applications, staff_profiles, files, chat_messages)
- `lib/api-client-react/src/generated/` — Orval-generated React Query hooks and Zod schemas
- `artifacts/api-server/src/routes/` — Express route handlers (auth, applications, staff, files, chat)
- `artifacts/api-server/src/lib/` — auth guards, session config, logger
- `artifacts/rcl-portal/src/pages/` — React pages (Login, Apply, Dashboard, Applications, Staff, Files, Chat, Admin)
- `artifacts/rcl-portal/src/contexts/AuthContext.tsx` — global auth state
- `artifacts/api-server/uploads/` — multer file storage

## Architecture decisions

- **Discord OAuth callback uses dynamic redirect URI** from `x-forwarded-host`/`x-forwarded-proto` headers so it works on both Replit dev and custom domains without hardcoding.
- **Owner role** is auto-assigned on first login by matching `OWNER_DISCORD_ID` env var; no DB seed needed.
- **Blacklist duration is hardcoded to 10 days** from the application timestamp, auto-expires in the `/auth/me` endpoint.
- **File upload is done with raw fetch** (not generated hook) because the OpenAPI spec omits binary upload to avoid `File`/`Blob` TypeScript portability issues.
- **Session uses `sameSite: none` in production** (Replit proxy requires cross-origin cookies); `lax` in dev.
- **AI chatbot reads uploaded text files** as supplementary context in the system prompt (up to 3 files, 3000 chars each).

## Product

- **Login**: Discord OAuth sign-in, redirected to application form if not yet a staff member
- **Application system**: Staff submit access requests; HICOM+ can approve (with role), decline, or blacklist for 10 days
- **Dashboard**: Quick stats and navigation for approved staff
- **Staff directory**: View and manage staff profiles; HICOM+ can add/edit/delete profiles
- **File library**: Upload and download PDFs and documents; HICOM+ can upload/delete
- **AI Assistant**: Chat with an AI trained on RCL moderation procedures, with staff documents as context
- **Admin panel**: Owner-only role management across all staff

## Role Hierarchy

Owner > HICOM > Head Mod > Senior Mod > Moderator > Trial Mod

- Owner: Full access including Admin panel
- HICOM+: Application review, staff management, file upload
- All approved staff: Dashboard, staff directory, file download, AI chat

## User preferences

- Dark military/ops theme (navy dark background, blue primary accent)
- No emojis in UI unless explicitly requested

## Gotchas

- Run `pnpm run typecheck:libs` after any `lib/db` schema change before typechecking the API server
- The `OWNER_DISCORD_ID` must be set before the owner first logs in, or they'll get the `none` role
- Discord OAuth app must have the callback URL whitelisted: `https://<domain>/api/auth/callback`
- File uploads go to `artifacts/api-server/uploads/` — this directory is ephemeral in deployed environments; consider object storage for production

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details

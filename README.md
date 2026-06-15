# Kanban Flux

A fullstack Trello-style Kanban board with media attachments and AI-powered task extraction.

**Live demo:** https://kanban-flux.vercel.app

Built with Next.js 14 (App Router + Server Actions), Prisma, PostgreSQL, Clerk, Stripe, Azure Blob Storage, and a Python/spaCy ML backend.

## What it does

Kanban Flux lets organizations manage work on drag-and-drop boards, just like Trello:

- **Organizations & auth** — Sign in with Clerk and work inside multi-tenant organizations. Each board, list, and card is scoped to the active org.
- **Boards, lists & cards** — Create, rename, copy, reorder, and delete boards, lists, and cards. Drag-and-drop (via `@hello-pangea/dnd`) keeps the order in sync, and every change is persisted through Next.js Server Actions in `actions/`.
- **Custom board backgrounds** — Pick a board cover image from Unsplash.
- **Media attachments** — Attach images/video to cards. Files are uploaded directly to **Azure Blob Storage** using short-lived SAS tokens minted by `app/api/upload`, and the blobs are cleaned up automatically when a card is deleted (`actions/delete-card`).
- **AI task extraction** — Paste a block of free-form text (notes, a meeting summary, an email) and the app turns it into structured cards. The Next.js route `app/api/extract-tasks` forwards the text to the Python ML backend, which uses **spaCy** to split sentences, detect assignees (PERSON) and deadlines (DATE) via NER, infer priority from keywords, and build a clean actionable title from the dependency parse.
- **Audit log** — Every create/update/delete is recorded as an `AuditLog` entry per organization.
- **Billing** — Free orgs are capped at a limited number of boards (`OrgLimit`); upgrading to **Stripe**-backed Pro removes the cap (`OrgSubscription`, handled via `app/api/webhook` and `actions/stripe-redirect`).

## Architecture

| Layer | Tech |
| --- | --- |
| Frontend & API | Next.js 14 (App Router, Server Actions, React 18, Tailwind, shadcn/Radix UI) |
| Auth | Clerk (organizations) |
| Database | PostgreSQL via Prisma (`prisma/schema.prisma`) |
| File storage | Azure Blob Storage (SAS-token uploads) |
| Images | Unsplash API |
| Payments | Stripe |
| ML backend | Python · Flask · spaCy (`ml-backend/`), deployable via Docker / Render |

### Repository layout

```
actions/        Server Actions (create/update/delete/copy/reorder boards, lists, cards)
app/            Next.js App Router — marketing pages, dashboard, and API routes
  api/upload         Mints Azure SAS tokens for direct media uploads
  api/extract-tasks  Proxies text to the ML backend and returns extracted tasks
  api/webhook        Stripe webhook handler
components/     UI components (shadcn/Radix)
lib/            Shared server helpers (db, auth, etc.)
prisma/         Database schema
ml-backend/     Flask + spaCy task-extraction service
```

## Getting started

### Prerequisites

- **Node 18.x**
- **PostgreSQL** database
- (Optional, for AI task extraction) **Python 3.10+**

### 1. Clone & install

```shell
git clone <repo-url>
cd Kanbanflux
npm install
```

### 2. Configure environment

Create a `.env` file in the project root:

```js
# Clerk auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=

# Database (PostgreSQL)
DATABASE_URL=
DIRECT_URL=

# Unsplash (board cover images)
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=

# Stripe billing
STRIPE_API_KEY=
STRIPE_WEBHOOK_SECRET=

# App
NEXT_PUBLIC_APP_URL=

# Azure Blob Storage (media uploads)
AZURE_STORAGE_ACCOUNT_NAME=
AZURE_STORAGE_ACCOUNT_KEY=
AZURE_STORAGE_CONTAINER_NAME=
AZURE_STORAGE_CONNECTION_STRING=

# ML backend (defaults to http://localhost:5001)
ML_BACKEND_URL=
```

### 3. Set up the database

```shell
npx prisma generate
npx prisma db push
```

### 4. Run the app

```shell
npm run dev
```

## Running the ML backend (optional)

The AI task-extraction feature needs the Flask/spaCy service in `ml-backend/`.

```shell
cd ml-backend
pip install -r requirements.txt
python -m spacy download en_core_web_sm
python app.py            # serves on http://localhost:5001
```

For production, the service ships with a `Dockerfile` and `render.yaml`, and runs under gunicorn:

```shell
gunicorn app:app --bind 0.0.0.0:$PORT --workers 1 --timeout 60 --preload
```

Set `CORS_ORIGINS` to your frontend URL and point the Next.js app at the deployed backend via `ML_BACKEND_URL`.

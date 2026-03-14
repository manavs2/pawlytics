# Pawlytics

Dog health passport and preventative care platform. Track vaccinations, organize medical records, manage preventative care schedules, and share a digital health passport with vets, boarding facilities, or caregivers.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL
- **ORM**: Prisma v7
- **Auth**: Auth.js (next-auth v5)
- **Storage**: AWS S3 (presigned URLs)
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL running locally (or a remote instance)
- (Optional) AWS S3 bucket for document uploads

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env` and fill in your values:

```bash
cp .env .env.local
```

Required variables:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | Random secret (min 32 chars). Generate with `openssl rand -base64 32` |
| `AUTH_URL` | App URL (e.g., `http://localhost:3000`) |
| `AWS_REGION` | AWS region for S3 |
| `AWS_ACCESS_KEY_ID` | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key |
| `S3_BUCKET_NAME` | S3 bucket name |

### 3. Set up database

```bash
npx prisma migrate dev --name init
```

### 4. Generate Prisma client

```bash
npx prisma generate
```

### 5. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/              # Next.js App Router pages and API routes
│   ├── (auth)/       # Login/signup (centered card layout)
│   ├── (app)/        # Authenticated pages (navbar layout)
│   ├── passport/     # Public shareable passport
│   └── api/          # API routes (auth, documents)
├── actions/          # Server actions (dogs, care, vaccinations, etc.)
├── components/       # React components
│   ├── ui/           # Design system primitives
│   ├── layout/       # Navbar, page header
│   ├── dogs/         # Dog profile components
│   ├── care/         # Preventative care components
│   ├── vaccinations/ # Vaccination tracking
│   ├── documents/    # Document management
│   └── passport/     # Shareable passport
├── lib/              # Core libraries
│   ├── auth.ts       # Auth.js configuration
│   ├── prisma.ts     # Database client
│   ├── s3.ts         # AWS S3 helpers
│   ├── care-rules.ts # Preventative care rules engine
│   ├── care-scheduler.ts # Care event generator
│   ├── breeds.ts     # Breed data (size, traits)
│   ├── validations.ts # Zod schemas
│   └── utils.ts      # Shared utilities
└── types/            # TypeScript type definitions
```

## Key Features

- **Dog Profiles**: Create and manage profiles for multiple dogs
- **Smart Care Plans**: Auto-generated preventative care schedules based on breed, age, and traits
- **Vaccination Tracking**: Log vaccines with expiration and booster date tracking
- **Document Management**: Upload medical documents (PDFs, images) via S3
- **Shareable Passport**: Generate public read-only links to share health summaries

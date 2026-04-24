# Moments

A minimal public writing timeline built with `Next.js 16`, `Better Auth`, `Drizzle`, `Supabase Postgres`, `shadcn/ui`, and `Tiptap`.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FwangqiyangX%2Fmoments.qiyang.dev&project-name=moments-qiyang-dev&repository-name=moments.qiyang.dev&env=BETTER_AUTH_SECRET,BETTER_AUTH_URL&envDescription=Better%20Auth%20settings.%20Use%20the%20Vercel%20Supabase%20integration%20for%20Postgres%2C%20or%20manually%20add%20DATABASE_URL.&envLink=https%3A%2F%2Fgithub.com%2FwangqiyangX%2Fmoments.qiyang.dev%23environment-variables)

Users can browse published moments on the homepage, sign in with email and password, and create new moments directly from the same page. Each published moment also supports likes.

## Features

- Public homepage timeline
- Email/password authentication with Better Auth
- Homepage composer powered by Tiptap
- Postgres persistence via Drizzle ORM
- Dark mode with `next-themes`
- Simple like button for published moments

## Stack

- `Next.js 16` App Router
- `React 19`
- `Better Auth`
- `Drizzle ORM`
- `Supabase Postgres`
- `shadcn/ui`
- `Tiptap`
- `Tailwind CSS v4`

## Getting Started

### 1. Install dependencies

```bash
bun install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:

- `DATABASE_URL` or `POSTGRES_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`

### 3. Run database migrations

```bash
bun run db:migrate
```

### 4. Start the development server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `bun run dev` - start the development server
- `bun run lint` - run ESLint
- `bun run build` - create a production build
- `bun run db:generate` - generate Drizzle migrations
- `bun run db:migrate` - apply Drizzle migrations
- `bun run auth:generate` - regenerate Better Auth schema output

## Environment Variables

See [`./.env.example`](./.env.example).

## Deploy to Vercel

Click the deploy button at the top of this README to clone this repository into your Git provider and create a Vercel project.

For the database, use the [Supabase integration for Vercel](https://vercel.com/marketplace/supabase). It can create or connect a Supabase project and sync Postgres environment variables such as `POSTGRES_URL` to the Vercel project automatically.

During setup, Vercel will ask for:

- `BETTER_AUTH_SECRET` - a long random secret for Better Auth
- `BETTER_AUTH_URL` - the production URL for the deployed app, for example `https://your-project.vercel.app`

If you do not use the Supabase integration, manually add `DATABASE_URL` in Vercel Project Settings.

After the first deploy, run the database migrations against the same database URL:

```bash
bun run db:migrate
```

## Project Structure

```text
app/                  Next.js routes
components/           UI and feature components
drizzle/              SQL migrations and snapshots
lib/                  auth, db, data access, and server actions
```

## Development Notes

- The homepage is public.
- Only signed-in users can create new moments.
- Newly created moments are published immediately.
- `publishedAt` is assigned automatically on the server.

## Contributing

Please read [`CONTRIBUTING.md`](./CONTRIBUTING.md) before opening a pull request.

## Security

Please read [`SECURITY.md`](./SECURITY.md) for responsible disclosure guidance.

## License

MIT. See [`LICENSE`](./LICENSE).

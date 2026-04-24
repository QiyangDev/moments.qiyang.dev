# Contributing

Thanks for considering a contribution.

## Development Setup

1. Install dependencies with `bun install`
2. Copy `.env.example` to `.env.local`
3. Configure a working Postgres database
4. Run `bun run db:migrate`
5. Start the app with `bun run dev`

## Before Opening a Pull Request

- Run `bun run lint`
- Run `bun run build`
- Keep changes focused and easy to review
- Update docs when behavior or setup changes

## Pull Request Guidelines

- Describe the problem and the approach clearly
- Include screenshots or recordings for UI changes when helpful
- Mention any migration or environment variable changes explicitly

## Scope

Please avoid unrelated refactors in the same pull request unless they are necessary to complete the change safely.

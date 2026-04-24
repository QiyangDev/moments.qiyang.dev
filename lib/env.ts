type RequiredEnvVar =
  | "DATABASE_URL"
  | "BETTER_AUTH_SECRET"
  | "BETTER_AUTH_URL";

function readRequiredEnv(name: RequiredEnvVar) {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Check .env.local or your deployment settings.`,
    );
  }

  return value;
}

function readDatabaseUrl() {
  const value = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

  if (!value) {
    throw new Error(
      "Missing required environment variable: DATABASE_URL or POSTGRES_URL. Check .env.local or your deployment settings.",
    );
  }

  return value;
}

export function getAuthEnv() {
  return {
    databaseUrl: readDatabaseUrl(),
    betterAuthSecret: readRequiredEnv("BETTER_AUTH_SECRET"),
    betterAuthUrl: readRequiredEnv("BETTER_AUTH_URL"),
  };
}

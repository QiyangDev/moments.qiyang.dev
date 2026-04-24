import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

import { normalizeDatabaseUrl } from "./lib/db/connection-url";
import { getAuthEnv } from "./lib/env";

loadEnvConfig(process.cwd());

const { databaseUrl } = getAuthEnv();

export default defineConfig({
  out: "./drizzle",
  schema: "./lib/db/schema/*.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: normalizeDatabaseUrl(databaseUrl),
  },
});

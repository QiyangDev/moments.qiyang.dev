import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { getAuthEnv } from "../env";
import { normalizeDatabaseUrl } from "./connection-url";
import * as authSchema from "./schema/auth-schema";
import * as momentsSchema from "./schema/moments-schema";

const { databaseUrl } = getAuthEnv();

export const sql = postgres(normalizeDatabaseUrl(databaseUrl), {
  prepare: false,
});

export const db = drizzle(sql, {
  schema: {
    ...authSchema,
    ...momentsSchema,
  },
});

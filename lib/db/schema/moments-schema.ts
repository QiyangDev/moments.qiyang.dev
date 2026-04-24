import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  integer,
} from "drizzle-orm/pg-core";

export const moments = pgTable(
  "moments",
  {
    id: text("id").primaryKey(),
    content: text("content").notNull(),
    likeCount: integer("like_count").default(0).notNull(),
    publishedAt: timestamp("published_at").notNull(),
    isPublished: boolean("is_published").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("moments_published_at_idx").on(table.publishedAt)],
);

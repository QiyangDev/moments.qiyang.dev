import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { user } from "./auth-schema";

export const moments = pgTable(
  "moments",
  {
    id: text("id").primaryKey(),
    authorId: text("author_id").references(() => user.id, {
      onDelete: "set null",
    }),
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
  (table) => [
    index("moments_author_id_idx").on(table.authorId),
    index("moments_published_at_idx").on(table.publishedAt),
  ],
);

export const momentsRelations = relations(moments, ({ one }) => ({
  author: one(user, {
    fields: [moments.authorId],
    references: [user.id],
  }),
}));

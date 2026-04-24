import { and, desc, eq, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";

import { db } from "@/lib/db";
import { moments } from "@/lib/db/schema/moments-schema";

export type MomentInput = {
  content: string;
  publishedAt: Date;
  isPublished: boolean;
};

export type CreateMomentInput = MomentInput & {
  authorId: string;
};

export async function listPublishedMoments() {
  return db.query.moments.findMany({
    where: eq(moments.isPublished, true),
    orderBy: desc(moments.publishedAt),
    with: {
      author: true,
    },
  });
}

export async function listAllMoments() {
  return db.query.moments.findMany({
    orderBy: desc(moments.publishedAt),
  });
}

export async function getMomentById(id: string) {
  return db.query.moments.findFirst({
    where: eq(moments.id, id),
  });
}

export async function createMoment(input: CreateMomentInput) {
  const [moment] = await db
    .insert(moments)
    .values({
      id: randomUUID(),
      ...input,
    })
    .returning();

  return moment;
}

export async function updateMoment(id: string, input: MomentInput) {
  const [moment] = await db
    .update(moments)
    .set(input)
    .where(eq(moments.id, id))
    .returning();

  return moment;
}

export async function deleteMoment(id: string, authorId: string) {
  const [moment] = await db
    .delete(moments)
    .where(and(eq(moments.id, id), eq(moments.authorId, authorId)))
    .returning({ id: moments.id });

  return moment;
}

export async function incrementMomentLikeCount(id: string, amount = 1) {
  const [moment] = await db
    .update(moments)
    .set({
      likeCount: sql`${moments.likeCount} + ${amount}`,
    })
    .where(and(eq(moments.id, id), eq(moments.isPublished, true)))
    .returning({ likeCount: moments.likeCount });

  return moment;
}

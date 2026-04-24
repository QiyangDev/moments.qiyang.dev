ALTER TABLE "moments" ADD COLUMN "author_id" text;--> statement-breakpoint
ALTER TABLE "moments" ADD CONSTRAINT "moments_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "moments_author_id_idx" ON "moments" USING btree ("author_id");
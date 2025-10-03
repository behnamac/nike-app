import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").notNull(),
  userId: uuid("user_id").notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Relations will be defined in the relations.ts file to avoid circular imports

// Zod validation schemas
export const reviewSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  userId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().nullable(),
  createdAt: z.date(),
});

export const newReviewSchema = reviewSchema.omit({ id: true, createdAt: true });

export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;

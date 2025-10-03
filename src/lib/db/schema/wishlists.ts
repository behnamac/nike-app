import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

export const wishlists = pgTable("wishlists", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  productId: uuid("product_id").notNull(),
  addedAt: timestamp("added_at").notNull().defaultNow(),
});

// Relations will be defined in the relations.ts file to avoid circular imports

// Zod validation schemas
export const wishlistSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  productId: z.string().uuid(),
  addedAt: z.date(),
});

export const newWishlistSchema = wishlistSchema.omit({
  id: true,
  addedAt: true,
});

export type Wishlist = typeof wishlists.$inferSelect;
export type NewWishlist = typeof wishlists.$inferInsert;

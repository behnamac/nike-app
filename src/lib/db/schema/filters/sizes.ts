import { pgTable, uuid, varchar, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { z } from "zod";

export const sizes = pgTable("sizes", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 20 }).notNull(), // e.g., "S", "M", "L", "10", "10.5"
  slug: varchar("slug", { length: 20 }).notNull().unique(), // e.g., "s", "m", "l", "10", "10-5"
  sortOrder: integer("sort_order").notNull().default(0), // for ordering: S < M < L
});

export const sizesRelations = relations(sizes, ({ many }) => ({
  productVariants: many(productVariants),
}));

// Zod validation schemas
export const sizeSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(20),
  slug: z.string().min(1).max(20),
  sortOrder: z.number().int().min(0),
});

export const newSizeSchema = sizeSchema.omit({ id: true });

export type Size = typeof sizes.$inferSelect;
export type NewSize = typeof sizes.$inferInsert;

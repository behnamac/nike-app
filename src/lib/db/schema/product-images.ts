import { pgTable, uuid, varchar, integer, boolean } from "drizzle-orm/pg-core";
import { z } from "zod";

export const productImages = pgTable("product_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").notNull(),
  variantId: uuid("variant_id"), // Optional - for variant-specific images
  url: varchar("url", { length: 500 }).notNull(),
  sortOrder: integer("sort_order").notNull().default(0), // for gallery ordering
  isPrimary: boolean("is_primary").notNull().default(false),
});

// Relations will be defined in the relations.ts file to avoid circular imports

// Zod validation schemas
export const productImageSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  variantId: z.string().uuid().nullable(),
  url: z.string().url().max(500),
  sortOrder: z.number().int().min(0),
  isPrimary: z.boolean(),
});

export const newProductImageSchema = productImageSchema.omit({ id: true });

export type ProductImage = typeof productImages.$inferSelect;
export type NewProductImage = typeof productImages.$inferInsert;

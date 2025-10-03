import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { z } from "zod";

export const brands = pgTable("brands", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(), // e.g., "Nike", "Adidas", "Puma"
  slug: varchar("slug", { length: 100 }).notNull().unique(), // e.g., "nike", "adidas", "puma"
  logoUrl: varchar("logo_url", { length: 500 }), // Optional logo URL
});

// Relations will be defined in the relations.ts file to avoid circular imports

// Zod validation schemas
export const brandSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  logoUrl: z.string().url().max(500).nullable(),
});

export const newBrandSchema = brandSchema.omit({ id: true });

export type Brand = typeof brands.$inferSelect;
export type NewBrand = typeof brands.$inferInsert;

import { pgTable, uuid, varchar, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  categoryId: uuid("category_id").notNull(),
  genderId: uuid("gender_id").notNull(),
  brandId: uuid("brand_id").notNull(),
  isPublished: boolean("is_published").notNull().default(false),
  defaultVariantId: uuid("default_variant_id"), // Will reference product_variants.id
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Relations will be defined in the relations.ts file to avoid circular imports

// Zod validation schemas
export const productSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().nullable(),
  categoryId: z.string().uuid(),
  genderId: z.string().uuid(),
  brandId: z.string().uuid(),
  isPublished: z.boolean(),
  defaultVariantId: z.string().uuid().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const newProductSchema = productSchema.omit({ id: true, createdAt: true, updatedAt: true });

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

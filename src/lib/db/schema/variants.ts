import { pgTable, uuid, varchar, numeric, integer, real, jsonb, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

export const productVariants = pgTable("product_variants", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").notNull(),
  sku: varchar("sku", { length: 100 }).notNull().unique(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  salePrice: numeric("sale_price", { precision: 10, scale: 2 }),
  colorId: uuid("color_id").notNull(),
  sizeId: uuid("size_id").notNull(),
  inStock: integer("in_stock").notNull().default(0),
  weight: real("weight"), // in kg
  dimensions: jsonb("dimensions"), // { length, width, height } in cm
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Relations will be defined in the relations.ts file to avoid circular imports

// Zod validation schemas
export const dimensionsSchema = z.object({
  length: z.number().positive(),
  width: z.number().positive(),
  height: z.number().positive(),
});

export const productVariantSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  sku: z.string().min(1).max(100),
  price: z.number().positive(),
  salePrice: z.number().positive().nullable(),
  colorId: z.string().uuid(),
  sizeId: z.string().uuid(),
  inStock: z.number().int().min(0),
  weight: z.number().positive().nullable(),
  dimensions: dimensionsSchema.nullable(),
  createdAt: z.date(),
});

export const newProductVariantSchema = productVariantSchema.omit({ id: true, createdAt: true });

export type ProductVariant = typeof productVariants.$inferSelect;
export type NewProductVariant = typeof productVariants.$inferInsert;

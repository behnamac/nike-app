import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

export const collections = pgTable("collections", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(), // e.g., "Summer '25", "New Arrivals"
  slug: varchar("slug", { length: 100 }).notNull().unique(), // e.g., "summer-25", "new-arrivals"
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const productCollections = pgTable("product_collections", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").notNull(),
  collectionId: uuid("collection_id").notNull(),
});

// Relations will be defined in the relations.ts file to avoid circular imports

// Zod validation schemas
export const collectionSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  createdAt: z.date(),
});

export const newCollectionSchema = collectionSchema.omit({
  id: true,
  createdAt: true,
});

export const productCollectionSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  collectionId: z.string().uuid(),
});

export const newProductCollectionSchema = productCollectionSchema.omit({
  id: true,
});

export type Collection = typeof collections.$inferSelect;
export type NewCollection = typeof collections.$inferInsert;
export type ProductCollection = typeof productCollections.$inferSelect;
export type NewProductCollection = typeof productCollections.$inferInsert;

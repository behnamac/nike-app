import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { z } from "zod";

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  parentId: uuid("parent_id"), // Self-referencing for hierarchical structure
});

// Relations will be defined in the relations.ts file to avoid circular imports

// Zod validation schemas
export const categorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  parentId: z.string().uuid().nullable(),
});

export const newCategorySchema = categorySchema.omit({ id: true });

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

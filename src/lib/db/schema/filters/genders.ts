import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { z } from "zod";

export const genders = pgTable("genders", {
  id: uuid("id").primaryKey().defaultRandom(),
  label: varchar("label", { length: 50 }).notNull(), // e.g., "Men", "Women", "Kids"
  slug: varchar("slug", { length: 50 }).notNull().unique(), // e.g., "men", "women", "kids"
});

export const gendersRelations = relations(genders, ({ many }) => ({
  products: many(products),
}));

// Zod validation schemas
export const genderSchema = z.object({
  id: z.string().uuid(),
  label: z.string().min(1).max(50),
  slug: z.string().min(1).max(50),
});

export const newGenderSchema = genderSchema.omit({ id: true });

export type Gender = typeof genders.$inferSelect;
export type NewGender = typeof genders.$inferInsert;

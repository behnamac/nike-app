import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { z } from "zod";

export const colors = pgTable("colors", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 50 }).notNull(), // e.g., "Red", "Blue", "Black"
  slug: varchar("slug", { length: 50 }).notNull().unique(), // e.g., "red", "blue", "black"
  hexCode: varchar("hex_code", { length: 7 }).notNull(), // e.g., "#FF0000"
});

// Relations will be defined in the main index file to avoid circular imports

// Zod validation schemas
export const colorSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(50),
  slug: z.string().min(1).max(50),
  hexCode: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color code"),
});

export const newColorSchema = colorSchema.omit({ id: true });

export type Color = typeof colors.$inferSelect;
export type NewColor = typeof colors.$inferInsert;

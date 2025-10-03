import { pgTable, uuid, varchar, boolean, pgEnum } from "drizzle-orm/pg-core";
import { z } from "zod";

// Enum for address types
export const addressTypeEnum = pgEnum("address_type", ["billing", "shipping"]);

export const addresses = pgTable("addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  type: addressTypeEnum("type").notNull(),
  line1: varchar("line1", { length: 255 }).notNull(),
  line2: varchar("line2", { length: 255 }),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  postalCode: varchar("postal_code", { length: 20 }).notNull(),
  isDefault: boolean("is_default").notNull().default(false),
});

// Relations will be defined in the relations.ts file to avoid circular imports

// Zod validation schemas
export const addressTypeSchema = z.enum(["billing", "shipping"]);

export const addressSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: addressTypeSchema,
  line1: z.string().min(1).max(255),
  line2: z.string().max(255).nullable(),
  city: z.string().min(1).max(100),
  state: z.string().min(1).max(100),
  country: z.string().min(1).max(100),
  postalCode: z.string().min(1).max(20),
  isDefault: z.boolean(),
});

export const newAddressSchema = addressSchema.omit({ id: true });

export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;

import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { z } from "zod";

export const carts = pgTable("carts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id"), // nullable for guest users
  guestId: varchar("guest_id", { length: 100 }), // nullable, for guest users
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const cartItems = pgTable("cart_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  cartId: uuid("cart_id").notNull(),
  productVariantId: uuid("product_variant_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
});

// Relations will be defined in the relations.ts file to avoid circular imports

// Zod validation schemas
export const cartSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid().nullable(),
  guestId: z.string().max(100).nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const newCartSchema = cartSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const cartItemSchema = z.object({
  id: z.string().uuid(),
  cartId: z.string().uuid(),
  productVariantId: z.string().uuid(),
  quantity: z.number().int().min(1),
});

export const newCartItemSchema = cartItemSchema.omit({ id: true });

export type Cart = typeof carts.$inferSelect;
export type NewCart = typeof carts.$inferInsert;
export type CartItem = typeof cartItems.$inferSelect;
export type NewCartItem = typeof cartItems.$inferInsert;

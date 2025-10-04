import {
  pgTable,
  uuid,
  varchar,
  numeric,
  integer,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { z } from "zod";

// Enum for discount types
export const discountTypeEnum = pgEnum("discount_type", [
  "percentage",
  "fixed",
]);

export const coupons = pgTable("coupons", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  discountType: discountTypeEnum("discount_type").notNull(),
  discountValue: numeric("discount_value", {
    precision: 10,
    scale: 2,
  }).notNull(),
  expiresAt: timestamp("expires_at"),
  maxUsage: integer("max_usage"),
  usedCount: integer("used_count").notNull().default(0),
});

// Zod validation schemas
export const discountTypeSchema = z.enum(["percentage", "fixed"]);

export const couponSchema = z.object({
  id: z.string().uuid(),
  code: z.string().min(1).max(50),
  discountType: discountTypeSchema,
  discountValue: z.number().positive(),
  expiresAt: z.date().nullable(),
  maxUsage: z.number().int().positive().nullable(),
  usedCount: z.number().int().min(0),
});

export const newCouponSchema = couponSchema.omit({ id: true });

export type Coupon = typeof coupons.$inferSelect;
export type NewCoupon = typeof coupons.$inferInsert;

import { pgTable, uuid, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { z } from "zod";

// Enum for payment methods
export const paymentMethodEnum = pgEnum("payment_method", ["stripe", "paypal", "cod"]);

// Enum for payment status
export const paymentStatusEnum = pgEnum("payment_status", ["initiated", "completed", "failed"]);

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  method: paymentMethodEnum("method").notNull(),
  status: paymentStatusEnum("status").notNull().default("initiated"),
  paidAt: timestamp("paid_at"),
  transactionId: varchar("transaction_id", { length: 255 }), // External payment processor transaction ID
});

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
}));

// Zod validation schemas
export const paymentMethodSchema = z.enum(["stripe", "paypal", "cod"]);
export const paymentStatusSchema = z.enum(["initiated", "completed", "failed"]);

export const paymentSchema = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  method: paymentMethodSchema,
  status: paymentStatusSchema,
  paidAt: z.date().nullable(),
  transactionId: z.string().max(255).nullable(),
});

export const newPaymentSchema = paymentSchema.omit({ id: true });

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;

import { pgTable, serial, varchar, text, numeric, integer, boolean, timestamp } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const products = pgTable("products", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	price: numeric({ precision: 10, scale:  2 }).notNull(),
	image: varchar({ length: 500 }),
	category: varchar({ length: 100 }),
	brand: varchar({ length: 100 }).default('Nike').notNull(),
	size: varchar({ length: 20 }),
	color: varchar({ length: 50 }),
	stock: integer().default(0).notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

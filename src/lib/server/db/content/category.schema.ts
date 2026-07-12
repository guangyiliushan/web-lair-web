import { integer, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const categories = pgTable(
	'categories',
	{
		id: text('id').primaryKey().notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		name: text('name').notNull(),
		slug: text('slug').notNull(),
		type: integer('type').notNull().default(0)
	},
	(table) => [
		uniqueIndex('categories_name_uniq').on(table.name),
		uniqueIndex('categories_slug_uniq').on(table.slug)
	]
);

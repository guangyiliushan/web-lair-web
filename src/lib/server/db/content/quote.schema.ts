import {
	index,
	pgTable,
	text,
	timestamp,
} from 'drizzle-orm/pg-core'

export const quotes = pgTable(
	'quotes',
	{
		id: text('id').primaryKey().notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		text: text('text').notNull(),
		source: text('source'),
		author: text('author')
	},
	(table) => [index('quotes_created_at_idx').on(table.createdAt)]
)

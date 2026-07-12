import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const aiSummaries = pgTable(
	'ai_summaries',
	{
		id: text('id').primaryKey().notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		hash: text('hash').notNull(),
		summary: text('summary').notNull(),
		refId: text('ref_id').notNull(),
		lang: text('lang')
	},
	(table) => [index('ai_summaries_ref_id_idx').on(table.refId)]
);

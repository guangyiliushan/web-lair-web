import { index, integer, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const activities = pgTable(
	'activities',
	{
		id: text('id').primaryKey().notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		type: integer('type'),
		payload: jsonb('payload').$type<Record<string, unknown> | null>()
	},
	(table) => [index('activities_created_at_idx').on(table.createdAt)]
);

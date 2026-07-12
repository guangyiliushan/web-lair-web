import { index, pgTable, text } from 'drizzle-orm/pg-core';

export const slugTrackers = pgTable(
	'slug_trackers',
	{
		id: text('id').primaryKey().notNull(),
		slug: text('slug').notNull(),
		type: text('type').notNull(),
		targetId: text('target_id').notNull()
	},
	(table) => [
		index('slug_trackers_type_target_idx').on(table.type, table.targetId),
		index('slug_trackers_slug_type_idx').on(table.slug, table.type)
	]
);

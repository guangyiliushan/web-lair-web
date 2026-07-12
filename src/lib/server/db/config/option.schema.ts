import { jsonb, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core';

export const options = pgTable(
	'options',
	{
		id: text('id').primaryKey().notNull(),
		name: text('name').notNull(),
		value: jsonb('value').$type<unknown>()
	},
	(table) => [uniqueIndex('options_name_uniq').on(table.name)]
);

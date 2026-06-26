import { pgTable, text, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const siteSetting = pgTable('site_setting', {
	id: text('id').primaryKey(),
	group: text('group').notNull(),
	key: text('key').notNull().unique(),
	value: jsonb('value').notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull()
});

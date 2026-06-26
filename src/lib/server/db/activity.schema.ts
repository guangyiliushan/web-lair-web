import { pgTable, text, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const activityEvent = pgTable('activity_event', {
	id: text('id').primaryKey(),
	source: text('source').notNull(),
	type: text('type').notNull(),
	title: text('title').notNull(),
	payload: jsonb('payload'),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

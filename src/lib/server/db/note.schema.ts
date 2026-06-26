import { pgTable, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';
import { user } from './auth.schema';

export const note = pgTable('note', {
	id: text('id').primaryKey(),
	title: text('title').notNull(),
	slug: text('slug').notNull().unique(),
	summary: text('summary'),
	content: text('content').notNull(),
	coverUrl: text('cover_url'),
	status: text('status').notNull().default('draft'),
	authorId: text('author_id')
		.notNull()
		.references(() => user.id),
	seriesId: text('series_id'),
	isPinned: boolean('is_pinned').default(false),
	publishedAt: timestamp('published_at'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull()
});

export const noteSeries = pgTable('note_series', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(),
	description: text('description'),
	coverUrl: text('cover_url'),
	sortOrder: text('sort_order').default('0'),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { post } from './post.schema';

export const category = pgTable('category', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(),
	description: text('description'),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

export const tag = pgTable('tag', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

export const postTag = pgTable('post_tag', {
	postId: text('post_id')
		.notNull()
		.references(() => post.id, { onDelete: 'cascade' }),
	tagId: text('tag_id')
		.notNull()
		.references(() => tag.id, { onDelete: 'cascade' })
});

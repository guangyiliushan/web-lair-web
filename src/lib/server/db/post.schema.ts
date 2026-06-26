import { pgTable, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';
import { user } from './auth.schema';

export const post = pgTable('post', {
	id: text('id').primaryKey(),
	title: text('title').notNull(),
	slug: text('slug').notNull().unique(),
	summary: text('summary'),
	content: text('content').notNull(),
	lexicalState: jsonb('lexical_state'),
	coverUrl: text('cover_url'),
	status: text('status').notNull().default('draft'),
	authorId: text('author_id')
		.notNull()
		.references(() => user.id),
	categoryId: text('category_id'),
	isPinned: boolean('is_pinned').default(false),
	aiMeta: jsonb('ai_meta'),
	origin: jsonb('origin'),
	seoTitle: text('seo_title'),
	seoDescription: text('seo_description'),
	ogImage: text('og_image'),
	publishedAt: timestamp('published_at'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull()
});

export const postTranslation = pgTable('post_translation', {
	id: text('id').primaryKey(),
	sourcePostId: text('source_post_id')
		.notNull()
		.references(() => post.id),
	targetPostId: text('target_post_id')
		.notNull()
		.references(() => post.id),
	language: text('language').notNull(),
	provider: text('provider'),
	model: text('model'),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

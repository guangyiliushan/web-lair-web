import { sql } from 'drizzle-orm';
import { index, integer, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const drafts = pgTable(
	'drafts',
	{
		id: text('id').primaryKey().notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true }),
		refType: text('ref_type').notNull(),
		refId: text('ref_id'),
		title: text('title').notNull().default(''),
		text: text('text').notNull().default(''),
		content: text('content'),
		contentFormat: text('content_format').notNull(),
		images: jsonb('images').$type<unknown[]>(),
		meta: jsonb('meta').$type<Record<string, unknown>>(),
		typeSpecificData: jsonb('type_specific_data').$type<Record<string, unknown> | null>(),
		history: jsonb('history').$type<unknown[] | null>(),
		version: integer('version').notNull().default(1),
		publishedVersion: integer('published_version')
	},
	(table) => [
		index('drafts_ref_idx')
			.on(table.refType, table.refId)
			.where(sql`${table.refId} is not null`),
		index('drafts_updated_at_idx').on(table.updatedAt)
	]
);

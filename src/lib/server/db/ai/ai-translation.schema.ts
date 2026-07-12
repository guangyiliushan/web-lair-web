import { sql } from 'drizzle-orm';
import { index, jsonb, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const aiTranslations = pgTable(
	'ai_translations',
	{
		id: text('id').primaryKey().notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		hash: text('hash').notNull(),
		refId: text('ref_id').notNull(),
		refType: text('ref_type').notNull(),
		lang: text('lang').notNull(),
		sourceLang: text('source_lang').notNull(),
		title: text('title').notNull(),
		text: text('text').notNull(),
		subtitle: text('subtitle'),
		summary: text('summary'),
		tags: text('tags')
			.array()
			.notNull()
			.default(sql`'{}'::text[]`),
		sourceModifiedAt: timestamp('source_modified_at', { withTimezone: true }),
		aiModel: text('ai_model'),
		aiProvider: text('ai_provider'),
		contentFormat: text('content_format'),
		content: text('content'),
		sourceBlockSnapshots: jsonb('source_block_snapshots').$type<unknown>(),
		sourceMetaHashes: jsonb('source_meta_hashes').$type<unknown>()
	},
	(table) => [
		uniqueIndex('ai_translations_ref_lang_uniq').on(table.refId, table.refType, table.lang),
		index('ai_translations_ref_id_idx').on(table.refId)
	]
);

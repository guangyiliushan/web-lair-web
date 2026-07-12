import { index, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const translationEntries = pgTable(
	'translation_entries',
	{
		id: text('id').primaryKey().notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		keyPath: text('key_path').notNull(),
		lang: text('lang').notNull(),
		keyType: text('key_type').notNull(),
		lookupKey: text('lookup_key').notNull(),
		sourceText: text('source_text').notNull(),
		translatedText: text('translated_text').notNull(),
		sourceUpdatedAt: timestamp('source_updated_at', { withTimezone: true })
	},
	(table) => [
		uniqueIndex('translation_entries_key_uniq').on(
			table.keyPath,
			table.lang,
			table.keyType,
			table.lookupKey
		),
		index('translation_entries_path_lang_idx').on(table.keyPath, table.lang),
		index('translation_entries_lookup_key_idx').on(table.lookupKey)
	]
);

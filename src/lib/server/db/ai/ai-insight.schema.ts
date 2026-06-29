import type { AnyPgColumn } from 'drizzle-orm/pg-core'
import {
	boolean,
	jsonb,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
} from 'drizzle-orm/pg-core'

export const aiInsights = pgTable(
	'ai_insights',
	{
		id: text('id').primaryKey().notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		refId: text('ref_id').notNull(),
		lang: text('lang').notNull(),
		hash: text('hash').notNull(),
		content: text('content').notNull(),
		isTranslation: boolean('is_translation').notNull().default(false),
		sourceInsightsId: text('source_insights_id').references(
			(): AnyPgColumn => aiInsights.id,
			{ onDelete: 'set null' },
		),
		sourceLang: text('source_lang'),
		modelInfo: jsonb('model_info').$type<Record<string, unknown> | null>(),
	},
	(table) => [
		uniqueIndex('ai_insights_ref_lang_uniq').on(table.refId, table.lang),
	],
)

import {
	index,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	varchar,
} from 'drizzle-orm/pg-core'

export const enrichmentCache = pgTable(
	'enrichment_cache',
	{
		id: text('id').primaryKey().notNull(),
		provider: varchar('provider', { length: 64 }).notNull(),
		externalId: varchar('external_id', { length: 256 }).notNull(),
		url: text('url').notNull(),
		locale: varchar('locale', { length: 8 }).notNull().default(''),
		normalized: jsonb('normalized').$type<Record<string, unknown>>().notNull(),
		raw: jsonb('raw'),
		fetchedAt: timestamp('fetched_at', { withTimezone: true }).notNull().defaultNow(),
		expiresAt: timestamp('expires_at', { withTimezone: true }),
		failureCount: integer('failure_count').notNull().default(0),
		lastError: text('last_error'),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [
		uniqueIndex('enrichment_provider_external_id_locale_uniq').on(
			table.provider,
			table.externalId,
			table.locale,
		),
		index('enrichment_expires_at_idx').on(table.expiresAt),
	],
)

export interface EnrichmentImagePalette {
	dominant: string
	swatches?: string[]
}

export const enrichmentCaptures = pgTable(
	'enrichment_captures',
	{
		enrichmentId: text('enrichment_id')
			.primaryKey()
			.notNull()
			.references(() => enrichmentCache.id, { onDelete: 'cascade' }),
		objectKey: text('object_key').notNull(),
		bytes: integer('bytes').notNull(),
		width: integer('width').notNull(),
		height: integer('height').notNull(),
		thumbhash: text('thumbhash'),
		palette: jsonb('palette').$type<EnrichmentImagePalette>(),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		lastAccessedAt: timestamp('last_accessed_at', { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => [
		index('enrichment_captures_lru_idx').on(table.lastAccessedAt.asc()),
	],
)

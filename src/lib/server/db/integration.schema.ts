import { pgTable, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';

export const integrationProvider = pgTable('integration_provider', {
	id: text('id').primaryKey(),
	provider: text('provider').notNull().unique(),
	enabled: boolean('enabled').default(false),
	config: jsonb('config'),
	lastCheckedAt: timestamp('last_checked_at'),
	lastError: text('last_error'),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull()
});

export const enrichmentCache = pgTable('enrichment_cache', {
	id: text('id').primaryKey(),
	urlHash: text('url_hash').notNull(),
	provider: text('provider').notNull(),
	data: jsonb('data').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	expiresAt: timestamp('expires_at')
});

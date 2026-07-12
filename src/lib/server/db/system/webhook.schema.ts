import { boolean, index, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const webhooks = pgTable(
	'webhooks',
	{
		id: text('id').primaryKey().notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }),
		payloadUrl: text('payload_url').notNull(),
		events: text('events').array().notNull(),
		isEnabled: boolean('is_enabled').notNull().default(true),
		secret: text('secret').notNull(),
		scope: integer('scope')
	},
	(table) => [index('webhooks_is_enabled_idx').on(table.isEnabled)]
);

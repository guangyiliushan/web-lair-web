import {
	boolean,
	index,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
	uniqueIndex
} from 'drizzle-orm/pg-core';
import { user } from '../auth.schema';

export const apiKeys = pgTable(
	'api_keys',
	{
		id: text('id').primaryKey().notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true }),
		userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
		referenceId: text('reference_id').references(() => user.id, { onDelete: 'cascade' }),
		configId: text('config_id'),
		name: text('name'),
		key: text('key').notNull(),
		start: text('start'),
		prefix: text('prefix'),
		enabled: boolean('enabled').notNull().default(true),
		rateLimitEnabled: boolean('rate_limit_enabled').notNull().default(false),
		rateLimitTimeWindow: integer('rate_limit_time_window'),
		rateLimitMax: integer('rate_limit_max'),
		requestCount: integer('request_count').notNull().default(0),
		remaining: integer('remaining'),
		refillInterval: integer('refill_interval'),
		refillAmount: integer('refill_amount'),
		expiresAt: timestamp('expires_at', { withTimezone: true }),
		lastRefillAt: timestamp('last_refill_at', { withTimezone: true }),
		lastRequest: timestamp('last_request', { withTimezone: true }),
		permissions: jsonb('permissions').$type<unknown>(),
		metadata: jsonb('metadata').$type<unknown>()
	},
	(table) => [
		uniqueIndex('api_keys_key_uniq').on(table.key),
		index('api_keys_user_id_idx').on(table.userId)
	]
);

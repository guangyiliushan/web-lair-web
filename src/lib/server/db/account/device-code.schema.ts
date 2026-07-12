import { index, integer, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { user } from '../auth.schema';

export const deviceCodes = pgTable(
	'device_codes',
	{
		id: text('id').primaryKey().notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true }),
		deviceCode: text('device_code').notNull(),
		userCode: text('user_code').notNull(),
		userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
		expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
		status: text('status').notNull(),
		lastPolledAt: timestamp('last_polled_at', { withTimezone: true }),
		pollingInterval: integer('polling_interval'),
		clientId: text('client_id'),
		scope: text('scope')
	},
	(table) => [
		uniqueIndex('device_codes_device_code_uniq').on(table.deviceCode),
		uniqueIndex('device_codes_user_code_uniq').on(table.userCode),
		index('device_codes_expires_at_idx').on(table.expiresAt)
	]
);

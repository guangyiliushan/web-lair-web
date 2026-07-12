import { boolean, integer, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const subscriptions = pgTable(
	'subscriptions',
	{
		id: text('id').primaryKey().notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		email: text('email').notNull(),
		cancelToken: text('cancel_token').notNull(),
		status: integer('status').notNull(),
		isVerified: boolean('is_verified').notNull().default(false)
	},
	(table) => [
		uniqueIndex('subscriptions_email_uniq').on(table.email),
		uniqueIndex('subscriptions_cancel_token_uniq').on(table.cancelToken)
	]
);

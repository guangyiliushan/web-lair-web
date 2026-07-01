import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from '../auth.schema';

export const adminAccounts = pgTable(
	'admin_account',
	{
		id: text('id').primaryKey(),
		userId: text('user_id')
			.notNull()
			.unique()
			.references(() => user.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
	}
);

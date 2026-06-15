import { sql } from 'drizzle-orm';
import { pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { user } from './auth.schema';

export const userRole = pgTable(
	'user_role',
	{
		id: text('id').primaryKey(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		role: text('role', { enum: ['owner', 'editor', 'reader'] }).notNull(),
		grantedBy: text('granted_by'),
		grantedAt: timestamp('granted_at').defaultNow().notNull()
	},
	(table) => [
		uniqueIndex('user_role_user_role_idx').on(table.userId, table.role),
		uniqueIndex('unique_owner_idx')
			.on(table.role)
			.where(sql`role = 'owner'`)
	]
);

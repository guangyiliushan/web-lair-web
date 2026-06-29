import { sql } from 'drizzle-orm';
import { pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { user } from '../auth.schema';

export const userRoles = pgTable(
	'user_roles',
	{
		id: text('id').primaryKey(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		role: text('role', { enum: ['owner', 'editor', 'reader'] }).notNull(),
		grantedBy: text('granted_by'),
		grantedAt: timestamp('granted_at', { withTimezone: true }).defaultNow().notNull()
	},
	(table) => [
		uniqueIndex('user_roles_user_role_idx').on(table.userId, table.role),
		uniqueIndex('user_roles_unique_owner_idx')
			.on(table.role)
			.where(sql`role = 'owner'`)
	]
);

import { jsonb, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'
import { user } from '../auth.schema'

export const ownerProfiles = pgTable(
	'owner_profiles',
	{
		id: text('id').primaryKey().notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		mail: text('mail'),
		url: text('url'),
		introduce: text('introduce'),
		lastLoginIp: text('last_login_ip'),
		lastLoginTime: timestamp('last_login_time', { withTimezone: true }),
		socialIds: jsonb('social_ids').$type<Record<string, unknown> | null>()
	},
	(table) => [uniqueIndex('owner_profiles_user_id_uniq').on(table.userId)]
)

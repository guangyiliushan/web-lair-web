import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from '../auth.schema';

export const userProfiles = pgTable('user_profiles', {
	userId: text('user_id')
		.primaryKey()
		.references(() => user.id, { onDelete: 'cascade' }),
	displayName: text('display_name').notNull(),
	slug: text('slug').notNull().unique(),
	bio: text('bio'),
	avatarUrl: text('avatar_url'),
	emailNotifications: boolean('email_notifications').default(true).notNull(),
	publicProfile: boolean('public_profile').default(false).notNull(),
	showOnlineStatus: boolean('show_online_status').default(false).notNull(),
	status: text('status', { enum: ['active', 'suspended', 'deleted'] })
		.default('active')
		.notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull()
});

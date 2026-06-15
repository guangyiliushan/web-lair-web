import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { user } from './auth.schema';

export const appUserProfile = pgTable('app_user_profile', {
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
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull()
});

import type { AnyPgColumn } from 'drizzle-orm/pg-core'
import {
	boolean,
	index,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
} from 'drizzle-orm/pg-core'
import { user } from '../auth.schema'

/**
 * Self-referential thread structure plus polymorphic ref to content (Post/Note/Page/Recently).
 */
export const comments = pgTable(
	'comments',
	{
		id: text('id').primaryKey().notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		refType: text('ref_type').notNull(),
		refId: text('ref_id').notNull(),
		author: text('author'),
		mail: text('mail'),
		url: text('url'),
		text: text('text').notNull(),
		state: integer('state').notNull().default(0),
		parentCommentId: text('parent_comment_id').references(
			(): AnyPgColumn => comments.id,
			{ onDelete: 'cascade' },
		),
		rootCommentId: text('root_comment_id').references(
			(): AnyPgColumn => comments.id,
			{ onDelete: 'cascade' },
		),
		replyCount: integer('reply_count').notNull().default(0),
		latestReplyAt: timestamp('latest_reply_at', { withTimezone: true }),
		isDeleted: boolean('is_deleted').notNull().default(false),
		deletedAt: timestamp('deleted_at', { withTimezone: true }),
		ip: text('ip'),
		agent: text('agent'),
		pin: boolean('pin').notNull().default(false),
		location: text('location'),
		isWhisper: boolean('is_whisper').notNull().default(false),
		avatar: text('avatar'),
		authProvider: text('auth_provider'),
		meta: text('meta'),
		readerId: text('reader_id'),
		editedAt: timestamp('edited_at', { withTimezone: true }),
		anchor: jsonb('anchor').$type<Record<string, unknown> | null>(),
		isOwnerReply: boolean('is_owner_reply').notNull().default(false),
		countryCode: text('country_code'),
	},
	(table) => [
		index('comments_thread_idx').on(
			table.refType,
			table.refId,
			table.parentCommentId,
			table.pin,
			table.createdAt,
		),
		index('comments_root_idx').on(table.rootCommentId, table.createdAt),
		index('comments_reader_idx').on(table.readerId),
	],
)

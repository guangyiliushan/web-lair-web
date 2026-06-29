import {
	boolean,
	index,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
} from 'drizzle-orm/pg-core'

/**
 * Polymorphic content reference (`Post` | `Note` | `Page` | `Recently`).
 * The actual reference is validated by repository code.
 */
export const recentItems = pgTable(
	'recent_items',
	{
		id: text('id').primaryKey().notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		content: text('content').notNull().default(''),
		type: text('type').notNull(),
		metadata: jsonb('metadata').$type<Record<string, unknown> | null>(),
		refType: text('ref_type'),
		refId: text('ref_id'),
		commentsIndex: integer('comments_index').notNull().default(0),
		allowComment: boolean('allow_comment').notNull().default(true),
		modifiedAt: timestamp('modified_at', { withTimezone: true }),
		up: integer('up').notNull().default(0),
		down: integer('down').notNull().default(0),
	},
	(table) => [
		index('recent_items_ref_idx').on(table.refType, table.refId),
		index('recent_items_created_at_idx').on(table.createdAt),
	],
)

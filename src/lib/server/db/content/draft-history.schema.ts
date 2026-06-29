import {
	boolean,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
} from 'drizzle-orm/pg-core'
import { drafts } from './draft.schema'

/**
 * Optional separate-table form for draft history. Only populated when
 * indexed lookup across drafts is required (Phase 0 deferred).
 */
export const draftHistories = pgTable(
	'draft_histories',
	{
		id: text('id').primaryKey().notNull(),
		draftId: text('draft_id')
			.notNull()
			.references(() => drafts.id, { onDelete: 'cascade' }),
		version: integer('version').notNull(),
		title: text('title').notNull(),
		text: text('text'),
		content: text('content'),
		contentFormat: text('content_format').notNull(),
		typeSpecificData: jsonb('type_specific_data').$type<Record<
			string,
			unknown
		> | null>(),
		savedAt: timestamp('saved_at', { withTimezone: true }).notNull(),
		isFullSnapshot: boolean('is_full_snapshot').notNull(),
		refVersion: integer('ref_version'),
		baseVersion: integer('base_version'),
	},
	(table) => [
		uniqueIndex('draft_histories_draft_version_uniq').on(
			table.draftId,
			table.version,
		),
	],
)

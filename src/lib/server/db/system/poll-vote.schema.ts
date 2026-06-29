import {
	index,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
} from 'drizzle-orm/pg-core'

export const pollVotes = pgTable(
	'poll_votes',
	{
		id: text('id').primaryKey().notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		pollId: text('poll_id').notNull(),
		voterFingerprint: text('voter_fingerprint').notNull()
	},
	(table) => [
		uniqueIndex('poll_votes_poll_voter_uniq').on(
			table.pollId,
			table.voterFingerprint
		),
		index('poll_votes_poll_id_idx').on(table.pollId)
	]
)

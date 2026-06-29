import {
	index,
	pgTable,
	text,
	uniqueIndex,
} from 'drizzle-orm/pg-core'
import { pollVotes } from './poll-vote.schema'

export const pollVoteOptions = pgTable(
	'poll_vote_options',
	{
		voteId: text('vote_id')
			.notNull()
			.references(() => pollVotes.id, { onDelete: 'cascade' }),
		optionId: text('option_id').notNull()
	},
	(table) => [
		uniqueIndex('poll_vote_options_pk').on(table.voteId, table.optionId),
		index('poll_vote_options_option_idx').on(table.optionId)
	]
)

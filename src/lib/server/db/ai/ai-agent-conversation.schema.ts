import { sql } from 'drizzle-orm'
import {
	index,
	jsonb,
	pgTable,
	text,
	timestamp,
} from 'drizzle-orm/pg-core'

export const aiAgentConversations = pgTable(
	'ai_agent_conversations',
	{
		id: text('id').primaryKey().notNull(),
		sessionId: text('session_id').notNull(),
		model: text('model'),
		providerId: text('provider_id'),
		title: text('title'),
		messages: jsonb('messages')
			.$type<unknown[]>()
			.notNull()
			.default(sql`'[]'::jsonb`),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true }),
	},
	(table) => [index('ai_agent_conversations_session_idx').on(table.sessionId)],
)

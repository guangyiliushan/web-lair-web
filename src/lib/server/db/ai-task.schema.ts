import { pgTable, text, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { user } from './auth.schema';
import { post } from './post.schema';

export const aiTask = pgTable('ai_task', {
	id: text('id').primaryKey(),
	targetType: text('target_type').notNull(),
	targetId: text('target_id')
		.notNull()
		.references(() => post.id, { onDelete: 'cascade' }),
	taskType: text('task_type').notNull(),
	status: text('status').notNull().default('queued'),
	provider: text('provider'),
	model: text('model'),
	input: jsonb('input'),
	output: jsonb('output'),
	error: text('error'),
	requestedBy: text('requested_by')
		.notNull()
		.references(() => user.id),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	completedAt: timestamp('completed_at')
});

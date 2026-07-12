import { pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const projects = pgTable(
	'projects',
	{
		id: text('id').primaryKey().notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		name: text('name').notNull(),
		previewUrl: text('preview_url'),
		docUrl: text('doc_url'),
		projectUrl: text('project_url'),
		images: text('images').array(),
		description: text('description').notNull(),
		avatar: text('avatar'),
		text: text('text')
	},
	(table) => [uniqueIndex('projects_name_uniq').on(table.name)]
);

import { pgTable, serial, integer, text } from 'drizzle-orm/pg-core';

export const task = pgTable('task', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	priority: integer('priority').notNull().default(1)
});

export * from './auth.schema';
export * from './app-profile.schema';
export * from './app-role.schema';
export * from './post.schema';
export * from './note.schema';
export * from './taxonomy.schema';
export * from './site-setting.schema';
export * from './integration.schema';
export * from './ai-task.schema';
export * from './activity.schema';

import type { AnyPgColumn } from 'drizzle-orm/pg-core'
import {
	index,
	integer,
	pgTable,
	text,
	uniqueIndex,
} from 'drizzle-orm/pg-core'
import { posts } from './post.schema'

export const postRelatedPosts = pgTable(
	'post_related_posts',
	{
		postId: text('post_id')
			.notNull()
			.references((): AnyPgColumn => posts.id, { onDelete: 'cascade' }),
		relatedPostId: text('related_post_id')
			.notNull()
			.references((): AnyPgColumn => posts.id, { onDelete: 'cascade' }),
		position: integer('position').notNull().default(0),
	},
	(table) => [
		uniqueIndex('post_related_posts_pk').on(table.postId, table.relatedPostId),
		index('post_related_posts_related_idx').on(table.relatedPostId),
	],
)

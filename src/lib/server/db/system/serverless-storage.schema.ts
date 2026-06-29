import {
	index,
	jsonb,
	pgTable,
	text,
	uniqueIndex,
} from 'drizzle-orm/pg-core'

export const serverlessStorages = pgTable(
	'serverless_storages',
	{
		id: text('id').primaryKey().notNull(),
		namespace: text('namespace').notNull(),
		key: text('key').notNull(),
		value: jsonb('value').$type<unknown>().notNull()
	},
	(table) => [
		uniqueIndex('serverless_storages_ns_key_uniq').on(
			table.namespace,
			table.key
		)
	]
)

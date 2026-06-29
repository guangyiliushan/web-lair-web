import { bigint, index, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const fileReferences = pgTable(
	'file_references',
	{
		id: text('id').primaryKey().notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		fileUrl: text('file_url').notNull(),
		fileName: text('file_name').notNull(),
		status: text('status').notNull(),
		refId: text('ref_id'),
		refType: text('ref_type'),
		s3ObjectKey: text('s3_object_key'),
		readerId: text('reader_id'),
		uploadedBy: text('uploaded_by'),
		mimeType: text('mime_type'),
		byteSize: bigint('byte_size', { mode: 'number' }),
		detachedAt: timestamp('detached_at', { withTimezone: false })
	},
	(table) => [
		index('file_references_file_url_idx').on(table.fileUrl),
		index('file_references_ref_idx').on(table.refId, table.refType),
		index('file_references_status_created_idx').on(
			table.status,
			table.createdAt
		),
		index('file_references_reader_status_created_idx').on(
			table.readerId,
			table.status,
			table.createdAt
		),
		index('file_references_status_detached_idx').on(
			table.status,
			table.detachedAt
		)
	]
)

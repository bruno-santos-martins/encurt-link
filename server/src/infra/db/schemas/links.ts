import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'

export const links = pgTable('links', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => uuidv7()),
	url: text('url').notNull().unique(),
	urlCurt: text('url_curt').notNull().unique(),
	visited: integer('visited').default(0).notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
		.defaultNow()
		.notNull(),
})

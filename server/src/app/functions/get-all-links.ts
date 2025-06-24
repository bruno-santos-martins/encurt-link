import { db } from '@/infra/db/index.js';
import { schema } from '@/infra/db/schemas/index.js';

export async function getAllLinks() {
  return db
    .select()
    .from(schema.links)
    .orderBy(schema.links.createdAt);
}
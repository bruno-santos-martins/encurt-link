import { db } from '@/infra/db/index.js';
import { schema } from '@/infra/db/schemas/index.js';
import { eq, sql } from 'drizzle-orm';

export async function getAndIncrementLinkByUrlCurt(urlCurt: string): Promise<string | null> {
  
  const link = await db
    .select()
    .from(schema.links)
    .where(eq(schema.links.urlCurt, urlCurt));
  
  const linkRes = await db
    .update(schema.links)
    .set({ visited: sql`${schema.links.visited} + 1` })
    .where(eq(schema.links.id, link[0].id)).returning();
 
  return linkRes;

}

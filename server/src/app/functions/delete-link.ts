import { db } from '@/infra/db/index.js';
import { schema } from '@/infra/db/schemas/index.js';
import { type Either, makeLeft, makeRight } from '@/shared/either.js';
import { z } from 'zod';
import { eq } from 'drizzle-orm';

const deleteLinkInputSchema = z.object({
  id: z.string().uuid({ message: 'ID inválido' }),
});

type DeleteLinkInput = z.infer<typeof deleteLinkInputSchema>;

export async function deleteLink(
  input: DeleteLinkInput
): Promise<Either<string, DeleteLinkInput>> {
  const { id } = deleteLinkInputSchema.parse(input);

  const result = await db
    .delete(schema.links)
    .where(eq(schema.links.id, id))
    .returning();
    
  const deleted = result.length ?? 0;
  
  
  if (deleted === 0) {
    return makeLeft('Link não encontrado.');
  }

  return makeRight({ id });
}

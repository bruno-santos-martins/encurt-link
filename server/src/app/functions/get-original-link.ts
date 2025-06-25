import { db } from '@/infra/db/index.js';
import { schema } from '@/infra/db/schemas/index.js';
import { type Either, makeLeft, makeRight } from '@/shared/either.js';
import { z } from 'zod';
import { eq } from 'drizzle-orm';

const getUrlInputSchema = z.object({
  urlCurt: z.string(),
});

type GetUrlInput = z.infer<typeof getUrlInputSchema>;

export async function getOriginalUrl(
  input: GetUrlInput
): Promise<Either<string, { url: string }>> {

  const { urlCurt } = getUrlInputSchema.parse(input);
 
  const result = await db
    .select({ url: schema.links.url })
    .from(schema.links)
    .where(eq(schema.links.urlCurt, urlCurt));
  
  console.log(result);
  if (result.length === 0) {
    return makeLeft('URL encurtada não encontrada.');
  }

  return makeRight({ url: result[0].url });
}

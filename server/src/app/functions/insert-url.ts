import { db } from "@/infra/db/index.js";
import { schema } from "@/infra/db/schemas/index.js";
import { type Either, makeLeft, makeRight } from "@/shared/either.js";
import { z } from "zod";
import { eq, or } from "drizzle-orm";

const linkInputSchema = z.object({
  url: z.string().url({ message: "URL inválida" }),
  urlCurt: z.string(),
});

type LinkInput = z.infer<typeof linkInputSchema>;

export async function insertLink(
  input: LinkInput
): Promise<Either<string, LinkInput>> {
  const { url, urlCurt } = linkInputSchema.parse(input);

  const existing = await db
    .select()
    .from(schema.links)
    .where(or(eq(schema.links.url, url), eq(schema.links.urlCurt, urlCurt)));

  if (existing.length > 0) {
    return makeLeft("URL ou URL encurtada já existem.");
  }

  await db.insert(schema.links).values({ url, urlCurt });

  return makeRight({ url, urlCurt });
}
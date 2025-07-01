import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { writeFile, mkdir } from 'fs/promises';
import { createReadStream } from 'fs';
import { Upload } from '@aws-sdk/lib-storage';
import { env } from '@/env.js';
import { r2 } from '@/infra/storage/client.js';
import { type Either, makeLeft, makeRight } from '@/shared/either.js';
import { z } from 'zod';

// --- Tipagem do link
const linkSchema = z.object({
  id: z.string().uuid(),
  url: z.string().url(),
  urlCurt: z.string().url(),
  visited: z.number(),
  createdAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date-time string",
  }),
});

type Link = z.infer<typeof linkSchema>;

export async function uploadLinksCsvToCloudflare(
  links: Link[]
): Promise<Either<string, { url: string }>> {
  const parsed = z.array(linkSchema).safeParse(links);
  if (!links.length) {
    return makeLeft('Lista de links inválida ou vazia.');
  }
    const headers = Object.keys(links[0]);
      
      const csvRows = [
        headers.join(","), // Cabeçalho
        ...links.map((link) =>
          headers
            .map((key) => `"${String((link as any)[key] ?? "")}"`)
            .join(",")
        ),
      ];
    
      const csvContent = csvRows.join("\n");
      
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 10);
     
      const uniqueName = `csv${timestamp}-${random}`
      const filePath = join(__dirname,'..','..','infra','storage-file','links.csv');
      await writeFile(filePath, csvContent, "utf8");
      const contentStream = createReadStream(filePath, { encoding: 'utf8' });

    try {
      const upload = new Upload({
          client: r2,
          params: {
            Key: uniqueName,
            Bucket: env.CLOUDFLARE_BUCKET,
            Body: contentStream,
            ContentType: 'text/csv',
          },
        })
         await upload.done()
    
    return makeRight({ url: new URL(uniqueName, env.CLOUDFLARE_PUBLIC_URL).toString() });
  } catch (error) {
    console.error('Erro ao exportar CSV:', error);
    return makeLeft('Erro ao exportar links como CSV.');
  }
}

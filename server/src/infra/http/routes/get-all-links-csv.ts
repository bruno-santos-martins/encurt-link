import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { getAllLinks } from "@/app/functions/get-all-links.js";
import { env } from '@/env.js'
import { writeFile } from "fs/promises";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Upload } from '@aws-sdk/lib-storage'
import { r2 } from "@/infra/storage/client.js";
import { createReadStream } from "fs";

const linkResponseSchema = z.object({
  id: z.string().uuid(),
  url: z.string().url(),
  urlCurt: z.string().url(),
  visited: z.number(),
  createdAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date-time string",
  }),
});

type Link = z.infer<typeof linkResponseSchema>;

export const getAllLinksCsvRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/links-csv",
    {
      schema: {
        summary: "Listar todos os links",
        tags: ["link"],
        response: {
          201: z.array(linkResponseSchema),
        },
      },
    },
    async (request, reply) => {
      const rawLinks = await getAllLinks();
      const links = rawLinks as Link[];
    
      if (!links.length) {
        return reply.status(204).send({ message: "Nenhum link encontrado" });
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
      const filePath = join(__dirname,'..','..','storage-file','links.csv');
      console.log(filePath);
     
      try {
        
          const file = await writeFile(filePath, csvContent, "utf8");
          const contentStream = createReadStream(filePath, { encoding: 'utf8' });

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
        return reply
          .status(500)
          .send ({
          url: new URL(uniqueName, env.CLOUDFLARE_PUBLIC_URL).toString(),
        })
      } catch (error) {
        return reply
          .status(500)
          .send({ message: "Erro ao salvar CSV no servidor" });
      }
    }
  );
};

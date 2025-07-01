import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { string, z } from "zod";
import { getAllLinks } from "@/app/functions/get-all-links.js";
import { env } from '@/env.js'
import { writeFile } from "fs/promises";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Upload } from '@aws-sdk/lib-storage'
import { r2 } from "@/infra/storage/client.js";
import { createReadStream, link } from "fs";
import { uploadLinksCsvToCloudflare } from "@/app/functions/upload-csv.js";
import { isRight, unwrapEither } from "@/shared/either.js";

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
          201: z.object({url: z.string()}),
          400: z
						.object({
							message: z.string(),
						})
						.describe('Falha no envio.'),
        },
      },
    },
    async (request, reply) => {
      const rawLinks = await getAllLinks();
      const links = rawLinks as Link[];
       
      const resultUpload =  await uploadLinksCsvToCloudflare(links);

      if (isRight(resultUpload)) {
        const original = resultUpload.right;
        return reply.status(200).send({ url: original.url });
      }

      const error = unwrapEither(resultUpload);
      return reply.status(400).send({ message: error });
    
    }
  );
};

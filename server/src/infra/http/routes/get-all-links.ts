import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { getAllLinks } from '@/app/functions/get-all-links.js';


const linkResponseSchema = z.object({
  id: z.string().uuid(),
  url: z.string().url(),
  urlCurt: z.string().url(),
  visited: z.number(),
  createdAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date-time string',
  }),
});

type Link = z.infer<typeof linkResponseSchema>;

export const getAllLinksRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    '/links',
    {
      schema: {
        summary: 'Listar todos os links',
        tags: ['link'],
        response: {
					201: z.array(linkResponseSchema),
				},
      },
    },
    async (request, reply) => {
      const rawLinks = await getAllLinks();
      return reply.status(200).send(rawLinks as Link[]);
    }
  );
};

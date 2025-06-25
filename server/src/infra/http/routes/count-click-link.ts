import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { getAndIncrementLinkByUrlCurt } from '@/app/functions/count-click-link.js';

const linkSchema = z.object({
  id: z.string().uuid(),
  url: z.string().url(),
  urlCurt: z.string(),
  visited: z.number(),
  createdAt: z.string(), // ou z.coerce.date()
});

export const redirectCountRoute: FastifyPluginAsyncZod = async (server) => {
  server.get('/rcount/:curt', {
    schema: {
      summary: 'Obter URL original e incrementar contador',
      tags: ['link'],
      params: z.object({
        curt: z.string().min(1),
      }),
      response: {
        200: linkSchema,
        404: z.object({ message: z.string() }).describe('Não encontrado'),
      },
    },
  }, async (request, reply) => {
    const { curt } = request.params;

    const originalUrl = await getAndIncrementLinkByUrlCurt(curt);

    if (!originalUrl?.length) {
      return reply.status(404).send({ message: 'Link encurtado não encontrado' });
    }
    
    return reply.status(200).send(linkSchema.parse(originalUrl));
  });
};

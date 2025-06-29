import { getOriginalUrl } from '@/app/functions/get-original-link.js';
import { isRight, unwrapEither } from '@/shared/either.js';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';


export const getOriginalUrlRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    '/link/:curt',
    {
      schema: {
        summary: 'Obter URL original por meio da URL encurtada',
        tags: ['link'],
        params: z.object({
          curt: z.string(),
        }),
        response: {
          200: z.object({ url: z.string().url() }).describe('URL original encontrada'),
          400: z.object({ message: z.string() }).describe('URL não encontrada'),
        },
      },
    },
    async (request, reply) => {
      //const result = await deleteLink({ id: request.params.id });
      const result = await getOriginalUrl({ urlCurt: request.params.curt });
       
      if (isRight(result)) {
        const original = result.right;
        return reply.status(200).send({ url: original.url });
      }

      const error = unwrapEither(result);
      return reply.status(400).send({ message: error });
      
    }
  );
};

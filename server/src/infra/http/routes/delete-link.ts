import { deleteLink } from '@/app/functions/delete-link.js';
import { isRight, unwrapEither } from '@/shared/either.js';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';

export const deleteLinkRoute: FastifyPluginAsyncZod = async (server) => {
  server.delete(
    '/link/:id',
    {
      schema: {
        summary: 'Deletar um link por ID',
        tags: ['link'],
        params: z.object({
          id: z.string().uuid(),
        }),
        response: {
          204: z.null().describe('Link deletado com sucesso'),
          400: z.object({ message: z.string() }).describe('Link não encontrado'),
        },
      },
    },
    async (request, reply) => {
      const result = await deleteLink({ id: request.params.id });

      if (isRight(result)) {
        return reply.status(204).send();
      }

      const error = unwrapEither(result);

      return reply.status(400).send({
        message: error,
      });
    }
  );
};
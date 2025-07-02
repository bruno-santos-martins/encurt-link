import { insertLink } from '@/app/functions/insert-url.js'
import { isRight, unwrapEither } from '@/shared/either.js'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const inserLinkRoute: FastifyPluginAsyncZod = async server => {
	server.post(
		'/link',
		{
			schema: {
				summary: 'Link',
				tags: ['link'],
				consumes: ['application/json'],
				body: z.object({
          url: z.string(),
          urlCurt: z.string(),
        }),
				response: {
					201: z.object({
						id: z.string().uuid(),
						url: z.string().url(),
						urlCurt: z.string(),
						visited: z.number(),
						createdAt: z.string(),
					}),
					400: z
						.object({
							message: z.string(),
						})
						.describe('Falha no envio.'),
				},
			},
		},

		async (request, reply) => {
			
      const result = await insertLink({
				url: request.body.url,
				urlCurt: request.body.urlCurt,
			})

			if (isRight(result)) {
			
				const link = result.right as {
					id: string;
					url: string;
					urlCurt: string;
					visited: number;
					createdAt: string;
				};
			
				return reply.status(201).send(link)
			}

			const error = unwrapEither(result)

			return reply.status(400).send({
				message: error,
			})
      
					
		}
	)
}

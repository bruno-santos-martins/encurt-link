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
					201: z.object({ uploadId: z.string() }).describe('Image uploaded'),
					400: z
						.object({
							message: z.string(),
						})
						.describe('Upload already exists.'),
				},
			},
		},

		async (request, reply) => {
			
      const result = await insertLink({
				url: request.body.url,
				urlCurt: request.body.urlCurt,
			})

			if (isRight(result)) {
				return reply.status(201).send()
			}

			const error = unwrapEither(result)

			return reply.status(400).send({
				message: error,
			})
      
					
		}
	)
}

import { env } from '@/env.js'
import { fastifyCors } from '@fastify/cors'
import { fastifyMultipart } from '@fastify/multipart'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
	hasZodFastifySchemaValidationErrors,
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
} from 'fastify-type-provider-zod'

import { transformSwaggerSchema } from './transform-swagger-schema.js'
import { inserLinkRoute } from './routes/insert-link.js'
import { getAllLinksRoute } from './routes/get-all-links.js'
import { deleteLinkRoute } from './routes/delete-link.js'
import { getOriginalUrlRoute } from './routes/get-original-link.js'
import { getAllLinksCsvRoute } from './routes/get-all-links-csv.js'


const server = fastify()

server.register(fastifyMultipart)
server.register(fastifySwagger, {
	openapi: {
		info: {
			title: 'Upload Server',
			version: '1.0.0',
		},
	},
	transform: transformSwaggerSchema,
})
server.register(fastifySwaggerUi, {
	routePrefix: '/docs',
})

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.setErrorHandler((error, request, reply) => {
	if (hasZodFastifySchemaValidationErrors(error)) {
		return reply.status(400).send({
			message: 'Validation error.',
			issues: error.validation,
		})
	}

	return reply.status(500).send({ message: 'Internal server error.' })
})

server.register(fastifyCors, { origin: '*' })
server.register(inserLinkRoute)
server.register(getAllLinksRoute);
server.register(deleteLinkRoute);
server.register(getOriginalUrlRoute);
server.register(getAllLinksCsvRoute);

server.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
	console.log('HTTP server running!', 3333)
})

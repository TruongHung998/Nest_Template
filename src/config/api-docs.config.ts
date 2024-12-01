import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function configSwagger(
	app: NestFastifyApplication,
	username: string,
	password: string,
) {
	//Setup Swaggers
	const config = new DocumentBuilder()
		.setTitle('RBAC Example Project')
		.setDescription(
			'Hope this project can help somebody know to start working with RBAC with NestJS...',
		)
		.addBearerAuth(
			{ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
			'JWT',
		)
		.addSecurityRequirements('JWT')
		.setVersion('1.0')
		.build();
	const document = SwaggerModule.createDocument(app, config);

	const httpAdapter = app.getHttpAdapter(); //https://docs.nestjs.com/faq/http-adapter
	httpAdapter.use('/api-docs', (req: any, res: any, next: any) => {
		/* 
			1. Extract the authentication data from the Basic authentication header in the WWW-Authenticate field.

			2. The authentication data typically follows the format: "Basic [EncodedBase64Part]". Split this string to separate the "Basic" prefix from the encoded Base64 part.

			3. Decode the Base64 encoding of the extracted encoded part. This will yield a string containing the username and password separated by a colon (e.g., "username:password").

			4. Split the decoded string into separate username and password strings.

			5. Compare the extracted username and password with the provided credentials to authenticate the user.
		*/
		function parseAuthHeader(input: string): { name: string; pass: string } {
			const [, encodedPart] = input.split(' ');
			const buff = Buffer.from(encodedPart, 'base64');
			const text = buff.toString('ascii');
			const [name, pass] = text.split(':');

			return { name, pass };
		}

		function unauthorizedResponse(): void {
			if (httpAdapter.getType() === 'fastify') {
				res.statusCode = 401;
				res.setHeader('WWW-Authenticate', 'Basic');
			} else {
				res.status(401);
				res.set('WWW-Authenticate', 'Basic');
			}

			next();
		}

		if (!req.headers.authorization) {
			return unauthorizedResponse();
		}

		const credentials = parseAuthHeader(req.headers.authorization);

		if (credentials?.name !== username || credentials?.pass !== password) {
			return unauthorizedResponse();
		}

		next();
	});
	SwaggerModule.setup('api-docs', app, document, {
		swaggerOptions: {
			persistAuthorization: true,
		},
		customJs: '/swagger-custom.js',
	});
}

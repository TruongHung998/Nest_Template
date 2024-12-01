import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FastifyReply } from 'fastify';
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	constructor(private readonly configService: ConfigService) {}
	catch(exception: any, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<FastifyReply>();

		const status =
			exception instanceof HttpException ? exception.getStatus() : 500;

		const message =
			exception instanceof HttpException
				? exception?.['response']
					? exception?.['response']
					: exception.message
				: 'Internal server error';
		response.status(status).send({
			statusCode: status,
			message,
			error:
				this.configService.get('NODE_ENV') !== 'production'
					? {
							response: exception.response,
							stack: exception.stack,
						}
					: undefined,
		});
	}
}

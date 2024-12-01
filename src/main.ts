import { configSwagger } from "@configs/api-docs.config";
import { Logger, ValidationPipe, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import cookieParser = require("cookie-parser");

import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true })
  );

  //Setup Cors
  app.enableCors();

  //Setup Versioning API
  app.setGlobalPrefix("api");
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: "v",
    defaultVersion: "1",
  });
  app.useGlobalPipes(new ValidationPipe());

  app.use(cookieParser());

  //Setup Swaggers
  configSwagger(app, process.env.SWAGGER_USERNAME, process.env.SWAGGER_PASSWORD);

  Logger.log(`---> Get: ${process.env.NODE_ENV}`, "Environment");
  await app.listen(process.env.PORT, "0.0.0.0");
}
bootstrap();

import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { TransformInterceptor } from "./core/transform.interceptor";
import cookieParser = require("cookie-parser");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  app.setGlobalPrefix('api')
  app.use(cookieParser())
  app.enableVersioning({
    defaultVersion: ['1', '2'],
    type: VersioningType.URI
  });
  await app.listen(8000);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { AppConfigModule } from '@common/config/config.module.js';
import { setupSwagger } from '@common/libs/swagger/swagger.js';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '@common/config/config.type.js';
import compression from 'compression';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    {
      snapshot: true,
      //  logger: new InternalDisabledLogger(),
    },
  );

  app.set('query parser', 'extended');

  const configService = app.get(ConfigService<AppConfig, true>);

  // =========================================================
  // configure swagger
  // =========================================================

  if (!AppConfigModule.isProd()) setupSwagger(app, configService);

  // ======================================================
  // security and middlewares
  // ======================================================

  app.enable('trust proxy');
  app.set('etag', 'strong');

  if (!AppConfigModule.isProd()) {
    app.use(compression());
    app.use(helmet());
    app.enableCors({
      credentials: true,
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      maxAge: 3600,
      origin: configService.get('app.allowedOrigins', { infer: true }),
    });
  }

  // =====================================================
  // configure global pipes, filters, interceptors
  // =====================================================

  const globalPrefix = configService.get('app.prefix', { infer: true });

  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(new ValidationPipe(AppUtils.validationPipeOptions()));

  app.useGlobalFilters(
    new I18nValidationExceptionFilter({ detailedErrors: false }),
  );

  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  await app.listen(configService.get<appconf>('app'));
}
await bootstrap();

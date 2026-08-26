import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),

    {
      snapshot: true,
      logger: new InternalDisabledLogger(),
    },
  );

  app.set('query parser', 'extended');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

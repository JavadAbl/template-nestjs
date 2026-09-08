import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { appConfig, appConfigValidationSchema } from '#common/config/configs/app.config.js';
import { databaseConfig, databaseConfigValidationSchema } from '#common/config/configs/database.config.js';
import { loggerConfig, loggerConfigValidationSchema } from '#common/config/configs/logger.config.js';
import { getLoggerAsyncConfig } from '#common/libs/pino/pino.config.js';
import { Configs } from '#common/config/config.type.js';
import Joi from 'joi';
import { UserModule } from '#modules/user/user.module.js';
import { PrismaModule } from '#common/infrastructure/database/prisma.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, loggerConfig],
      validationSchema: Joi.object({
        ...appConfigValidationSchema,
        ...databaseConfigValidationSchema,
        ...loggerConfigValidationSchema,
      }),
      validationOptions: {
        libraryOptions: {
          allowUnknown: true, // Allows variables not defined in schema
          abortEarly: true, // Stops validation on the first error
        },
      },
    }),

    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<Configs, true>) => getLoggerAsyncConfig(config),
    }),

    PrismaModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

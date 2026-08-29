import { ConfigType } from '@nestjs/config';
import { appConfig } from './configs/app.config.js';
import { databaseConfig } from './configs/database.config.js';

export type AppConfig = {
  main: 
  database: ConfigType<typeof databaseConfig>;
};

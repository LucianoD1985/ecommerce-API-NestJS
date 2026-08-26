import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
dotenvConfig({ path: 'env.development' });
import { environment } from './environment';

const config = {
  type: 'postgres',
  database: environment.DB_NAME,
  host: environment.DB_HOST,
  port: Number(environment.DB_PORT),
  username: environment.DB_USERNAME,
  password: environment.DB_PASSWORD,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
  logging: false,
  synchronize: true,
  dropSchema: false, //*pasar a false en producción
};

export const typeOrmConfig = registerAs('typeorm', () => config);
//
export const connectionSource = new DataSource(config as DataSourceOptions);

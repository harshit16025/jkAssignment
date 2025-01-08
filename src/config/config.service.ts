import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { cwd, env } from 'process';

dotenv.config();
class ConfigService {
  constructor() {}

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: env.DB_HOST,
      port: parseInt(env.DB_PORT),
      username: env.DB_USERNAME,
      password: env.DB_PASSWORD,
      database: env.DB_DATABASE,
      entities: ['src/*.entity{.ts,.js}'],
      synchronize: false,
      autoLoadEntities: true,
      migrationsTableName: 'migrations',
      migrations: ['dist/database/migrations/*.ts'],
      // migrations: ['src/migration/**/*{.ts,.js}'],
    };
  }

}
const configService = new ConfigService();

export { configService };

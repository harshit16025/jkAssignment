import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config/config.service';
import { AuthModule } from './admin/auth/auth.module';
import { AuthtokenMiddleware } from './common/middleware/authToken.middleware';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store'; 
import * as dotenv from 'dotenv';
import { cwd, env } from 'process';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { DocumentsModule } from './admin/documents/documents.module';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    CacheModule.register({
      store: redisStore,
      host: env.REDIS_HOST,  // Redis host
      port: parseInt(env.REDIS_PORT),         // Redis port
      ttl: parseInt(env.REDIS_TTL),          // TTL for cache
    }),
    ServeStaticModule.forRoot(
      {
        rootPath: '/data/jkassignment/documents',
        serveRoot: '/document', // optional, default is '/'
      },
      {
        rootPath: '/path/to/your/images', // Absolute path to your external image folder
        serveRoot: '/images', // This will serve images under /images route
      }
  ),
    AuthModule,
    DocumentsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthtokenMiddleware)
      .exclude(
        // { path: 'auth/login', method: RequestMethod.ALL },
         'document/(.*)',
      )
      .forRoutes('*');
  }
}

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import * as dotenv from 'dotenv';
import { cwd, env } from 'process';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
    ]),
    CacheModule.register({
      store: redisStore,              // Use redisStore function here
      host: env.REDIS_HOST,           // Redis host
      port: parseInt(env.REDIS_PORT), // Redis port
      ttl: parseInt(env.REDIS_TTL),   // TTL for cache
    }),
    JwtModule.register({
      global: true,
      secret: env.SECRETKEY,
      signOptions: { expiresIn: env.EXPIRESIN },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}

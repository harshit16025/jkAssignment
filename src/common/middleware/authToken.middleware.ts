import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { cwd, env } from 'process';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class AuthtokenMiddleware implements NestMiddleware {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private jwtService: JwtService
    ) { }

    async use(req: Request, res: Response, next: Function) {
        try{
        var token = '';
        var isAuthorized;
        if (req.headers.authorization) {
            token = req.headers.authorization;
            token = token.replace('Bearer ', '');
            isAuthorized = token;
            const blacklisted = await this.cacheManager.get(`blacklist:${token}`);
            if(isAuthorized == blacklisted){
                throw new HttpException('Unauthorized Users', HttpStatus.UNAUTHORIZED);
            }

            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: env.SECRETKEY,
                }
            );
            if (payload !== null) {
                req.headers['user'] = payload;
            } else {
                throw new HttpException('Unauthorized User', HttpStatus.UNAUTHORIZED);
            }
        }
        if (!isAuthorized) {
            throw new HttpException('Unauthorized User', HttpStatus.UNAUTHORIZED);
        }
        next();
        }catch(e){
            throw new HttpException('Unauthorized User', HttpStatus.UNAUTHORIZED);
        }  
    }
}

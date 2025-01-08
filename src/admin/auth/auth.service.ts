import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class AuthService {


    private logger = new Logger(AuthService.name);

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private jwtService: JwtService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
        // private readonly queryHelper: QueryHelper,
        // private appConfigService: AppConfigService,
        // private readonly timeHelper: TimeHelper,
        // private readonly redisService: RedisService,
    ) {
    }


    /**
   *
   * @param user
   */
    public async register(userDto): Promise<any> {

        const user = this.userRepository.create(userDto);
        var result = await this.userRepository.save(user);
        return result;
    }

    /**
     *
     * @param userInfo
     */
    public async validateUser(userDto): Promise<any> {
        const userData = await this.userRepository.findOne({
            where: {
                email: userDto.email,
            },
        });
        if (!userData) {
            return null;
        } else {
            const encryptPassword = await this.userEncryptPassword(
                userDto.password,
                userData.salt,
            );
            if (
                encryptPassword === userData.password
                // && userData.status === 1
            ) {
                delete userData.password;
                delete userData.salt;
                const authToken = await this.setAuthToken(userData);
                return userData;
            } else if (encryptPassword !== userData.password) {
                return { password_mismatch: true };
            }
        }
    }

    async userEncryptPassword(password, salt) {
        return crypto
            .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
            .toString(`hex`);
    }

    /**
     *
     * @param userProfile
     */
    async setAuthToken(userProfile) {
        const payload = { sub: userProfile.email };
        const token = await this.jwtService.signAsync(payload)
        userProfile.access_token = token
        return token;
    }

    // Logout by blacklisting the token
    async logout(token: string) {
        // Store the token in cache to blacklist it
        await this.cacheManager.set(`blacklist:${token}`, token, 3600);
        const blacklisted = await this.cacheManager.get(`blacklist:${token}`);
    }

    async checkuserExists(userId: number) {
        const userData = await this.userRepository.findOne({
            where: {
                id: userId,
            },
        });
        if (!userData) {
            return null;
        } else {
            return userData
        }
    }

    public async updateUser(userDto): Promise<any> {    
        return await this.userRepository.save(userDto);
      }
}
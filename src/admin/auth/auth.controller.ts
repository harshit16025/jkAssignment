import { Body, Controller, HttpStatus, Logger, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { IResponse } from 'src/common/interfaces/response.interface';
import { ResponseError, ResponseSuccess } from 'src/common/dto/response.dto';
import { CreateUsersConfigDto } from './dto/create-user-config.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { ManageRoleDto } from './dto/manage-role.dto';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(
        private readonly authService: AuthService,
    ) {

    }


    /**
   *
   * @param RegisterUserDto
   */
    @Post('register')
    //   @UseGuards(PermissionGuard)
    //   @Permission('create-admin-user')
    @ApiOperation({ summary: 'Register' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiBody({ type: CreateUsersConfigDto })
    async register(
        @Request() req,
        @Body() registerUserDto: CreateUsersConfigDto,
    ): Promise<IResponse> {
        try {
            const data = await this.authService.register(registerUserDto);
            return new ResponseSuccess(
                'User Created Successfully',
                data,
                HttpStatus.OK,
            );
        } catch (error) {
            this.logger.error(error);
            return new ResponseError(
                error.message,
                error,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    /**
   *
   * @param RegisterUserDto
   */
    @Post('login')
    @ApiOperation({ summary: 'Login' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiBody({ type: UserLoginDto })
    async login(
        @Request() req,
        @Body() userLoginDto: UserLoginDto,
    ): Promise<IResponse> {
        try {

            const data = await this.authService.validateUser(userLoginDto);
            if (data) {
                if (data.password_mismatch) {
                    return new ResponseError(
                        'Username or password incorrect',
                        {},
                        HttpStatus.UNAUTHORIZED,
                    );
                }

                return new ResponseSuccess(
                    'Login Successfull',
                    data,
                    HttpStatus.OK,
                );
            } else {
                return new ResponseError(
                    'Username or password incorrect',
                    {},
                    HttpStatus.NOT_FOUND,
                );
            }
        } catch (error) {
            this.logger.error(error);
            return new ResponseError(
                error.message,
                error,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    /**
     *
     * @param RegisterUserDto
     */
    @Post('logout')
    @ApiOperation({ summary: 'Logout' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiBody({})
    async logout(
        @Request() req,
    ): Promise<IResponse> {
        try {
            let token = req.headers.authorization;
            token = token.replace('Bearer ', '');
            const data = {};
            if (!token) {
                return new ResponseSuccess(
                    'No token found',
                    data,
                    HttpStatus.OK,
                );
            }
            await this.authService.logout(token);
            return new ResponseSuccess(
                'Logout Successfull',
                data,
                HttpStatus.OK,
            );

        } catch (error) {
            this.logger.error(error);
            return new ResponseError(
                error.message,
                error,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }


    /**
     *
     * @param RegisterUserDto
     */
    @Post('manageRole')
    @ApiOperation({ summary: 'Manage Role' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiBody({type: ManageRoleDto})
    async manageRole(
        @Request() req,
        @Body() manageRoleDto: ManageRoleDto,
    ): Promise<IResponse> {
        try {
            const data = await this.authService.checkuserExists(manageRoleDto.userId);
            if(data){
                let updatedData = {
                    id : manageRoleDto.userId,
                    role : manageRoleDto.roleId
                }
                await this.authService.updateUser(updatedData);
                return new ResponseSuccess(
                    'Role Changed Successfull',
                    data,
                    HttpStatus.OK,
                );
            }else{
                return new ResponseSuccess(
                    "User didn't exist.",
                    data,
                    HttpStatus.OK,
                );
            }

        } catch (error) {
            this.logger.error(error);
            return new ResponseError(
                error.message,
                error,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

}

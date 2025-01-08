import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsersConfigDto {
  @ApiProperty({ example: 'harshit', description: 'The name of the user' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'asdf@12345',
    description: 'The value of the password',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'Y2xpb2NvZGU=',
    description: 'The key for encryption',
  })
  @IsNotEmpty()
  salt: string;

  @ApiProperty({ example: "Harshit Kumar", description: 'The full name of the user' })
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({ example: "harshit160295@gmail.com", description: 'The email of the user' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: "1", description: 'The role of the user' })
  @IsNotEmpty()
  role: string;
}

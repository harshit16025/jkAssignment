import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserLoginDto {
  @ApiProperty({ example: 'harshit160295@gmail.com', description: 'The name of the tag' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'asdf@12345',
    description: 'The value of the configuration',
  })
  @IsNotEmpty()
  password: string;

}

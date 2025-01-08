import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ManageRoleDto {
  @ApiProperty({ example: '2', description: 'The name of the tag' })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({
    example: '2',
    description: 'The value of the configuration',
  })
  @IsNotEmpty()
  @IsNumber()
  roleId: number;

}

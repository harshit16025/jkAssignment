import { IsNotEmpty, IsString, IsOptional, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddDocumentsDto {

  @ApiProperty({
    example : 'This is a title',
    description: 'The title of the blog',
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'this is the description text',
    description: 'The descryption of the blog',
  })
  @IsNotEmpty()
  description: string;
  
}

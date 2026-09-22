import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CategoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
